import { useEffect } from 'react';
import { supabase } from './supabase/supabaseClient';

function App() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      console.log('Supabase connected:', data);
    };

    testConnection();
  }, []);

  return (
    <div>
      <h1>Crypto Forum</h1>
    </div>
  );
}

export default App;