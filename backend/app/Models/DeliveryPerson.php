<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryPerson extends Model
{
    use HasFactory;

    // ✅ Explicitly link to your table
    protected $table = 'delivery_persons';

    protected $fillable = [
        'name',
        'phone',
        'order_id',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'delivery_person_id', 'id');
    }
}
