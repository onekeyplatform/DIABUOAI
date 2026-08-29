# Organization & Multi-Tenant Module

## Purpose

Provides the core tenant abstraction for the platform so users, roles, settings, billing, and business data can be isolated per organization.

## Domain model

- `Tenant` is the top-level organization container.
- Each tenant has a unique slug and lifecycle status.
- Users belong to exactly one tenant.

## API

- `GET /organizations`
- `GET /organizations/:id`
- `POST /organizations`
- `PUT /organizations/:id`

## Notes

This module is foundational and is required by every subsequent domain. It is intentionally designed to support enterprise multi-tenancy, tenant settings, and future per-tenant configuration.
