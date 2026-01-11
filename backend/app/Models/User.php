<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; // 🔥 PHẢI LÀ CÁI NÀY
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable  // 🔥 KẾ THỪA Authenticatable (của Eloquent)
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_name',
        'email',
        'password',
        'phone_number',
        'address',
        'avatar',
        'date_of_birth',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth'     => 'date',
    ];
    public function bookings()
{
    return $this->hasMany(Booking::class, 'user_id', 'user_id');
}

}