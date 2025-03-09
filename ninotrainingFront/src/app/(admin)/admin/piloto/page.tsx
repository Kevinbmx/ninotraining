"use client";

import { useState, useEffect, useRef } from "react";
import CustomTable, { ColumnConfig } from "@/components/table/CustomTable";
import { RenderActions } from "@/components/table/render-cell";
import { Button, Input, Spinner, Pagination, Switch } from "@nextui-org/react";
import { FileUp, House, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRoutes, internalRoutes } from "@/utils/routes";

const apiUrl = "http://ninotrainingback.algo/api/pilotos"; // URL de tu API de Laravel

export default function Piloto() {
  const [data, setData] = useState<any[]>([]); // Datos para la tabla
  const [searchQuery, setSearchQuery] = useState<string>(""); // Texto de búsqueda
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  }); // Estado de paginación
  const isInitialMount = useRef(true); // Para evitar dobles peticiones
  const router = useRouter();

  // --- Función para buscar datos ---
  const fetchData = async (page: number, perPage: number, query: string = "") => {
    setLoading(true); // Muestra el loading en la tabla
    setError(null); // Resetea posibles errores
    try {
      const response = await fetch(
        `${apiUrl}?page=${page}&perPage=${perPage}&search=${query}`
      );
      const result = await response.json();
      setData(result.data); // Actualiza los datos
      setPagination({
        page: result.current_page,
        perPage: result.per_page,
        total: result.total,
      }); // Actualiza la paginación
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      setError("Error al cargar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false); // Oculta el loading
    }
  };

  // --- Maneja la búsqueda con debounce ---
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const timeout = setTimeout(() => {
        fetchData(pagination.page, pagination.perPage, searchQuery);
      }, 500); // Espera 500ms antes de hacer la petición

      return () => clearTimeout(timeout); // Limpia el timeout si cambia el query
    }
  }, [pagination.page, pagination.perPage, searchQuery]);

  // --- Cambiar página ---
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // --- Redirigir a editar ---
  const handleEdit = (item: any) => {
    router.push(`${internalRoutes.adminPilotoEditar}/${item.id}`);
  };

  // --- Eliminar piloto ---
  const handleDelete = async (item: any) => {
    if (confirm("¿Estás seguro de que deseas eliminar este piloto?")) {
      try {
        const response = await fetch(`${apiUrl}/${item.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Piloto eliminado correctamente.");
          fetchData(pagination.page, pagination.perPage, searchQuery); // Recargar datos
        } else {
          alert("Ocurrió un error al eliminar el piloto.");
        }
      } catch (error) {
        console.error("Error al eliminar el piloto:", error);
      }
    }
  };

  // --- Configuración de columnas ---
  const columns: ColumnConfig<any>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "apellidoPaterno", label: "Apellido Paterno" },
    { key: "apellidoMaterno", label: "Apellido Materno" },
    {
      key: "actions",
      label: "Acciones",
      renderCell: (item) => (
        <RenderActions
          item={item}
          actions={{
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
          <span>Piloto</span>
        </li>
      </ul>

      {/* Header */}
      <h3 className="text-xl font-semibold">Pilotos</h3>

      {/* Buscador y Acciones */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Buscar pilotos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Link href={internalRoutes.adminPilotoCrear}>
            <Button color="primary">Añadir Piloto</Button>
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
          <>
            <CustomTable
              data={data}
              columns={columns}
              loading={loading} // Muestra el loading en la tabla
            />
            <div className="mt-4 flex justify-center">
              <Pagination
                total={Math.ceil(pagination.total / pagination.perPage)}
                initialPage={pagination.page}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}