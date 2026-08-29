import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller('knowledge-base')
@ApiTags('Knowledge Base')
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a document for RAG processing',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        tenantId: { type: 'string' },
        title: { type: 'string' },
      },
    },
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { tenantId: string; title: string },
  ) {
    return this.kbService.uploadDocument({
      tenantId: body.tenantId,
      title: body.title,
      file: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
    });
  }

  @Get('documents')
  async listDocuments(@Query('tenantId') tenantId: string) {
    return this.kbService.listDocuments(tenantId);
  }

  @Get('documents/:documentId')
  async getDocument(@Param('documentId') documentId: string, @Query('tenantId') tenantId: string) {
    return this.kbService.getDocument(documentId, tenantId);
  }

  @Get('documents/:documentId/stats')
  async getDocumentStats(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.kbService.getDocumentStats(documentId, tenantId);
  }

  @Delete('documents/:documentId')
  async deleteDocument(
    @Param('documentId') documentId: string,
    @Query('tenantId') tenantId: string,
  ) {
    const success = this.kbService.deleteDocument(documentId, tenantId);
    return { success, documentId };
  }

  @Post('search/vector')
  async vectorSearch(
    @Body() body: { tenantId: string; query: string; limit?: number; threshold?: number },
  ) {
    return this.kbService.vectorSearch({
      tenantId: body.tenantId,
      query: body.query,
      limit: body.limit,
      threshold: body.threshold,
    });
  }

  @Post('search/full-text')
  async fullTextSearch(@Body() body: { tenantId: string; query: string; limit?: number }) {
    return this.kbService.fullTextSearch({
      tenantId: body.tenantId,
      query: body.query,
      limit: body.limit,
    });
  }

  @Post('search/hybrid')
  async hybridSearch(
    @Body() body: { tenantId: string; query: string; limit?: number; threshold?: number },
  ) {
    return this.kbService.hybridSearch({
      tenantId: body.tenantId,
      query: body.query,
      limit: body.limit,
      threshold: body.threshold,
    });
  }
}
