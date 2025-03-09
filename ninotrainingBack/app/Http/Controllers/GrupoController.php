<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    // Obtener grupos paginados y filtrados
    public function index(Request $request)
    {
        $query = Grupo::query();

        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%')
                ->orWhere('descripcion', 'like', '%' . $request->search . '%');
        }

        $grupos = $query->orderBy('fechaInicio', 'desc')
            ->paginate($request->get('perPage', 1));

        return response()->json($grupos);
    }

    // Obtener grupo por ID
    public function show($id)
    {
        $grupo = Grupo::findOrFail($id);
        return response()->json($grupo);
    }

    // Crear grupo
    public function store(Request $request)
    {
        $grupo = Grupo::create($request->all());
        return response()->json($grupo, 201);
    }

    // Actualizar grupo
    public function update(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);
        $grupo->update($request->all());
        return response()->json($grupo);
    }

    // Eliminar grupo
    public function destroy($id)
    {
        Grupo::destroy($id);
        return response()->json(null, 204);
    }
}
