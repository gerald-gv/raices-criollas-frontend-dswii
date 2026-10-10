"use client"

import { actualizarPerfil } from "@/app/actions/perfil";
import { useActionState, useEffect } from "react";
import { useToast } from "../ui/Toast";
import { FormState } from "@/app/types/menu";
import { Perfil } from "@/app/types/auth";
import { Field, inputClass } from "../ui/field";
import { SubmitButton } from "../ui/SubmitButton";
import { AlertCircle } from "lucide-react";

export const ProfileForm = ({ perfil }: { perfil: Perfil }) => {
    const [state, formAction] = useActionState(actualizarPerfil, {} as FormState);
    const { notify } = useToast();

    useEffect(() => {
        if (state.ok) notify("ok", state.mensaje ?? "Datos actualizados");
    }, [state, notify]);

    const error = (name: string) => state.errores?.[name];

    // Si la accion fallo se muestra lo que escribio; si no, lo guardado
    const value = (name: "nombre" | "apellido" | "telefono", fallback: string) => state.valores ? (state.valores[name] ?? "") : fallback;

    return (
        <form action={formAction} className="flex flex-col gap-5 border border-(--line) bg-(--paper) p-7 sm:p-9">

            <div>
                <h2 className="font-serif text-[26px] font-normal leading-none tracking-tighter">Mis datos</h2>
                <p className="mt-2 text-[12px] text-(--muted)">Así aparecerás en tus reservas.</p>
            </div>

            {state.mensaje && !state.ok && (

                <div role="alert" className="flex items-start gap-2.5 border border-(--terracotta) bg-[#f8e9e2] p-3.5 text-[13px] font-bold text-(--terracotta)">
                    <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
                    {state.mensaje}
                </div>

            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Field label="Nombre" htmlFor="perfil-nombre" error={error("nombre")}>
                    <input id="perfil-nombre" name="nombre" required maxLength={100} autoComplete="given-name"
                        defaultValue={value("nombre", perfil.nombre)} aria-invalid={!!error("nombre")} className={inputClass} />
                </Field>

                <Field label="Apellido" htmlFor="perfil-apellido" error={error("apellido")}>
                    <input id="perfil-apellido" name="apellido" required maxLength={100} autoComplete="family-name"
                        defaultValue={value("apellido", perfil.apellido)} aria-invalid={!!error("apellido")} className={inputClass} />
                </Field>

            </div>

            <Field label="Correo electrónico" htmlFor="perfil-email" hint="Es tu usuario para ingresar, por eso no se puede cambiar aquí.">
                <input id="perfil-email" type="email" value={perfil.email} readOnly disabled className={`${inputClass} cursor-not-allowed bg-(--cream) text-(--muted)`} />
            </Field>

            <Field label="Teléfono (opcional)" htmlFor="perfil-telefono" error={error("telefono")}>
                <input id="perfil-telefono" name="telefono" type="tel" maxLength={20} autoComplete="tel"
                    defaultValue={value("telefono", perfil.telefono ?? "")} aria-invalid={!!error("telefono")} className={inputClass} />
            </Field>

            <div className="flex justify-end">
                <SubmitButton pendingText="Guardando…">Guardar cambios</SubmitButton>
            </div>

        </form>
    );
};
