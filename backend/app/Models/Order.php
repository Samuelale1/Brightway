<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'delivery_person',
        'delivery_phone',
        'total_price',
        'payment_method',
        'status',
        'address',
        'phone_number',
    ];

    // ✅ Relationship: an order belongs to a customer
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ✅ Relationship: an order has many items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // ✅ Relationship: an order can have many notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
