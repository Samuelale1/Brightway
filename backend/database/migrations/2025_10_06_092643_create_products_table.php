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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Product name
            $table->text('description')->nullable(); // Product details
            $table->decimal('price', 10, 2)->default(0.00); // Product price
            $table->string('image')->nullable(); // Product image path
            $table->decimal('quantity', 8, 2)->default(0);
            $table->foreignId('added_by')->nullable()->constrained('users')->onDelete('cascade'); // Who added the product
            $table->boolean('is_deleted')->default(false); // For soft delete
            $table->timestamp('deleted_at')->nullable(); // When deleted
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
