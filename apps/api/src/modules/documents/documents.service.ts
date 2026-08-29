import { Injectable } from '@nestjs/common';
import {
  CreateDocumentInput,
  Document,
  DocumentPermission,
  DocumentPermissionEntry,
  DocumentSearchFilters,
  DocumentShare,
  DocumentTemplate,
  DocumentVersion,
  UpdateDocumentInput,
} from './documents.types';

@Injectable()
export class DocumentsService {
  private documents: Map<string, Document> = new Map();
  private versions: Map<string, DocumentVersion> = new Map();
  private permissions: Map<string, DocumentPermissionEntry> = new Map();
  private shares: Map<string, DocumentShare> = new Map();
  private templates: Map<string, DocumentTemplate> = new Map();
  private idCounter = 0;

  /**
   * Create a new document
   */
  async createDocument(input: CreateDocumentInput): Promise<Document> {
    const docId = `doc-${++this.idCounter}`;

    const document: Document = {
      id: docId,
      tenantId: input.tenantId,
      title: input.title,
      description: input.description,
      content: input.content,
      type: input.type,
      status: 'draft',
      authorId: input.authorId,
      ownerId: input.ownerId,
      fileSize: input.content.length,
      wordCount: this.countWords(input.content),
      tags: input.tags,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.documents.set(docId, document);

    // Create initial version
    await this.createVersion(docId, {
      id: `ver-${++this.idCounter}`,
      documentId: docId,
      versionNumber: 1,
      title: document.title,
      content: document.content,
      authorId: input.authorId,
      createdAt: new Date(),
    });

    return document;
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId: string, tenantId: string): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    // Increment view count
    doc.viewCount++;
    doc.updatedAt = new Date();

    return doc;
  }

  /**
   * List documents with filtering
   */
  async listDocuments(filters: DocumentSearchFilters): Promise<Document[]> {
    let results = Array.from(this.documents.values()).filter((d) => d.tenantId === filters.tenantId);

    if (filters.type) {
      results = results.filter((d) => d.type === filters.type);
    }

    if (filters.status) {
      results = results.filter((d) => d.status === filters.status);
    }

    if (filters.authorId) {
      results = results.filter((d) => d.authorId === filters.authorId);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((d) => d.tags && filters.tags!.some((t) => d.tags!.includes(t)));
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q),
      );
    }

    if (filters.dateFrom) {
      results = results.filter((d) => d.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      results = results.filter((d) => d.createdAt <= filters.dateTo!);
    }

    // Sort by most recent first
    results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const offset = filters.offset || 0;
    const limit = filters.limit || 20;

    return results.slice(offset, offset + limit);
  }

  /**
   * Update document
   */
  async updateDocument(
    documentId: string,
    tenantId: string,
    input: UpdateDocumentInput,
    userId: string,
  ): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    // Check permission
    if (doc.ownerId !== userId && !(await this.hasPermission(documentId, userId, 'edit'))) {
      return null;
    }

    const oldContent = doc.content;

    // Update fields
    if (input.title) doc.title = input.title;
    if (input.description !== undefined) doc.description = input.description;
    if (input.content) doc.content = input.content;
    if (input.status) doc.status = input.status;
    if (input.tags) doc.tags = input.tags;

    doc.fileSize = doc.content.length;
    doc.wordCount = this.countWords(doc.content);
    doc.updatedAt = new Date();

    // Create version if content changed
    if (input.content && input.content !== oldContent) {
      await this.createVersion(documentId, {
        id: `ver-${++this.idCounter}`,
        documentId,
        versionNumber: (await this.getLatestVersion(documentId))?.versionNumber! + 1 || 1,
        title: doc.title,
        content: doc.content,
        authorId: userId,
        createdAt: new Date(),
      });
    }

    return doc;
  }

  /**
   * Publish document
   */
  async publishDocument(documentId: string, tenantId: string, userId: string): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    if (doc.ownerId !== userId) return null;

    doc.status = 'published';
    doc.publishedAt = new Date();
    doc.updatedAt = new Date();

    return doc;
  }

  /**
   * Archive document
   */
  async archiveDocument(documentId: string, tenantId: string, userId: string): Promise<boolean> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return false;

    if (doc.ownerId !== userId) return false;

    doc.status = 'archived';
    doc.updatedAt = new Date();

    return true;
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string, tenantId: string, userId: string): Promise<boolean> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return false;

    if (doc.ownerId !== userId) return false;

    this.documents.delete(documentId);

    // Delete related data
    for (const [id, ver] of this.versions) {
      if (ver.documentId === documentId) {
        this.versions.delete(id);
      }
    }

    for (const [id, perm] of this.permissions) {
      if (perm.documentId === documentId) {
        this.permissions.delete(id);
      }
    }

    for (const [id, share] of this.shares) {
      if (share.documentId === documentId) {
        this.shares.delete(id);
      }
    }

    return true;
  }

  /**
   * Get document versions
   */
  async getVersions(documentId: string, tenantId: string): Promise<DocumentVersion[]> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return [];

    return Array.from(this.versions.values())
      .filter((v) => v.documentId === documentId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  /**
   * Restore document version
   */
  async restoreVersion(
    documentId: string,
    versionNumber: number,
    tenantId: string,
    userId: string,
  ): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    if (doc.ownerId !== userId) return null;

    const version = Array.from(this.versions.values()).find(
      (v) => v.documentId === documentId && v.versionNumber === versionNumber,
    );

    if (!version) return null;

    return this.updateDocument(
      documentId,
      tenantId,
      { content: version.content, title: version.title },
      userId,
    );
  }

  /**
   * Grant permission
   */
  async grantPermission(
    documentId: string,
    userId: string,
    permission: DocumentPermission,
    grantedBy: string,
    tenantId: string,
  ): Promise<DocumentPermissionEntry | null> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) return null;

    const permId = `perm-${++this.idCounter}`;
    const entry: DocumentPermissionEntry = {
      id: permId,
      documentId,
      userId,
      permission,
      grantedBy,
      grantedAt: new Date(),
    };

    this.permissions.set(permId, entry);
    return entry;
  }

  /**
   * Check if user has permission
   */
  async hasPermission(documentId: string, userId: string, requiredPermission: DocumentPermission): Promise<boolean> {
    const doc = this.documents.get(documentId);
    if (!doc) return false;

    // Owner has all permissions
    if (doc.ownerId === userId) return true;

    const perm = Array.from(this.permissions.values()).find(
      (p) => p.documentId === documentId && p.userId === userId,
    );

    if (!perm) return false;

    const permHierarchy = ['view', 'comment', 'edit', 'admin'];
    const requiredLevel = permHierarchy.indexOf(requiredPermission);
    const userLevel = permHierarchy.indexOf(perm.permission);

    return userLevel >= requiredLevel;
  }

  /**
   * Share document
   */
  async shareDocument(
    documentId: string,
    sharedWith: string,
    permission: DocumentPermission,
    expiresAt?: Date,
  ): Promise<DocumentShare | null> {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    const shareId = `share-${++this.idCounter}`;
    const share: DocumentShare = {
      id: shareId,
      documentId,
      sharedWith,
      permission,
      expiresAt,
      createdAt: new Date(),
    };

    this.shares.set(shareId, share);
    return share;
  }

  /**
   * Create document template
   */
  async createTemplate(
    tenantId: string,
    name: string,
    content: string,
    category: string,
  ): Promise<DocumentTemplate> {
    const templateId = `tmpl-${++this.idCounter}`;
    const template: DocumentTemplate = {
      id: templateId,
      tenantId,
      name,
      content,
      category,      description: '',      createdAt: new Date(),
    };

    this.templates.set(templateId, template);
    return template;
  }

  /**
   * List templates
   */
  async listTemplates(tenantId: string): Promise<DocumentTemplate[]> {
    return Array.from(this.templates.values()).filter((t) => t.tenantId === tenantId);
  }

  /**
   * Private helper: create version
   */
  private async createVersion(documentId: string, version: DocumentVersion): Promise<void> {
    this.versions.set(version.id, version);
  }

  /**
   * Private helper: get latest version
   */
  private async getLatestVersion(documentId: string): Promise<DocumentVersion | undefined> {
    return Array.from(this.versions.values())
      .filter((v) => v.documentId === documentId)
      .sort((a, b) => b.versionNumber - a.versionNumber)[0];
  }

  /**
   * Private helper: count words
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter((w) => w.length > 0).length;
  }
}
