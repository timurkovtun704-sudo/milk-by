import { supabase } from '../config/supabase.js';

export const checkSupabaseConnection = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};