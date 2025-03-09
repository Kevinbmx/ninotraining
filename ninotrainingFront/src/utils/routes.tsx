// utils/routes.ts

// Rutas internas
export const internalRoutes = {
  home: "/",
  admin: "/admin",
  //------grupo------
  adminGrupo: "/admin/grupo",
  adminGrupoCrear: "/admin/grupo/create",
  adminGrupoEditar: "/admin/grupo/edit",
  //------piloto--------
  adminPiloto: "/admin/piloto",
  adminPilotoCrear: "/admin/piloto/create",
  adminPilotoEditar: "/admin/piloto/edit",


  //------tutor------
  adminTutor: "/admin/tutor",
  adminTutorCrear: "/admin/tutor/create",
  //------asistencia--------
  adminAsistencia: "/admin/asistencia",

  // Añade aquí más rutas internas de la aplicación
} as const;

// Rutas de API
export const apiRoutes = {
  grupos: process.env.NEXT_PUBLIC_ENV_VARIABLE + "/grupos",
  pilotos: process.env.NEXT_PUBLIC_ENV_VARIABLE + "/pilotos",
  tutores: process.env.NEXT_PUBLIC_ENV_VARIABLE + "/tutores",
  tutoressearchpilotos: process.env.NEXT_PUBLIC_ENV_VARIABLE + "/tutoressearchpilotos", //es una busqueda de pilotos en el mismo tutor
  
  // getPiloto: (id: string | number) => `/api/pilotos/${id}`,
  // createPiloto: "/api/pilotos",
  // updatePiloto: (id: string | number) => `/api/pilotos/${id}`,
  // getAllTutor: "/api/tutor",
  // getTutor: (id: string | number) => `/api/tutor/${id}`,
  // findAllTutor: "/api/tutor/findAllTutor",
  // crearTutor: "/api/tutor/create",
  // actualizarTutor: (id: string | number) => `/api/tutor/update/${id}`,
  // createtutor: "/api/tutor",
  // updatetutor: (id: string | number) => `/api/pilotos/${id}`,
  // Añade aquí más rutas de API
} as const;
