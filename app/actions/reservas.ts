"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { cancelarMiReserva, crearReservaCliente } from "../lib/cliente-reservas";
import { actualizarEstadoReserva } from "../lib/admin-reservas";
import { ApiError, getFieldErrors } from "../lib/api";
import { EstadoPago, EstadoReserva, Reserva, ReservaFormState, ReservaRequestDTO } from "../types/reservas";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const valuesOf = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

function toState(error: unknown): ReservaFormState {
  unstable_rethrow(error);

  const errores = getFieldErrors(error);
  if (errores) return { mensaje: "Revisa los datos marcados.", errores };

  if (error instanceof ApiError) {
    if (error.status === 409) {
      return {
        mensaje:
          error.message ||
          "La mesa ya no está disponible para ese horario o existe un conflicto. Por favor realiza una nueva búsqueda.",
      };
    }
    return { mensaje: error.message };
  }

  return { mensaje: "Ocurrió un error inesperado. Inténtalo de nuevo." };
}

function refreshReservas() {
  revalidatePath("/mis-reservas");
  revalidatePath("/reservar-mesa");
  revalidatePath("/admin/reservas");
  revalidatePath("/admin/clientes");
}

/**
 * Server Action para registrar una reserva por el cliente autenticado.
 * La reserva se crea en estado operativo PENDIENTE y estado de pago PENDIENTE.
 * El backend calcula el montoTotal y fechaExpiracionPago con bloqueo pesimista.
 * El frontend nunca envía precios, montos, clienteId ni userId.
 */
export async function crearReservaAction(_prev: ReservaFormState, formData: FormData): Promise<ReservaFormState> {
  const mesaId = Number(text(formData, "mesaId"));
  const fecha = text(formData, "fecha");
  const horaInicio = text(formData, "horaInicio");
  const horaFin = text(formData, "horaFin");
  const cantidadPersonas = Number(text(formData, "cantidadPersonas"));
  const observaciones = text(formData, "observaciones") || null;

  const errores: Record<string, string> = {};

  if (!mesaId || mesaId <= 0) {
    errores.mesaId = "Selecciona una mesa válida";
  }

  if (!fecha) {
    errores.fecha = "Selecciona la fecha de reserva";
  }

  if (!horaInicio) {
    errores.horaInicio = "Selecciona la hora de inicio";
  }

  if (!horaFin) {
    errores.horaFin = "Selecciona la hora de fin";
  }

  if (!cantidadPersonas || cantidadPersonas < 1) {
    errores.cantidadPersonas = "Indica al menos 1 persona";
  }

  if (Object.keys(errores).length > 0) {
    return {
      mensaje: "Por favor revisa los datos ingresados.",
      errores,
      valores: valuesOf(formData),
    };
  }

  // Formato ISO local para Spring LocalDateTime: YYYY-MM-DDTHH:mm:ss
  const inicioIso = `${fecha}T${horaInicio.length === 5 ? `${horaInicio}:00` : horaInicio}`;
  const finIso = `${fecha}T${horaFin.length === 5 ? `${horaFin}:00` : horaFin}`;

  const inicioDate = new Date(inicioIso);
  const finDate = new Date(finIso);

  if (Number.isNaN(inicioDate.getTime()) || Number.isNaN(finDate.getTime())) {
    return {
      mensaje: "Las fechas u horas proporcionadas no son válidas.",
      valores: valuesOf(formData),
    };
  }

  if (inicioDate >= finDate) {
    return {
      mensaje: "La hora de inicio debe ser anterior a la hora de finalización.",
      errores: { horaFin: "Debe ser posterior a la hora de inicio" },
      valores: valuesOf(formData),
    };
  }

  if (inicioDate.getTime() < Date.now()) {
    return {
      mensaje: "No es posible realizar reservas en fechas u horas pasadas.",
      errores: { fecha: "La fecha y hora deben ser futuras" },
      valores: valuesOf(formData),
    };
  }

  const dto: ReservaRequestDTO = {
    mesaId,
    fechaInicio: inicioIso,
    fechaFin: finIso,
    cantidadPersonas,
    observaciones,
  };

  let reservaCreada: Reserva;

  try {
    reservaCreada = await crearReservaCliente(dto);
  } catch (error) {
    return {
      ...toState(error),
      valores: valuesOf(formData),
    };
  }

  refreshReservas();
  return {
    ok: true,
    mensaje: "Tu solicitud de reserva ha sido registrada y está pendiente de pago.",
    data: reservaCreada,
  };
}

/**
 * Server Action para que el cliente cancele su propia reserva.
 */
export async function cancelarMiReservaAction(_prev: ReservaFormState, formData: FormData): Promise<ReservaFormState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return { mensaje: "Reserva no válida para cancelar." };
  }

  try {
    await cancelarMiReserva(id);
  } catch (error) {
    return toState(error);
  }

  refreshReservas();
  return {
    ok: true,
    mensaje: "Tu reserva ha sido cancelada.",
  };
}

/**
 * Server Action para que el administrador actualice el estado de una reserva y/o su pago.
 */
export async function cambiarEstadoReservaAdminAction(
  _prev: ReservaFormState,
  formData: FormData
): Promise<ReservaFormState> {
  const id = Number(formData.get("id"));
  const nuevoEstado = text(formData, "estado") as EstadoReserva;
  const nuevoEstadoPago = text(formData, "estadoPago") as EstadoPago;
  const observaciones = text(formData, "observaciones") || undefined;

  if (!id) {
    return { mensaje: "Reserva no identificada." };
  }

  const estadosValidos: EstadoReserva[] = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];
  const estadosPagoValidos: EstadoPago[] = ["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"];

  const dto: { estado?: EstadoReserva; estadoPago?: EstadoPago; observaciones?: string } = {};

  if (nuevoEstado && estadosValidos.includes(nuevoEstado)) {
    dto.estado = nuevoEstado;
  }

  if (nuevoEstadoPago && estadosPagoValidos.includes(nuevoEstadoPago)) {
    dto.estadoPago = nuevoEstadoPago;
  }

  if (observaciones) {
    dto.observaciones = observaciones;
  }

  try {
    await actualizarEstadoReserva(id, dto);
  } catch (error) {
    return toState(error);
  }

  refreshReservas();
  return {
    ok: true,
    mensaje: `Reserva #${id} actualizada exitosamente.`,
  };
}
