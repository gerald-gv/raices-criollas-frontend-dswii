import { formatPrice } from "@/app/lib/format";
import { Plato } from "@/app/types/menu";
import { ShoppingBag, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

interface DishCardProps {
    plato: Plato;
    variant?: "default" | "feature";
    className?: string;
    sizes?: string;
    badge?: string;
}

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

const DishImage = ({ plato, sizes }: { plato: Plato; sizes: string }) =>
    plato.imagen ? (

        <Image sizes={sizes} fill src={plato.imagen} alt={plato.nombre} loading="lazy" draggable={false} className="size-full object-cover transition-transform duration-700 group-hover:scale-105"/>
    ) : (

        <div className="flex size-full items-center justify-center text-(--terracotta)">
            <UtensilsCrossed size={34} strokeWidth={1.25} aria-hidden="true" />
        </div>
    );

// todavia no hay carrito. Cuando exista, basta con darle un onClick
const CartButton = ({ plato, pill = false }: { plato: Plato; pill?: boolean }) => (
    <button
        type="button"
        aria-label={`Añadir ${plato.nombre} al pedido`}
        className={`dish-card__cart inline-flex cursor-pointer select-none items-center justify-center gap-2 border border-(--ink) bg-transparent text-[11px] font-extrabold uppercase tracking-[0.08em] text-(--ink) transition-colors duration-200 hover:border-(--terracotta) hover:bg-(--terracotta) hover:text-white active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--terracotta) ${pill ? "rounded-full px-6 py-3" : "w-full rounded-sm px-4 py-3.25"}`}
    >
        <ShoppingBag size={15} aria-hidden="true" />
        Añadir al pedido
    </button>
);

export const DishCard = ({ plato, variant = "default", className = "", sizes = DEFAULT_SIZES, badge }: DishCardProps) => {

    const etiqueta = badge ?? (plato.destacado ? "Recomendado" : undefined);

    if (variant === "feature") {
        return (
            <article className={`group flex flex-col transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transition-none ${className}`.trim()}>

                <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-sm bg-[#f2ebdc] outline-1 outline-(--line) outline-offset-[6px] transition-[outline-color,outline-offset] duration-300 group-hover:outline-(--terracotta) group-hover:outline-offset-[9px] motion-reduce:transition-none">
                    <DishImage plato={plato} sizes={sizes} />
                </div>

                <div className="flex flex-1 flex-col items-center gap-2.5 px-2 pb-1 pt-7 text-center">
                    {etiqueta && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-(--terracotta)">
                            <Star size={11} fill="currentColor" aria-hidden="true" />
                            {etiqueta}
                        </span>
                    )}

                    <h3 className="font-serif text-[24px] font-normal leading-[1.05] tracking-[-0.04em]">
                        {plato.nombre}
                    </h3>

                    <span className="text-[13px] font-extrabold text-(--terracotta)">
                        {formatPrice(plato.precio)}
                    </span>

                    {plato.descripcion && (
                        <p className="line-clamp-2 max-w-[28ch] font-serif text-[14px] leading-[1.6] text-(--muted)">
                            {plato.descripcion}
                        </p>
                    )}

                    <div className="mt-auto pt-2">
                        <CartButton plato={plato} pill />
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className={`dish-card group flex flex-col overflow-hidden border border-(--line) bg-(--paper) ${className}`.trim()}>

            <div className="relative aspect-4/3 overflow-hidden bg-[#f2ebdc]">
                <DishImage plato={plato} sizes={sizes} />

                {etiqueta && (
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 bg-(--yellow) px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-(--ink)">
                        <Star size={11} fill="currentColor" aria-hidden="true" />
                        {etiqueta}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-5">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-[22px] font-normal leading-[1.05] tracking-[-0.04em]">
                        {plato.nombre}
                    </h3>

                    <span className="shrink-0 pt-1 text-[13px] font-extrabold text-(--terracotta)">
                        {formatPrice(plato.precio)}
                    </span>
                </div>

                {plato.descripcion && (
                    <p className="line-clamp-3 font-serif text-[14px] leading-[1.6] text-(--muted)">
                        {plato.descripcion}
                    </p>
                )}

                <div className="mt-auto pt-2">
                    <CartButton plato={plato} />
                </div>
            </div>

        </article>
    );
};
