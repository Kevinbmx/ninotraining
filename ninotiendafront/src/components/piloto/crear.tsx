"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, DatePicker } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { parseDate } from "@internationalized/date"; // Para convertir strings a CalendarDate
import { apiRoutes, internalRoutes } from "@/utils/routes";

interface Telefono {
  id?: number;
  unic_id?: string;
  piloto_id?: number;
  numeroTelefono: string;
}

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaCumpleaño: string; // Guardamos la fecha como string
  telefonos: Telefono[];
}

const CrearPiloto = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaCumpleaño: "",
    telefonos: [{ numeroTelefono: "" }],
  });
  const [loading, setLoading] = useState<boolean>(!!id); // Cargar datos si está en modo edición

  const MAX_TELEFONOS = 3; // Límite de teléfonos

  // Cargar datos si se está en modo edición
  useEffect(() => {
    if (id) {
      const fetchPilotoData = async () => {
        try {
          const response = await fetch(`${apiRoutes.pilotos}/${id}`);
          if (!response.ok) {
            throw new Error("Error al cargar los datos del piloto.");
          }
          const data = await response.json();
          setFormData({
            nombre: data.nombre,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            fechaCumpleaño: data.fechaCumpleaño,
            telefonos: data.telefonos || [{ numeroTelefono: "" }],
          });
        } catch (error) {
          console.error("Error al cargar los datos:", error);
          alert("Error al cargar los datos del piloto.");
        } finally {
          setLoading(false); // Oculta el loading
        }
      };

      fetchPilotoData();
    }
  }, [id]);

  // --- MÉTODOS PARA MANEJAR LOS CAMPOS ---
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTelefonoChange = (index: number, value: string) => {
    const updatedTelefonos = [...formData.telefonos];
    updatedTelefonos[index].numeroTelefono = value;
    setFormData((prev) => ({ ...prev, telefonos: updatedTelefonos }));
  };

  const handleAddTelefono = () => {
    if (formData.telefonos.length >= MAX_TELEFONOS) {
      alert(`No se pueden añadir más de ${MAX_TELEFONOS} teléfonos.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      telefonos: [...prev.telefonos, { numeroTelefono: "" }],
    }));
  };

  const handleRemoveTelefono = (index: number) => {
    const updatedTelefonos = formData.telefonos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, telefonos: updatedTelefonos }));
  };

  const validateForm = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, telefonos } = formData;

    if (!nombre || !apellidoPaterno || !apellidoMaterno) {
      alert("Por favor, completa los campos personales.");
      return false;
    }

    if (telefonos.some((t) => t.numeroTelefono.trim() === "")) {
      alert("Por favor, completa todos los teléfonos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const url = id ? `${apiRoutes.pilotos}/${id}` : apiRoutes.pilotos;
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          id
            ? "Piloto actualizado correctamente."
            : "Piloto creado correctamente."
        );
        router.push(internalRoutes.adminPiloto); // Redirige a la lista de Pilotos
      } else {
        alert("Ocurrió un error. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al guardar el piloto:", error);
    }
  };

  // Convertir la fecha de string a CalendarDate para el DatePicker
  const fechaCumpleañoDate = formData.fechaCumpleaño
    ? parseDate(formData.fechaCumpleaño)
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Título */}
      <div className="text-left text-2xl font-bold uppercase">
        {id ? "Editar Piloto" : "Crear Piloto"}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          {/* Datos personales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Juan"
              fullWidth
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
            <Input
              label="Apellido Paterno"
              placeholder="Gómez"
              fullWidth
              value={formData.apellidoPaterno}
              onChange={(e) => handleChange("apellidoPaterno", e.target.value)}
            />
            <Input
              label="Apellido Materno"
              placeholder="Díaz"
              fullWidth
              value={formData.apellidoMaterno}
              onChange={(e) => handleChange("apellidoMaterno", e.target.value)}
            />
            <DatePicker
              label="Fecha de Cumpleaños"
              value={fechaCumpleañoDate} // Usamos CalendarDate aquí
              onChange={(value) =>
                handleChange("fechaCumpleaño", value.toString()) // Convertimos CalendarDate a string
              }
            />
          </div>

          {/* Teléfonos */}
          <div className="space-y-4">
            {formData.telefonos.map((telefono, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  label={`Teléfono ${index + 1}`}
                  placeholder="Ej: 789544123333"
                  fullWidth
                  value={telefono.numeroTelefono}
                  onChange={(e) =>
                    handleTelefonoChange(index, e.target.value)
                  }
                />
                <Button
                  size="sm"
                  color="danger"
                  isIconOnly
                  startContent={<Trash2 />}
                  onClick={() => handleRemoveTelefono(index)}
                ></Button>
              </div>
            ))}
            <Button
              color="secondary"
              onClick={handleAddTelefono}
              disabled={formData.telefonos.length >= MAX_TELEFONOS}
            >
              Añadir Teléfono
            </Button>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Button color="danger" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button color="success" onClick={handleSubmit}>
              Guardar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CrearPiloto;