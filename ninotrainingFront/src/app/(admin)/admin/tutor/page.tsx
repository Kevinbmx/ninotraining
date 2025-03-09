"use client";

import { useState, useEffect } from "react";
import CustomTable, { ColumnConfig } from "@/components/table/CustomTable";
import { RenderActions } from "@/components/table/render-cell";
import { Button, Input, Spinner } from "@nextui-org/react";
import { FileUp, House, User } from "lucide-react";
import Link from "next/link";
import { apiRoutes, internalRoutes } from "@/utils/routes";

const apiUrl = "https://jsonplaceholder.typicode.com/users";

export default function Tutor() {
  const [data, setData] = useState<any[]>([]); // Datos para la tabla
  const [searchQuery, setSearchQuery] = useState<string>(""); // Texto de búsqueda
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // --- Función para buscar datos ---
  const fetchData = async (query: string) => {
    setData([]); // Vacía los datos previos
    setLoading(true); // Muestra el loading en la tabla
    setError(null); // Resetea posibles errores
    try {
      const response = await fetch(
        `${apiUrl}${query ? `?search=${query}` : ""}`
      );
      const result = await response.json();
      setData(result); // Actualiza los datos
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Error al cargar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false); // Oculta el loading
    }
  };

  // --- Maneja la búsqueda con debounce ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(searchQuery);
    }, 500); // Espera 500ms antes de hacer la petición

    return () => clearTimeout(timeout); // Limpia el timeout si cambia el query
  }, [searchQuery]);

  // --- Configuración de columnas ---
  const handleView = (item: any) => console.log("Ver usuario:", item);
  const handleEdit = (item: any) => console.log("Editar usuario:", item);
  const handleDelete = (item: any) => console.log("Eliminar usuario:", item);

  const columns: ColumnConfig<any>[] = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo Electrónico" },
    { key: "phone", label: "Teléfono" },
    {
      key: "actions",
      label: "Acciones",
      renderCell: (item) => (
        <RenderActions
          item={item}
          actions={{
            view: handleView,
            edit: handleEdit,
            delete: handleDelete,
          }}
        />
      ),
    },
  ];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <ul className="flex">
        <li className="flex gap-2">
          <House />
          <Link href={internalRoutes.admin}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
        <li className="flex gap-2">
          <User />
          <span>Tutor</span>
        </li>
      </ul>

      {/* Header */}
      <h3 className="text-xl font-semibold">Tutores</h3>

      {/* Buscador y Acciones */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Buscar Tutores"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Link href={internalRoutes.adminTutorCrear}>
            <Button color="primary">Añadir Tutor</Button>
          </Link>
          <Button color="primary" startContent={<FileUp />}>
            Exportar a CSV
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-[95rem] mx-auto w-full">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <CustomTable
            data={data}
            columns={columns}
            loading={loading} // Muestra el loading en la tabla
          />
        )}
      </div>
    </div>
  );
}
