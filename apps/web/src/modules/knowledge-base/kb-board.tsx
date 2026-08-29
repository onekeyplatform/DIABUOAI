import { DocumentUploader } from './document-uploader';
import { KnowledgeBaseSearch } from './kb-search';
import { DocumentList } from './document-list';

export function KnowledgeBaseBoard() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <DocumentUploader />
      <KnowledgeBaseSearch />
      <DocumentList />
    </div>
  );
}
