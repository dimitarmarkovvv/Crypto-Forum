-- Auto-create profile row when a new auth user registers

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- Keep updated_at honest: the column defaults to now() on insert, but
-- nothing moved it afterwards, so an edited row still reported its
-- creation time.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;

create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.touch_updated_at();