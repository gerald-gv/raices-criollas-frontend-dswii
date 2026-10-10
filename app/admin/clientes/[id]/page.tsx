import { PageHeader } from "@/app/components/admin/PageHeader";
import { StatCard } from "@/app/components/admin/StatCard";
import { ReservaModalProvider } from "@/app/components/admin/reservas/ReservaModal";
import { ReservaTable } from "@/app/components/admin/reservas/ReservaTable";
import { listAdminReservas } from "@/app/lib/admin-reservas";
import { ArrowLeft, Calendar, CalendarCheck2, CheckCircle2, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ClienteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClienteDetailPage({ params }: ClienteDetailPageProps) {
  const { id } = await params;
  const clienteId = decodeURIComponent(id);

  const todas = await listAdminReservas();
  const reservasCliente = todas.filter((r) => r.clienteId === clienteId);

  if (reservasCliente.length === 0) {
    notFound();
  }

  const total = reservasCliente.length;
  const confirmadas = reservasCliente.filter((r) => r.estado === "CONFIRMADA").length;
  const canceladas = reservasCliente.filter((r) => r.estado === "CANCELADA").length;
  const completadas = reservasCliente.filter((r) => r.estado === "COMPLETADA").length;

  return (
    <ReservaModalProvider>
      <div className="mb-6">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-(--terracotta) hover:underline"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Volver a la lista de comensales
        </Link>
      </div>

      <PageHeader
        eyebrow="Ficha de Comensal"
        title={
          <>
            Historial de <span className="font-mono text-[clamp(24px,3vw,38px)] text-(--terracotta)">{clienteId}</span>
          </>
        }
        description={`Registro completo de las ${total} reservas asociadas a este identificador en el sistema.`}
      />

      {/* Indicadores calculados a partir de las reservas disponibles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <StatCard
          label="Total reservas"
          value={total}
          detail="Historial acumulado"
          icon={<CalendarCheck2 size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Confirmadas"
          value={confirmadas}
          detail="Mesas reservadas"
          icon={<CheckCircle2 size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Completadas"
          value={completadas}
          detail="Visitas realizadas"
          icon={<Calendar size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Canceladas"
          value={canceladas}
          detail="Reservas desestimadas"
          icon={<XCircle size={18} aria-hidden="true" />}
        />
      </div>

      {/* Aviso de limitación técnica */}
      <div
        role="note"
        className="mb-8 flex items-start gap-3 rounded-sm border-l-2 border-(--yellow) bg-(--paper) p-4 text-[13px] leading-relaxed text-(--muted)"
      >
        <Info size={18} className="mt-0.5 shrink-0 text-(--gold)" aria-hidden="true" />
        <div>
          <strong className="block font-bold text-(--ink)">
            Perfil derivado de reservas
          </strong>
          Este historial refleja únicamente los datos registrados en el microservicio de reservas para el identificador <code className="font-mono text-xs bg-(--cream) px-1 py-0.5">{clienteId}</code>.
          El microservicio de autenticación administra las credenciales y datos de contacto de forma aislada.
        </div>
      </div>

      <section aria-labelledby="historial-reservas-titulo">
        <h2
          id="historial-reservas-titulo"
          className="font-serif text-[clamp(22px,2.5vw,28px)] font-normal tracking-tight text-(--ink) mb-4"
        >
          Reservas del comensal
        </h2>
        <ReservaTable reservas={reservasCliente} />
      </section>
    </ReservaModalProvider>
  );
}
