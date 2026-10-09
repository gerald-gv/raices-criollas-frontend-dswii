import { ApiResponse } from "../types/ApiResponse";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        options?: ErrorOptions,
    ) {
        super(message, options);
        this.name = "ApiError";
    }
}

// Se obtiene el gateway y este como respuesta devuelve data
export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {

    let res: Response;
    const url = `${API_URL}${path}`;
    console.log("[apiGet] URL solicitada:", url);
    try {
        res = await fetch(`${API_URL}${path}`, {
            headers: { Accept: "application/json" },
            next: { revalidate },
        });
    } catch {
        throw new ApiError("No se pudo conectar con el servidor", 503); // En caso no responsa, lanza ApiError
    }

    let body: ApiResponse<T> | null = null;
    try {
        body = (await res.json()) as ApiResponse<T>;
    } catch {
    }

    if (!res.ok || !body?.success) {
        throw new ApiError(body?.mensaje ?? `Error ${res.status}`, res.status);
    }

    return body.data;
}
