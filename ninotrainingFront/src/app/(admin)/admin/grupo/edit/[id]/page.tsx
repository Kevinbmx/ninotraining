import React from "react";
import CrearGrupo from "@/components/grupo/crear";

export default function EditarGrupoPage({ params }: { params: { id: string } }) {
  const { id } = params; // Obtén el ID desde los parámetros de la ruta

  if (!id) return <div>Cargando...</div>; // Mostrar algo mientras se carga el ID

  return <CrearGrupo id={id} />;
}
