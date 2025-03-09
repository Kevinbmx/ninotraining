<?php

namespace App\Http\Controllers;

use App\Models\Piloto;
use App\Models\TelefonoPiloto;
use Illuminate\Http\Request;

class PilotoController extends Controller
{
    // Obtener pilotos paginados y filtrados
    public function index(Request $request)
    {
        $query = Piloto::query();

        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoPaterno', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoMaterno', 'like', '%' . $request->search . '%');
        }

        $pilotos = $query->orderBy('nombre', 'desc')
            ->paginate($request->get('limit', 10));

        return response()->json($pilotos);
    }

    // Obtener piloto por ID con teléfonos
    public function show($id)
    {
        $piloto = Piloto::with('telefonos')->findOrFail($id);
        return response()->json($piloto);
    }

    // Crear piloto con teléfonos
    public function store(Request $request)
    {
        $piloto = Piloto::create($request->except('telefonos'));

        if ($request->has('telefonos')) {
            foreach ($request->telefonos as $telefono) {
                TelefonoPiloto::create([
                    'piloto_id' => $piloto->id,
                    'numeroTelefono' => $telefono['numeroTelefono']
                ]);
            }
        }

        return response()->json($piloto, 201);
    }

    // Actualizar piloto y teléfonos
    public function update(Request $request, $id)
    {
        $piloto = Piloto::findOrFail($id);
        $piloto->update($request->except('telefonos'));

        if ($request->has('telefonos')) {
            TelefonoPiloto::where('piloto_id', $piloto->id)->delete();
            foreach ($request->telefonos as $telefono) {
                TelefonoPiloto::create([
                    'piloto_id' => $piloto->id,
                    'numeroTelefono' => $telefono['numeroTelefono']
                ]);
            }
        }

        return response()->json($piloto);
    }

    // Eliminar piloto y teléfonos
    public function destroy($id)
    {
        Piloto::destroy($id);
        TelefonoPiloto::where('piloto_id', $id)->delete();
        return response()->json(null, 204);
    }
}
