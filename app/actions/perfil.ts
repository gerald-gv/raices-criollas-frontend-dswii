"use server"

import { unstable_rethrow } from "next/navigation";
import { FormState } from "../types/menu";
import { ApiError, getFieldErrors } from "../lib/api";
import { changePassword, updatePerfil } from "../lib/perfil";
import { revalidatePath } from "next/cache";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function toState(error: unknown): FormState {
    unstable_rethrow(error);

    const errores = getFieldErrors(error);

    if (errores) return {
        mensaje: "Revisa los datos marcados.", errores
    };

    if (error instanceof ApiError) return {
        mensaje: error.message
    };

    return { mensaje: "Ocurrió un error inesperado. Inténtalo de nuevo." };
}

export async function actualizarPerfil(_prev: FormState, formData: FormData): Promise<FormState> {
    const valores = {
        nombre: text(formData, "nombre"),
        apellido: text(formData, "apellido"),
        telefono: text(formData, "telefono"),
    };

    try {
        await updatePerfil({ ...valores, telefono: valores.telefono || null });
    } catch (error) {
        return { ...toState(error), valores };
    }

    revalidatePath("/cuenta");
    return { ok: true, mensaje: "Tus datos se actualizaron correctamente" };
}

export async function cambiarPassword(_prev: FormState, formData: FormData): Promise<FormState> {
    
    const passwordActual = String(formData.get("passwordActual") ?? "");
    const passwordNueva = String(formData.get("passwordNueva") ?? "");
    const confirmar = String(formData.get("confirmar") ?? "");

    if (passwordNueva !== confirmar) {
        return { 
            mensaje: "Revisa los datos marcados.", 
            errores: { confirmar: "Las contraseñas no coinciden" }
         };
    }

    try {
        await changePassword({ passwordActual, passwordNueva });
    } catch (error) {
        return toState(error);   // nunca se devuelven las contraseñas escritas
    }

    return { ok: true, mensaje: "Tu contraseña se cambió correctamente" };
}
