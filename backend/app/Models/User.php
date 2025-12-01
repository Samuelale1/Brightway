<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role', 'api_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    // 🧍 Customer profile
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    // 🚚 Delivery person profile
    public function deliveryPerson()
    {
        return $this->hasOne(DeliveryPerson::class);
    }

    // 🧾 Orders the user (customer) made
    public function customerOrders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    // 💼 Orders treated by salesperson
    public function salespersonOrders()
    {
        return $this->hasMany(Order::class, 'salesperson_id');
    }
}
