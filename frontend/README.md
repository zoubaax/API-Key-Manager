# Smart API Gateway Frontend

React frontend for authentication and role-based access using Supabase.

## Features

- Email/password signup and login
- Google OAuth login with Supabase
- Session persistence across refreshes
- Role loading from the `profiles` table
- Protected routes for authenticated users and admins
- JWT-aware backend requests
- TailwindCSS-powered UI

## Environment variables

Create a `.env` file based on `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BACKEND_URL=http://localhost:3000
```

## Run

```bash
npm install
npm run dev
```

## Important notes

- Enable Google in Supabase Auth if you want OAuth login.
- Add your frontend URL to Supabase allowed redirect URLs.
- Backend calls use `Authorization: Bearer <token>` automatically.
