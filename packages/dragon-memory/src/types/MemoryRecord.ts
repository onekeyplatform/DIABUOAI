export interface MemoryRecord {
  id: string;
  timestamp: Date;

  source: string;
  category: string;

  content: unknown;

  tags: string[];
}