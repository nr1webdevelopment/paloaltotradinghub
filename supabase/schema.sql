-- ============================================================
-- PATH (Palo Alto Trading Hub) — Database schema
-- Run this in Supabase Studio → SQL Editor on a fresh project.
-- ============================================================

-- ─── 1. profiles ──────────────────────────────────────────────
-- One row per user. References auth.users (Supabase's built-in
-- auth table). RLS ensures each user only sees their own row.

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default '',
  email         text not null,
  onboarded     boolean not null default false,
  onboarding    jsonb default '{}'::jsonb,   -- {experience, goal, time, coding}
  digest_pref   text default 'Weekly',
  joined_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 2. lesson_progress ───────────────────────────────────────
-- One row per (user, lesson) marking it complete + when.

create table if not exists public.lesson_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   text not null,
  module_id   text not null,
  completed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users read own progress"   on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users delete own progress" on public.lesson_progress for delete using (auth.uid() = user_id);

-- ─── 3. quiz_scores ───────────────────────────────────────────
-- Latest score per (user, module).

create table if not exists public.quiz_scores (
  user_id    uuid not null references auth.users(id) on delete cascade,
  module_id  text not null,
  score      int not null,
  total      int not null,
  attempts   int not null default 1,
  taken_at   timestamptz default now(),
  primary key (user_id, module_id)
);

alter table public.quiz_scores enable row level security;

create policy "Users read own quiz scores"    on public.quiz_scores for select using (auth.uid() = user_id);
create policy "Users upsert own quiz scores"  on public.quiz_scores for insert with check (auth.uid() = user_id);
create policy "Users update own quiz scores"  on public.quiz_scores for update using (auth.uid() = user_id);

-- ─── 4. study_sessions (optional, lightweight time tracking) ──
create table if not exists public.study_sessions (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  minutes     int not null,
  recorded_at timestamptz default now()
);

alter table public.study_sessions enable row level security;
create policy "Users read own sessions"   on public.study_sessions for select using (auth.uid() = user_id);
create policy "Users insert own sessions" on public.study_sessions for insert with check (auth.uid() = user_id);

-- ─── helpful indexes ──────────────────────────────────────────
create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);
create index if not exists lesson_progress_module_idx on public.lesson_progress (user_id, module_id);
create index if not exists quiz_scores_user_idx on public.quiz_scores (user_id);
create index if not exists study_sessions_user_idx on public.study_sessions (user_id, recorded_at);
