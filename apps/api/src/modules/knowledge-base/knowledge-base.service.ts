import { Injectable } from '@nestjs/common';
import {
  Document,
  DocumentChunk,
  DocumentEmbedding,
  HybridSearchResult,
  SearchInput,
  UploadDocumentInput,
  VectorSearchResult,
} from './knowledge-base.types';
import { parseDocument } from './document-parser';
import { chunkDocument, semanticChunk } from './chunking';
import { cosineSimilarity, generateEmbedding, generateEmbeddingsBatch } from './embeddings';

@Injectable()
export class KnowledgeBaseService {
  private documents: Map<string, Document> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();
  private embeddings: Map<string, DocumentEmbedding> = new Map();
  private idCounter = 0;

  /**
   * Upload and process a document
   */
  async uploadDocument(input: UploadDocumentInput): Promise<Document> {
    const docId = `doc-${++this.idCounter}`;

    // Parse document
    const parsed = await parseDocument(input.file, input.mimeType, input.filename);

    // Create document record
    const document: Document = {
      id: docId,
      tenantId: input.tenantId,
      title: input.title,
      filename: input.filename,
      content: parsed.text,
      mimeType: input.mimeType,
      fileSize: input.file.length,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.documents.set(docId, document);

    // Process document asynchronously
    this.processDocument(docId, parsed.text).catch((error) => {
      document.status = 'failed';
      document.errorMessage = error.message;
      document.updatedAt = new Date();
    });

    return document;
  }

  /**
   * Process document: chunk and generate embeddings
   */
  private async processDocument(documentId: string, content: string): Promise<void> {
    const document = this.documents.get(documentId);
    if (!document) return;

    try {
      // Chunk the document
      const chunks = semanticChunk(content);

      // Store chunks
      for (const chunk of chunks) {
        const chunkId = `chunk-${++this.idCounter}`;
        const docChunk: DocumentChunk = {
          id: chunkId,
          documentId,
          content: chunk.content,
          chunkIndex: chunk.index,
          startOffset: chunk.startOffset,
          endOffset: chunk.endOffset,
          createdAt: new Date(),
        };
        this.chunks.set(chunkId, docChunk);
      }

      // Generate embeddings for all chunks
      const chunkContents = chunks.map((c) => c.content);
      const embeddingResults = await generateEmbeddingsBatch(chunkContents);

      // Store embeddings
      const chunkIds = Array.from(this.chunks.values())
        .filter((c) => c.documentId === documentId)
        .map((c) => c.id);

      for (let i = 0; i < chunkIds.length; i++) {
        const embId = `emb-${++this.idCounter}`;
        const docEmbedding: DocumentEmbedding = {
          id: embId,
          chunkId: chunkIds[i],
          embedding: embeddingResults[i].embedding,
          model: embeddingResults[i].model,
          tokenCount: embeddingResults[i].tokenCount,
          createdAt: new Date(),
        };
        this.embeddings.set(embId, docEmbedding);
      }

      // Mark as completed
      document.status = 'completed';
      document.updatedAt = new Date();
    } catch (error) {
      document.status = 'failed';
      document.errorMessage = error.message;
      document.updatedAt = new Date();
      throw error;
    }
  }

  /**
   * Vector search using embeddings
   */
  async vectorSearch(input: SearchInput): Promise<VectorSearchResult[]> {
    const limit = input.limit || 10;
    const threshold = input.threshold || 0.5;

    // Generate query embedding
    const queryEmbedding = (await generateEmbedding(input.query)).embedding;

    // Search through all embeddings
    const results: VectorSearchResult[] = [];

    for (const embedding of this.embeddings.values()) {
      const similarity = cosineSimilarity(queryEmbedding, embedding.embedding);

      if (similarity >= threshold) {
        const chunk = this.chunks.get(embedding.chunkId);
        const document = this.documents.get(chunk?.documentId || '');

        if (document?.tenantId === input.tenantId) {
          results.push({
            chunkId: embedding.chunkId,
            documentId: chunk?.documentId || '',
            title: document?.title || '',
            content: chunk?.content || '',
            similarity,
          });
        }
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  /**
   * Full-text search (keyword search)
   */
  async fullTextSearch(input: SearchInput): Promise<DocumentChunk[]> {
    const limit = input.limit || 10;
    const query = input.query.toLowerCase();

    const results: DocumentChunk[] = [];

    for (const chunk of this.chunks.values()) {
      const doc = this.documents.get(chunk.documentId);
      if (doc?.tenantId === input.tenantId && chunk.content.toLowerCase().includes(query)) {
        results.push(chunk);
      }
    }

    return results.slice(0, limit);
  }

  /**
   * Hybrid search combining vector and full-text search
   */
  async hybridSearch(input: SearchInput): Promise<HybridSearchResult[]> {
    const vectorResults = await this.vectorSearch(input);
    const textResults = await this.fullTextSearch(input);

    // Combine results with scoring
    const resultMap = new Map<string, HybridSearchResult>();

    // Add vector results
    for (const result of vectorResults) {
      resultMap.set(result.chunkId, {
        ...result,
        vectorScore: result.similarity,
        textScore: 0,
        combinedScore: result.similarity * 0.7, // 70% weight for vector
      });
    }

    // Add/merge text results
    for (let i = 0; i < textResults.length; i++) {
      const chunk = textResults[i];
      const existing = resultMap.get(chunk.id);
      const textScore = 1 - i / textResults.length; // Inverse rank for text

      if (existing) {
        existing.textScore = textScore;
        existing.combinedScore = existing.vectorScore * 0.7 + textScore * 0.3;
      } else {
        const doc = this.documents.get(chunk.documentId);
        resultMap.set(chunk.id, {
          chunkId: chunk.id,
          documentId: chunk.documentId,
          title: doc?.title || '',
          content: chunk.content,
          similarity: textScore,
          vectorScore: 0,
          textScore,
          combinedScore: textScore * 0.3,
        });
      }
    }

    return Array.from(resultMap.values())
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, input.limit || 10);
  }

  /**
   * List documents for tenant
   */
  listDocuments(tenantId: string): Document[] {
    return Array.from(this.documents.values()).filter((d) => d.tenantId === tenantId);
  }

  /**
   * Get document by ID
   */
  getDocument(documentId: string, tenantId: string): Document | undefined {
    const doc = this.documents.get(documentId);
    return doc?.tenantId === tenantId ? doc : undefined;
  }

  /**
   * Delete document and its associated chunks and embeddings
   */
  deleteDocument(documentId: string, tenantId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return false;

    this.documents.delete(documentId);

    // Delete associated chunks and embeddings
    for (const [id, chunk] of this.chunks) {
      if (chunk.documentId === documentId) {
        this.chunks.delete(id);
      }
    }

    for (const [id, emb] of this.embeddings) {
      const chunk = this.chunks.get(emb.chunkId);
      if (chunk?.documentId === documentId) {
        this.embeddings.delete(id);
      }
    }

    return true;
  }

  /**
   * Get document statistics
   */
  getDocumentStats(documentId: string, tenantId: string) {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    const chunks = Array.from(this.chunks.values()).filter((c) => c.documentId === documentId);
    const embeddings = Array.from(this.embeddings.values()).filter((e) => {
      const chunk = this.chunks.get(e.chunkId);
      return chunk?.documentId === documentId;
    });

    return {
      documentId,
      title: doc.title,
      status: doc.status,
      chunkCount: chunks.length,
      embeddingCount: embeddings.length,
      totalTokens: embeddings.reduce((sum, e) => sum + e.tokenCount, 0),
    };
  }
}
