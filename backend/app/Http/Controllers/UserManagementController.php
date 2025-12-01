<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    // Get all users
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'phone', 'role', 'is_active')
                     ->orderBy('id', 'desc')
                     ->get();

        return response()->json([
            'status' => 'success',
            'users' => $users->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'phone' => $u->phone,
                    'role' => $u->role,
                    'is_active' => $u->is_active,
                ];
            })
        ]);
    }

    // Update user role
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:admin,salesperson,customer',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    // Activate / Deactivate (Soft lock)
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => $user->is_active ? 'User activated' : 'User deactivated',
            'user' => $user
        ]);
    }

    // Reset user password
    public function resetPassword($id)
    {
        $user = User::findOrFail($id);

        $newPass = 'password123';
        $user->password = bcrypt($newPass);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset successfully',
            'new_password' => $newPass
        ]);
    }
}
