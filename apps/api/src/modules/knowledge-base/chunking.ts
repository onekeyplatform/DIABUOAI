/**
 * Document chunking strategy with semantic awareness
 */

export interface Chunk {
  content: string;
  index: number;
  startOffset: number;
  endOffset: number;
}

const DEFAULT_CHUNK_SIZE = 512;
const DEFAULT_OVERLAP = 50;

export function chunkDocument(
  text: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  overlap: number = DEFAULT_OVERLAP,
): Chunk[] {
  const chunks: Chunk[] = [];
  let currentIndex = 0;
  let offset = 0;

  while (offset < text.length) {
    const endOffset = Math.min(offset + chunkSize, text.length);
    const chunk = text.slice(offset, endOffset);

    if (chunk.trim().length > 0) {
      chunks.push({
        content: chunk,
        index: currentIndex,
        startOffset: offset,
        endOffset: endOffset,
      });
      currentIndex++;
    }

    offset += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Semantic chunking by sentences (more advanced)
 */
export function semanticChunk(
  text: string,
  maxChunkSize: number = DEFAULT_CHUNK_SIZE,
): Chunk[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: Chunk[] = [];
  let currentChunk = '';
  let currentIndex = 0;
  let startOffset = 0;

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push({
        content: currentChunk.trim(),
        index: currentIndex,
        startOffset,
        endOffset: startOffset + currentChunk.length,
      });
      currentIndex++;
      currentChunk = sentence;
      startOffset += currentChunk.length;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      index: currentIndex,
      startOffset,
      endOffset: startOffset + currentChunk.length,
    });
  }

  return chunks;
}
