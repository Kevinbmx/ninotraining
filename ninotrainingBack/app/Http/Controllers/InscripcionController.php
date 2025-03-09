<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use Illuminate\Http\Request;

class InscripcionController extends Controller
{
     // Obtener inscripciones con datos de piloto y grupo
     public function index(Request $request)
     {
         $inscripciones = Inscripcion::with(['piloto', 'grupo'])
             ->orderBy('fechaInicio', 'desc')
             ->paginate($request->get('limit', 10));
 
         return response()->json($inscripciones);
     }
 
     // Obtener inscripción por ID con historial
     public function show($id)
     {
         $inscripcion = Inscripcion::with(['piloto', 'grupo', 'asistencias'])->findOrFail($id);
         return response()->json($inscripcion);
     }
 
     // Crear inscripción
     public function store(Request $request)
     {
         $inscripcion = Inscripcion::create($request->all());
         return response()->json($inscripcion, 201);
     }
 
     // Actualizar inscripción
     public function update(Request $request, $id)
     {
         $inscripcion = Inscripcion::findOrFail($id);
         $inscripcion->update($request->all());
         return response()->json($inscripcion);
     }
 
     // Eliminar inscripción
     public function destroy($id)
     {
         Inscripcion::destroy($id);
         return response()->json(null, 204);
     }
}
