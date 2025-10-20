<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Who placed the order (customer)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Order details
            $table->string('order_number')->unique();
            $table->decimal('total_price', 10, 2)->default(0);
            $table->string('payment_method')->default('pay_on_delivery'); // pay_on_delivery or pay_now
            $table->string('status')->default('pending'); // pending, confirmed, delivered, cancelled

            // Delivery info
            $table->string('delivery_address')->nullable();
            $table->string('delivery_person')->nullable();
            $table->string('delivery_phone')->nullable();

            // Track order processing
            $table->timestamp('sent_out_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
