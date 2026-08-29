-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Document table
CREATE TABLE IF NOT EXISTS "Document" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- Create DocumentChunk table
CREATE TABLE IF NOT EXISTS "DocumentChunk" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "chunkIndex" INTEGER NOT NULL,
  "startOffset" INTEGER NOT NULL,
  "endOffset" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
);

-- Create DocumentEmbedding table with pgvector support
CREATE TABLE IF NOT EXISTS "DocumentEmbedding" (
  "id" TEXT NOT NULL,
  "chunkId" TEXT NOT NULL,
  "embedding" vector(1536),
  "model" TEXT NOT NULL DEFAULT 'text-embedding-3-small',
  "tokenCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentEmbedding_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DocumentEmbedding_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES "DocumentChunk" ("id") ON DELETE CASCADE
);

-- Create indexes for efficient searches
CREATE INDEX IF NOT EXISTS "Document_tenantId_idx" ON "Document"("tenantId");
CREATE INDEX IF NOT EXISTS "Document_status_idx" ON "Document"("status");
CREATE INDEX IF NOT EXISTS "DocumentChunk_documentId_idx" ON "DocumentChunk"("documentId");
CREATE INDEX IF NOT EXISTS "DocumentEmbedding_chunkId_idx" ON "DocumentEmbedding"("chunkId");
CREATE INDEX IF NOT EXISTS "DocumentEmbedding_embedding_idx" ON "DocumentEmbedding" USING ivfflat ("embedding" vector_cosine_ops);

-- Full-text search index for hybrid search
CREATE INDEX IF NOT EXISTS "DocumentChunk_content_fts_idx" ON "DocumentChunk" USING GIN (to_tsvector('english', "content"));
