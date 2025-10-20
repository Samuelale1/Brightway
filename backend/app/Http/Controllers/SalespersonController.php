<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Notification;

class SalespersonController extends Controller
{
    // ✅ Fetch all pending or on-delivery orders
    public function getOrders()
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'orders' => $orders
        ], 200);
    }

    // ✅ Treat (update) an order
    public function treatOrder(Request $request, $id)
    {
        $request->validate([
            'delivery_person_name' => 'required|string',
            'delivery_person_phone' => 'required|string',
            'status' => 'required|string|in:on_delivery,delivered,paid'
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'delivery_person_name' => $request->delivery_person_name,
            'delivery_person_phone' => $request->delivery_person_phone,
            'status' => $request->status,
        ]);

        // ✅ Notify the customer
        Notification::create([
            'user_id' => $order->user_id,
            'order_id' => $order->id,
            'title' => 'Order Status Updated',
            'message' => "Your order #{$order->id} is now {$order->status}.",
            'type' => 'order_update',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Order updated successfully.',
            'order' => $order
        ]);
    }

    // ✅ Fetch notifications for salesperson
    public function getNotifications()
    {
        $notifications = Notification::where('type', 'system')
            ->orWhere('type', 'order_update')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'notifications' => $notifications
        ], 200);
    }
}
