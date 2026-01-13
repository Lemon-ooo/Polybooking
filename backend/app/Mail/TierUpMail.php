<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TierUpMail extends Mailable
{
    use SerializesModels;

    public $user;
    public $tier;
    public $points;
    public $voucher;

    public function __construct($user, $tier, $points, $voucher)
    {
        $this->user = $user;
        $this->tier = $tier;
        $this->points = $points;
        $this->voucher = $voucher;
    }

    public function build()
    {
        return $this->subject('🎉 Chúc mừng bạn đã lên hạng thành viên')
            ->view('emails.tier_up');
    }
}