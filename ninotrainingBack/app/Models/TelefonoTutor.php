<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TelefonoTutor extends Model
{
    use HasFactory;

    protected $table = 'telefonos_tutor';

    protected $fillable = [
        'unic_id',
        'tutor_id',
        'numeroTelefono',
    ];
    protected $hidden = [
        'tutor_id',
        'created_at',
        'updated_at',
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($telefonoTutor) {
            $telefonoTutor->unic_id = (string) Str::uuid();
        });
    }
}
