<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DamageType extends Model
{
    protected $fillable = ['name', 'price'];

    public function damages()
    {
        return $this->hasMany(DamageInvoice::class);
    }
}
