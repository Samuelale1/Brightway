<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // User who receives the notification (customer or salesperson)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Optional link to a specific order
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('cascade');

            // Notification content
            $table->string('title')->nullable(); // e.g., "Order Confirmed"
            $table->text('message');             // e.g., "Your order #123 has been confirmed."
            $table->enum('type', ['order_update', 'system', 'reminder'])->default('order_update');

            // Status tracking
            $table->enum('status', ['unread', 'read'])->default('unread');

            // Timestamps
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
