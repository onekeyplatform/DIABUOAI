import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, UpdateDocumentInput } from './documents.types';

@Resolver()
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation()
  async createDocument(@Args() input: CreateDocumentInput) {
    return this.documentsService.createDocument(input);
  }

  @Query()
  async document(@Args('documentId') documentId: string, @Args('tenantId') tenantId: string) {
    return this.documentsService.getDocument(documentId, tenantId);
  }

  @Query()
  async documents(
    @Args('tenantId') tenantId: string,
    @Args('query', { nullable: true }) query?: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.documentsService.listDocuments({
      tenantId,
      query,
      status: status as any,
      type: type as any,
      limit,
    });
  }

  @Mutation()
  async updateDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
    @Args('userId') userId: string,
    @Args() input: UpdateDocumentInput,
  ) {
    return this.documentsService.updateDocument(documentId, tenantId, input, userId);
  }

  @Mutation()
  async publishDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
    @Args('userId') userId: string,
  ) {
    return this.documentsService.publishDocument(documentId, tenantId, userId);
  }

  @Mutation()
  async archiveDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
    @Args('userId') userId: string,
  ) {
    const success = await this.documentsService.archiveDocument(documentId, tenantId, userId);
    return { success, documentId };
  }

  @Mutation()
  async deleteDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
    @Args('userId') userId: string,
  ) {
    const success = await this.documentsService.deleteDocument(documentId, tenantId, userId);
    return { success, documentId };
  }

  @Query()
  async documentVersions(@Args('documentId') documentId: string, @Args('tenantId') tenantId: string) {
    return this.documentsService.getVersions(documentId, tenantId);
  }

  @Mutation()
  async restoreDocumentVersion(
    @Args('documentId') documentId: string,
    @Args('versionNumber') versionNumber: number,
    @Args('tenantId') tenantId: string,
    @Args('userId') userId: string,
  ) {
    return this.documentsService.restoreVersion(documentId, versionNumber, tenantId, userId);
  }

  @Mutation()
  async shareDocument(
    @Args('documentId') documentId: string,
    @Args('sharedWith') sharedWith: string,
    @Args('permission') permission: string,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
  ) {
    return this.documentsService.shareDocument(documentId, sharedWith, permission as any, expiresAt);
  }
}
