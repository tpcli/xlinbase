// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vmhxclootvygyvbkmluf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaHhjbG9vdHZ5Z3l2YmttbHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjY5MjYsImV4cCI6MjA1ODg0MjkyNn0.2i4T6aCecTd6wodacmrykl6tOQoL4iIzU4Y8CE-3WR0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
