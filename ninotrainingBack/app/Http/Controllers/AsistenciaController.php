<?php

namespace App\Http\Controllers;
use App\Models\Asistencia;
use Illuminate\Http\Request;

class AsistenciaController extends Controller
{
     // Obtener asistencias filtradas por alumno, grupo y rango de fechas
     public function index(Request $request)
     {
         $query = Asistencia::query();
 
         if ($request->has('piloto_id')) {
             $query->whereHas('inscripcion', function ($q) use ($request) {
                 $q->where('piloto_id', $request->piloto_id);
             });
         }
 
         if ($request->has('grupo_id')) {
             $query->whereHas('inscripcion', function ($q) use ($request) {
                 $q->where('grupo_id', $request->grupo_id);
             });
         }
 
         if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
             $query->whereBetween('fechaMarcada', [$request->fecha_inicio, $request->fecha_fin]);
         }
 
         $asistencias = $query->with(['inscripcion.piloto', 'inscripcion.grupo'])
             ->orderBy('fechaMarcada', 'desc')
             ->paginate($request->get('limit', 10));
 
         return response()->json($asistencias);
     }
 
     // Crear o actualizar asistencia
     public function store(Request $request)
     {
         $asistencia = Asistencia::updateOrCreate(
             ['inscripcion_id' => $request->inscripcion_id, 'fechaMarcada' => $request->fechaMarcada],
             ['asistio' => $request->asistio]
         );
         return response()->json($asistencia, 201);
     }
 
     // Eliminar asistencia
     public function destroy($id)
     {
         Asistencia::destroy($id);
         return response()->json(null, 204);
     }
}
