<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // Get current authenticated user
    public function show()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user()
        ]);
    }

    // Update profile details (name, email, phone)
    public function update(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = Auth::user();

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    }
}
