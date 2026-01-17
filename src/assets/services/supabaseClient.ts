import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase'


const supabaseUrl =import.meta.env.VITE_API_SUPA;
const supabaseAnonKey= import.meta.env.VITE_KEY_SUPA;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export default supabase;