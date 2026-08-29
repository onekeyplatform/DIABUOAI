# RBAC Module

## Overview

Provides tenant-scoped role and permission governance for application access control.

## Roles

- owner
- admin
- manager
- member

## Permissions

- users.read
- users.write
- tenants.read
- tenants.write
- roles.manage
- audit.read
- billing.read
- billing.write

## API

- `GET /rbac/roles?tenantId=...`
- `POST /rbac/roles/assign`
- `GET /rbac/permissions/:userId?permission=...`

## Notes

This module is designed to support a secure, enterprise multi-tenant authorization model and can be expanded with fine-grained resource policies.
