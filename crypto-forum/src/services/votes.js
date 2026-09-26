import { supabase } from "../supabase/supabaseClient";

export const castVote = async (postId, userId, voteValue) => {
    const { data, error } = await supabase
    .from('post_votes')
    .upsert(
        { post_id: postId, user_id: userId, vote: voteValue },
        { onConflict: 'post_id,user_id' }
    );
    
    if(error) {
        throw error;
    };

    return data ?? null;
};

export const getPostVotes = async (postId, userId) => {
  const { data, error } = await supabase
    .from('post_votes')
    .select('vote, user_id')
    .eq('post_id', postId);

  if (error) {
    throw error;
  }

  const score = data.reduce((sum, row) => sum + row.vote, 0);
  const userVote = data.find((row) => row.user_id === userId)?.vote ?? 0;

  return { score, userVote };
};

export const removeVote = async (postId, userId) => {
  const { data, error } = await supabase
    .from('post_votes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data ?? null;
};