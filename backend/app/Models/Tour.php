<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
  use HasFactory;

  /**
   * Các cột được phép gán hàng loạt
   */
  protected $fillable = [
    'name',
    'price',
    'location',
    'start_date',
    'duration',
    'description',
    'image',
  ];

  /**
   * Ép kiểu dữ liệu
   */
  protected $casts = [
    'start_date' => 'datetime',
    'price' => 'decimal:2',
  ];
}
