<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Inscripcion extends Model
{
    use HasFactory;
    protected $table = 'inscripciones';

    protected $fillable = [
        'unic_id',
        'grupo_id',
        'piloto_id',
        'fechaInicio',
        'fechaFin'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    // Relación con Grupo
    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    // Relación con Piloto
    public function piloto()
    {
        return $this->belongsTo(Piloto::class, 'piloto_id');
    }

    // Relación con Asistencias
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class, 'inscripcion_id');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($inscripcion) {
            $inscripcion->unic_id = (string) Str::uuid();
        });
    }
}
