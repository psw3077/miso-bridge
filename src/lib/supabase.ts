import { createClient } from "@supabase/supabase-js";

const fallbackUrl = "https://lqohxtvcpdwmtonsifga.supabase.co";
const fallbackKey = "sb_publishable_Wxo0Tl7HSRjKss1RAnhbsg_v5xWN_kR";

const url = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || fallbackKey;

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;
