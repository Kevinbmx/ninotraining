"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Textarea,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { apiRoutes, internalRoutes } from "@/utils/routes";

// Configuración del mapa
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  latitud: -17.7833, // Latitud y longitud inicial (por ejemplo, La Paz, Bolivia)
  longitud: -63.1821,
};

interface Direccion {
  latitud: string;
  longitud: string;
  descripcion: string;
}

interface Piloto {
  id: number;
  nombre: string;
  parentesco: string;
}

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefonos: string[];
  direcciones: Direccion[];
  pilotos: Piloto[];
}

const CrearTutor = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefonos: [""],
    direcciones: [{ latitud: "", longitud: "", descripcion: "" }],
    pilotos: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Piloto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.API_KEY_GOOGLE, // Reemplaza con tu clave de API
  });

  const MAX_TELEFONOS = 6; // Límite de teléfonos
  const MAX_DIRECCIONES = 4; // Límite de direcciones
  const MAX_PILOTOS = 4; // Límite de pilotos

  // Cargar datos si se está en modo edición
  useEffect(() => {
    if (id) {
      const fetchTutorData = async () => {
        try {
          const response = await fetch(`${apiRoutes.tutores}/${id}`);
          if (!response.ok) {
            throw new Error("No se pudo acceder al tutor.");
          }
          const data = await response.json();
          setFormData({
            ...data,
            telefonos: data.telefonos?.map((t: any) => t.numeroTelefono) || [
              "",
            ],
            direcciones: data.direcciones?.map((d: any) => ({
              latitud: d.latitud,
              longitud: d.longitud,
              descripcion: d.descripcion,
            })) || [{ latitud: "", longitud: "", descripcion: "" }],
            pilotos: data.pilotos || [],
          });
        } catch (error) {
          alert("No se pudo acceder al tutor o no se encuentra.");
          router.push(internalRoutes.adminTutor);
        }
      };
      fetchTutorData();
    }
  }, [id]);

  // --- MÉTODOS PARA MANEJAR LOS CAMPOS ---
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTelefonoChange = (index: number, value: string) => {
    const updatedTelefonos = [...formData.telefonos];
    updatedTelefonos[index] = value;
    setFormData((prev) => ({ ...prev, telefonos: updatedTelefonos }));
  };

  const handleAddTelefono = () => {
    if (formData.telefonos.length >= MAX_TELEFONOS) {
      alert(`No se pueden añadir más de ${MAX_TELEFONOS} teléfonos.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      telefonos: [...prev.telefonos, ""],
    }));
  };

  const handleRemoveTelefono = (index: number) => {
    const updatedTelefonos = formData.telefonos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, telefonos: updatedTelefonos }));
  };

  const handleDireccionChange = (
    index: number,
    field: keyof Direccion,
    value: string
  ) => {
    const updatedDirecciones = [...formData.direcciones];
    updatedDirecciones[index][field] = value;
    setFormData((prev) => ({ ...prev, direcciones: updatedDirecciones }));
  };

  const handleAddDireccion = () => {
    if (formData.direcciones.length >= MAX_DIRECCIONES) {
      alert(`No se pueden añadir más de ${MAX_DIRECCIONES} direcciones.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      direcciones: [
        ...prev.direcciones,
        { latitud: "", longitud: "", descripcion: "" },
      ],
    }));
  };

  const handleRemoveDireccion = (index: number) => {
    const updatedDirecciones = formData.direcciones.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, direcciones: updatedDirecciones }));
  };

  // --- MANEJAR LA SELECCIÓN DE UBICACIÓN EN EL MAPA ---
  const handleMapClick = (index: number, event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const latitud = event.latLng.lat();
      const longitud = event.latLng.lng();

      const updatedDirecciones = [...formData.direcciones];
      updatedDirecciones[index] = {
        ...updatedDirecciones[index],
        latitud: latitud.toString(),
        longitud: longitud.toString(),
      };
      setFormData((prev) => ({ ...prev, direcciones: updatedDirecciones }));

      // Obtener la dirección usando Geocoding
      getAddressFromLatLng(index, latitud, longitud);
    }
  };

  // --- OBTENER LA DIRECCIÓN DESDE LATITUD Y LONGITUD ---
  const getAddressFromLatLng = async (
    index: number,
    latitud: number,
    longitud: number
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${process.env.API_KEY_GOOGLE}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        const updatedDirecciones = [...formData.direcciones];
        updatedDirecciones[index].descripcion = address;
        setFormData((prev) => ({ ...prev, direcciones: updatedDirecciones }));
      }
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
    }
  };

  // --- BÚSQUEDA DE PILOTOS ---
  const handleSearchPilotos = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${apiRoutes.tutoressearchpilotos}?search=${term}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error al buscar pilotos:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPiloto = (piloto: Piloto) => {
    if (formData.pilotos.length >= MAX_PILOTOS) {
      alert(`No se pueden añadir más de ${MAX_PILOTOS} pilotos.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      pilotos: [...prev.pilotos, piloto],
    }));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemovePiloto = (index: number) => {
    const updatedPilotos = formData.pilotos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, pilotos: updatedPilotos }));
  };

  // --- VALIDAR EL FORMULARIO ---
  const validateForm = () => {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefonos,
      direcciones,
      pilotos,
    } = formData;

    if (!nombre || !apellidoPaterno || !apellidoMaterno) {
      alert("Por favor, completa los campos personales.");
      return false;
    }

    if (telefonos.some((t) => t.trim() === "")) {
      alert("Por favor, completa todos los teléfonos.");
      return false;
    }

    if (direcciones.some((d) => !d.latitud || !d.longitud || !d.descripcion)) {
      alert("Por favor, completa todas las direcciones.");
      return false;
    }

    if (pilotos.length === 0) {
      alert("Por favor, añade al menos un piloto.");
      return false;
    }

    return true;
  };

  // --- MANEJAR EL ENVÍO DEL FORMULARIO ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const url = id ? `${apiRoutes.tutores}/${id}` : apiRoutes.tutores;
    const method = id ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          telefonos: formData.telefonos.map((t, index) => ({
            id: id ? formData.telefonos[index]?.id : null, // Envía el ID si existe
            numeroTelefono: t,
          })),
          direcciones: formData.direcciones.map((d, index) => ({
            id: id ? formData.direcciones[index]?.id : null, // Envía el ID si existe
            descripcion: d.descripcion,
            latitud: d.latitud,
            longitud: d.longitud,
          })),
          pilotos: formData.pilotos.map((p) => ({
            id: p.id,
            parentesco: p.parentesco,
          })),
        }),
      });

      if (response.ok) {
        alert(
          id
            ? "Tutor actualizado correctamente."
            : "Tutor creado correctamente."
        );
        router.push(internalRoutes.adminTutor);
      } else {
        alert("Ocurrió un error. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al guardar el tutor:", error);
    }
  };

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando Google Maps...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Título */}
      <div className="text-left text-2xl font-bold uppercase">
        {id ? "Editar Tutor" : "Crear Tutor"}
      </div>

      {/* Datos personales */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Teléfonos */}
      <div className="space-y-4">
        {formData.telefonos.map((telefono, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              label={`Teléfono ${index + 1}`}
              placeholder="Ej: 789544123333"
              fullWidth
              value={telefono}
              onChange={(e) => handleTelefonoChange(index, e.target.value)}
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

      {/* Direcciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formData.direcciones.map((direccion, index) => (
          <div key={index}>
            <Button
              size="sm"
              color="danger"
              isIconOnly
              startContent={<Trash2 />}
              onClick={() => handleRemoveDireccion(index)}
            ></Button>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{
                lat: parseFloat(direccion.latitud) || defaultCenter.latitud,
                lng: parseFloat(direccion.longitud) || defaultCenter.longitud,
              }}
              zoom={15}
              onClick={(e) => handleMapClick(index, e)}
            >
              {direccion.latitud && direccion.longitud && (
                <Marker
                  position={{
                    lat: parseFloat(direccion.latitud),
                    lng: parseFloat(direccion.longitud),
                  }}
                />
              )}
            </GoogleMap>
            <Textarea
              label="Dirección"
              placeholder="Selecciona una ubicación en el mapa"
              value={direccion.descripcion}
              onChange={(e) =>
                handleDireccionChange(index, "descripcion", e.target.value)
              }
            />
          </div>
        ))}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
          <Button
            color="secondary"
            onClick={handleAddDireccion}
            disabled={formData.direcciones.length >= MAX_DIRECCIONES}
          >
            Añadir Dirección
          </Button>
        </div>
      </div>

      {/* Pilotos */}
      <div className="space-y-4">
        <Input
          label="Buscar Piloto"
          placeholder="Nombre del Piloto"
          fullWidth
          value={searchTerm}
          onChange={(e) => handleSearchPilotos(e.target.value)}
        />
        {isSearching && <p>Buscando pilotos...</p>}
        <Listbox>
          {searchResults.map((piloto) => (
            <ListboxItem
              key={piloto.id}
              onClick={() => handleSelectPiloto(piloto)}
            >
              {piloto.nombre} {piloto.apellidoPaterno} {piloto.apellidoMaterno}
            </ListboxItem>
          ))}
        </Listbox>
        {formData.pilotos.map((piloto, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              label="Piloto"
              placeholder="Nombre del Piloto"
              fullWidth
              value={piloto.nombre}
              readOnly
            />
            <Input
              label="Parentesco"
              placeholder="Ej: Padre"
              fullWidth
              value={piloto.pivot?.parentesco} // Usa el parentesco directamente
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pilotos: prev.pilotos.map((p, i) =>
                    i === index ? { ...p, parentesco: e.target.value } : p
                  ),
                }))
              }
            />
            <Button
              size="sm"
              color="danger"
              isIconOnly
              startContent={<Trash2 />}
              onClick={() => handleRemovePiloto(index)}
            ></Button>
          </div>
        ))}
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
    </div>
  );
};

export default CrearTutor;
