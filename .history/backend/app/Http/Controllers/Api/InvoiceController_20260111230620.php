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
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /* ======================================================
     | CORE: BUILD INVOICE DATA (SINGLE SOURCE OF TRUTH)
     ====================================================== */
    private function buildInvoiceData(int $bookingId): array
    {
        $booking = Booking::with('user')->findOrFail($bookingId);

        /* ===== ROOM ===== */
        $roomTotal = (int) ($booking->total_price ?? 0);

        /* ===== SERVICES ===== */
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
            ->map(fn($d) => [
                'name'  => $d->damageType?->damage_type_name ?? 'Damage',
                'price' => (int) $d->amount,
                'image' => $d->image,
            ])
            ->values()
            ->toArray();

        $damageTotal = collect($damages)->sum('price');

        /* ===== PENALTIES ===== */
        $penalties = Penalty::where('booking_id', $bookingId)
            ->get()
            ->map(fn($p) => [
                'reason' => $p->reason ?? 'Penalty',
                'amount' => (int) $p->amount,
            ])
            ->values()
            ->toArray();

        $penaltyTotal = collect($penalties)->sum('amount');

        /* ===== PAYMENTS ===== */
        $payments = Payment::where('booking_id', $bookingId)
            ->where('status', 'success')
            ->get()
            ->map(fn($p) => [
                'method'  => $p->payment_method ?? $p->method ?? 'N/A',
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
            'booking_data' => [
                'check_in'  => $booking->check_in ? date('d/m/Y', strtotime($booking->check_in)) : '',
                'check_out' => $booking->check_out ? date('d/m/Y', strtotime($booking->check_out)) : '',
                'nights'    => $booking->nights,
                'adults'    => $booking->adults,
                'children'  => $booking->children,
                'status'    => $booking->status,
            ],

            'customer' => [
                'name'  => $booking->user?->name ?? $booking->user?->user_name ?? '',
                'email' => $booking->user?->email ?? '',
                'phone' => $booking->user?->phone ?? '',
            ],

            'room' => [
                'price' => $roomTotal,
                'items' => $booking->items->map(function($item) {
                    return [
                        'room_type' => $item->room_type_name ?? 'Room',
                        'quantity'  => $item->quantity,
                        'nights'    => $item->number_of_nights,
                        'price_per_night' => $item->base_price,
                        'total'     => $item->amount,
                    ];
                })->toArray(),
            ],

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
            'issued_by' => 'Hotel Management System',
        ];
    }

    /* ======================================================
     | API ENDPOINTS
     ====================================================== */

    /** GET /api/admin/bookings/{id}/invoice */
    public function show($id)
    {
        try {
            return response()->json([
                'success' => true,
                'invoice' => $this->buildInvoiceData($id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /** GET /api/admin/bookings/{id}/invoice/pdf */
    public function pdf($id)
    {
        try {
            $invoice = $this->buildInvoiceData($id);
            $pdf = Pdf::loadView('invoice.pdf', compact('invoice'));
            
            return $pdf->download('invoice_' . $invoice['invoice_code'] . '.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /** POST /api/admin/bookings/{id}/invoice/store-and-send */
    public function storeAndSend(Request $request, $id)
    {
        try {
            return DB::transaction(function () use ($id, $request) {
                // Kiểm tra đã có invoice chưa
                $existingInvoice = Invoice::where('booking_id', $id)->first();
                
                if ($existingInvoice) {
                    // Nếu đã có invoice, chỉ gửi email
                    $invoiceData = $existingInvoice->data;
                    $invoiceId = $existingInvoice->id;
                    
                    // Gửi email
                    Mail::to($existingInvoice->customer_email)
                        ->send(new InvoiceMail($invoiceData));
                        
                    return response()->json([
                        'success' => true,
                        'message' => 'Invoice already exists. Email sent successfully.',
                        'invoice_id' => $invoiceId,
                        'invoice_code' => $existingInvoice->invoice_code
                    ]);
                }
                
                // Tạo invoice mới
                $invoiceData = $this->buildInvoiceData($id);
                
                // Tạo PDF
                $pdf = Pdf::loadView('invoice.pdf', [
                    'invoice' => $invoiceData
                ]);
                
                // Lưu PDF
                $path = 'invoices/invoice_' . $invoiceData['invoice_code'] . '.pdf';
                Storage::put($path, $pdf->output());
                
                // Lưu vào database
                $invoice = Invoice::create([
                    'booking_id'     => $invoiceData['booking_id'],
                    'invoice_code'   => $invoiceData['invoice_code'],
                    'customer_name'  => $invoiceData['customer']['name'],
                    'customer_email' => $invoiceData['customer']['email'],
                    'customer_phone' => $invoiceData['customer']['phone'] ?? null,
                    
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
                    'issued_by' => $request->user()?->name ?? 'System',
                ]);
                
                // Gửi email
                Mail::to($invoice->customer_email)
                    ->send(new InvoiceMail($invoiceData));
                
                return response()->json([
                    'success' => true,
                    'message' => 'Invoice created and email sent successfully',
                    'invoice_id' => $invoice->id,
                    'invoice_code' => $invoice->invoice_code,
                    'pdf_url' => route('api.invoice.download', $invoice->id),
                ]);
            });
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /** GET /api/invoices/{id}/pdf */
    public function downloadPdf($id)
    {
        $invoice = Invoice::findOrFail($id);
        
        if (!Storage::exists($invoice->pdf_path)) {
            abort(404, 'PDF file not found');
        }
        
        return Storage::download($invoice->pdf_path, 'invoice_' . $invoice->invoice_code . '.pdf');
    }

    /** POST /api/admin/bookings/{id}/invoice/send-mail */
    public function sendMail($id)
    {
        try {
            $invoice = Invoice::where('booking_id', $id)->firstOrFail();
            
            Mail::to($invoice->customer_email)
                ->send(new InvoiceMail($invoice->data));
                
            return response()->json([
                'success' => true,
                'message' => 'Invoice sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}