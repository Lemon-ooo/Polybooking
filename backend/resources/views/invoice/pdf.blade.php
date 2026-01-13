<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice</title>
    <style>
        body {
            font-family: DejaVu Sans;
            font-size: 13px;
            color: #333;
        }

        h1 {
            text-align: center;
            margin-bottom: 5px;
        }

        .invoice-header {
            margin-bottom: 20px;
        }

        .invoice-header table {
            width: 100%;
            border: none;
        }

        .invoice-header td {
            border: none;
            padding: 4px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            border: 1px solid #999;
            padding: 8px;
        }

        th {
            background: #f2f2f2;
            text-align: left;
        }

        .text-right {
            text-align: right;
        }

        .section-title {
            margin-top: 25px;
            font-weight: bold;
            font-size: 14px;
        }

        .summary-table th {
            width: 70%;
        }
    </style>
</head>
<body>

<h1>INVOICE</h1>

<div class="invoice-header">
    <table>
        <tr>
            <td>
                <strong>Invoice code:</strong> {{ $invoice['invoice_code'] }} <br>
                <strong>Issued at:</strong> {{ $invoice['issued_at'] }}
            </td>
            <td class="text-right">
                <strong>Customer:</strong> {{ $invoice['customer']['name'] }} <br>
                <strong>Email:</strong> {{ $invoice['customer']['email'] }}
            </td>
        </tr>
    </table>
</div>

{{-- ================= ROOM ================= --}}
<div class="section-title">Room charge</div>
<table>
    <tr>
        <th>Description</th>
        <th class="text-right">Amount (VND)</th>
    </tr>
    <tr>
        <td>Room booking</td>
        <td class="text-right">{{ number_format($invoice['room']['price']) }}</td>
    </tr>
</table>

{{-- ================= SERVICES ================= --}}
@if(count($invoice['services']) > 0)
<div class="section-title">Services</div>
<table>
    <tr>
        <th>Service</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Total</th>
    </tr>
    @foreach($invoice['services'] as $service)
        <tr>
            <td>{{ $service['name'] }}</td>
            <td class="text-right">{{ $service['qty'] }}</td>
            <td class="text-right">{{ number_format($service['price']) }}</td>
            <td class="text-right">{{ number_format($service['total']) }}</td>
        </tr>
    @endforeach
</table>
@endif

{{-- ================= DAMAGES ================= --}}
@if(count($invoice['damages']) > 0)
<div class="section-title">Damages</div>
<table>
    <tr>
        <th>Damage</th>
        <th class="text-right">Amount</th>
    </tr>
    @foreach($invoice['damages'] as $damage)
        <tr>
            <td>{{ $damage['name'] }}</td>
            <td class="text-right">{{ number_format($damage['price']) }}</td>
        </tr>
    @endforeach
</table>
@endif

{{-- ================= PENALTIES (FIXED) ================= --}}
@if(count($invoice['penalties']) > 0)
<div class="section-title">Penalties</div>
<table>
    <tr>
        <th>Description</th>
        <th class="text-right">Amount</th>
    </tr>
    @foreach($invoice['penalties'] as $penalty)
        <tr>
            <td>
                Late checkout
                @if(isset($penalty['days_late']))
                    ({{ $penalty['days_late'] }} day(s))
                @endif
            </td>
            <td class="text-right">{{ number_format($penalty['amount']) }}</td>
        </tr>
    @endforeach
</table>
@endif

{{-- ================= SUMMARY ================= --}}
<div class="section-title">Summary</div>
<table class="summary-table">
    <tr>
        <th>Room</th>
        <td class="text-right">{{ number_format($invoice['summary']['room']) }}</td>
    </tr>
    <tr>
        <th>Service</th>
        <td class="text-right">{{ number_format($invoice['summary']['service']) }}</td>
    </tr>
    <tr>
        <th>Damage</th>
        <td class="text-right">{{ number_format($invoice['summary']['damage']) }}</td>
    </tr>
    <tr>
        <th>Penalty</th>
        <td class="text-right">{{ number_format($invoice['summary']['penalty']) }}</td>
    </tr>
    <tr>
        <th><strong>Total</strong></th>
        <td class="text-right"><strong>{{ number_format($invoice['summary']['total']) }}</strong></td>
    </tr>
    <tr>
        <th>Paid</th>
        <td class="text-right">{{ number_format($invoice['summary']['paid']) }}</td>
    </tr>
    <tr>
        <th>Amount due</th>
        <td class="text-right"><strong>{{ number_format($invoice['summary']['due']) }}</strong></td>
    </tr>
</table>

{{-- ================= PAYMENTS ================= --}}
@if(count($invoice['payments']) > 0)
<div class="section-title">Payment history</div>
<table>
    <tr>
        <th>Method</th>
        <th class="text-right">Amount</th>
        <th class="text-right">Paid at</th>
    </tr>
    @foreach($invoice['payments'] as $payment)
        <tr>
            <td>{{ strtoupper($payment['method']) }}</td>
            <td class="text-right">{{ number_format($payment['amount']) }}</td>
            <td class="text-right">{{ $payment['paid_at'] }}</td>
        </tr>
    @endforeach
</table>
@endif

</body>
</html>
