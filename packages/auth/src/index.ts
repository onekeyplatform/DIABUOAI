import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  tenantId: z.string(),
  role: z.string().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export function signJwt(payload: JwtPayload, secret: string) {
  return jwt.sign(payload, secret);
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  return JwtPayloadSchema.parse(jwt.verify(token, secret));
}
