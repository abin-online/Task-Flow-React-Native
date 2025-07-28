import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/constants/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = SUPABASE_URL as string
const supabaseAnonKey = SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
