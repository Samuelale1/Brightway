<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // ✅ Define which fields are mass assignable
    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'image',
        'added_by',  // salesperson or admin who added the product
        'is_deleted', // for soft delete logic
    ];

    // ✅ Relationships
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    // ✅ Accessor for image path (optional helper)
    public function getImageUrlAttribute()
    {
        return $this->image 
            ? asset('storage/products/' . $this->image)
            : asset('storage/products/default.png');
    }
}
