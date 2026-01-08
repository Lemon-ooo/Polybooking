<?php

namespace App\Mail;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $invoice;

    public function __construct(array $invoice)
    {
        $this->invoice = $invoice;
    }

    public function build()
    {
        // Render PDF
        $pdf = Pdf::loadView('invoice.pdf', [
            'invoice' => $this->invoice
        ]);

        return $this
            ->subject('Invoice ' . $this->invoice['invoice_code'])
            ->view('emails.invoice')
            ->attachData(
                $pdf->output(),
                'invoice_' . $this->invoice['invoice_code'] . '.pdf',
                [
                    'mime' => 'application/pdf',
                ]
            );
    }
}