export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
}

export interface OrganizationSettings {
  id: string;
  tenantId: string;
  locale: string;
  timezone: string;
  currency: string;
  branding: {
    logoUrl?: string;
    primaryColor?: string;
  };
}
