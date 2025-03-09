"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Switch, TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { apiRoutes, internalRoutes } from "@/utils/routes";

interface FormData {
  nombre: string;
  descripcion: string;
  fechaInicio: Time | null;
  fechaFinal: Time | null;
  vigente: boolean;
}

const CrearGrupo = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    fechaInicio: null,
    fechaFinal: null,
    vigente: true,
  });
  const isInitialMount = useRef(true); // Para evitar dobles peticiones
  // Estado de errores
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  // Recuperar datos del grupo si se está editando
  useEffect(() => {
    if (id && isInitialMount.current) {
      isInitialMount.current = false; // Evita que se ejecute dos veces
      const fetchGrupoData = async () => {
        try {
          const response = await fetch(`${apiRoutes.grupos}/${id}`);
          const data = await response.json();

          setFormData({
            ...data,
            fechaInicio: data.fechaInicio
              ? new Time(
                  parseInt(data.fechaInicio.split(":")[0]), // Horas
                  parseInt(data.fechaInicio.split(":")[1]) // Minutos
                )
              : null,
            fechaFinal: data.fechaFinal
              ? new Time(
                  parseInt(data.fechaFinal.split(":")[0]), // Horas
                  parseInt(data.fechaFinal.split(":")[1]) // Minutos
                )
              : null,
          });
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      };
      fetchGrupoData();
    }
  }, [id]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es requerido.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es requerida.";
    if (!formData.fechaInicio)
      newErrors.fechaInicio = "La hora de inicio es requerida.";
    if (!formData.fechaFinal)
      newErrors.fechaFinal = "La hora final es requerida.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const url = id ? `${apiRoutes.grupos}/${id}` : apiRoutes.grupos;
    const method = id ? "PUT" : "POST";

    const body = {
      ...formData,
      fechaInicio: formData.fechaInicio?.toString(),
      fechaFinal: formData.fechaFinal?.toString(),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(
          id
            ? "Grupo actualizado correctamente."
            : "Grupo creado correctamente."
        );
        router.push(internalRoutes.adminGrupo);
      } else {
        alert("Ocurrió un error. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-left text-2xl font-bold uppercase">
        {id ? "Editar Grupo" : "Crear Grupo"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          label="Nombre 123"
          placeholder="Bicicross 18:00 - 20:00"
          fullWidth
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre}
        />
        <Input
          label="Descripción"
          placeholder="Entrenamiento horario nocturno BMX"
          fullWidth
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          isInvalid={!!errors.descripcion}
          errorMessage={errors.descripcion}
        />
        <TimeInput
          label="Hora Inicio"
          fullWidth
          value={formData.fechaInicio}
          onChange={(value) => handleChange("fechaInicio", value)}
          isInvalid={!!errors.fechaInicio}
          errorMessage={errors.fechaInicio || undefined}
        />
        <TimeInput
          label="Hora Final"
          fullWidth
          value={formData.fechaFinal}
          onChange={(value) => handleChange("fechaFinal", value)}
          isInvalid={!!errors.fechaFinal}
          errorMessage={errors.fechaFinal || undefined}
        />
        <Switch
          isSelected={formData.vigente}
          onValueChange={(value) => handleChange("vigente", value)}
        >
          ¿Grupo vigente?
        </Switch>
      </div>

      <div className="flex justify-end gap-4">
        <Button color="danger" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button color="success" onClick={handleSubmit}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default CrearGrupo;
