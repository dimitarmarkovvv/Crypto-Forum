import { supabase } from "../supabase/supabaseClient";

export const getPosts = async ({
  page = 1,
  pageSize = 10,
  search = '',
  sort = 'newest',
  authorID = null,
} = {}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('posts')
    .select('*, profiles(username)')

  if (search.trim()) {
    query = query.ilike('title', `${search.trim()}%`)
  }

  if (authorID) {
    query = query.eq('author_id', authorID)
  }

  query = query
    .order('created_at', {
      ascending: sort === 'oldest',
    })
    .range(from, to)

  const { data, error } = await query

  if (error) {
    throw error;
  };

  return data ?? [];
};

export const createPost = async ({ title, content }, authorID) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title: title, content: content, author_id: authorID })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const updatePost = async (postId, { title, content }) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ title: title, content: content })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const deletePost = async (postId) => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data ?? null;
};

export const getPostById = async (id) => {
  const {data, error} = await supabase
  .from('posts')
  .select('*, profiles(username)')
  .eq('id', id)
  .single();

  if(error){
    throw error;
  };

  return data;
};