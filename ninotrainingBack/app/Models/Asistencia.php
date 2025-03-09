<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Asistencia extends Model
{
    use HasFactory;
    protected $table = 'asistencias';

    protected $fillable = [
        'unic_id',
        'inscripcion_id',
        'asistio',
        'fechaMarcada'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Relación con Inscripción
    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class, 'inscripcion_id');
    }

    // Relación con Comentarios
    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'asistencia_id');
    }
}
