"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";

export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  renderCell?: (item: T) => React.ReactNode;
  hidden?: boolean; // Permite ocultar columnas dinámicamente
};

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
}

export default function CustomTable<T>({
  data,
  columns,
  loading,
}: CustomTableProps<T>) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Tabla personalizada">
        <TableHeader>
          {columns
            .filter((col) => !col.hidden)
            .map((col) => (
              <TableColumn key={String(col.key)}>{col.label}</TableColumn>
            ))}
        </TableHeader>
        <TableBody
          isLoading={loading}
          items={data}
          loadingContent={<p>Cargando...</p>}
        >
          {/* {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns
                .filter((col) => !col.hidden)
                .map((col) => (
                  <TableCell key={`${rowIndex}-${String(col.key)}`}>
                    {col.renderCell
                      ? col.renderCell(item)
                      : (item[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
            </TableRow>
          ))} */}
          {data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns
                .filter((col) => !col.hidden) // Muestra solo las columnas visibles
                .map((col) => (
                  <TableCell key={`${rowIndex}-${String(col.key)}`}>
                    {col.renderCell
                      ? col.renderCell(item) // Si hay un renderCell definido, úsalo
                      : (item[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
