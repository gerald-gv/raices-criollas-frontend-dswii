
'use client'
import { useState } from "react";
import BrandMark from "../brand-mark";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { navigationLinks } from "@/app/data/Navigation";

export const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen((open) => !open);
    };

    const handleNavigation = () => {
        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-5 flex h-17.5 items-center justify-between bg-(--cream) px-6 sm:h-20.5 sm:px-[clamp(24px,6vw,88px)]">            <Link href="/" className=" flex items-center gap-2.5 uppercase leading-[0.85]">
            
            <BrandMark />

            <div className="text-sm font-extrabold tracking-[0.08em] leading-[0.85]">
                Raices
                <span className="block font-serif text-[17px] font-normal italic tracking-normal text-(--terracotta) normal-case">
                    Criollas
                </span>
            </div>

        </Link>

            <nav className={`nav-links ${menuOpen ? "nav-open" : "hidden"} ml-auto gap-[clamp(20px,3vw,44px)] md:mr-11.5 md:flex md:flex-row md:bg-transparent md:p-0 md:shadow-none`} aria-label="Navegación principal">
                {navigationLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={handleNavigation}
                        className=" text-[13px] font-bold text-[#625e54] transition-colors duration-200 hover:text-(--terracotta)">
                        {link.label}
                    </Link>
                ))}

                <Link href="/reservar-mesa" className="md:hidden inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-sm border border-transparent px-5.25 py-3.5 text-xs font-extrabold tracking-[0.03em] transition-all duration-200 hover:-translate-y-0.5 button-primary">
                    Reservar mesa
                </Link>
            </nav>

            <div className="hidden items-center gap-4.25 md:flex">

                <button type="button" className=" flex cursor-pointer items-center gap-1.75 border-0 bg-transparent p-2.5 text-(--ink)" aria-label="Ver pedido, 0 productos">
                    <ShoppingBag size={19} />

                    <span className=" flex size-4.5 items-center justify-center rounded-full bg-(--yellow) text-[10px] font-extrabold">
                        0
                    </span>

                </button>

                <Link href="/reservar-mesa" className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-sm border border-transparent px-5.25 py-3.5 text-xs font-extrabold tracking-[0.03em] transition-all duration-200 hover:-translate-y-0.5 button-primary">
                    Reservar mesa
                </Link>
            </div>

            <button className=" cursor-pointer border-0 bg-transparent p-0 md:hidden" onClick={handleMenuToggle}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>

                {menuOpen ? (<X size={24} />) : (<Menu size={24} />)}

            </button>
        </header>
    );
};