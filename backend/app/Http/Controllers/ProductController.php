<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // ✅ Get all products
    public function index()
    {
        $products = Product::latest()->get();
        return response()->json($products);
    }

    // ✅ Add a new product
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|numeric|min:0',
            /* 'added_by'    => 'required|exists:users,id', */ 
            'added_by' => 'required|numeric',           // expects user id
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,gif|max:4096',
            'category'    => 'nullable|string',
            'availability' => 'nullable|in:available,wait_time',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // store in storage/app/public/products
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = \App\Models\Product::create(array_merge($validated, [
            'image' => $imagePath,
        ]));

        return response()->json([
            'status'  => 'success',
            'message' => ['Product added successfully'],
            'product' => $product,
        ], 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // Return JSON array of errors (consistent format)
        return response()->json([
            'status'  => 'error',
            'message' => $e->validator->errors()->all()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Product store error: '.$e->getMessage());
        return response()->json([
            'status'  => 'error',
            'message' => ['Server error while saving product.']
        ], 500);
    }
}
public function update(Request $request, $id)
{
    try {
        $product = \App\Models\Product::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|numeric|min:0',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,gif|max:4096',
            'category'    => 'nullable|string',
            'availability' => 'nullable|in:available,wait_time',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->validator->errors()->all(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error updating product: '.$e->getMessage(),
        ], 500);
    }
}
public function destroy($id)
{
    try {
        $product = \App\Models\Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Product deleted successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Error deleting product: '.$e->getMessage()
        ], 500);
    }
}

}
