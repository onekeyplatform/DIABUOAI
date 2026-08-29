import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RbacService } from './rbac.service';

@ApiTags('RBAC')
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List roles for a tenant' })
  async listRoles(@Query('tenantId') tenantId: string) {
    return this.rbacService.getRoles(tenantId);
  }

  @Post('roles/assign')
  @ApiOperation({ summary: 'Assign a role to a user' })
  async assignRole(@Body() body: { userId: string; roleName: string }) {
    return this.rbacService.assignRole(body.userId, body.roleName);
  }

  @Get('permissions/:userId')
  @ApiOperation({ summary: 'Check whether a user has a permission' })
  async hasPermission(@Param('userId') userId: string, @Query('permission') permission: string) {
    return { hasPermission: await this.rbacService.hasPermission(userId, permission) };
  }
}
