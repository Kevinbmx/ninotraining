<?php

namespace App\Http\Controllers;

use App\Models\Tutor;
use App\Models\TelefonoTutor;
use App\Models\Direccion;
use Illuminate\Http\Request;
use App\Models\Piloto;
use App\Models\TutorPiloto;
use Illuminate\Support\Facades\DB;

class TutorController extends Controller
{
    // Obtener tutores paginados y filtrados
    public function index(Request $request)
    {
        $query = Tutor::query();
        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoPaterno', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoMaterno', 'like', '%' . $request->search . '%');
        }
        $tutores = $query->orderBy('nombre', 'desc')
            ->paginate($request->get('limit', 10));

        return response()->json($tutores);
    }

    // Obtener tutor por ID con teléfonos y direcciones
    public function show($id)
    {
        $tutor = Tutor::with(['telefonos', 'direcciones', 'pilotos'])->find($id);
        if (!$tutor) {
            return response()->json(['error' => 'Tutor no encontrado'], 404);
        }
        return response()->json($tutor);
        // return $tutor;
    }

    // Buscar pilotos por nombre y apellido
    public function searchPilotos(Request $request)
    {
        $query = Piloto::query();

        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoPaterno', 'like', '%' . $request->search . '%')
                ->orWhere('apellidoMaterno', 'like', '%' . $request->search . '%');
        }
        $pilotos = $query->get();

        return response()->json($pilotos);
    }

    // Crear tutor, teléfonos,  direcciones y pilotos
    public function store(Request $request)
    {
        // dd($request->all()); // Depuración
        DB::beginTransaction();
        try {
            // Crear el tutor
            $tutor = Tutor::create($request->except(['telefonos', 'direcciones', 'pilotos']));

            // Crear teléfonos
            if ($request->has('telefonos')) {
                foreach ($request->telefonos as $telefono) {
                    if (is_array($telefono) && isset($telefono['numeroTelefono'])) {
                        TelefonoTutor::create([
                            'tutor_id' => $tutor->id,
                            'numeroTelefono' => $telefono['numeroTelefono'],
                        ]);
                    }
                }
            }

            // Crear direcciones
            if ($request->has('direcciones')) {
                foreach ($request->direcciones as $direccion) {
                    Direccion::create([
                        'tutor_id' => $tutor->id,
                        'descripcion' => $direccion['descripcion'],
                        'latitud' => $direccion['latitud'],
                        'longitud' => $direccion['longitud'],
                    ]);
                }
            }

            // Crear relación con pilotos
            if ($request->has('pilotos')) {
                foreach ($request->pilotos as $piloto) {
                    TutorPiloto::create([
                        'tutor_id' => $tutor->id,
                        'piloto_id' => $piloto['id'],
                        'parentesco' => $piloto['parentesco'],
                    ]);
                }
            }

            DB::commit();
            return response()->json($tutor, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            // return response()->json(['error' => 'Error al crear el tutor'], 500);
            return $e->getMessage();
        }
    }

    // Actualizar tutor, teléfonos,  direcciones y pilotos
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $tutor = Tutor::findOrFail($id);
            $tutor->update($request->except(['telefonos', 'direcciones', 'pilotos']));

            // Actualizar teléfonos
            if ($request->has('telefonos')) {
                foreach ($request->telefonos as $telefono) {
                    TelefonoTutor::updateOrCreate(
                        ['id' => $telefono['id'] ?? null], // Busca por ID o crea uno nuevo si no existe
                        [
                            'tutor_id' => $tutor->id,
                            'numeroTelefono' => $telefono['numeroTelefono'],
                        ]
                    );
                }
            }

            // Actualizar direcciones
            if ($request->has('direcciones')) {
                foreach ($request->direcciones as $direccion) {
                    Direccion::updateOrCreate(
                        ['id' => $direccion['id'] ?? null], // Busca por ID o crea uno nuevo si no existe
                        [
                            'tutor_id' => $tutor->id,
                            'descripcion' => $direccion['descripcion'],
                            'latitud' => $direccion['latitud'],
                            'longitud' => $direccion['longitud'],
                        ]
                    );
                }
            }

            // Actualizar relación con pilotos
            if ($request->has('pilotos')) {
                foreach ($request->pilotos as $piloto) {
                    TutorPiloto::updateOrCreate(
                        [
                            'tutor_id' => $tutor->id,
                            'piloto_id' => $piloto['id'],
                        ],
                        [
                            'parentesco' => $piloto['parentesco'],
                        ]
                    );
                }
            }

            DB::commit();
            return response()->json($tutor);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar el tutor: ' . $e->getMessage()], 500);
        }
    }

    // Eliminar tutor, teléfonos y direcciones
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            Tutor::destroy($id);
            TelefonoTutor::where('tutor_id', $id)->delete();
            Direccion::where('tutor_id', $id)->delete();
            TutorPiloto::where('tutor_id', $id)->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar el tutor'], 500);
        }
    }
}
