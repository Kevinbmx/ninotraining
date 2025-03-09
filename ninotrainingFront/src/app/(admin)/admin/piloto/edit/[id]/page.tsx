import React from "react";
import CrearGrupo from "@/components/piloto/crear";


export default function EditarPilotoPage({ params }: { params: { id: string } }) {
  const { id } = params; // Obtén el ID desde los parámetros de la ruta

  if (!id) return <div>Cargando...</div>; // Mostrar algo mientras se carga el ID

  return <CrearGrupo id={id} />;
}
