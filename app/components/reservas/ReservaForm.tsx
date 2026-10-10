"use client";

import { crearReservaAction } from "@/app/actions/reservas";
import { FormState } from "@/app/types/menu";
import { Mesa } from "@/app/types/reservas";
import { AlertCircle, Calendar, CheckCircle2, Clock, MapPin, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Field, inputClass } from "../ui/field";
import { SubmitButton } from "../ui/SubmitButton";

interface ReservaFormProps {
  mesa: Mesa;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  personas: number;
  isLoggedIn: boolean;
  loginRedirectUrl: string;
}

export const ReservaForm = ({
  mesa,
  fecha,
  horaInicio,
  horaFin,
  personas,
  isLoggedIn,
  loginRedirectUrl,
}: ReservaFormProps) => {
  const [state, formAction] = useActionState(crearReservaAction, {} as FormState);

  // Formateador amigable de fecha
  const fechaLegible = new Date(`${fecha}T12:00:00`).toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (state.ok) {
    return (
      <div className="rounded-sm border border-(--olive)/40 bg-(--paper) p-8 shadow-[0_12px_36px_rgba(38,37,31,0.08)] text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef1e3] text-(--olive)">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-(--olive)">
          Reserva Confirmada
        </p>
        <h3 className="mt-2 font-serif text-[clamp(28px,3vw,36px)] font-normal text-(--ink)">
          ¡Te esperamos en Raíces Criollas!
        </h3>
        <p className="mt-3 text-[14px] text-(--muted) max-w-md mx-auto">
          {state.mensaje ?? "Tu reserva se ha registrado satisfactoriamente en nuestro sistema."}
        </p>

        <div className="my-6 mx-auto max-w-sm rounded-sm border border-(--line) bg-(--cream) p-4 text-left text-[13px]">
          <div className="flex justify-between py-1 border-b border-(--line)/60">
            <span className="text-(--muted)">Mesa:</span>
            <span className="font-bold">Mesa {mesa.numeroMesa} ({mesa.ubicacion})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-(--line)/60">
            <span className="text-(--muted)">Fecha:</span>
            <span className="font-bold capitalize">{fechaLegible}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-(--line)/60">
            <span className="text-(--muted)">Horario:</span>
            <span className="font-bold">{horaInicio} – {horaFin}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-(--muted)">Comensales:</span>
            <span className="font-bold">{personas} personas</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/mis-reservas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-(--ink) px-6 py-3.5 text-xs font-extrabold text-white transition-all hover:bg-(--terracotta)"
          >
            Ver mis reservas
          </Link>
          <Link
            href="/carta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-(--ink) px-6 py-3.5 text-xs font-extrabold text-(--ink) transition-colors hover:bg-(--ink) hover:text-white"
          >
            Explorar la carta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-(--line) bg-(--paper) p-6 shadow-[0_12px_36px_rgba(38,37,31,0.06)] md:p-8">
      <div className="mb-6 flex items-start justify-between border-b border-(--line) pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-(--terracotta)">
            Paso final
          </span>
          <h2 className="mt-1 font-serif text-[clamp(24px,3vw,32px)] font-normal text-(--ink)">
            Confirmar reserva de mesa
          </h2>
          <p className="text-[13px] text-(--muted)">
            Revisa los datos de tu visita antes de confirmar.
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#eef1e3] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-(--olive)">
          <Sparkles size={13} aria-hidden="true" />
          Mesa disponible
        </span>
      </div>

      {/* Resumen de la mesa seleccionada */}
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-sm border border-(--line) bg-(--cream) p-4 text-[13px] sm:grid-cols-4">
        <div>
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--muted)">
            <MapPin size={12} className="text-(--terracotta)" />
            Mesa
          </span>
          <p className="mt-1 font-serif text-[16px] font-bold text-(--ink)">
            #{mesa.numeroMesa} · {mesa.ubicacion}
          </p>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--muted)">
            <Calendar size={12} className="text-(--terracotta)" />
            Fecha
          </span>
          <p className="mt-1 font-bold capitalize text-(--ink)">{fechaLegible}</p>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--muted)">
            <Clock size={12} className="text-(--terracotta)" />
            Horario
          </span>
          <p className="mt-1 font-bold text-(--ink)">{horaInicio} a {horaFin}</p>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--muted)">
            <Users size={12} className="text-(--terracotta)" />
            Comensales
          </span>
          <p className="mt-1 font-bold text-(--ink)">{personas} personas</p>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="rounded-sm border border-dashed border-(--terracotta)/60 bg-[#f8e9e2]/50 p-6 text-center">
          <p className="font-serif text-lg text-(--ink)">
            Inicia sesión para completar tu reserva
          </p>
          <p className="mt-1 text-[13px] text-(--muted) max-w-md mx-auto">
            Tus datos de contacto nos permiten notificarte y tener tu mesa lista con anticipación.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={loginRedirectUrl}
              className="inline-flex items-center justify-center rounded-sm bg-(--ink) px-6 py-3 text-xs font-extrabold text-white transition-colors hover:bg-(--terracotta)"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-sm border border-(--ink) px-6 py-3 text-xs font-extrabold text-(--ink) transition-colors hover:bg-(--cream)"
            >
              Crear una cuenta nueva
            </Link>
          </div>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          {/* Campos ocultos de la selección */}
          <input type="hidden" name="mesaId" value={mesa.id} />
          <input type="hidden" name="fecha" value={fecha} />
          <input type="hidden" name="horaInicio" value={horaInicio} />
          <input type="hidden" name="horaFin" value={horaFin} />
          <input type="hidden" name="cantidadPersonas" value={personas} />

          {state.mensaje && !state.ok && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-(--terracotta) bg-[#f8e9e2] p-4 text-[13px] font-bold text-(--terracotta)"
            >
              <AlertCircle size={18} className="mt-px shrink-0" aria-hidden="true" />
              <div>
                <p>{state.mensaje}</p>
                {state.errores && (
                  <ul className="mt-1.5 list-disc pl-5 text-[12px] font-normal">
                    {Object.entries(state.errores).map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <Field
            label="Observaciones o solicitudes especiales (opcional)"
            htmlFor="reserva-observaciones"
            hint="Ej.: Celebración especial, silla para bebé, preferencia de ubicación interior, etc."
          >
            <textarea
              id="reserva-observaciones"
              name="observaciones"
              rows={3}
              maxLength={255}
              placeholder="Indícanos cualquier detalle para preparar tu mesa…"
              className={`${inputClass} resize-y`}
            />
          </Field>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-(--line) pt-5">
            <p className="text-[12px] text-(--muted)">
              Al confirmar, tu reserva quedará registrada y recibirás atención prioritaria a tu llegada.
            </p>

            <SubmitButton
              variant="primary"
              pendingText="Confirmando reserva…"
              className="w-full sm:w-auto"
            >
              Confirmar reserva ahora
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
};
