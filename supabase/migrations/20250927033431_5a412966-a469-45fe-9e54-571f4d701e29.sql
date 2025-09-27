-- Add new columns to profiles table for the requested features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS my_story TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;