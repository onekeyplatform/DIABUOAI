import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async listOrganizations() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrganization(id: string) {
    const org = await this.prisma.tenant.findUnique({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async createOrganization(input: { name: string; slug: string; plan?: string }) {
    return this.prisma.tenant.create({
      data: {
        name: input.name,
        slug: input.slug,
        status: 'active',
      },
    });
  }

  async updateOrganization(id: string, input: { name?: string; status?: string }) {
    return this.prisma.tenant.update({
      where: { id },
      data: { ...input },
    });
  }
}
