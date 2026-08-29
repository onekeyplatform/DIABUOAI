# AI Agents Module

## Purpose

Provides the orchestration layer for AI assistants and domain-specific agents that operate within a tenant context.

## API

- `GET /ai-agents/:tenantId`
- `POST /ai-agents/run`

## Notes

This module is intentionally agent-oriented and can be expanded to LangGraph workflows, human review loops, and tool-augmented assistants.
