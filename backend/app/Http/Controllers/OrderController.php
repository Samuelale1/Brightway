<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // 🧾 1️⃣ Get all orders (Admin & Salesperson)
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc');

        // 🟢 Filter examples (optional)
        if ($request->filter === 'pending') {
            $query->where(function ($q) {
                $q->whereNull('delivery_person')
                  ->whereNull('delivery_phone')
                  ->where(function ($sub) {
                      $sub->whereNull('delivery_status')
                          ->orWhere('delivery_status', 'pending')
                          ->orWhere('delivery_status', '');
                  });
            });
        }

        if ($request->filter === 'treated') {
            $query->where('delivery_status', 'sent');
        }

        if ($request->filter === 'delivered') {
            $query->whereIn('delivery_status', ['delivered', 'completed']);
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

            // ✅ Create the main order
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

            // ✅ Create each order item
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                        'subtotal' => $product->price * $item['quantity'],
                    ]);
                }
            }

            // ✅ Notify Admin/Sales
            Notification::create([
                'user_id' => 1,
                'order_id' => $order->id,
                'title' => 'New Order Placed',
                'message' => 'A new order has been placed and needs processing.',
                'type' => 'order_update',
            ]);

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
        $validated = $request->validate([
            'delivery_person' => 'required|string|max:255',
            'delivery_phone' => 'required|string|max:20',
            'delivery_address' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        // ✅ Update delivery info
        $order->update([
            'delivery_person' => $validated['delivery_person'],
            'delivery_phone' => $validated['delivery_phone'],
            'delivery_address' => $validated['delivery_address'] ?? $order->address,
            'delivery_status' => 'sent',
            'status' => 'on delivery',
        ]);

        // ✅ Notify customer
        Notification::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'title' => 'Order On The Way',
            'message' => "Your order is now being delivered by {$validated['delivery_person']}.",
            'type' => 'order_update',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Delivery assigned successfully',
            'order' => $order,
        ], 200);
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

        // ✅ Also sync delivery_status when delivered
        if ($validated['status'] === 'delivered') {
            $order->delivery_status = 'delivered';
            $order->payment_status = 'unpaid';
        } elseif ($validated['status'] === 'paid') {
            $order->payment_status = 'paid';
        }

        $order->update(['status' => $validated['status']]);

        // ✅ Notify customer
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
