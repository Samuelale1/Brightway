<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('delivery_status', 'pending')->orWhereNull('delivery_status')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalProducts = Product::count();
        $totalUsers = User::count();

        // Get Top 5 Selling Products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(order_items.quantity) as sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold')
            ->limit(5)
            ->get();

        return response()->json([
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders,
            'totalProducts' => $totalProducts,
            'totalUsers' => $totalUsers,
            'topProducts' => $topProducts
        ]);
    }
}
