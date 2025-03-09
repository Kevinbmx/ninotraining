<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TutorPiloto extends Model
{
    use HasFactory;

    protected $table = 'tutores_pilotos';
    protected $fillable = [
        'tutor_id',
        'piloto_id',
        'parentesco',
    ];
    protected $hidden = [
        'tutor_id',
        'piloto_id',
        'created_at',
        'updated_at',
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($tutorPiloto) {
            $tutorPiloto->unic_id = (string) Str::uuid();
        });
    }
}
