<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\PilotoController;
use App\Http\Controllers\TutorController;

// Rutas para Grupo
Route::get('/grupos', [GrupoController::class, 'index']);
Route::get('/grupos/{id}', [GrupoController::class, 'show']);
Route::post('/grupos', [GrupoController::class, 'store']);
Route::put('/grupos/{id}', [GrupoController::class, 'update']);
Route::delete('/grupos/{id}', [GrupoController::class, 'destroy']);

// Rutas para Piloto
Route::get('/pilotos', [PilotoController::class, 'index']);
Route::get('/pilotos/{id}', [PilotoController::class, 'show']);
Route::post('/pilotos', [PilotoController::class, 'store']);
Route::put('/pilotos/{id}', [PilotoController::class, 'update']);
Route::delete('/pilotos/{id}', [PilotoController::class, 'destroy']);

// Rutas para tutores
Route::get('/tutores', [TutorController::class, 'index']);
Route::get('/tutores/{id}', [TutorController::class, 'show']);
Route::get('/tutoressearchpilotos', [TutorController::class, 'searchPilotos']);
Route::post('/tutores', [TutorController::class, 'store']);
Route::put('/tutores/{id}', [TutorController::class, 'update']);
Route::delete('/tutores/{id}', [TutorController::class, 'destroy']);