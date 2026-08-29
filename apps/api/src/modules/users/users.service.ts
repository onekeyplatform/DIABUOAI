import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(filters?: { tenantId?: string; email?: string; isActive?: boolean }) {
    return this.prisma.user.findMany({
      where: {
        ...(filters?.tenantId ? { tenantId: filters.tenantId } : {}),
        ...(filters?.email ? { email: { contains: filters.email, mode: 'insensitive' } } : {}),
        ...(typeof filters?.isActive === 'boolean' ? { isActive: filters.isActive } : {}),
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } }, tenant: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(input: { email: string; name?: string; tenantId: string; passwordHash?: string; isActive?: boolean }) {
    return this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        tenantId: input.tenantId,
        passwordHash: input.passwordHash,
        isActive: input.isActive ?? true,
      },
    });
  }

  async updateUser(id: string, input: { name?: string; isActive?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data: { ...input },
    });
  }
}
