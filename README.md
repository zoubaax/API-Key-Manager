# Smart API Gateway Auth Backend

This project provides a modular Express backend connected to Supabase Auth and PostgreSQL.

## Features

- Email/password registration and login
- Google OAuth entrypoint through Supabase
- Supabase JWT verification middleware
- Role-based access control using a `profiles` table
- Protected routes for authenticated users and admins
- Rate limiting on auth routes
- Simple logging for login attempts

## Project Structure

```text
controllers/
middleware/
routes/
services/
supabase/
app.js
server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase values.

3. Run the SQL in [supabase/schema.sql](D:\dev\API Key Manager\supabase\schema.sql) inside the Supabase SQL editor.

4. In your Supabase dashboard, enable Google as an auth provider if you want OAuth.

5. Add the callback URL to Supabase Auth settings:

```text
http://localhost:3000/auth/callback
```

## Start

```bash
npm run dev
```

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/google`
- `GET /auth/callback`
- `POST /auth/logout`
- `GET /dashboard`
- `GET /admin`

## Notes

- `SUPABASE_SERVICE_ROLE_KEY` is used only on the backend. Never expose it in any frontend app.
- `verifyToken` reads the Supabase JWT from the `Authorization: Bearer <token>` header.
- `requireRole("admin")` restricts admin-only routes using the role stored in `profiles`.
