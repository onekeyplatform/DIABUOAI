export type AuthProvider = 'local' | 'google' | 'microsoft';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  tenantSlug?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  role?: string;
  provider?: AuthProvider;
  iat?: number;
  exp?: number;
}
