<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'user_id',
        'admin_id',
    ];

    // =========================
    // USER (CLIENT)
    // =========================
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id')
            ->select(['user_id', 'user_name', 'email']);
    }

    // =========================
    // ADMIN
    // =========================
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id')
            ->select(['user_id', 'user_name', 'email']);
    }

    // =========================
    // MESSAGES
    // =========================
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id', 'id');
    }
}