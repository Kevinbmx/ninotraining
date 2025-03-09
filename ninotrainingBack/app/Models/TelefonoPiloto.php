<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TelefonoPiloto extends Model
{
    use HasFactory;
    protected $table = 'telefonos_piloto';
    protected $fillable = [
        'unic_id',
        'piloto_id',
        'numeroTelefono',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($telefonoPiloto) {
            $telefonoPiloto->unic_id = (string) Str::uuid();
        });
    }
}
