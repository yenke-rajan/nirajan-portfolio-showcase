-- Remove education column and add phone number column to profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS education;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number text;