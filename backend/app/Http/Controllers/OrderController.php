<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // 🧾 1️⃣ Get all orders (Admin & Salesperson)
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'orders' => $orders,
        ], 200);
    }

    // 🛒 2️⃣ Customer creates new order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:card,delivery',
            'address' => 'required|string|max:255',
            'total_price' => 'required|numeric|min:0',
            'phone' => 'required|string|max:20',
        ]);

        try {
            DB::beginTransaction();

            $userId = Auth::id() ?? $request->user_id;

            // Create Order
            $order = Order::create([
                'user_id' => $userId,
                'payment_method' => $validated['payment_method'],
                'status' => $validated['payment_method'] === 'card' ? 'paid' : 'on delivery',
                'total_price' => $validated['total_price'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
            ]);

            // Create Order Items & reduce stock
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $product->decrement('quantity', $item['quantity']);
            }

            // Send notification to admin/salesperson
            Notification::create([
                'user_id' => 1, // You can later replace with dynamic salesperson assignment
                'order_id' => $order->id,
                'title' => 'New Order Placed',
                'message' => 'A new order has been placed and needs processing.',
                'type' => 'order_update',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
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
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'delivery_person' => $validated['delivery_person'],
            'delivery_phone' => $validated['delivery_phone'],
            'status' => 'on delivery',
        ]);

        // Notify customer
        Notification::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'title' => 'Order Shipped',
            'message' => "Your order is now being delivered by {$validated['delivery_person']}.",
            'type' => 'order_update',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Delivery person assigned and customer notified',
            'order' => $order,
        ], 200);
    }

    // 🧾 4️⃣ View a single order (for any user)
    public function show($id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'order' => $order,
        ], 200);
    }

    // ✅ 5️⃣ Update order status (paid, completed, cancelled)
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:on delivery,paid,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        // Notify customer
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

    // 🧍 6️⃣ Get all orders for a specific user (Customer Order History)
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
