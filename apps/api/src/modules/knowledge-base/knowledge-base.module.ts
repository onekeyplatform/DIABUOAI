import { Module } from '@nestjs/common';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseResolver } from './knowledge-base.resolver';

@Module({
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService, KnowledgeBaseResolver],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
