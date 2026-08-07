import { createClient } from "@supabase/supabase-js";

const defaultUrl = import.meta.env.VITE_SUPABASE_URL;
const defaultKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const params = new URLSearchParams(window.location.search);
const isContractPage =
  params.has("contracts") ||
  params.has("contract") ||
  window.location.pathname.startsWith("/contracts");

const contractUrl = "https://lqohxtvcpdwmtonsifga.supabase.co";
const contractKey = "sb_publishable_Wxo0Tl7HSRjKss1RAnhbsg_v5xWN_kR";

const url = isContractPage ? contractUrl : defaultUrl;
const key = isContractPage ? contractKey : defaultKey;

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;
