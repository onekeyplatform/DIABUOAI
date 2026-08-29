import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { RoleDefinition, RoleAssignment } from './rbac.types';
import { type PermissionName } from './rbac.types';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(tenantId: string): Promise<RoleDefinition[]> {
    const roles = await this.prisma.role.findMany({
      where: { users: { some: { user: { tenantId } } } },
    });

    return roles.map((role: any) => ({
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      permissions: this.defaultPermissionsForRole(role.name),
    }));
  }

  async assignRole(userId: string, roleName: string): Promise<RoleAssignment> {
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new NotFoundException('Role not found');

    const assignment = await this.prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId: role.id },
      },
      update: {},
      create: { userId, roleId: role.id },
      include: { role: true },
    });

    return {
      id: assignment.id,
      userId: assignment.userId,
      roleId: assignment.roleId,
      roleName: assignment.role.name,
    };
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const assignments = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    return assignments.some((assignment: any) => {
      const perms = this.defaultPermissionsForRole(assignment.role.name);
      return perms.includes(permission as any);
    });
  }

  private defaultPermissionsForRole(roleName: string): PermissionName[] {
    const map: Record<string, PermissionName[]> = {
      owner: ['users.read', 'users.write', 'tenants.read', 'tenants.write', 'roles.manage', 'audit.read', 'billing.read', 'billing.write'] as PermissionName[],
      admin: ['users.read', 'users.write', 'tenants.read', 'roles.manage', 'audit.read', 'billing.read'] as PermissionName[],
      manager: ['users.read', 'users.write', 'tenants.read', 'audit.read'] as PermissionName[],
      member: ['users.read'] as PermissionName[],
    };

    return map[roleName] || [];
  }
}
