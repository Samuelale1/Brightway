<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeliveryPerson;

class DeliveryPersonController extends Controller
{
    /**
     * ✅ Get all delivery persons (for dropdowns, etc.)
     */
    public function index()
    {
        $deliveryPersons = DeliveryPerson::orderBy('name')->get();

        return response()->json([
            'status' => 'success',
            'delivery_persons' => $deliveryPersons
        ]);
    }

    /**
     * ✅ Add new delivery person manually (for Admin use)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:delivery_persons,phone',
        ]);

        $person = DeliveryPerson::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Delivery person added successfully',
            'delivery_person' => $person,
        ], 201);
    }

    /**
     * ✅ Optional: Assign delivery person to an order (future use)
     */
    public function assignToOrder(Request $request, $orderId)
    {
        $validated = $request->validate([
            'delivery_person_id' => 'required|exists:delivery_persons,id',
        ]);

        $deliveryPerson = DeliveryPerson::find($validated['delivery_person_id']);
        $deliveryPerson->order_id = $orderId;
        $deliveryPerson->save();

        return response()->json([
            'status' => 'success',
            'message' => "{$deliveryPerson->name} assigned to order successfully",
            'delivery_person' => $deliveryPerson,
        ]);
    }
}
