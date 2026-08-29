# AI Gateway Module

## Purpose

Acts as the centralized abstraction for AI model access across providers and tenants.

## API

- `GET /ai-gateway/health`
- `POST /ai-gateway/generate`

## Notes

This module is designed to be provider-agnostic and can be extended to OpenAI, Azure OpenAI, and additional model providers.
