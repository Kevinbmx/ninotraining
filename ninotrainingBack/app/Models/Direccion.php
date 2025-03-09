<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Direccion extends Model
{
    use HasFactory;

    protected $table = 'direcciones';
    protected $fillable = [
        'unic_id',
        'tutor_id',
        'latitud',
        'longitud',
        'descripcion',
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($direccion) {
            $direccion->unic_id = (string) Str::uuid();
        });
    }
}
