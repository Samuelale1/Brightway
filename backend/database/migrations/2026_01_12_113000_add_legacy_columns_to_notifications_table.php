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
        Schema::table('notifications', function (Blueprint $table) {
            // Add missing legacy columns as nullable to satisfy manual Notification::create calls
            if (!Schema::hasColumn('notifications', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('notifiable_id');
            }
            if (!Schema::hasColumn('notifications', 'order_id')) {
                $table->unsignedBigInteger('order_id')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('notifications', 'title')) {
                $table->string('title')->nullable()->after('order_id');
            }
            if (!Schema::hasColumn('notifications', 'message')) {
                $table->text('message')->nullable()->after('title');
            }
            if (!Schema::hasColumn('notifications', 'status')) {
                $table->string('status')->default('unread')->after('message');
            }
            
            // Make data column nullable if it isn't already, just in case
            $table->text('data')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'order_id', 'title', 'message', 'status']);
        });
    }
};
