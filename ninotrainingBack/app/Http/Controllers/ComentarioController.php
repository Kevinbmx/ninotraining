<?php

namespace App\Http\Controllers;
use App\Models\Comentario;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
      // Obtener comentarios por asistencia y rango de fechas
      public function index(Request $request)
      {
          $query = Comentario::query();
  
          if ($request->has('asistencia_id')) {
              $query->where('asistencia_id', $request->asistencia_id);
          }
  
          if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
              $query->whereBetween('created_at', [$request->fecha_inicio, $request->fecha_fin]);
          }
  
          $comentarios = $query->orderBy('created_at', 'desc')
                               ->paginate($request->get('limit', 10));
  
          return response()->json($comentarios);
      }
  
      // Crear o actualizar comentario
      public function store(Request $request)
      {
          $comentario = Comentario::updateOrCreate(
              ['asistencia_id' => $request->asistencia_id],
              ['comentario' => $request->comentario]
          );
          return response()->json($comentario, 201);
      }
  
      // Eliminar comentario
      public function destroy($id)
      {
          Comentario::destroy($id);
          return response()->json(null, 204);
      }
}
