<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Notification;
use App\Models\DeliveryPerson;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // 🧾 1️⃣ Get all orders (Admin & Salesperson)
public function index(Request $request)
{
    $query = Order::with(['user', 'items.product', 'deliveryPerson'])
        ->orderBy('created_at', 'desc');

    
    switch ($request->filter) {
        case 'pending':
            $query->where(function ($q) {
                $q->whereNull('delivery_person_id')
                    ->orWhere('delivery_status', 'pending')
                    ->orWhereNull('delivery_status')
                    ->orWhere('delivery_status', '');
            });
            break;

        case 'treated':
            $query->where('delivery_status', 'sent');
            break;

        case 'delivered':
            $query->whereIn('delivery_status', ['delivered', 'completed']);
            break;
    }

    $orders = $query->get();

    return response()->json([
        'status' => 'success',
        'orders' => $orders, 
    ], 200);
}





    // 🛒 2️⃣ Customer creates new order
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'payment_method' => 'required|in:card,delivery',
                'address' => 'required|string',
                'phone_number' => 'required|string|max:20',
                'total_price' => 'required|numeric',
            ]);

            $order = \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request) {
                // ✅ Create main order
                $order = Order::create([
                    'user_id' => Auth::id() ?? $request->user_id,
                    'order_number' => 'ORD-' . strtoupper(uniqid()),
                    'payment_method' => $validated['payment_method'],
                    'status' => $validated['payment_method'] === 'card' ? 'paid' : 'on delivery',
                    'payment_status' => $validated['payment_method'] === 'card' ? 'paid' : 'unpaid',
                    'delivery_status' => 'pending',
                    'total_price' => $validated['total_price'],
                    'address' => $validated['address'],
                    'phone_number' => $validated['phone_number'],
                ]);

                // ✅ Bulk create items to reduce DB queries
                $orderItems = [];
                $productIds = array_column($validated['items'], 'product_id');
                $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

                $validItems = [];
                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    if ($product) {
                        $orderItems[] = [
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'quantity' => $item['quantity'],
                            'price' => $product->price,
                            'subtotal' => $product->price * $item['quantity'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }

                if (!empty($orderItems)) {
                    OrderItem::insert($orderItems);
                }

                // ✅ Notify Admin
                Notification::create([
                    'user_id' => 1,
                    'order_id' => $order->id,
                    'title' => 'New Order Placed',
                    'message' => 'A new order has been placed and needs processing.',
                    'type' => 'order_update',
                ]);

                return $order;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating order: ' . $e->getMessage(),
            ], 500);
        }
    }


    // 🚚 3️⃣ Salesperson assigns delivery details
 public function assignDelivery(Request $request, $id)
{
    $order = Order::findOrFail($id);

    $request->validate([
        'delivery_person_id' => 'required|exists:delivery_persons,id',
        'salesperson_id' => 'nullable|exists:users,id',
    ]);

    // Treat order
    $order->delivery_person_id = $request->delivery_person_id;

    // Assign accountability
    $order->salesperson_id = $request->salesperson_id ?? null;
    $order->admin_id = $request->salesperson_id ? null : auth()->id();

    // Order is now treated
    $order->delivery_status = 'sent';
    $order->sent_out_at = now();

    $order->save();

    $order->load(['user', 'items.product', 'deliveryPerson']);

    return response()->json([
        'message' => 'Delivery assigned successfully',
        'order' => $order
    ]);
}








    // 🧾 4️⃣ View a single order
    public function show($id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'order' => $order,
        ], 200);
    }


    // ✅ 5️⃣ Update order status
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:on delivery,paid,completed,cancelled,delivered',
        ]);

        $order = Order::findOrFail($id);

        if ($validated['status'] === 'delivered') {
            $order->delivery_status = 'delivered';
            $order->payment_status = 'unpaid';
        } elseif ($validated['status'] === 'paid') {
            $order->payment_status = 'paid';
        }

        $order->update(['status' => $validated['status']]);

        Notification::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'title' => 'Order Status Updated',
            'message' => "Your order status has been updated to: {$validated['status']}.",
            'type' => 'order_update',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Order status updated successfully',
            'order' => $order,
        ], 200);
    }



    
    
    public function confirmPayment(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);

            
            $order->update([
                'payment_status' => 'paid',
                'status' => 'completed',
                'delivery_status' => 'delivered',
            ]);

            
            Notification::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'title' => 'Order Delivered & Payment Confirmed',
                'message' => 'Your payment has been confirmed and your order is now completed.',
                'type' => 'order_update',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment confirmed and order marked as delivered!',
                'order' => $order->load(['items.product', 'user']),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error confirming payment: ' . $e->getMessage(),
            ], 500);
        }
    }



    // 🧍 6️⃣ Get all orders for a specific customer
    public function userOrders($userId)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'orders' => $orders,
        ], 200);
    }

    
}
