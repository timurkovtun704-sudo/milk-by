
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase Auth environment variables are missing. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env'
  );
}

const authClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const loginUser = async (
  email: string,
  password: string
) => {
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error('Supabase session was not created');
  }

  return {
    user: data.user,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
};
