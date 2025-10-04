-- Add stat fields to profiles table for About section
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS semester TEXT,
ADD COLUMN IF NOT EXISTS years_coding TEXT,
ADD COLUMN IF NOT EXISTS projects_count TEXT;