import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async list() {
    return this.organizationService.listOrganizations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id' })
  async get(@Param('id') id: string) {
    return this.organizationService.getOrganization(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() body: { name: string; slug: string; plan?: string }) {
    return this.organizationService.createOrganization(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an organization' })
  async update(@Param('id') id: string, @Body() body: { name?: string; status?: string }) {
    return this.organizationService.updateOrganization(id, body);
  }
}
