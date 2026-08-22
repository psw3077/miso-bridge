import { createClient } from "@supabase/supabase-js";

const defaultUrl = "https://lqohxtvcpdwmtonsifga.supabase.co";
const defaultPublishableKey = "sb_publishable_Wxo0Tl7HSRjKss1RAnhbsg_v5xWN_kR";

const url = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || defaultPublishableKey;

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = createClient(url, key);
