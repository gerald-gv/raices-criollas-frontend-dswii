import { redirect } from "next/navigation";
import { getToken } from "./session";
import { ActualizarEstadoReservaDTO, FiltrosAdminReservas, Reserva } from "../types/reservas";
import { ApiError, apiRequest } from "./api";

const RESERVAS_PREFIX = "/api/reservas";

async function adminReservasApi<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const token = await getToken();

  if (!token) {
    redirect("/login?next=/admin/reservas");
  }

  try {
    return await apiRequest<T>(`${RESERVAS_PREFIX}${path}`, {
      method,
      body,
      token,
      revalidate: false,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?expired=1&next=/admin/reservas");
    }
    throw error;
  }
}

/**
 * Listado general administrativo de reservas.
 * Permite filtrar en cliente o servidor según los parámetros provistos.
 */
export async function listAdminReservas(filtros?: FiltrosAdminReservas): Promise<Reserva[]> {
  const reservas = await adminReservasApi<Reserva[]>("/reservas", "GET");

  if (!filtros) return reservas;

  // Filtrado local seguro para garantizar consistencia sin inventar parámetros de query no soportados
  return reservas.filter((reserva) => {
    if (filtros.estado && filtros.estado !== "TODOS" && reserva.estado !== filtros.estado) {
      return false;
    }
    if (filtros.clienteId && reserva.clienteId !== filtros.clienteId) {
      return false;
    }
    if (filtros.mesaId && reserva.mesa?.id !== filtros.mesaId) {
      return false;
    }
    if (filtros.fecha && !reserva.fechaInicio.startsWith(filtros.fecha)) {
      return false;
    }
    return true;
  });
}

/**
 * Consulta el detalle administrativo de una reserva por su ID.
 */
export async function getAdminReserva(id: number): Promise<Reserva> {
  return adminReservasApi<Reserva>(`/reservas/${id}`, "GET");
}

/**
 * Actualiza el estado de una reserva (CONFIRMADA, CANCELADA, COMPLETADA, PENDIENTE).
 */
export async function actualizarEstadoReserva(
  id: number,
  dto: ActualizarEstadoReservaDTO
): Promise<Reserva> {
  return adminReservasApi<Reserva>(`/reservas/${id}/estado`, "PATCH", dto);
}
