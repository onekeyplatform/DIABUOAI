import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { KnowledgeBaseService } from './knowledge-base.service';

@Resolver()
export class KnowledgeBaseResolver {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Query()
  async kbDocuments(@Args('tenantId') tenantId: string) {
    return this.kbService.listDocuments(tenantId);
  }

  @Query()
  async kbDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
  ) {
    return this.kbService.getDocument(documentId, tenantId);
  }

  @Query()
  async kbDocumentStats(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
  ) {
    return this.kbService.getDocumentStats(documentId, tenantId);
  }

  @Query()
  async kbVectorSearch(
    @Args('tenantId') tenantId: string,
    @Args('query') query: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('threshold', { nullable: true }) threshold?: number,
  ) {
    return this.kbService.vectorSearch({ tenantId, query, limit, threshold });
  }

  @Query()
  async kbFullTextSearch(
    @Args('tenantId') tenantId: string,
    @Args('query') query: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.kbService.fullTextSearch({ tenantId, query, limit });
  }

  @Query()
  async kbHybridSearch(
    @Args('tenantId') tenantId: string,
    @Args('query') query: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('threshold', { nullable: true }) threshold?: number,
  ) {
    return this.kbService.hybridSearch({ tenantId, query, limit, threshold });
  }

  @Mutation()
  async kbDeleteDocument(
    @Args('documentId') documentId: string,
    @Args('tenantId') tenantId: string,
  ) {
    const success = this.kbService.deleteDocument(documentId, tenantId);
    return { success, documentId };
  }
}
