<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Booking;
use App\Models\DamageType;
use App\Models\DamageInvoice;

class AdminDamageController extends Controller
{
    // List damages for a booking
    public function index($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        $items = DamageInvoice::where('booking_id', $bookingId)
            ->with('damageType')
            ->get();

        return response()->json(['success' => true, 'data' => $items]);
    }

    // Create damage (supports image upload)
    public function store(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        if (!in_array($booking->status, [Booking::STATUS_CHECK_IN, Booking::STATUS_IN_USE])) {
            return response()->json(['success' => false, 'message' => 'Booking không hợp lệ'], 400);
        }

        $data = $request->validate([
            'damage_type_id' => 'required|exists:damage_types,id',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:5120'
        ]);

        $damageType = DamageType::findOrFail($data['damage_type_id']);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('damages', 'public');
        }

        $invoice = DamageInvoice::create([
            'booking_id'     => $booking->id,
            'damage_type_id' => $damageType->id,
            'amount'         => $damageType->price,
            'image_path'     => $imagePath
        ]);

        if ($booking->status === Booking::STATUS_CHECK_IN) {
            $booking->update(['status' => Booking::STATUS_IN_USE]);
        }

        return response()->json(['success' => true, 'data' => $invoice]);
    }

    // Update damage invoice (allow change type and replace image)
    public function update(Request $request, $id)
    {
        $invoice = DamageInvoice::findOrFail($id);
        $booking = $invoice->booking;

        $data = $request->validate([
            'damage_type_id' => 'nullable|exists:damage_types,id',
            'image' => 'nullable|file|mimes:jpg,jpeg,png|max:5120'
        ]);

        if (isset($data['damage_type_id'])) {
            $damageType = DamageType::findOrFail($data['damage_type_id']);
            $invoice->damage_type_id = $damageType->id;
            $invoice->amount = $damageType->price;
        }

        if ($request->hasFile('image')) {
            // remove old file
            if ($invoice->image_path) {
                Storage::disk('public')->delete($invoice->image_path);
            }
            $invoice->image_path = $request->file('image')->store('damages', 'public');
        }

        $invoice->save();

        return response()->json(['success' => true, 'data' => $invoice]);
    }

    // Delete damage invoice
    public function destroy($id)
    {
        $invoice = DamageInvoice::findOrFail($id);

        if ($invoice->image_path) {
            Storage::disk('public')->delete($invoice->image_path);
        }

        $invoice->delete();

        return response()->json(['success' => true]);
    }
}
