import { ArrowRight, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPlatosDestacados } from "@/app/lib/menu"
import { formatPrice } from "@/app/lib/format"

export const FeaturedSection = async () => {
    const platos = await getPlatosDestacados().catch(() => [])

    return (
        <section className="featured-section">
            <div className="container mx-auto">

                <div className="mb-8.75 flex flex-col items-start gap-4.25 sm:flex-row sm:items-end sm:justify-between sm:gap-0">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-(--terracotta)">
                            Lo que se está sirviendo
                        </span>

                        <h2 className="mt-3.25 font-serif text-[clamp(38px,4vw,52px)] font-normal tracking-[-0.065em]">
                            Los favoritos de{" "}
                            <span className="text-(--terracotta) italic">
                                Raíces
                            </span>
                        </h2>
                    </div>

                    <Link href="/carta" className="flex items-center gap-1.75 text-[11px] font-extrabold text-(--terracotta) sm:mb-2">
                        Ver carta completa
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {platos.length === 0 ? (
                    <div className="flex min-h-50 items-center justify-center border border-dashed border-(--line) bg-(--cream)">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--muted)">
                            Pronto habrá novedades
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {platos.map((plato) => (
                            <article
                                key={plato.id}
                                className="group flex flex-col overflow-hidden border border-(--line) bg-(--paper)"
                            >
                                {/* Imagen */}
                                <div className="relative aspect-4/3 overflow-hidden bg-[#f2ebdc]">
                                {plato.imagen ? (
                                        <Image
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                                            src={plato.imagen}
                                            alt={plato.nombre}
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-(--terracotta)">
                                            <UtensilsCrossed size={32} strokeWidth={1.25} aria-hidden="true" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-serif text-[18px] font-normal leading-[1.1] tracking-[-0.03em]">
                                            {plato.nombre}
                                        </h3>
                                        <span className="shrink-0 pt-0.5 text-[13px] font-extrabold text-(--terracotta)">
                                            {formatPrice(plato.precio)}
                                        </span>
                                    </div>

                                    {plato.descripcion && (
                                        <p className="line-clamp-2 font-serif text-[13px] leading-[1.55] text-(--muted)">
                                            {plato.descripcion}
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </div>
        </section>
    )
}
