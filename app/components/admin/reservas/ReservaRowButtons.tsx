"use client";

import { Reserva } from "@/app/types/reservas";
import { Check, CheckCircle2, Eye, XCircle } from "lucide-react";
import { useOpenReservaModal } from "./ReservaModal";

const iconButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-sm border border-(--line) text-(--muted) transition-colors duration-200 hover:border-(--ink) hover:text-(--ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--terracotta)";

export const ReservaRowButtons = ({ reserva }: { reserva: Reserva }) => {
  const open = useOpenReservaModal();

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Botón Ver Detalle */}
      <button
        type="button"
        onClick={() => open({ kind: "detail", reserva })}
        aria-label={`Ver detalle de reserva #${reserva.id}`}
        title="Ver detalle completo"
        className={iconButton}
      >
        <Eye size={14} aria-hidden="true" />
      </button>

      {/* Si está PENDIENTE: puede confirmar o cancelar */}
      {reserva.estado === "PENDIENTE" && (
        <>
          <button
            type="button"
            onClick={() => open({ kind: "confirmar", reserva })}
            aria-label={`Confirmar reserva #${reserva.id}`}
            title="Confirmar reserva"
            className={`${iconButton} hover:border-(--olive)! hover:text-(--olive)!`}
          >
            <CheckCircle2 size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => open({ kind: "cancelar", reserva })}
            aria-label={`Cancelar reserva #${reserva.id}`}
            title="Cancelar reserva"
            className={`${iconButton} hover:border-(--terracotta)! hover:text-(--terracotta)!`}
          >
            <XCircle size={14} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Si está CONFIRMADA: puede marcar completada o cancelar */}
      {reserva.estado === "CONFIRMADA" && (
        <>
          <button
            type="button"
            onClick={() => open({ kind: "completar", reserva })}
            aria-label={`Marcar completada reserva #${reserva.id}`}
            title="Marcar como atendida / completada"
            className={`${iconButton} hover:border-(--olive)! hover:text-(--olive)!`}
          >
            <Check size={14} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => open({ kind: "cancelar", reserva })}
            aria-label={`Cancelar reserva #${reserva.id}`}
            title="Cancelar reserva"
            className={`${iconButton} hover:border-(--terracotta)! hover:text-(--terracotta)!`}
          >
            <XCircle size={14} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
};
