<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'title',
        'message',
        'type',
        'status',
    ];

    // ✅ Define relationship to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ✅ Define relationship to order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
