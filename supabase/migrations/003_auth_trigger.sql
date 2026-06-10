-- ============================================================
-- Miteda — Auth trigger: auto-create profile on sign-up
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, organization_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'role', 'gyventojas'),
    (new.raw_user_meta_data->>'organization_id')::uuid
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
