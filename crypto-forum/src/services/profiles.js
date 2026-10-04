import { supabase } from "../supabase/supabaseClient";

export const updateProfile = async (userId, { first_name, last_name, location, signature, gender }) => {
    const { data, error } = await supabase
    .from('profiles')
    .update({first_name, last_name, location, signature, gender})
    .eq('id', userId)
    .select()
    .single();

    if(error){
        throw error;
    };

    return data ?? null;
};

export const uploadAvatar = async (userId, file, oldPath = null) => {
  if (oldPath) {
    await supabase.storage.from('avatars').remove([oldPath]);
  };

  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file);

  if (uploadError) {
    throw uploadError;
  };

  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: path })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  };

  return data ?? null;
};

export const getAvatarUrl = (path) => {
  if (!path) return null;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};

export const searchUsers = async (searchTerm) => {
  const {data, error} = await supabase.rpc('search_users', {search_term: searchTerm});

  if(error){
    throw error;
  };

  return data ?? [];
};

export const promoteUser = async (targetUserId, newRole) => {
  const {data, error} = await supabase.rpc('promote_user', { target_user_id: targetUserId, new_role: newRole });

  if(error){
    throw error;
  };

  return data ?? null;
};

export const getUserProfileById = async (userId) => {

  if(!isValidUuid(userId)){
    return null;
  }
  
  const {data, error } = await supabase
  .from('profiles')
  .select(`id,
    username,
    first_name,
    last_name,
    avatar_url,
    location,
    signature,
    gender,
    role,
    created_at
    `)
    .eq('id', userId)
    .maybeSingle();

    if(error) {
      throw error;
    }

    return data
}

export const adminSearchUsers = async (searchTerm = '') => {
  const {data, error } = await supabase.rpc(
    'admin_search_users',
    {
      search_term: searchTerm,
    }
  )

  if(error) {
    throw error;
  }

  return data ?? [];
}

const isValidUuid = (value) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}