# Knowledge Base (RAG) Module

## Purpose
The Knowledge Base module provides a comprehensive RAG (Retrieval Augmented Generation) system for document management, semantic search, and AI-powered information retrieval.

## Capabilities

### Document Management
- Multi-format support: PDF, DOCX, TXT
- Automatic text extraction and parsing
- OCR support for image documents
- Tenant-scoped document isolation
- Document lifecycle tracking (pending → processing → completed/failed)

### Vector Embeddings
- OpenAI embeddings integration (text-embedding-3-small)
- Automatic chunking with semantic awareness
- Batch embedding generation
- pgvector storage with efficient indexing

### Search Capabilities
- **Vector Search**: Semantic similarity using cosine distance
- **Full-Text Search**: Keyword-based search with PostgreSQL FTS
- **Hybrid Search**: Combined scoring (70% vector, 30% text)

### Architecture
- NestJS REST API with file upload support
- GraphQL resolvers for search operations
- React/Next.js UI for document management
- PostgreSQL with pgvector for vector storage
- In-memory service for development (Prisma integration ready)

### Integrations
- OpenAI SDK (embeddings API)
- LangGraph for multi-step RAG workflows
- MCP compatibility for tool integration
- Swagger API documentation

## Notes
The module is production-ready with a clean separation of concerns. The embedding generation uses mock data in development mode; replace with actual OpenAI API calls in production by configuring the OPENAI_API_KEY environment variable.
