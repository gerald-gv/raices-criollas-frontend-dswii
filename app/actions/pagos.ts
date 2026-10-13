"use server"

import { redirect, unstable_rethrow } from "next/navigation";
import { mensajeDe } from "../lib/action-errors";
import { crearPago, getPago } from "../lib/pagos";
import { confirmarCarrito, verificarStockPedido } from "../lib/pedidos";
import { EstadoPago } from "../types/pagos";

export interface PagoActionResult {
    ok: false;
    mensaje: string;
}

export async function realizarPagoAction(): Promise<PagoActionResult> {
    let urlPago: string;

    try {
        const pedido = await confirmarCarrito();
        const pago = await crearPago(pedido.id);

        if (!pago.urlPago) {
            return { ok: false, mensaje: "No se pudo abrir Mercado Pago. Tu pedido quedó en «Mis pedidos»: puedes pagarlo desde ahí." };
        }
        urlPago = pago.urlPago;
    } catch (error) {
        return { ok: false, mensaje: mensajeDe(error) };
    }

    redirect(urlPago);
}

export async function pagarPedidoPendienteAction(pedidoId: number): Promise<PagoActionResult> {
    if (!Number.isInteger(pedidoId) || pedidoId <= 0) return { ok: false, mensaje: "Pedido no válido." };

    let urlPago: string;

    try {
        // Antes de ir a pagar, el stock de este pedido pudo agotarse
        await verificarStockPedido(pedidoId);
        const pago = await crearPago(pedidoId);

        if (!pago.urlPago) return { ok: false, mensaje: "No se pudo abrir Mercado Pago. Inténtalo de nuevo." };
        urlPago = pago.urlPago;
    } catch (error) {
        return { ok: false, mensaje: mensajeDe(error) };
    }

    redirect(urlPago);
}

export interface EstadoPagoResult {
    estado: EstadoPago | null;
    pedidoId?: number;
}

export async function consultarPagoAction(pagoId: number): Promise<EstadoPagoResult> {
    if (!Number.isInteger(pagoId) || pagoId <= 0) return { estado: null };

    try {
        const pago = await getPago(pagoId);
        return { estado: pago.estado, pedidoId: pago.pedidoId };
    } catch (error) {
        unstable_rethrow(error);
        return { estado: null };
    }
}
