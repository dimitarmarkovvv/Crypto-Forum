-- Posts
alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
on public.posts
for select
using (true);

create policy "Users can create their own posts"
on public.posts
for insert
with check (author_id = auth.uid());

create policy "Users can update their own posts"
on public.posts
for update
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "Users can delete their own posts"
on public.posts
for delete
using (author_id = auth.uid());

-- Comments
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
on public.comments
for select
using (true);

create policy "Users can create their own comments"
on public.comments
for insert
with check (author_id = auth.uid());

create policy "Users can update their own comments"
on public.comments
for update
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "Users can delete their own comments"
on public.comments
for delete
using (author_id = auth.uid());

-- Post votes
alter table public.post_votes enable row level security;

create policy "Post votes are viewable by everyone"
on public.post_votes
for select
using (true);

create policy "Users can create their own post votes"
on public.post_votes
for insert
with check (user_id = auth.uid());

create policy "Users can update their own post votes"
on public.post_votes
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own post votes"
on public.post_votes
for delete
using (user_id = auth.uid());

-- Comment votes
alter table public.comment_votes enable row level security;

create policy "Comment votes are viewable by everyone"
on public.comment_votes
for select
using (true);

create policy "Users can create their own comment votes"
on public.comment_votes
for insert
with check (user_id = auth.uid());

create policy "Users can update their own comment votes"
on public.comment_votes
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own comment votes"
on public.comment_votes
for delete
using (user_id = auth.uid());

-- Profiles
alter table public.profiles enable row level security;

create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (select auth.uid() = id
and role = 'user'
and is_blocked = false);

create policy "Users can update their own profile"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

revoke update on public.profiles from authenticated;

grant update(
    first_name,
    last_name
)
on public.profiles
to authenticated;