import { z } from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
