"use client";

import { cancelarMiReservaAction } from "@/app/actions/reservas";
import { Reserva } from "@/app/types/reservas";
import { Calendar, Clock, MapPin, MessageSquare, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../admin/ConfirmDialog";
import { ReservaEstadoBadge } from "./ReservaEstadoBadge";

interface ReservaCardProps {
  reserva: Reserva;
}

export const ReservaCard = ({ reserva }: ReservaCardProps) => {
  const [openCancel, setOpenCancel] = useState(false);

  // Formato de fecha
  const inicioDate = new Date(reserva.fechaInicio);
  const finDate = new Date(reserva.fechaFin);

  const fechaFormateada = !Number.isNaN(inicioDate.getTime())
    ? inicioDate.toLocaleDateString("es-PE", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : reserva.fechaInicio;

  const horaInicioStr = !Number.isNaN(inicioDate.getTime())
    ? inicioDate.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    : reserva.fechaInicio.split("T")[1]?.slice(0, 5) ?? "";

  const horaFinStr = !Number.isNaN(finDate.getTime())
    ? finDate.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    : reserva.fechaFin.split("T")[1]?.slice(0, 5) ?? "";

  const puedeCancelar = reserva.estado === "PENDIENTE" || reserva.estado === "CONFIRMADA";

  return (
    <article className="flex flex-col justify-between rounded-sm border border-(--line) bg-(--paper) p-6 transition-all duration-200 hover:border-(--ink)/30 hover:shadow-[0_8px_24px_rgba(38,37,31,0.06)]">
      <div>
        {/* Cabecera de la tarjeta */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-(--line) pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-(--yellow)/30 font-serif text-[13px] font-bold text-(--ink)">
              #{reserva.id}
            </span>
            <div>
              <h3 className="font-serif text-[18px] font-normal leading-tight text-(--ink)">
                Mesa {reserva.mesa?.numeroMesa ?? "—"}
              </h3>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--muted)">
                <MapPin size={11} className="text-(--terracotta)" aria-hidden="true" />
                {reserva.mesa?.ubicacion ?? "Ubicación asignada"}
              </p>
            </div>
          </div>

          <ReservaEstadoBadge estado={reserva.estado} />
        </div>

        {/* Detalles principales */}
        <dl className="mt-4 grid grid-cols-1 gap-2.5 text-[13px] sm:grid-cols-2">
          <div className="flex items-center gap-2 text-(--ink)">
            <Calendar size={15} className="shrink-0 text-(--terracotta)" aria-hidden="true" />
            <span className="capitalize font-medium">{fechaFormateada}</span>
          </div>

          <div className="flex items-center gap-2 text-(--ink)">
            <Clock size={15} className="shrink-0 text-(--terracotta)" aria-hidden="true" />
            <span className="font-medium">{horaInicioStr} – {horaFinStr}</span>
          </div>

          <div className="flex items-center gap-2 text-(--ink)">
            <Users size={15} className="shrink-0 text-(--terracotta)" aria-hidden="true" />
            <span>
              <strong className="font-bold">{reserva.cantidadPersonas}</strong> {reserva.cantidadPersonas === 1 ? "comensal" : "comensales"}
            </span>
          </div>
        </dl>

        {/* Observaciones si las hay */}
        {reserva.observaciones && (
          <div className="mt-4 rounded-sm border-l-2 border-(--yellow) bg-(--cream) p-3 text-[12px] text-(--muted)">
            <span className="flex items-center gap-1 font-bold text-(--ink)">
              <MessageSquare size={12} className="text-(--terracotta)" aria-hidden="true" />
              Observaciones:
            </span>
            <p className="mt-0.5 line-clamp-2">{reserva.observaciones}</p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-6 flex items-center justify-between border-t border-(--line) pt-4">
        <span className="text-[11px] text-(--muted)">
          Código: <span className="font-mono font-bold text-(--ink)">RC-RES-{reserva.id}</span>
        </span>

        {puedeCancelar ? (
          <button
            type="button"
            onClick={() => setOpenCancel(true)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-(--terracotta)/40 px-3 py-1.5 text-[11px] font-extrabold text-(--terracotta) transition-colors hover:bg-(--terracotta) hover:text-white focus-visible:outline-2 focus-visible:outline-(--terracotta)"
          >
            <XCircle size={14} aria-hidden="true" />
            Cancelar reserva
          </button>
        ) : (
          <span className="text-[11px] italic text-(--muted)">
            {reserva.estado === "CANCELADA" ? "Cancelada previamente" : "Visita completada"}
          </span>
        )}
      </div>

      {/* Diálogo de confirmación para cancelación */}
      <ConfirmDialog
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        title="Cancelar reserva"
        tone="danger"
        icon={<XCircle size={20} />}
        description={
          <>
            ¿Deseas cancelar tu reserva para el <strong className="capitalize">{fechaFormateada}</strong> de {horaInicioStr} a {horaFinStr}?
          </>
        }
        warning="Al cancelar, la mesa quedará liberada para otros clientes. Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar reserva"
        pendingText="Cancelando reserva…"
        action={cancelarMiReservaAction}
        fields={{ id: String(reserva.id) }}
      />
    </article>
  );
};
