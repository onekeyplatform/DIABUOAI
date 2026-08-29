export type PermissionName =
  | 'users.read'
  | 'users.write'
  | 'tenants.read'
  | 'tenants.write'
  | 'roles.manage'
  | 'audit.read'
  | 'billing.read'
  | 'billing.write';

export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  roleName: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionName[];
}
