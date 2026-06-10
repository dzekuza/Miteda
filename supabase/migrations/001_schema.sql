-- ============================================================
-- Miteda — complete schema (multi-tenant)
-- ============================================================

-- Organizations (multi-tenant top level)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz default now()
);

-- Buildings & units --------------------------------------------------
create table buildings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  address text,
  units int default 0,
  sold int default 0,
  created_at timestamptz default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade,
  label text not null,
  floor int,
  area numeric,
  status text not null default 'free'  -- free | reserved | sold
);

-- People -------------------------------------------------------------
-- profiles extends Supabase auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id),
  name text,
  phone text,
  email text,
  role text not null default 'gyventojas',  -- gyventojas | admin | statyba
  building_id uuid references buildings(id),
  unit_id uuid references units(id)
);

-- Defects ------------------------------------------------------------
create table defects (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  unit_id uuid references units(id),
  room text,
  title text not null,
  description text,
  status text not null default 'open',  -- open | progress | resolved
  author_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table defect_messages (
  id uuid primary key default gen_random_uuid(),
  defect_id uuid references defects(id) on delete cascade,
  author_id uuid references profiles(id),
  role text,
  body text not null,
  created_at timestamptz default now()
);

-- Contracts, contacts, events ----------------------------------------
create table contracts (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id),
  service text,
  provider text,
  number text,
  monthly numeric,
  status text not null default 'pending'  -- signed | pending | action
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  name text,
  role text,
  company text,
  category text,
  phone text,
  email text
);

create table events (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  title text,
  starts_at timestamptz,
  place text,
  category text
);

-- Community ----------------------------------------------------------
create table bulletin_posts (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  author_id uuid references profiles(id),
  category text,
  title text,
  body text,
  price text,
  created_at timestamptz default now()
);

create table threads (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  author_id uuid references profiles(id),
  category text,
  title text,
  body text,
  created_at timestamptz default now()
);

create table thread_comments (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads(id) on delete cascade,
  author_id uuid references profiles(id),
  body text,
  created_at timestamptz default now()
);

-- Repair / construction ----------------------------------------------
create table repair_projects (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id),
  organization_id uuid references organizations(id),
  manager_id uuid references profiles(id),
  progress int default 0,
  phase text
);

create table repair_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references repair_projects(id) on delete cascade,
  author_id uuid references profiles(id),
  body text,
  notify_owner bool default false,
  created_at timestamptz default now()
);

create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  author_id uuid references profiles(id),
  title text,
  body text,
  created_at timestamptz default now()
);

create table broadcast_recipients (
  broadcast_id uuid references broadcasts(id) on delete cascade,
  unit_id uuid references units(id)
);

-- Photos (Supabase Storage bucket "photos" + this index) -------------
create table photos (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  organization_id uuid references organizations(id),
  album text,
  storage_path text,
  created_at timestamptz default now()
);
