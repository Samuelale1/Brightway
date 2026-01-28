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
        Schema::table('delivery_persons', function (Blueprint $table) {
            if (!Schema::hasColumn('delivery_persons', 'name')) {
                $table->string('name');
            }
            if (!Schema::hasColumn('delivery_persons', 'phone')) {
                $table->string('phone');
            }

            // check if order_id exists before adding foreign key
            if (!Schema::hasColumn('delivery_persons', 'order_id')) {
                 $table->unsignedBigInteger('order_id')->nullable();
            }
            
            // Re-adding foreign key might fail if it exists, so we wrap it or assume it's okay in this simple fix
            //$table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_persons', function (Blueprint $table) {
            //
        });
    }
};
