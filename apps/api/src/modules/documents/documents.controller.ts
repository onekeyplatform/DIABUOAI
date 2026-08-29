import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, DocumentSearchFilters, UpdateDocumentInput } from './documents.types';

@Controller('documents')
@ApiTags('Documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async createDocument(@Body() input: CreateDocumentInput) {
    return this.documentsService.createDocument(input);
  }

  @Get()
  async listDocuments(@Query() filters: DocumentSearchFilters) {
    return this.documentsService.listDocuments(filters);
  }

  @Get(':documentId')
  async getDocument(@Param('documentId') documentId: string, @Query('tenantId') tenantId: string) {
    return this.documentsService.getDocument(documentId, tenantId);
  }

  @Put(':documentId')
  async updateDocument(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
    @Body() input: UpdateDocumentInput,
  ) {
    return this.documentsService.updateDocument(documentId, tenantId, input, userId);
  }

  @Post(':documentId/publish')
  async publishDocument(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
  ) {
    return this.documentsService.publishDocument(documentId, tenantId, userId);
  }

  @Post(':documentId/archive')
  async archiveDocument(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
  ) {
    const success = await this.documentsService.archiveDocument(documentId, tenantId, userId);
    return { success, documentId };
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
  ) {
    const success = await this.documentsService.deleteDocument(documentId, tenantId, userId);
    return { success, documentId };
  }

  @Get(':documentId/versions')
  async getVersions(@Param('documentId') documentId: string, @Query('tenantId') tenantId: string) {
    return this.documentsService.getVersions(documentId, tenantId);
  }

  @Post(':documentId/restore-version')
  async restoreVersion(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('userId') userId: string,
    @Body() body: { versionNumber: number },
  ) {
    return this.documentsService.restoreVersion(documentId, body.versionNumber, tenantId, userId);
  }

  @Post(':documentId/share')
  async shareDocument(
    @Param('documentId') documentId: string,
    @Body() body: { sharedWith: string; permission: string; expiresAt?: Date },
  ) {
    return this.documentsService.shareDocument(
      documentId,
      body.sharedWith,
      body.permission as any,
      body.expiresAt,
    );
  }

  @Post(':documentId/permissions')
  async grantPermission(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
    @Query('grantedBy') grantedBy: string,
    @Body() body: { userId: string; permission: string },
  ) {
    return this.documentsService.grantPermission(
      documentId,
      body.userId,
      body.permission as any,
      grantedBy,
      tenantId,
    );
  }

  @Post('templates')
  async createTemplate(
    @Query('tenantId') tenantId: string,
    @Body() body: { name: string; content: string; category: string },
  ) {
    return this.documentsService.createTemplate(tenantId, body.name, body.content, body.category);
  }

  @Get('templates/list')
  async listTemplates(@Query('tenantId') tenantId: string) {
    return this.documentsService.listTemplates(tenantId);
  }
}
