import { PageHeader } from "@/app/components/admin/PageHeader";
import { Pagination } from "@/app/components/admin/Pagination";
import { StatCard } from "@/app/components/admin/StatCard";
import {
  ReservaModalProvider,
  ReservaModalState,
} from "@/app/components/admin/reservas/ReservaModal";
import { ReservaTable } from "@/app/components/admin/reservas/ReservaTable";
import { getAdminReserva, listAdminReservas } from "@/app/lib/admin-reservas";
import { ApiError } from "@/app/lib/api";
import { EstadoReserva } from "@/app/types/reservas";
import { Calendar, CalendarCheck2, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 10;

type Param = string | string[] | undefined;

interface ReservasPageProps {
  searchParams: Promise<{
    estado?: Param;
    fecha?: Param;
    page?: Param;
    detalle?: Param;
  }>;
}

const first = (value: Param) => (Array.isArray(value) ? value[0] : value);

export default async function AdminReservasPage({ searchParams }: ReservasPageProps) {
  const params = await searchParams;

  const estadoParam = first(params.estado)?.toUpperCase();
  const estado =
    estadoParam && ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"].includes(estadoParam)
      ? (estadoParam as EstadoReserva)
      : undefined;

  const fecha = first(params.fecha)?.trim() || undefined;
  const pagina = Math.max(1, Number(first(params.page)) || 1);

  // Obtenemos todas las reservas desde la capa de administración
  const todasLasReservas = await listAdminReservas();

  // Filtrado
  const reservasFiltradas = todasLasReservas.filter((reserva) => {
    if (estado && reserva.estado !== estado) return false;
    if (fecha && !reserva.fechaInicio.startsWith(fecha)) return false;
    return true;
  });

  // Métricas
  const totalReservas = todasLasReservas.length;
  const pendientesCount = todasLasReservas.filter((r) => r.estado === "PENDIENTE").length;
  const confirmadasCount = todasLasReservas.filter((r) => r.estado === "CONFIRMADA").length;
  const completadasCount = todasLasReservas.filter((r) => r.estado === "COMPLETADA").length;

  // Paginación local
  const totalElements = reservasFiltradas.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;
  const fromIndex = (pagina - 1) * PAGE_SIZE;
  const reservasPaginadas = reservasFiltradas.slice(fromIndex, fromIndex + PAGE_SIZE);

  // Modal abierto por URL (?detalle=ID)
  let initial: ReservaModalState = null;
  const detalleId = Number(first(params.detalle)) || undefined;

  if (detalleId) {
    try {
      const res = await getAdminReserva(detalleId);
      initial = { kind: "detail", reserva: res };
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 404)) throw error;
    }
  }

  const tabs: { label: string; value: EstadoReserva | undefined }[] = [
    { label: "Todas", value: undefined },
    { label: "Pendientes", value: "PENDIENTE" },
    { label: "Confirmadas", value: "CONFIRMADA" },
    { label: "Completadas", value: "COMPLETADA" },
    { label: "Canceladas", value: "CANCELADA" },
  ];

  return (
    <ReservaModalProvider initial={initial}>
      <PageHeader
        eyebrow="Salón y Comensales"
        title={
          <>
            Control de <span className="text-(--terracotta) italic">reservas</span>
          </>
        }
        description="Gestión en tiempo real de reservas recibidas, validación de estado y confirmaciones de mesa."
      />

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total registradas"
          value={totalReservas}
          detail="Histórico general"
          icon={<CalendarCheck2 size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Pendientes"
          value={pendientesCount}
          detail="Por confirmar"
          icon={<Clock size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Confirmadas"
          value={confirmadasCount}
          detail="Esperando comensal"
          icon={<CheckCircle2 size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Completadas"
          value={completadasCount}
          detail="Atendidas en salón"
          icon={<Calendar size={18} aria-hidden="true" />}
        />
      </div>

      {/* Barra de Filtros */}
      <div className="mt-8 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-(--line) pb-4">
        {/* Pestañas de estado */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const active = (!estado && !tab.value) || estado === tab.value;
            const queryParams = new URLSearchParams();
            if (tab.value) queryParams.set("estado", tab.value);
            if (fecha) queryParams.set("fecha", fecha);
            const href = queryParams.toString() ? `/admin/reservas?${queryParams.toString()}` : "/admin/reservas";

            return (
              <Link
                key={tab.label}
                href={href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-(--ink) text-white"
                    : "bg-(--cream) text-(--muted) hover:bg-(--line) hover:text-(--ink)"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Filtro por fecha */}
        <form method="get" action="/admin/reservas" className="flex items-center gap-2">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <label htmlFor="filtro-fecha" className="text-[11px] font-bold text-(--muted)">
            Fecha:
          </label>
          <input
            id="filtro-fecha"
            name="fecha"
            type="date"
            defaultValue={fecha ?? ""}
            className="rounded-sm border border-(--line) bg-white px-2.5 py-1 text-[12px] text-(--ink)"
          />
          <button
            type="submit"
            className="rounded-sm bg-(--ink) px-3 py-1 text-[11px] font-extrabold text-white transition-colors hover:bg-(--terracotta)"
          >
            Filtrar
          </button>
          {fecha && (
            <Link
              href={estado ? `/admin/reservas?estado=${estado}` : "/admin/reservas"}
              className="text-[11px] font-bold text-(--terracotta) underline"
            >
              Limpiar fecha
            </Link>
          )}
        </form>
      </div>

      {/* Tabla de Reservas */}
      <ReservaTable reservas={reservasPaginadas} />

      {/* Paginación */}
      <Pagination
        page={pagina}
        totalPages={totalPages}
        totalElements={totalElements}
        size={PAGE_SIZE}
        basePath="/admin/reservas"
        params={{
          ...(estado ? { estado } : {}),
          ...(fecha ? { fecha } : {}),
        }}
      />
    </ReservaModalProvider>
  );
}
