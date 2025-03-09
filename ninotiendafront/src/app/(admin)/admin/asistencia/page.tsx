"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  DateRangePicker,
} from "@nextui-org/react";
import {
  parseDate,
  getLocalTimeZone,
  today,
  CalendarDate,
} from "@internationalized/date";
import { CheckCircle, XCircle, MinusCircle, Search, X } from "lucide-react";
import { useDateFormatter } from "@react-aria/i18n";

const alumnosSimulados = [
  { id: "1", nombre: "Juan Mamani", estadoPago: "pagado" },
  { id: "2", nombre: "Ana Gómez", estadoPago: "debe" },
  { id: "3", nombre: "Luis Torres", estadoPago: "pagado" },
  { id: "4", nombre: "María López", estadoPago: "debe" },
];

const PILOTOS_PRUEBA = ["Grupo A", "Grupo B", "Grupo C"];

const getMesActual = (): { start: CalendarDate; end: CalendarDate } => {
  const fechaHoy = today(getLocalTimeZone());
  const year = fechaHoy.year;
  const month = `${fechaHoy.month}`.padStart(2, "0"); // Asegura dos dígitos para el mes
  const inicioMes = parseDate(`${year}-${month}-01`);
  const ultimoDiaMes = new Date(year, fechaHoy.month, 0).getDate();
  const finMes = parseDate(
    `${year}-${month}-${ultimoDiaMes.toString().padStart(2, "0")}`
  ); // También asegura dos dígitos para el día
  return { start: inicioMes, end: finMes };
};
export default function AsistenciasConBusqueda() {
  const [rangoFechas, setRangoFechas] = useState(() => getMesActual());
  // const [rangoFechas, setRangoFechas] = useState({
  //   start: parseDate(today(getLocalTimeZone()).toString()),
  //   end: parseDate(today(getLocalTimeZone()).add({ months: 1 }).toString()),
  // });
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>("Grupo A");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [asistencias, setAsistencias] = useState<
    { alumnoId: string; fecha: string; presente: boolean | null }[]
  >([]);
  const [menuContextual, setMenuContextual] = useState<{
    visible: boolean;
    alumnoId?: string;
    fecha?: string;
    x?: number;
    y?: number;
  }>({
    visible: false,
  });
  const menuRef = useRef<HTMLDivElement>(null);
  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (menuContextual.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuContextual.visible]);
  const formatter = useDateFormatter({ dateStyle: "long" });
  // 📌 📌 📌 UseMemo para evitar re-render innecesario
  const fechasPorMes = useMemo(() => {
    console.log("Generando fechasPorMes...");
    const fechas: Record<string, string[]> = {};
    const currentDate = rangoFechas.start.toDate(getLocalTimeZone());
    const endDate = rangoFechas.end.toDate(getLocalTimeZone());

    while (currentDate <= endDate) {
      const yearMonth = currentDate.toISOString().slice(0, 7);
      const day = currentDate.toISOString().split("T")[0];

      if (!fechas[yearMonth]) fechas[yearMonth] = [];
      fechas[yearMonth].push(day);

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return fechas;
  }, [rangoFechas]);

  const handleToggleAsistencia = (
    alumnoId: string,
    fecha: string,
    presente: boolean | null
  ) => {
    setAsistencias((prev) => {
      const index = prev.findIndex(
        (a) => a.alumnoId === alumnoId && a.fecha === fecha
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index].presente = presente;
        return updated;
      }
      return [...prev, { alumnoId, fecha, presente }];
    });
  };

  const handleOpenMenu = (
    e: React.MouseEvent<HTMLTableCellElement>,
    alumnoId: string,
    fecha: string
  ) => {
    e.preventDefault();
    const xPos = e.clientX;
    const yPos = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const menuWidth = 200; // Aproximado del menú
    const menuHeight = 280; // Aproximado del menú

    setMenuContextual({
      visible: true,
      alumnoId,
      fecha,
      x: xPos + menuWidth > screenWidth ? xPos - menuWidth : xPos,
      y: yPos + menuHeight > screenHeight ? yPos - menuHeight : yPos,
    });
  };

  const handleCloseMenu = () => setMenuContextual({ visible: false });

  return (
    <div className="container mx-auto p-6 space-y-6 relative">
      {/* Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar Alumno"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            contentRight={<Search />}
            onKeyDown={(e) => {
              if (e.key === "Enter") console.log("Buscando...");
            }}
          />
        </div>
        <DateRangePicker
          label="Rango de Fechas"
          value={rangoFechas}
          onChange={setRangoFechas}
          granularity="day"
          valueFormat="dd/MM/yyyy"
        />
        <Input
          label="Grupo"
          placeholder="Seleccionar grupo..."
          fullWidth
          list="grupos"
          value={grupoSeleccionado}
          onChange={(e) => setGrupoSeleccionado(e.target.value)}
        />
        <datalist id="grupos">
          {PILOTOS_PRUEBA.map((grupo) => (
            <option key={grupo} value={grupo} />
          ))}
        </datalist>
      </div>

      <p className="text-sm text-default-500 mt-2">
        Fechas seleccionadas:{" "}
        {formatter.formatRange(
          rangoFechas.start.toDate(getLocalTimeZone()),
          rangoFechas.end.toDate(getLocalTimeZone())
        )}
      </p>

      {Object.entries(fechasPorMes).map(([yearMonth, fechas]) => {
        // Asegúrate de que el formato de yearMonth sea "YYYY-MM"
        const [year, month] = yearMonth.split("-");
        const nombreMes = new Date(
          parseInt(year),
          parseInt(month) - 1,
          1
        ).toLocaleString("es", {
          month: "long",
          year: "numeric",
        });
        console.log(nombreMes);
        return (
          <div key={yearMonth} className="space-y-4">
            <h3
              className="text-lg font-bold capitalize"
              suppressHydrationWarning
            >
              {nombreMes}
            </h3>
            <Table>
              <TableHeader>
                <TableColumn>Alumno</TableColumn>
                {fechas.map((fecha) => (
                  <TableColumn key={fecha}>{fecha.split("-")[2]}</TableColumn>
                ))}
                <TableColumn>Días Asistidos</TableColumn>
                <TableColumn>Estado de Pago</TableColumn>
              </TableHeader>
              <TableBody>
                {alumnosSimulados.map((alumno) => {
                  const diasAsistidos = asistencias.filter(
                    (a) => a.alumnoId === alumno.id && fechas.includes(a.fecha)
                  ).length;

                  return (
                    <TableRow key={alumno.id}>
                      <TableCell>{alumno.nombre}</TableCell>
                      {fechas.map((fecha) => {
                        const asistencia = asistencias.find(
                          (a) => a.alumnoId === alumno.id && a.fecha === fecha
                        )?.presente;

                        return (
                          <TableCell
                            key={fecha}
                            onClick={(e) => handleOpenMenu(e, alumno.id, fecha)}
                          >
                            {asistencia === true ? (
                              <CheckCircle color="green" size={20} />
                            ) : asistencia === false ? (
                              <XCircle color="red" size={20} />
                            ) : (
                              <MinusCircle color="gray" size={20} />
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell>{diasAsistidos}</TableCell>
                      <TableCell>
                        {alumno.estadoPago === "pagado" ? (
                          <CheckCircle color="green" size={20} />
                        ) : (
                          <XCircle color="red" size={20} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}
      {/* Menú Contextual */}
      {menuContextual.visible && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleCloseMenu}
          ></div>

          {/* Menú */}
          <div
            ref={menuRef}
            className="fixed z-50 bg-white shadow-md rounded-md p-4 backdrop-blur-lg bg-opacity-75"
            style={{ top: menuContextual.y, left: menuContextual.x }}
          >
            <button
              className="absolute top-2 right-2"
              onClick={handleCloseMenu}
            >
              <X />
            </button>
            <h4 className="font-bold">
              {alumnosSimulados.find((a) => a.id === menuContextual.alumnoId)
                ?.nombre || ""}
            </h4>
            <p className="text-sm text-gray-500">{menuContextual.fecha}</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={() =>
                  handleToggleAsistencia(
                    menuContextual.alumnoId!,
                    menuContextual.fecha!,
                    true
                  )
                }
              >
                Asistió
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() =>
                  handleToggleAsistencia(
                    menuContextual.alumnoId!,
                    menuContextual.fecha!,
                    false
                  )
                }
              >
                Faltó
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Añadir Comentario
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-md">
                Ver Detalle
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
