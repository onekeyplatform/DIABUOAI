# Authentication Module

## Purpose

Provides secure login, registration, JWT issuance, and refresh token handling for the multi-tenant platform.

## Components

- `AuthController`: exposes `POST /auth/register`, `POST /auth/login`, and `POST /auth/refresh`
- `AuthService`: handles user creation, password validation, and JWT issuance
- `PrismaService`: database access for user, tenant, and token records

## Security notes

- Passwords are hashed with bcrypt
- JWT signing uses a configured secret
- Refresh tokens are persisted and validated per user and tenant

## Extension points

- OAuth Google / Microsoft integration
- MFA and password reset workflows
- structured audit logging
