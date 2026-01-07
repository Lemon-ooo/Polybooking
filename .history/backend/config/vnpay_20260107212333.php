<?php

return [

    "tmn_code"    => "P1HZVK4R",
    "hash_secret" => "7LS7F9RZROL8N9PTVHFYJ3LF2FAR89NR",

    // URL sandbox của VNPAY
    "url"        => "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    // Return URL của hệ thống bro (LOCALHOST vẫn CHẠY được)
    'return_url' => 'http://127.0.0.1:8000/api/payments/vnpay/callback',

];