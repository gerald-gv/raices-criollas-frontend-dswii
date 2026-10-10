"use client"

import { guardarPlato } from "@/app/actions/menu";
import { Categoria, FormState, Plato } from "@/app/types/menu";
import { useActionState, useEffect } from "react";
import { useToast } from "../Toast";
import { AlertCircle } from "lucide-react";
import { Field, inputClass } from "../../ui/field";
import { ImageField } from "./ImageField";
import { Button } from "../../ui/button";
import { SubmitButton } from "../../ui/SubmitButton";

interface PlatoFormProps {
    categorias: Categoria[];
    plato?: Plato;
    onClose: () => void;
}

export const PlatoForm = ({ categorias, plato, onClose }: PlatoFormProps) => {
    const [state, formAction] = useActionState(guardarPlato, {} as FormState);
    const { notify } = useToast();

    useEffect(() => {
        if (state.ok) {
            notify("ok", state.mensaje ?? "Guardado");
            onClose();
        }
    }, [state, notify, onClose]);

    const error = (name: string) => state.errores?.[name];
    const value = (name: string, fallback: string) => state.valores ? (state.valores[name] ?? "") : fallback;

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {plato && <input type="hidden" name="id" value={plato.id} />}

            {state.mensaje && !state.ok && (
                <div role="alert" className="flex items-start gap-2.5 border border-(--terracotta) bg-[#f8e9e2] p-3.5 text-[13px] font-bold text-(--terracotta)">
                    <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
                    {state.mensaje}
                </div>
            )}

            <Field label="Nombre" htmlFor="plato-nombre" error={error("nombre")}>
                <input id="plato-nombre" name="nombre" required minLength={3} maxLength={150} defaultValue={value("nombre", plato?.nombre ?? "")} placeholder="Ej.: Lomo saltado" aria-invalid={!!error("nombre")} className={inputClass} />
            </Field>

            <Field label="Descripción" htmlFor="plato-descripcion" error={error("descripcion")}>
                <textarea id="plato-descripcion" name="descripcion" rows={3} maxLength={500} defaultValue={value("descripcion", plato?.descripcion ?? "")} aria-invalid={!!error("descripcion")} className={`${inputClass} resize-y`} />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Precio (S/)" htmlFor="plato-precio" error={error("precio")}>
                    <input id="plato-precio" name="precio" type="number" required min="0.01" step="0.01" inputMode="decimal" defaultValue={value("precio", plato ? String(plato.precio) : "")} placeholder="0.00" aria-invalid={!!error("precio")} className={inputClass} />
                </Field>

                <Field label="Categoría" htmlFor="plato-categoria" error={error("categoriaId")}>
                    <select id="plato-categoria" name="categoriaId" required defaultValue={value("categoriaId", plato ? String(plato.categoriaId) : "")} aria-invalid={!!error("categoriaId")} className={inputClass}>
                        <option value="" disabled>Elige una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}{categoria.activo ? "" : " (inactiva)"}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <ImageField defaultUrl={value("imagen", plato?.imagen ?? "")} error={error("imagen")} />

            <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" name="disponible" defaultChecked={state.valores ? state.valores.disponible === "on" : (plato?.disponible ?? true)} className="mt-0.5 size-4 accent-(--terracotta)" />
                <span>
                    <span className="block text-[13px] font-bold">Disponible en la carta</span>
                    <span className="block text-[12px] text-(--muted)">Desmárcalo si hoy no se está sirviendo.</span>
                </span>
            </label>

            <div className="mt-1 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <SubmitButton>{plato ? "Guardar cambios" : "Crear plato"}</SubmitButton>
            </div>
        </form>
    );
};
