import { formatPrice } from "@/app/lib/format";
import { Plato } from "@/app/types/menu";
import { UtensilsCrossed } from "lucide-react";
import Image from "next/image";

interface DishCardProps {
    plato: Plato;
}

export const DishCard = ({ plato }: DishCardProps) => {
    return (
        <article className="dish-card group flex flex-col overflow-hidden border border-(--line) bg-(--paper)">

            <div className="relative aspect-4/3 overflow-hidden bg-[#f2ebdc]">
                {plato.imagen ? (
                    <Image
                        src={plato.imagen}
                        alt={plato.nombre}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-(--terracotta)">
                        <UtensilsCrossed size={34} strokeWidth={1.25} aria-hidden="true"/>
                    </div>
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
            </div>

        </article>
    );
};
