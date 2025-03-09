<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tutor extends Model
{
    use HasFactory;
    protected $table = 'tutores';

    protected $fillable = [
        'unic_id',
        'nombre',
        'apellidoPaterno',
        'apellidoMaterno'
    ];

    protected $hidden = [
        'unic_id',
        'created_at',
        'updated_at'
    ];

    // Relación con Teléfonos
    public function telefonos()
    {
        return $this->hasMany(TelefonoTutor::class, 'tutor_id');
    }

    // Relación con Direcciones
    public function direcciones()
    {
        return $this->hasMany(Direccion::class, 'tutor_id');
    }

    // Relación con Pilotos
    public function pilotos()
    {
        return $this->belongsToMany(Piloto::class, 'tutores_pilotos', 'tutor_id', 'piloto_id')
                    ->withPivot('parentesco');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($tutor) {
            $tutor->unic_id = (string) Str::uuid();
        });
    }
}
