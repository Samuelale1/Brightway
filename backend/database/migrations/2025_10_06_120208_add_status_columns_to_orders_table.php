<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid')->after('payment_method');
            $table->enum('delivery_status', ['pending', 'sent', 'delivered'])->default('pending')->after('payment_status');
            $table->enum('notification_status', ['new', 'read'])->default('new')->after('delivery_status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'delivery_status', 'notification_status']);
        });
    }
};
