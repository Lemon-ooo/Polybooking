<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ✅ thêm dòng này

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
<<<<<<< HEAD
=======

    const ROLE_ADMIN = 'admin';
    const ROLE_CLIENT = 'client';
>>>>>>> lamtangthanh

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // ✅ thêm dòng này
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
