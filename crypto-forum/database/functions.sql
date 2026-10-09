-- Forum statistics
-- Returns total users, posts and comments

create or replace function public.get_forum_stats()
returns table (
    total_users bigint,
    total_posts bigint,
    total_comments bigint
)
language sql
security definer
set search_path = ''
as $$
    select
        (select count(*) from public.profiles) as total_users,
        (select count(*) from public.posts) as total_posts,
        (select count(*) from public.comments) as total_comments;
$$;

revoke all on function public.get_forum_stats() from public;

grant execute on function public.get_forum_stats()
to anon, authenticated;

-- Recent posts
-- Returns the 10 newest posts

create or replace function public.get_recent_posts()
returns table (
    id uuid,
    title text,
    author text,
    created_at timestamptz,
    author_id uuid
)
language sql
security definer
set search_path = ''
as $$
    select
        p.id,
        p.title,
        pr.username as author,
        p.created_at,
        pr.id as author_id
    from public.posts p
    join public.profiles pr
        on pr.id = p.author_id
    order by p.created_at desc
    limit 10;
$$;

revoke all on function public.get_recent_posts() from public;

grant execute on function public.get_recent_posts()
to anon, authenticated;

-- Most commented posts
-- Returns the 10 posts with the most comments

create or replace function public.get_most_commented_posts()
returns table (
    id uuid,
    title text,
    author text,
    created_at timestamptz,
    author_id uuid,
    comment_count bigint
)
language sql
security definer
set search_path = ''
as $$
    select
        p.id,
        p.title,
        pr.username as author,
        p.created_at,
        pr.id as author_id,
        count(c.id) as comment_count
    from public.posts p
    join public.profiles pr
        on pr.id = p.author_id
    left join public.comments c
        on c.post_id = p.id
    group by
        pr.id,
        p.id,
        p.title,
        pr.username,
        p.created_at
    order by
        count(c.id) desc,
        p.created_at desc
    limit 10;
$$;

revoke all on function public.get_most_commented_posts() from public;

grant execute on function public.get_most_commented_posts()
to anon, authenticated;

-- Search users
-- Returns profiles matching username or first+last name

create or replace function public.search_users(search_term text)
returns table (
    id uuid,
    username text,
    first_name text,
    last_name text,
    avatar_url text
)
language sql
security invoker
set search_path = ''
as $$
    select
        p.id,
        p.username,
        p.first_name,
        p.last_name,
        p.avatar_url
    from public.profiles p
    where
        p.username ilike '%' || search_term || '%'
        or (p.first_name || ' ' || p.last_name)
            ilike '%' || search_term || '%'
    limit 20;
$$;

revoke all on function public.search_users(text) from public;

grant execute on function public.search_users(text)
to authenticated;

-- Promote user role
-- Only callable successfully by admins

create or replace function public.promote_user(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    ) then
        raise exception 'Only admins can promote users.';
    end if;

    update public.profiles
    set role = new_role
    where id = target_user_id;
end;
$$;

revoke all on function public.promote_user(uuid, text) from public;

grant execute on function public.promote_user(uuid, text)
to authenticated;

create or replace function public.admin_search_users(search_term text default '')
returns table (
    id uuid,
    username text,
    first_name text,
    last_name text,
    email text,
    avatar_url text,
    role text,
    is_blocked boolean
)
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    ) then 
       raise exception 'Only admins can search users.';
       end if;
       
       return query
       select
          p.id,
          p.username,
          p.first_name,
          p.last_name,
          p.email,
          p.avatar_url,
          p.role,
          p.is_blocked
        from public.profiles p 
        where
          trim(search_term) = ''
          or p.username ilike '%' || trim(search_term) || '%'
          or p.email ilike '%' || trim(search_term) || '%'
          or (p.first_name || ' ' || p.last_name)
              ilike '%' || trim(search_term) || '%'
        order by p.username
        limit 50;
end;
$$;

revoke all
on function public.admin_search_users(text)
from public;

grant execute
on function public.admin_search_users(text)
to authenticated;

-- Block / unblock user
-- Only admins can change another user's blocked status

create or replace function public.set_user_blocked(
    target_user_id uuid,
    blocked boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'admin'
    ) then
        raise exception 'Only admins can block or unblock users.';
    end if;

    if target_user_id = auth.uid() then
        raise exception 'You cannot block your own account.';
    end if;

    if exists (
       select 1
       from public.profiles
       where id = target_user_id
         and role = 'admin'
    ) then
        raise exception 'Admins cannot block other admins.';
    end if;

    if not exists (
        select 1
        from public.profiles
        where id = target_user_id
    ) then
        raise exception 'User not found.';
    end if;

    update public.profiles
    set is_blocked = blocked
    where id = target_user_id;
end;
$$;

revoke all
on function public.set_user_blocked(uuid, boolean)
from public;

grant execute
on function public.set_user_blocked(uuid, boolean)
to authenticated;