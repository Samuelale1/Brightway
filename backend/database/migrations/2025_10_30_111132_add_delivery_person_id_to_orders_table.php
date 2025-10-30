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
            $table->unsignedBigInteger('delivery_person_id')->nullable()->after('salesperson_id');
            $table->foreign('delivery_person_id')->references('id')->on('delivery_persons')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['delivery_person_id']);
            $table->dropColumn('delivery_person_id');
        });
    }
};
