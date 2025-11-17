<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    /**
     * 🧾 1️⃣ Overview Summary (Dashboard)
     * Returns quick stats: total orders, sales, revenue, and daily figures
     */
    public function overview()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_price');
        $totalPending = Order::where('delivery_status', 'pending')->count();
        $totalDelivered = Order::whereIn('delivery_status', ['delivered', 'completed'])->count();

        // Today’s metrics
        $today = Carbon::today();
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::whereDate('created_at', $today)
            ->where('payment_status', 'paid')
            ->sum('total_price');

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_pending' => $totalPending,
                'total_delivered' => $totalDelivered,
                'today_orders' => $todayOrders,
                'today_revenue' => $todayRevenue,
            ],
        ], 200);
    }


    /**
     * 📊 2️⃣ Top-Selling Products Report
     * Returns product performance ranked by total quantity sold
     */
    public function topProducts()
    {
        $topProducts = OrderItem::select(
            'product_id',
            DB::raw('SUM(quantity) as total_sold'),
            DB::raw('SUM(subtotal) as total_revenue')
        )
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->with('product:id,name,price')
            ->take(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'products' => $topProducts,
        ], 200);
    }


    /**
     * 📅 3️⃣ Daily Revenue Chart (Last 7 or 30 Days)
     * Returns daily revenue and orders count for chart visualization
     */
    public function dailyRevenue(Request $request)
    {
        $days = $request->query('days', 7); // default = 7 days

        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $dailyData = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_price) as total_revenue'),
            DB::raw('COUNT(id) as total_orders')
        )
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        // Fill missing dates for a smoother chart
        $filledData = collect();
        for ($i = 0; $i < $days; $i++) {
            $date = Carbon::now()->subDays($days - 1 - $i)->toDateString();
            $dayData = $dailyData->firstWhere('date', $date);
            $filledData->push([
                'date' => $date,
                'total_revenue' => $dayData->total_revenue ?? 0,
                'total_orders' => $dayData->total_orders ?? 0,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'daily' => $filledData,
        ], 200);
    }


    /**
     * 💼 4️⃣ Sales by Staff / Admin Accountability
     * Shows total sales handled by each salesperson or admin
     */
    public function staffPerformance()
    {
        $sales = Order::select(
            'salesperson_id',
            DB::raw('COUNT(id) as orders_handled'),
            DB::raw('SUM(total_price) as total_sales')
        )
            ->whereNotNull('salesperson_id')
            ->groupBy('salesperson_id')
            ->with('salesperson:id,name')
            ->orderByDesc('total_sales')
            ->get();

        return response()->json([
            'status' => 'success',
            'staff_sales' => $sales,
        ], 200);
    }
}
