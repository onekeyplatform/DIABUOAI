import { DocumentEditor } from './document-editor';
import { DocumentList } from './document-list';
import { DocumentVersions } from './document-versions';
import { DocumentSharing } from './document-sharing';

export function DocumentsBoard() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <DocumentEditor />
      <DocumentList />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DocumentVersions />
        <DocumentSharing />
      </div>
    </div>
  );
}
