create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    username text not null unique,
    first_name text not null,
    last_name text not null,
    email text not null unique,

    role text not null default 'user',

    is_blocked boolean not null default false,

    created_at timestamptz not null default now(),

    constraint first_name_length
        check (char_length(first_name) between 4 and 32),

    constraint last_name_length
        check (char_length(last_name) between 4 and 32)
);
create table public.posts (
    id uuid primary key default gen_random_uuid(),

    author_id uuid not null
        references public.profiles(id)
        on delete cascade,

    title text not null,
    content text not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint post_title_length
        check (char_length(title) between 16 and 64),

    constraint post_content_length
        check (char_length(content) between 32 and 8192)
);
create table public.comments (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null
        references public.posts(id)
        on delete cascade,

    author_id uuid not null
        references public.profiles(id)
        on delete cascade,

    parent_comment_id uuid
        references public.comments(id),

    content text not null
        check (char_length(trim(content)) > 0),

    is_deleted boolean not null default false,
    deleted_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create table public.post_votes (
    id uuid primary key default gen_random_uuid(),

    post_id uuid not null
        references public.posts(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    vote smallint not null
        check (vote in (-1, 1)),

    created_at timestamptz not null default now(),

    constraint unique_post_vote
        unique (post_id, user_id)
);

create table public.comment_votes (
    id uuid primary key default gen_random_uuid(),

    comment_id uuid not null
        references public.comments(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    vote smallint not null
        check (vote in (-1, 1)),

    created_at timestamptz not null default now(),

    constraint unique_comment_vote
        unique (comment_id, user_id)
);

alter table public.profiles
    add column avatar_url text,
    add column location text,
    add column signature text,
    add column gender text,

    add constraint location_length
        check (char_length(location) between 4 and 64),

    add constraint signature_length
        check (char_length(signature) <= 100),

    add constraint gender_values
        check (gender in ('male', 'female'));

alter table public.profiles
    drop constraint profiles_role_check;

alter table public.profiles
    add constraint profiles_role_check
        check (role in ('user', 'moderator', 'admin'));