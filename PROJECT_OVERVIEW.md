# Smart API Gateway (API Key Manager)

## Project Overview

Smart API Gateway is a backend system designed to manage and use multiple third-party API keys intelligently. Instead of letting clients call external APIs directly, all requests pass through this backend, which selects an appropriate API key, forwards the request, and automatically rotates to another key when the current one fails or exceeds its quota.

The main purpose of this system is to eliminate manual API key switching and provide a cleaner, safer, and more scalable way to work with rate-limited external services such as Google APIs and AI APIs.

## Core Idea

Clients communicate only with this backend. The backend is responsible for:

- Selecting an available API key from a managed pool
- Forwarding requests to external third-party APIs
- Detecting failures such as quota exhaustion or invalid key errors
- Automatically switching to another valid key when needed

This approach hides sensitive API keys from clients and centralizes usage control, tracking, and security.

## Target Users

- Developers working with APIs that enforce quotas or rate limits
- Small teams or individuals managing multiple API keys for the same provider

## Main Features

### 1. API Key Pool Management

- Store multiple API keys in a database
- Track each key's status, such as:
  - Active
  - Exhausted
  - Disabled

### 2. Smart Key Rotation

- Automatically choose a valid key before making an external request
- Retry with another key when a request fails because of:
  - Quota exceeded
  - Invalid key
  - Provider-side errors tied to a specific key

### 3. Proxy Layer

- All client traffic goes through the backend
- The backend forwards requests to the target external API
- Clients never see or manage the actual third-party API keys

### 4. Authentication System

Users can register and log in using:

- Email and password
- Google OAuth (optional)

Each user has a role:

- `user`
- `admin`

### 5. Role-Based Access Control

- Admins can manage API keys and system settings
- Regular users can consume the proxied API but cannot manage keys

### 6. Usage Tracking

- Track how many requests each API key makes
- Track how many requests each user makes
- Support visibility into usage, limits, and system behavior

### 7. Security

- Protect routes using JWT
- Verify Supabase-issued JWTs in the backend
- Never expose API keys to clients
- Keep security enforcement on the backend, not in the frontend

## Architecture

- Backend: Node.js with Express
- Database and Authentication: Supabase
  - PostgreSQL for data storage
  - Supabase Auth for authentication

The backend handles business logic, validates Supabase JWTs, applies access control, manages API key rotation, and communicates with external APIs.

## Engineering Priorities

- Modular and scalable structure
- Clean code with strong separation of concerns
- Graceful handling of errors such as rate limits and invalid keys
- Backend-enforced security
- Production-ready MVP mindset

## MVP Goal

The MVP should clearly demonstrate:

- API key rotation and failover
- Secure authentication
- Role-based access control
- Clean, maintainable backend architecture

## Summary

This project is a production-oriented backend MVP for smart API key management. It acts as a secure proxy between clients and third-party APIs, automatically handling key rotation, access control, authentication, and usage tracking while keeping the overall architecture clean and scalable.
