<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use App\Models\User;
use App\Mail\EventStartMail;
use Illuminate\Support\Facades\Mail;

class SendEventStartEmails extends Command
{
    protected $signature = 'events:send-start-mail';
    protected $description = 'Gửi email thông báo khi event bắt đầu';

    public function handle()
    {
        $today = now()->toDateString();

        $events = Event::whereDate('start_date', $today)
            ->where('is_active', 1)
            ->get();

        if ($events->isEmpty()) {
            $this->info('Không có event nào hôm nay');
            return;
        }

        $users = User::all();

        foreach ($events as $event) {
            foreach ($users as $user) {
                Mail::to($user->email)->send(new EventStartMail($event));
            }
        }

        $this->info('Đã gửi mail event thành công');
    }
}
