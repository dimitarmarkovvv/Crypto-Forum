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
    created_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
    select
        p.id,
        p.title,
        pr.username as author,
        p.created_at
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
        count(c.id) as comment_count
    from public.posts p
    join public.profiles pr
        on pr.id = p.author_id
    left join public.comments c
        on c.post_id = p.id
    group by
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
-- Returns profiles matching username, email, or first+last name

create or replace function public.search_users(search_term text)
returns table (
    id uuid,
    username text,
    first_name text,
    last_name text,
    email text,
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
        p.email,
        p.avatar_url
    from public.profiles p
    where
        p.username ilike '%' || search_term || '%'
        or p.email ilike '%' || search_term || '%'
        or (p.first_name || ' ' || p.last_name) ilike '%' || search_term || '%'
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
