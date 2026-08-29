import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleDefinition, RoleAssignment } from './rbac.types';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(tenantId: string): Promise<RoleDefinition[]> {
    const roles = await this.prisma.role.findMany({
      where: { users: { some: { user: { tenantId } } } },
    });

    return roles.map((role) => ({
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

    return assignments.some((assignment) => {
      const perms = this.defaultPermissionsForRole(assignment.role.name);
      return perms.includes(permission as any);
    });
  }

  private defaultPermissionsForRole(roleName: string): string[] {
    const map: Record<string, string[]> = {
      owner: ['users.read', 'users.write', 'tenants.read', 'tenants.write', 'roles.manage', 'audit.read', 'billing.read', 'billing.write'],
      admin: ['users.read', 'users.write', 'tenants.read', 'roles.manage', 'audit.read', 'billing.read'],
      manager: ['users.read', 'users.write', 'tenants.read', 'audit.read'],
      member: ['users.read'],
    };

    return map[roleName] || [];
  }
}
