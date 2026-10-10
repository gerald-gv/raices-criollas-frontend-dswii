import { PageHeader } from "@/app/components/admin/PageHeader";
import { StatCard } from "@/app/components/admin/StatCard";
import { listAdminReservas } from "@/app/lib/admin-reservas";
import { ClienteResumen } from "@/app/types/reservas";
import { ArrowRight, Calendar, Info, User, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminClientesPage() {
  const reservas = await listAdminReservas();

  // Agrupamos métricas reales por clienteId
  const clientesMap = new Map<string, ClienteResumen>();

  reservas.forEach((reserva) => {
    const id = reserva.clienteId;
    const actual = clientesMap.get(id) ?? {
      clienteId: id,
      totalReservas: 0,
      confirmadas: 0,
      canceladas: 0,
      completadas: 0,
      pendientes: 0,
      ultimaReserva: reserva.fechaInicio,
    };

    actual.totalReservas += 1;
    if (reserva.estado === "CONFIRMADA") actual.confirmadas += 1;
    else if (reserva.estado === "CANCELADA") actual.canceladas += 1;
    else if (reserva.estado === "COMPLETADA") actual.completadas += 1;
    else if (reserva.estado === "PENDIENTE") actual.pendientes += 1;

    // Actualizamos última fecha
    if (
      !actual.ultimaReserva ||
      new Date(reserva.fechaInicio).getTime() > new Date(actual.ultimaReserva).getTime()
    ) {
      actual.ultimaReserva = reserva.fechaInicio;
    }

    clientesMap.set(id, actual);
  });

  const clientes = Array.from(clientesMap.values()).sort(
    (a, b) => b.totalReservas - a.totalReservas
  );

  return (
    <>
      <PageHeader
        eyebrow="Directorio"
        title={
          <>
            Clientes con <span className="text-(--terracotta) italic">reservas</span>
          </>
        }
        description={`Listado de ${clientes.length} comensales con reservas registradas en el sistema.`}
      />

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-8">
        <StatCard
          label="Comensales únicos"
          value={clientes.length}
          detail="Con reservas en el historial"
          icon={<Users size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Total reservas asociadas"
          value={reservas.length}
          detail="Registradas en el backend"
          icon={<Calendar size={18} aria-hidden="true" />}
        />
        <StatCard
          label="Promedio reservas / comensal"
          value={clientes.length > 0 ? (reservas.length / clientes.length).toFixed(1) : 0}
          detail="Frecuencia estimada"
          icon={<User size={18} aria-hidden="true" />}
        />
      </div>

      {/* Aviso informativo de alcance */}
      <div
        role="note"
        className="mb-8 flex items-start gap-3 rounded-sm border-l-2 border-(--yellow) bg-(--paper) p-4 text-[13px] leading-relaxed text-(--muted)"
      >
        <Info size={18} className="mt-0.5 shrink-0 text-(--gold)" aria-hidden="true" />
        <div>
          <strong className="block font-bold text-(--ink)">
            Datos derivados del servicio de reservas
          </strong>
          Los identificadores mostrados provienen directamente del claim <code className="font-mono text-xs bg-(--cream) px-1 py-0.5">sub</code> de los JWT
          asociados a las reservas. El microservicio de reservas no almacena nombres ni correos personales,
          los cuales residen en el servicio de autenticación.
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-(--line) bg-(--paper) p-8 text-center">
          <Users size={36} className="text-(--muted)" aria-hidden="true" />
          <p className="font-serif text-xl">Aún no hay clientes con reservas registradas.</p>
          <p className="text-[12px] text-(--muted)">
            Cuando los clientes hagan reservas, aparecerán listados aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-(--line) bg-(--paper)">
          <table className="w-full min-w-150 text-left">
            <caption className="sr-only">Comensales con reservas registradas</caption>
            <thead>
              <tr className="border-b border-(--line) text-[10px] font-black uppercase tracking-[0.14em] text-(--muted)">
                <th scope="col" className="px-5 py-3.5">
                  ID Comensal (sub)
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Total Reservas
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Confirmadas / Atendidas
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Canceladas
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Última actividad
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Historial
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {clientes.map((c) => (
                <tr key={c.clienteId} className="transition-colors duration-200 hover:bg-(--cream)">
                  <td className="px-5 py-3.5 font-mono text-[13px] font-bold text-(--ink)">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-(--yellow)/25 font-sans text-xs">
                        <User size={13} className="text-(--ink)" />
                      </span>
                      <span>{c.clienteId}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-[13px] font-bold">
                    {c.totalReservas} {c.totalReservas === 1 ? "reserva" : "reservas"}
                  </td>

                  <td className="px-4 py-3.5 text-[13px] text-(--olive) font-medium">
                    {c.confirmadas + c.completadas}
                  </td>

                  <td className="px-4 py-3.5 text-[13px] text-(--terracotta) font-medium">
                    {c.canceladas}
                  </td>

                  <td className="px-4 py-3.5 text-[12px] text-(--muted)">
                    {c.ultimaReserva ? c.ultimaReserva.split("T")[0] : "—"}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/clientes/${encodeURIComponent(c.clienteId)}`}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-(--line) px-3 py-1.5 text-[11px] font-extrabold text-(--ink) transition-colors hover:border-(--ink) hover:bg-(--ink) hover:text-white"
                    >
                      Ver ficha
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
