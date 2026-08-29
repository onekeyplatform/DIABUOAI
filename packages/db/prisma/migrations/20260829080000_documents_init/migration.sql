-- Create Document table
CREATE TABLE IF NOT EXISTS "Document" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "authorId" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "parentDocumentId" TEXT,
  "fileSize" INTEGER NOT NULL,
  "wordCount" INTEGER NOT NULL,
  "language" TEXT,
  "tags" TEXT,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" TIMESTAMP(3),

  CONSTRAINT "Document_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Document_parentDocumentId_fkey" FOREIGN KEY ("parentDocumentId") REFERENCES "Document" ("id") ON DELETE SET NULL
);

-- Create DocumentVersion table
CREATE TABLE IF NOT EXISTS "DocumentVersion" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "changeDescription" TEXT,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE,
  CONSTRAINT "DocumentVersion_unique" UNIQUE ("documentId", "versionNumber")
);

-- Create DocumentPermission table
CREATE TABLE IF NOT EXISTS "DocumentPermission" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "permission" TEXT NOT NULL,
  "grantedBy" TEXT NOT NULL,
  "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentPermission_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DocumentPermission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE,
  CONSTRAINT "DocumentPermission_unique" UNIQUE ("documentId", "userId")
);

-- Create DocumentShare table
CREATE TABLE IF NOT EXISTS "DocumentShare" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "sharedWith" TEXT NOT NULL,
  "permission" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DocumentShare_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
);

-- Create DocumentTemplate table
CREATE TABLE IF NOT EXISTS "DocumentTemplate" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "content" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Document_tenantId_idx" ON "Document"("tenantId");
CREATE INDEX IF NOT EXISTS "Document_status_idx" ON "Document"("status");
CREATE INDEX IF NOT EXISTS "Document_type_idx" ON "Document"("type");
CREATE INDEX IF NOT EXISTS "Document_authorId_idx" ON "Document"("authorId");
CREATE INDEX IF NOT EXISTS "Document_ownerId_idx" ON "Document"("ownerId");
CREATE INDEX IF NOT EXISTS "Document_createdAt_idx" ON "Document"("createdAt");
CREATE INDEX IF NOT EXISTS "DocumentVersion_documentId_idx" ON "DocumentVersion"("documentId");
CREATE INDEX IF NOT EXISTS "DocumentPermission_documentId_idx" ON "DocumentPermission"("documentId");
CREATE INDEX IF NOT EXISTS "DocumentPermission_userId_idx" ON "DocumentPermission"("userId");
CREATE INDEX IF NOT EXISTS "DocumentShare_documentId_idx" ON "DocumentShare"("documentId");
CREATE INDEX IF NOT EXISTS "DocumentShare_sharedWith_idx" ON "DocumentShare"("sharedWith");
CREATE INDEX IF NOT EXISTS "DocumentTemplate_tenantId_idx" ON "DocumentTemplate"("tenantId");

-- Full-text search index
CREATE INDEX IF NOT EXISTS "Document_title_content_fts_idx" ON "Document" USING GIN (to_tsvector('english', "title" || ' ' || "content"));
