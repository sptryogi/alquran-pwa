import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = "https://egqzynlivqxpbvcmvwfm.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncXp5bmxpdnF4cGJ2Y212d2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2ODg0NTAsImV4cCI6MjA3NDI2NDQ1MH0.vPkvh4oJ0ArAtoYlqxW8P_FYpqr4AE43xf4Z4ebwi1U"
export const supabase = createClient(supabaseUrl, supabaseKey);
