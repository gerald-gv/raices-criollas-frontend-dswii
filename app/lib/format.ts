const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

export const formatPrice = (value: number) => moneda.format(value);
