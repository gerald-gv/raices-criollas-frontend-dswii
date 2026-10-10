"use client"

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type Kind = "ok" | "error";

interface ToastItem {
    id: number;
    kind: Kind;
    message: string;
}

const ToastContext = createContext<{ notify: (kind: Kind, message: string) => void } | null>(null);

// Avisos breves que sobreviven al cierre del modal que los origino
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ToastItem[]>([]);

    const notify = useCallback((kind: Kind, message: string) => {
        const id = Date.now() + Math.random();
        setItems((current) => [...current, { id, kind, message }]);
        setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 5000);
    }, []);

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed bottom-6 right-6 z-60 flex w-[min(92vw,360px)] flex-col gap-2" aria-live="polite">

                {items.map((item) => (
                    <div key={item.id} role={item.kind === "error" ? "alert" : "status"}
                        className={`pointer-events-auto flex items-start gap-2.5 border p-3.5 text-[13px] font-bold shadow-[0_14px_30px_rgba(38,37,31,0.12)] ${item.kind === "error"
                            ? "border-(--terracotta) bg-[#f8e9e2] text-(--terracotta)"
                            : "border-(--olive)/40 bg-[#eef1e3] text-(--olive)"
                            }`}
                    >
                        {item.kind === "error"
                            ? <AlertCircle size={16} className="mt-px shrink-0" aria-hidden="true" />
                            : <CheckCircle2 size={16} className="mt-px shrink-0" aria-hidden="true" />}
                        {item.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast debe usarse dentro de <ToastProvider>");
    return context;
};
