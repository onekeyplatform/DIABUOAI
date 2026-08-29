import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users with optional filters' })
  async list(@Query('tenantId') tenantId?: string, @Query('email') email?: string, @Query('isActive') isActive?: string) {
    return this.usersService.listUsers({
      tenantId,
      email,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by id' })
  async get(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user record' })
  async create(@Body() body: { email: string; name?: string; tenantId: string; passwordHash?: string; isActive?: boolean }) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile state' })
  async update(@Param('id') id: string, @Body() body: { name?: string; isActive?: boolean }) {
    return this.usersService.updateUser(id, body);
  }
}
