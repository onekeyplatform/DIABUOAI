export type DocumentStatus = 'draft' | 'review' | 'published' | 'archived';
export type DocumentType = 'page' | 'wiki' | 'guide' | 'policy' | 'template' | 'other';
export type DocumentPermission = 'view' | 'comment' | 'edit' | 'admin';

export interface Document {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  content: string;
  type: DocumentType;
  status: DocumentStatus;
  authorId: string;
  ownerId: string;
  parentDocumentId?: string;
  fileSize: number;
  wordCount: number;
  language?: string;
  tags?: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  title: string;
  content: string;
  changeDescription?: string;
  authorId: string;
  createdAt: Date;
}

export interface DocumentPermissionEntry {
  id: string;
  documentId: string;
  userId: string;
  permission: DocumentPermission;
  grantedBy: string;
  grantedAt: Date;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  sharedWith: string; // userId or groupId
  permission: DocumentPermission;
  expiresAt?: Date;
  createdAt: Date;
}

export interface DocumentTemplate {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  content: string;
  category: string;
  createdAt: Date;
}

export interface CreateDocumentInput {
  tenantId: string;
  title: string;
  description?: string;
  content: string;
  type: DocumentType;
  authorId: string;
  ownerId: string;
  tags?: string[];
  templateId?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  content?: string;
  status?: DocumentStatus;
  tags?: string[];
}

export interface DocumentSearchFilters {
  tenantId: string;
  query?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  authorId?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}
