import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { signJwt, verifyJwt } from '@diabuoai/auth';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { AuthTokens, LoginRequest, RegisterRequest, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterRequest): Promise<AuthTokens> {
    const tenantSlug = input.tenantSlug || 'default';

    const existingUser = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    let tenant = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          name: tenantSlug,
          slug: tenantSlug,
        },
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name || input.email.split('@')[0],
        passwordHash,
        tenantId: tenant.id,
      },
    });

    const role = await this.prisma.role.upsert({
      where: { name: 'owner' },
      update: {},
      create: { name: 'owner', description: 'Tenant owner' },
    });

    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    return this.createTokens(user.id, tenant.id, user.email, 'owner');
  }

  async login(input: LoginRequest): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = await this.prisma.userRole.findFirst({
      where: { userId: user.id },
      include: { role: true },
    });

    return this.createTokens(user.id, user.tenantId, user.email, role?.role.name || 'member');
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyJwt(refreshToken, process.env.JWT_SECRET || 'dev-secret');
    const record = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: this.hashToken(refreshToken) },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.createTokens(user.id, user.tenantId, user.email, payload.role || 'member');
  }

  async validateToken(token: string): Promise<JwtPayload> {
    return verifyJwt(token, process.env.JWT_SECRET || 'dev-secret');
  }

  private async createTokens(
    userId: string,
    tenantId: string,
    email: string,
    role: string,
  ): Promise<AuthTokens> {
    const accessToken = signJwt(
      { sub: userId, tenantId, email, role },
      process.env.JWT_SECRET || 'dev-secret',
    );

    const refreshTokenValue = this.generateSecureToken();
    const refreshExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tenantId,
        tokenHash: this.hashToken(refreshTokenValue),
        expiresAt: refreshExpiry,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 3600,
    };
  }

  private generateSecureToken() {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string) {
    return token;
  }
}
