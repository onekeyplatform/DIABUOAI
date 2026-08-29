/**
 * Embeddings generation using OpenAI SDK
 * In production, use @openai/sdk to call the embeddings API
 */

export interface EmbeddingResult {
  embedding: number[];
  tokenCount: number;
  model: string;
}

const EMBEDDING_DIMENSION = 1536; // text-embedding-3-small default

/**
 * Generate embeddings for text using OpenAI API
 * In production, call actual OpenAI API
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  // Simulate OpenAI embedding generation
  // In production: const client = new OpenAI(); await client.embeddings.create(...)

  // Create a deterministic embedding based on text hash
  const embedding = generateMockEmbedding(text);
  const tokenCount = Math.ceil(text.length / 4); // Rough approximation

  return {
    embedding,
    tokenCount,
    model: 'text-embedding-3-small',
  };
}

/**
 * Generate mock embeddings for development/testing
 * Replace with real OpenAI API calls in production
 */
function generateMockEmbedding(text: string): number[] {
  const embedding = new Array(EMBEDDING_DIMENSION).fill(0);

  // Simple hash-based generation for determinism
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Fill embedding with pseudo-random values seeded by hash
  let seed = hash;
  for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    embedding[i] = (seed / 233280) * 2 - 1; // Range [-1, 1]
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / magnitude);
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Batch generate embeddings for multiple texts
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<EmbeddingResult[]> {
  return Promise.all(texts.map((text) => generateEmbedding(text)));
}
