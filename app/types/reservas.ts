import { ApiResponse } from "./ApiResponse";

export type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";

export interface Mesa {
  id: number;
  numeroMesa: number;
  capacidad: number;
  ubicacion: string;
  activo: boolean;
}

export interface MesaRequestDTO {
  numeroMesa: number;
  capacidad: number;
  ubicacion: string;
  activo: boolean;
}

export interface MesaEstadoRequestDTO {
  activo: boolean;
}

export interface Reserva {
  id: number;
  clienteId: string;
  mesa: Mesa;
  fechaInicio: string; // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  fechaFin: string;    // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  cantidadPersonas: number;
  estado: EstadoReserva;
  observaciones: string | null;
  fechaCreacion?: string | null;
  createdAt?: string | null;
}

export interface ReservaRequestDTO {
  mesaId: number;
  fechaInicio: string; // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  fechaFin: string;    // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  cantidadPersonas: number;
  observaciones?: string | null;
}

export interface ActualizarEstadoReservaDTO {
  estado: EstadoReserva;
  observaciones?: string | null;
}

export interface FiltroDisponibilidad {
  fechaInicio: string; // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  fechaFin: string;    // ISO-8601: "YYYY-MM-DDTHH:mm:ss"
  cantidadPersonas: number;
}

export interface FiltrosAdminReservas {
  estado?: EstadoReserva | "TODOS";
  clienteId?: string;
  mesaId?: number;
  fecha?: string;
}

// Re-exportamos FormState para uniformidad
export interface ReservaFormState {
  ok?: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  valores?: Record<string, string>;
}

// Resumen agregado de un cliente derivado de sus reservas
export interface ClienteResumen {
  clienteId: string;
  totalReservas: number;
  confirmadas: number;
  canceladas: number;
  completadas: number;
  pendientes: number;
  ultimaReserva?: string;
}

export type { ApiResponse };
