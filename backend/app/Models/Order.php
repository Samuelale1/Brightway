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
        'admin_id',
        'order_number',
        'delivery_person_id',
        'delivery_person',
        'delivery_phone',
        'total_price',
        'payment_method',
        'status',
        'address',
        'phone_number',
        'delivery_status',
        'payment_status',
    ];

    /**
     * Fields automatically included in JSON responses.
     */
    protected $appends = ['delivery_person_name', 'delivery_person_phone'];

   
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    
    public function salesperson()
    {
        return $this->belongsTo(User::class, 'salesperson_id');
    }

   
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    
    public function deliveryPerson()
    {
        return $this->belongsTo(DeliveryPerson::class, 'delivery_person_id');
    }

   
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    

    public function getDeliveryPersonNameAttribute()
    {
        if ($this->relationLoaded('deliveryPerson') && $this->deliveryPerson) {
            return $this->deliveryPerson->name;
        }
        return $this->delivery_person ?? 'N/A';
    }

    public function getDeliveryPersonPhoneAttribute()
    {
        if ($this->relationLoaded('deliveryPerson') && $this->deliveryPerson) {
            return $this->deliveryPerson->phone;
        }
        return $this->delivery_phone ?? 'N/A';
    }
}
