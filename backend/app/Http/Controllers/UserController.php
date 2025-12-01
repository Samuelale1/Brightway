<?php

namespace App\Http\Controllers;

use App\Models\DeliveryPerson;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{
    // ✅ 1️⃣ Fetch logged-in user's profile
    public function profile()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ], 200);
    }

    // ✅ 2️⃣ Update logged-in user's profile
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'password' => 'nullable|min:6|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully!',
            'user' => $user,
        ], 200);
    }

      /* 
      * Get all users (ADMIN)
      */
    public function allUsers()
    {
        return response()->json([
            'status' => 'success',
            'users' => User::select('id','name','email','phone','role','is_active')->get()
        ]);
    }

   /* 
   *  Get user counts by role (ADMIN)
   */
    public function userCounts()
{
    return response()->json([
        'admins' => User::where('role', 'admin')->count(),
        'salespersons' => User::where('role', 'salesperson')->count(),
        'customers' => User::where('role', 'customer')->count(),
        'deliveryPersons' => DeliveryPerson::count(),
    ]);
}


   /* 
   * ADMIN — UPDATE USER ROLE
   */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string'
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['status'=>'success']);
    }

    /* 
    * ADMIN — TOGGLE USER ACTIVE STATUS
    */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json(['status'=>'success']);
    }

   /* 
   * ADMIN — RESET USER PASSWORD
   */
    public function resetPassword($id)
    {
        $user = User::findOrFail($id);

        $new = 'password123';
        $user->password = Hash::make($new);
        $user->save();

        return response()->json([
            'status'=>'success',
            'new_password'=>$new
        ]);
    }
}
