import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase'

const supabaseUrl = 'https://edpanvpebopejvrmnhse.supabase.co';
const supabaseAnonKey ='sb_publishable_8lFrJgmRllI8Inabrk8d_g_wAC92a8G';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export default supabase;