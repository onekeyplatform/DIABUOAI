export interface UserSummary {
  id: string;
  email: string;
  name?: string;
  tenantId: string;
  role?: string;
  isActive: boolean;
}

export interface UserFilters {
  tenantId?: string;
  email?: string;
  isActive?: boolean;
}
