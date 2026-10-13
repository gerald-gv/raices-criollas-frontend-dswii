export type EstadoPago = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "CANCELADO" | "REEMBOLSADO";

// PagoResponse
export interface Pago {
  id: number;
  pedidoId: number;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  urlPago: string | null;
  creadoEn: string;
}
