export interface Document {
  id: string;
  tenantId: string;
  title: string;
  filename: string;
  content: string;
  mimeType: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  startOffset: number;
  endOffset: number;
  createdAt: Date;
}

export interface DocumentEmbedding {
  id: string;
  chunkId: string;
  embedding: number[];
  model: string;
  tokenCount: number;
  createdAt: Date;
}

export interface VectorSearchResult {
  chunkId: string;
  documentId: string;
  title: string;
  content: string;
  similarity: number;
}

export interface HybridSearchResult extends VectorSearchResult {
  vectorScore: number;
  textScore: number;
  combinedScore: number;
}

export interface UploadDocumentInput {
  tenantId: string;
  title: string;
  file: Buffer;
  filename: string;
  mimeType: string;
}

export interface SearchInput {
  tenantId: string;
  query: string;
  limit?: number;
  threshold?: number;
}
