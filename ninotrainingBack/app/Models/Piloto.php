<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Piloto extends Model
{
    use HasFactory;
    protected $table = 'pilotos';

    protected $fillable = [
        'unic_id',
        'nombre',
        'apellidoPaterno',
        'apellidoMaterno',
        'fechaCumpleaño'
    ];

    protected $hidden = [
        'unic_id',
        'fechaCumpleaño',
        'created_at',
        'updated_at'
    ];

    // Relación con Teléfonos
    public function telefonos()
    {
        // dd("entnro");
        return $this->hasMany(TelefonoPiloto::class, 'piloto_id');
    }

    // Relación con Inscripciones
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'piloto_id');
    }

    // Relación con Tutores
    public function tutores()
    {
        return $this->belongsToMany(Tutor::class, 'tutor_acargo_de_piloto', 'piloto_id', 'tutor_id')
            ->withPivot('parentesco');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($piloto) {
            $piloto->unic_id = (string) Str::uuid();
        });
    }
}
