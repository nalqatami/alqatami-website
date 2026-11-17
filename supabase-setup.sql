-- Al-Qatami Family Legacy: database for the site when it runs on its own domain.
-- Paste all of this into Supabase, SQL Editor, then press Run. Change the email on the next line first.
create or replace function public.aq_owner() returns boolean language sql stable as $$
  select lower(coalesce(auth.jwt()->>'email','')) in ('nooralqatami@gmail.com')
$$;

create table if not exists public.docs (
  coll text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (coll, id)
);
alter table public.docs enable row level security;

-- Approved changes: everyone can read, only the owner can write.
drop policy if exists approved_read on public.docs;
create policy approved_read on public.docs for select using (coll = 'approved' or aq_owner() or (coll in ('suggestions','profiles') and id = auth.uid()::text));
drop policy if exists owner_all on public.docs;
create policy owner_all on public.docs for all using (aq_owner()) with check (aq_owner());
-- Family members can write only their own request list and their own name.
drop policy if exists self_insert on public.docs;
create policy self_insert on public.docs for insert with check (coll in ('suggestions','profiles') and id = auth.uid()::text);
drop policy if exists self_update on public.docs;
create policy self_update on public.docs for update using (coll in ('suggestions','profiles') and id = auth.uid()::text) with check (coll in ('suggestions','profiles') and id = auth.uid()::text);

-- Photos and scans people attach: public to view, signed in family can add, owner can remove.
insert into storage.buckets (id, name, public) values ('assets','assets', true) on conflict (id) do nothing;
drop policy if exists aq_assets_add on storage.objects;
create policy aq_assets_add on storage.objects for insert to authenticated with check (bucket_id = 'assets');
drop policy if exists aq_assets_owner on storage.objects;
create policy aq_assets_owner on storage.objects for delete using (bucket_id = 'assets' and aq_owner());
