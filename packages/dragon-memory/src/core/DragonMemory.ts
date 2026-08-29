import { MemoryRecord } from "../types/MemoryRecord";

export class DragonMemory {
  private records: MemoryRecord[] = [];

  add(record: MemoryRecord) {
    this.records.push(record);
  }

  getAll(): MemoryRecord[] {
    return this.records;
  }

  search(category: string) {
    return this.records.filter(r => r.category === category);
  }

  clear() {
    this.records = [];
  }
}