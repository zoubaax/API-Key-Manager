create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  provider text not null,
  key_value text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_owner_id on public.projects (owner_id);
create index if not exists idx_api_keys_project_id on public.api_keys (project_id);
