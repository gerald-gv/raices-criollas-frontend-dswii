"use client"

import { ImagePlus, Info, X } from "lucide-react";
import { DragEvent, useEffect, useState } from "react";
import { Field, inputClass } from "../../ui/field";

const MAX_BYTES = 2 * 1024 * 1024;

interface ImageFieldProps {
    defaultUrl?: string;
    error?: string;
}

// Zona para arrastrar o elegir una imagen, con vista previa.
// POR AHORA es solo visual, el archivo NO se envia
// en el FormData ni choca con el limite de 1 MB de las Server Actions). Lo que se guarda es el enlace.
export const ImageField = ({ defaultUrl = "", error }: ImageFieldProps) => {
    const [url, setUrl] = useState(defaultUrl);
    const [local, setLocal] = useState<{ name: string; src: string } | null>(null);
    const [broken, setBroken] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [problem, setProblem] = useState<string>();

    // Libera la vista previa local al cambiar de archivo o cerrar el modal
    useEffect(() => {
        return () => {
            if (local) URL.revokeObjectURL(local.src);
        };
    }, [local]);

    const takeFile = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setProblem("Elige un archivo de imagen (PNG, JPG o WEBP).");
            return;
        }
        if (file.size > MAX_BYTES) {
            setProblem("La imagen supera los 2 MB.");
            return;
        }

        setProblem(undefined);
        setBroken(false);
        setLocal({ name: file.name, src: URL.createObjectURL(file) });   // la vista previa se recarga
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        takeFile(event.dataTransfer.files[0]);
    };

    const src = local?.src ?? (url && !broken ? url : null);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-(--muted)">Imagen</span>

            <label
                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer items-center gap-4 border border-dashed p-4 transition-colors duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--terracotta) ${dragging ? "border-(--terracotta) bg-[#f8e9e2]" : "border-(--line) bg-(--cream) hover:border-(--terracotta)"
                    }`}
            >
                <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden bg-[#f2ebdc] text-(--terracotta)" aria-hidden="true">
                    {src ? (
                        <img key={src} src={src} alt="" className="size-full animate-[fadeIn_300ms_ease] object-cover" onError={() => setBroken(true)} />
                    ) : (
                        <ImagePlus size={28} strokeWidth={1.25} />
                    )}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold">
                        {local ? local.name : dragging ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para elegirla"}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-(--muted)">PNG, JPG o WEBP · máximo 2 MB</span>
                </span>

                {local && (
                    <button
                        type="button"
                        onClick={(event) => { event.preventDefault(); setLocal(null); }}
                        aria-label="Quitar la imagen elegida"
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-(--line) bg-(--paper) text-(--muted) transition-colors duration-200 hover:border-(--terracotta) hover:text-(--terracotta)"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                )}

                <input type="file" accept="image/*" className="sr-only" onChange={(event) => { takeFile(event.target.files?.[0]); event.target.value = ""; }} />
            </label>

            {problem && <p className="text-[12px] font-bold text-(--terracotta)" role="alert">{problem}</p>}

            {local && (
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-(--muted)" role="status">
                    <Info size={14} className="mt-0.5 shrink-0 text-(--gold)" aria-hidden="true" />
                    Es solo una vista previa: la subida de archivos aún no está disponible. Lo que se guarda es el enlace de abajo.
                </p>
            )}

            <Field label="Enlace de la imagen" htmlFor="plato-imagen" error={error} hint="Opcional. Es lo que se guarda y se muestra en la carta.">
                <input
                    id="plato-imagen"
                    name="imagen"
                    type="url"
                    maxLength={500}
                    value={url}
                    onChange={(event) => { setUrl(event.target.value); setBroken(false); setLocal(null); }}
                    placeholder="https://…"
                    aria-invalid={!!error}
                    className={inputClass}
                />
                {broken && <p className="text-[12px] font-bold text-(--terracotta)">No se pudo cargar la imagen de ese enlace.</p>}
            </Field>
        </div>
    );
};
