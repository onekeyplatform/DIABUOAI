export type TenantContext = {
  tenantId: string;
  userId: string;
  roles: string[];
};

export type OAuthProvider = 'google' | 'microsoft';

export type EventEnvelope<T> = {
  id: string;
  type: string;
  tenantId?: string;
  payload: T;
  createdAt: string;
};
