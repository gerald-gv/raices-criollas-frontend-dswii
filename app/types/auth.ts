// Respuesta de POST /api/auth/login y /api/auth/register
export interface TokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

// Lo que el frontend sabe del usuario a partir del JWT (claims: sub, email, roles, exp)
export interface Session {
    userId: string;
    email: string;
    roles: string[];
    isAdmin: boolean;
    expiresAt: number;
}

// Estado devuelto por las Server Actions de login/registro
export interface AuthState {
    mensaje?: string;
    errores?: Record<string, string>;
    valores?: Record<string, string>;
}
