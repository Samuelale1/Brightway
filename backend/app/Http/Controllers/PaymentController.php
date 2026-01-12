<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Notifications\OrderStatusChanged;

class PaymentController extends Controller
{
    private $paystackSecretKey;
    private $paystackBaseUrl = 'https://api.paystack.co';

    public function __construct()
    {
        $this->paystackSecretKey = config('services.paystack.secret_key');
    }

    /**
     * Initialize a Paystack transaction for an order.
     */
    public function initialize(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'email' => 'required|email',
        ]);

        $order = Order::with('user')->findOrFail($validated['order_id']);

        // Check if already paid
        if ($order->payment_status === 'paid') {
            return response()->json([
                'status' => 'error',
                'message' => 'Order is already paid',
            ], 400);
        }

        // Amount in kobo (Paystack expects smallest currency unit)
        $amountInKobo = (int) ($order->total_price * 100);

        // Generate unique reference
        $reference = 'BW-' . $order->order_number . '-' . time();

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->paystackSecretKey,
                'Content-Type' => 'application/json',
            ])->post($this->paystackBaseUrl . '/transaction/initialize', [
                'email' => $validated['email'],
                'amount' => $amountInKobo,
                'reference' => $reference,
                'callback_url' => config('app.frontend_url') . '/payment/callback',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->name ?? 'Guest',
                ],
            ]);

            $result = $response->json();

            if ($response->successful() && $result['status']) {
                // Store reference on order for verification later
                $order->update([
                    'payment_reference' => $reference,
                ]);

                return response()->json([
                    'status' => 'success',
                    'authorization_url' => $result['data']['authorization_url'],
                    'access_code' => $result['data']['access_code'],
                    'reference' => $reference,
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => $result['message'] ?? 'Failed to initialize payment',
            ], 400);

        } catch (\Exception $e) {
            Log::error('Paystack initialization error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Payment service unavailable',
            ], 500);
        }
    }

    /**
     * Verify payment after customer returns from Paystack.
     */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string',
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->paystackSecretKey,
            ])->get($this->paystackBaseUrl . '/transaction/verify/' . $validated['reference']);

            $result = $response->json();

            if ($response->successful() && $result['status'] && $result['data']['status'] === 'success') {
                $metadata = $result['data']['metadata'];
                $orderId = $metadata['order_id'] ?? null;

                if ($orderId) {
                    $order = Order::with('user')->find($orderId);
                    
                    if ($order && $order->payment_status !== 'paid') {
                        $order->update([
                            'payment_status' => 'paid',
                            'status' => 'paid',
                        ]);

                        // Notify customer
                        if ($order->user) {
                            $order->user->notify(new OrderStatusChanged($order, 'paid'));
                        }
                    }
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment verified successfully',
                    'data' => [
                        'amount' => $result['data']['amount'] / 100,
                        'currency' => $result['data']['currency'],
                        'paid_at' => $result['data']['paid_at'],
                    ],
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed',
            ], 400);

        } catch (\Exception $e) {
            Log::error('Paystack verification error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Verification service unavailable',
            ], 500);
        }
    }

    /**
     * Handle Paystack webhook events.
     */
    public function webhook(Request $request)
    {
        // Verify webhook signature
        $signature = $request->header('x-paystack-signature');
        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha512', $payload, $this->paystackSecretKey);

        if ($signature !== $expectedSignature) {
            Log::warning('Invalid Paystack webhook signature');
            return response()->json(['status' => 'error'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        Log::info('Paystack webhook received: ' . $event, $data);

        switch ($event) {
            case 'charge.success':
                $this->handleChargeSuccess($data);
                break;
            
            case 'transfer.success':
            case 'transfer.failed':
                // Handle transfers if needed in the future
                break;
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Process successful charge webhook.
     */
    private function handleChargeSuccess($data)
    {
        $reference = $data['reference'] ?? null;
        $metadata = $data['metadata'] ?? [];
        $orderId = $metadata['order_id'] ?? null;

        if (!$orderId) {
            Log::warning('Paystack webhook: No order_id in metadata', $data);
            return;
        }

        $order = Order::with('user')->find($orderId);

        if (!$order) {
            Log::warning('Paystack webhook: Order not found', ['order_id' => $orderId]);
            return;
        }

        if ($order->payment_status === 'paid') {
            Log::info('Paystack webhook: Order already paid', ['order_id' => $orderId]);
            return;
        }

        $order->update([
            'payment_status' => 'paid',
            'status' => 'paid',
            'payment_reference' => $reference,
        ]);

        // Notify customer
        if ($order->user) {
            $order->user->notify(new OrderStatusChanged($order, 'paid'));
        }

        Log::info('Paystack webhook: Order marked as paid', ['order_id' => $orderId]);
    }
}
