import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../supabase/supabaseClient';
import { useProfileSubscription } from '../hooks/useProfileSubscription';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  useProfileSubscription(user?.id, setProfile);

  const fetchProfile = async (userId) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfile(profileData);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      const authUser = data.session?.user ?? null;

      setUser(authUser);

      if (error) {
        console.error(
          'Failed to get session:',
          error.message
        );
      }

      if (authUser) {
        await fetchProfile(authUser.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;

        setUser(authUser);

        if (authUser) {
          await fetchProfile(authUser.id);
        } else {
          setProfile(null);
        }

      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}