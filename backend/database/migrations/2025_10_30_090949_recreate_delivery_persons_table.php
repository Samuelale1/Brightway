<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('delivery_persons', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('phone');
        $table->unsignedBigInteger('order_id')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('delivery_persons');
}

};
