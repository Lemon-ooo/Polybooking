<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{
    Booking,
    ServiceCharge,
    DamageInvoice,
    Penalty,
    Payment,
    Invoice
};
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\{
    Storage,
    Mail,
    DB
};
use App\Mail\InvoiceMail;

class InvoiceController extends Controller
{
    /* ======================================================
     | CORE: BUILD INVOICE DATA (SINGLE SOURCE OF TRUTH)
     ====================================================== */
    private function buildInvoiceData(int $bookingId): array
    {
        $booking = Booking::with('user')->findOrFail($bookingId);

        if ($booking->status !== 'check_out') {
            abort(400, 'Booking chưa checkout');
        }

        /* ===== ROOM ===== */
        $roomTotal = (int) ($booking->total_price ?? 0);

        /* ===== SERVICES (FIXED) ===== */
$services = ServiceCharge::with('service')
    ->whereHas('invoice', function ($q) use ($bookingId) {
        $q->where('booking_id', $bookingId);
    })
    ->get()
    ->map(function ($c) {
        return [
            'name'  => $c->service?->service_name ?? 'Service',
            'qty'   => (int) $c->quantity,
            'price' => (int) $c->price,
            'total' => (int) $c->amount,
        ];
    })
    ->values()
    ->toArray();

$serviceTotal = collect($services)->sum('total');

        /* ===== DAMAGES ===== */
        $damages = DamageInvoice::with('damageType')
            ->where('booking_id', $bookingId)
            ->get()
            ->map(fn ($d) => [
                'name'  => $d->damageType?->name ?? 'Damage',
                'price' => (int) $d->amount,
                'image' => $d->image,
            ])
            ->values()
            ->toArray();

        $damageTotal = collect($damages)->sum('price');

        /* ===== PENALTIES ===== */
        $penalties = Penalty::where('booking_id', $bookingId)
            ->get()
            ->map(fn ($p) => [
                'days_late' => (int) $p->days_late,
                'amount'    => (int) $p->amount,
            ])
            ->values()
            ->toArray();

        $penaltyTotal = collect($penalties)->sum('amount');

        /* ===== PAYMENTS ===== */
        $payments = Payment::where('booking_id', $bookingId)
            ->where('status', 'success')
            ->get()
            ->map(fn ($p) => [
                'method'  => $p->method,
                'amount'  => (int) $p->amount,
                'paid_at' => optional($p->paid_at)->format('d/m/Y H:i'),
            ])
            ->values()
            ->toArray();

        $paidTotal = collect($payments)->sum('amount');

        /* ===== SUMMARY ===== */
        $grandTotal = $roomTotal + $serviceTotal + $damageTotal + $penaltyTotal;
        $due = max(0, $grandTotal - $paidTotal);

        return [
'invoice_code' => 'INV-' . now()->format('Ymd') . '-' . str_pad($bookingId, 4, '0', STR_PAD_LEFT),
            'booking_id'   => $booking->id,

            'customer' => [
                'name'  => $booking->user?->user_name ?? '',
                'email' => $booking->user?->email ?? '',
            ],

            'room' => ['price' => $roomTotal],

            'services'  => $services,
            'damages'   => $damages,
            'penalties' => $penalties,

            'summary' => [
                'room'    => $roomTotal,
                'service' => $serviceTotal,
                'damage'  => $damageTotal,
                'penalty' => $penaltyTotal,
                'total'   => $grandTotal,
                'paid'    => $paidTotal,
                'due'     => $due,
            ],

            'payments'  => $payments,
            'issued_at' => now()->format('d/m/Y H:i'),
        ];
    }

    /* ======================================================
     | API
     ====================================================== */

    /** GET /api/admin/bookings/{id}/invoice */
    public function show($id)
    {
        return response()->json([
            'success' => true,
            'invoice' => $this->buildInvoiceData($id)
        ]);
    }

    /** GET /api/admin/bookings/{id}/invoice/pdf */
    public function pdf($id)
    {
        $invoice = $this->buildInvoiceData($id);

        return Pdf::loadView('invoice.pdf', compact('invoice'))
            ->download('invoice_' . $invoice['invoice_code'] . '.pdf');
    }

    /** POST /api/admin/bookings/{id}/invoice/store */
    public function store($id)
    {
        if (Invoice::where('booking_id', $id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice already exists'
            ], 409);
        }

        return DB::transaction(function () use ($id) {
            $invoiceData = $this->buildInvoiceData($id);

            $pdf = Pdf::loadView('invoice.pdf', [
                'invoice' => $invoiceData
            ]);

            $path = 'invoices/invoice_' . $invoiceData['invoice_code'] . '.pdf';
            Storage::put($path, $pdf->output());

            $invoice = Invoice::create([
                'booking_id'     => $invoiceData['booking_id'],
                'invoice_code'   => $invoiceData['invoice_code'],
                'customer_name'  => $invoiceData['customer']['name'],
                'customer_email' => $invoiceData['customer']['email'],

                'room_total'    => $invoiceData['summary']['room'],
                'service_total' => $invoiceData['summary']['service'],
                'damage_total'  => $invoiceData['summary']['damage'],
                'penalty_total' => $invoiceData['summary']['penalty'],
                'grand_total'   => $invoiceData['summary']['total'],
                'paid_total'    => $invoiceData['summary']['paid'],
'due_total'     => $invoiceData['summary']['due'],

                'data'      => $invoiceData,
                'pdf_path'  => $path,
                'issued_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'invoice_id' => $invoice->id
            ]);
        });
    }

    /** GET /api/invoices/{id}/pdf */
    public function downloadPdf($id)
    {
        $invoice = Invoice::findOrFail($id);
        return Storage::download($invoice->pdf_path);
    }

    /** POST /api/admin/bookings/{id}/invoice/send-mail */
    public function sendMail($id)
{
    $invoice = Invoice::findOrFail($id);

    Mail::to($invoice->customer_email)
        ->send(new InvoiceMail($invoice->data)); // ✅ TRUYỀN ARRAY

    return response()->json([
        'success' => true,
        'message' => 'Invoice sent successfully'
    ]);
}
}