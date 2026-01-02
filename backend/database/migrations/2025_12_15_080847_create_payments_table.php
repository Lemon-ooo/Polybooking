\<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {

            // PK
            $table->id();

            // FK → bookings.id (GIỮ NGUYÊN)
            $table->unsignedBigInteger('booking_id');

            /**
             * LOẠI THANH TOÁN
             * - room_prepaid : thanh toán tiền phòng ban đầu (VNPay)
             * - service      : thanh toán dịch vụ phát sinh
             * - damage       : thanh toán thiệt hại
             * - additional   : thanh toán bổ sung
             * - refund       : hoàn tiền
             */
            $table->enum('payment_type', [
                'room_prepaid',
                'service',
                'damage',
                'additional',
                'refund'
            ])->default('room_prepaid');

            // VNPay data
            $table->string('transaction_no')->nullable();      // vnp_TxnRef
            $table->string('bank_code')->nullable();           // vnp_BankCode
            $table->string('vnp_response_code')->nullable();   // 00, 24, 51...

            // Số tiền (+ thu, - hoàn)
            $table->integer('amount')->default(0);

            /**
             * TRẠNG THÁI THANH TOÁN
             * pending  : đã tạo yêu cầu
             * success  : thanh toán thành công
             * failed   : thất bại
             * refunded : đã hoàn tiền
             */
            $table->string('status')->default('pending');

            // Thời điểm thanh toán thành công
            $table->timestamp('paid_at')->nullable();

            // Ghi chú nghiệp vụ / audit
            $table->string('note')->nullable();

            $table->timestamps();

            // FK constraint (GIỮ NGUYÊN – KHÔNG PHÁ)
            $table->foreign('booking_id')
                  ->references('id')
                  ->on('bookings')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
