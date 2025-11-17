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
    Schema::table('orders', function (Blueprint $table) {
        if (Schema::hasColumn('orders', 'delivery_person')) {
            $table->dropColumn('delivery_person');
        }
        if (Schema::hasColumn('orders', 'delivery_phone')) {
            $table->dropColumn('delivery_phone');
        }
        if (Schema::hasColumn('orders', 'delivery_address')) {
            $table->dropColumn('delivery_address');
        }
    });
}

public function down()
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('delivery_person')->nullable();
        $table->string('delivery_phone')->nullable();
        $table->string('delivery_address')->nullable();
    });
}

};
