<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Comentario extends Model
{
    use HasFactory;
    protected $table = 'comentarios';

    protected $fillable = [
        'unic_id',
        'asistencia_id',
        'comentario'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    // Relación con Asistencia
    public function asistencia()
    {
        return $this->belongsTo(Asistencia::class, 'asistencia_id');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($comentario) {
            $comentario->unic_id = (string) Str::uuid();
        });
    }
}
