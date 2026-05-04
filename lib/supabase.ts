import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FreebieSection {
  heading: string;
  content: string;
  prompts?: string[];
}

export interface Freebie {
  id: string;
  slug: string;
  title: string;
  reel_input: string;
  sections: FreebieSection[];
  whatsapp_link: string;
  cta_text: string;
  link_url: string | null;
  link_label: string | null;
  created_at: string;
}
