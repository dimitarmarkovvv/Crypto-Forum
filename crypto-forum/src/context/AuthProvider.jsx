import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../supabase/supabaseClient';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const authUser = data.session?.user ?? null;
      setUser(authUser);

      if (error) {
        console.error('Failed to get session:', error.message);
      }

      if(authUser){
        const {data : profileData} = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange( async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .single();

          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user,profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}