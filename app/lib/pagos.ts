import { redirect } from "next/navigation";
import { getToken } from "./session";
import { ApiError, apiRequest } from "./api";
import { Pago } from "../types/pagos";

const PAGOS_PREFIX = "/api/payment";

async function pagosApi<T>(path: string, method: "GET" | "POST" = "GET", body?: unknown, headers?: Record<string, string>): Promise<T> {
    const token = await getToken();

    if (!token) {
        redirect("/login?next=/mis-pedidos");
    }

    try {
        return await apiRequest<T>(`${PAGOS_PREFIX}${path}`, { method, body, token, headers, revalidate: false });
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            redirect("/login?expired=1&next=/mis-pedidos");
        }
        throw error;
    }
}

export const crearPago = (pedidoId: number) => pagosApi<Pago>("/pagos", "POST", { pedidoId }, { "Idempotency-Key": `pedido-${pedidoId}` });

export const getPago = (id: number) => pagosApi<Pago>(`/pagos/${id}`);
