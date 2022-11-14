import { createClient } from "@supabase/supabase-js";

//import { SUPABASE_KEY, SUPABASE_URL } from "./config";

export const supabase = createClient('https://ppwfbmodhrkhvlbawjba.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwd2ZibW9kaHJraHZsYmF3amJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTg5MzM1MTUsImV4cCI6MTk3NDUwOTUxNX0.BcDjL_2inapFq7w7WyfiEGwr2kycg91h9cQ8QfhkbPw');