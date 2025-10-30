<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salesperson_id',
        'order_number',
        'delivery_person_id',
        'total_price',
        'payment_method',
        'status',
        'address',
        'phone_number',
        'delivery_status',
    ];

    /* ============================================================
       🔹 RELATIONSHIPS
    ============================================================ */

    // 🧍 Customer who made the order
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // 💼 Salesperson who treated the order
    public function salesperson()
    {
        return $this->belongsTo(User::class, 'salesperson_id');
    }

    // 🚚 Delivery person assigned (record in DeliveryPerson table)
    public function deliveryPerson()
{
    return $this->belongsTo(DeliveryPerson::class, 'delivery_person_id');
}

    // 🛍️ Items in the order
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // 🔔 Notifications related to the order
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
