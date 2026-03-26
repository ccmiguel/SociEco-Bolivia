import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este cliente es el que sincroniza las cookies con el Middleware
export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
)