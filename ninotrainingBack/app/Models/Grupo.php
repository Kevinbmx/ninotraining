<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Grupo extends Model
{
    use HasFactory;
    protected $table = 'grupos';

    protected $fillable = [
        'unic_id',
        'nombre',
        'descripcion',
        'fechaInicio',
        'fechaFinal',
        'vigente'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    // Relación con Inscripciones
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'grupo_id');
    }
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($grupo) {
            $grupo->unic_id = (string) Str::uuid();
        });
    }
}
