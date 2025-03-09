import CrearTutor from "@/components/tutor/crear";

// `params` es automáticamente proporcionado por el App Router en rutas dinámicas.
const Edit = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Obtenemos el id directamente desde params

  return <CrearTutor id={id} />;
};

export default Edit;
