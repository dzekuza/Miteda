-- ============================================================
-- Miteda — Row Level Security policies (org-scoped)
-- ============================================================

-- Helper: get current user's role
create or replace function current_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper: get current user's organization_id
create or replace function current_user_org()
returns uuid as $$
  select organization_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper: get current user's building_id
create or replace function current_user_building()
returns uuid as $$
  select building_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- ---- organizations ----
alter table organizations enable row level security;
create policy org_read on organizations for select
  using (id = current_user_org());

-- ---- buildings ----
alter table buildings enable row level security;
create policy buildings_read on buildings for select
  using (
    organization_id = current_user_org()
    or id = current_user_building()
  );
create policy buildings_write on buildings for all
  using (
    organization_id = current_user_org()
    and current_user_role() = 'admin'
  );

-- ---- units ----
alter table units enable row level security;
create policy units_read on units for select
  using (
    building_id in (select id from buildings where organization_id = current_user_org())
    or building_id = current_user_building()
  );

-- ---- profiles ----
alter table profiles enable row level security;
create policy profiles_own on profiles for select
  using (id = auth.uid() or organization_id = current_user_org());
create policy profiles_update_own on profiles for update
  using (id = auth.uid());

-- ---- defects ----
alter table defects enable row level security;
create policy defects_read on defects for select
  using (
    building_id = current_user_building()
    or (current_user_role() in ('admin', 'statyba')
        and building_id in (select id from buildings where organization_id = current_user_org()))
  );
create policy defects_insert on defects for insert
  with check (author_id = auth.uid());
create policy defects_update on defects for update
  using (current_user_role() in ('admin', 'statyba'));

-- ---- defect_messages ----
alter table defect_messages enable row level security;
create policy defect_messages_read on defect_messages for select
  using (
    defect_id in (select id from defects where building_id = current_user_building())
    or defect_id in (
      select d.id from defects d
      join buildings b on b.id = d.building_id
      where b.organization_id = current_user_org()
      and current_user_role() in ('admin', 'statyba')
    )
  );
create policy defect_messages_insert on defect_messages for insert
  with check (author_id = auth.uid());

-- ---- contracts ----
alter table contracts enable row level security;
create policy contracts_read on contracts for select
  using (
    unit_id in (select id from units where id = (select unit_id from profiles where id = auth.uid()))
    or current_user_role() = 'admin'
  );
create policy contracts_update on contracts for update
  using (
    unit_id in (select id from units where id = (select unit_id from profiles where id = auth.uid()))
    or current_user_role() = 'admin'
  );

-- ---- contacts ----
alter table contacts enable row level security;
create policy contacts_read on contacts for select
  using (
    building_id = current_user_building()
    or organization_id = current_user_org()
  );
create policy contacts_write on contacts for all
  using (
    organization_id = current_user_org()
    and current_user_role() = 'admin'
  );

-- ---- events ----
alter table events enable row level security;
create policy events_read on events for select
  using (
    building_id = current_user_building()
    or organization_id = current_user_org()
  );
create policy events_write on events for all
  using (
    organization_id = current_user_org()
    and current_user_role() = 'admin'
  );

-- ---- bulletin_posts ----
alter table bulletin_posts enable row level security;
create policy bulletin_read on bulletin_posts for select
  using (building_id = current_user_building() or organization_id = current_user_org());
create policy bulletin_insert on bulletin_posts for insert
  with check (
    author_id = auth.uid()
    and building_id = current_user_building()
  );

-- ---- threads ----
alter table threads enable row level security;
create policy threads_read on threads for select
  using (building_id = current_user_building() or organization_id = current_user_org());
create policy threads_insert on threads for insert
  with check (author_id = auth.uid());

-- ---- thread_comments ----
alter table thread_comments enable row level security;
create policy thread_comments_read on thread_comments for select
  using (
    thread_id in (
      select id from threads
      where building_id = current_user_building()
         or organization_id = current_user_org()
    )
  );
create policy thread_comments_insert on thread_comments for insert
  with check (author_id = auth.uid());

-- ---- repair_projects ----
alter table repair_projects enable row level security;
create policy repair_projects_read on repair_projects for select
  using (
    unit_id in (select id from units where id = (select unit_id from profiles where id = auth.uid()))
    or organization_id = current_user_org()
    or manager_id = auth.uid()
  );
create policy repair_projects_write on repair_projects for all
  using (
    organization_id = current_user_org()
    and current_user_role() in ('admin', 'statyba')
  );

-- ---- repair_updates ----
alter table repair_updates enable row level security;
create policy repair_updates_read on repair_updates for select
  using (
    project_id in (select id from repair_projects
      where unit_id = (select unit_id from profiles where id = auth.uid())
         or organization_id = current_user_org()
         or manager_id = auth.uid())
  );
create policy repair_updates_insert on repair_updates for insert
  with check (author_id = auth.uid() and current_user_role() in ('admin', 'statyba'));

-- ---- broadcasts ----
alter table broadcasts enable row level security;
create policy broadcasts_read on broadcasts for select
  using (
    building_id = current_user_building()
    or organization_id = current_user_org()
  );
create policy broadcasts_write on broadcasts for all
  using (
    organization_id = current_user_org()
    and current_user_role() in ('admin', 'statyba')
  );

-- ---- photos ----
alter table photos enable row level security;
create policy photos_read on photos for select
  using (
    building_id = current_user_building()
    or organization_id = current_user_org()
  );
create policy photos_insert on photos for insert
  with check (
    organization_id = current_user_org()
    and current_user_role() in ('admin', 'statyba')
  );
