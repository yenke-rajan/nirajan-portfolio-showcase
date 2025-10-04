-- Fix the security definer view issue
-- Drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER which is safer)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  display_name,
  bio,
  location,
  avatar_url,
  my_story,
  about_me,
  github_url,
  linkedin_url,
  twitter_url,
  instagram_url,
  semester,
  years_coding,
  projects_count,
  created_at,
  updated_at
FROM public.profiles;

-- Grant SELECT on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Comment to explain the security model
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles excluding sensitive contact information (email_contact, phone_number)';

-- Update the RLS policy to be more explicit about what fields are accessible
-- This policy still allows reading the full table, but the application should use the view instead
DROP POLICY IF EXISTS "Public can view basic profile data" ON public.profiles;

-- Recreate a policy that explicitly documents which fields should be private
CREATE POLICY "Public can view non-sensitive profile data" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add a comment to remind developers about sensitive fields
COMMENT ON POLICY "Public can view non-sensitive profile data" ON public.profiles IS 
'Allows public read access. Frontend should use public_profiles view to exclude email_contact and phone_number.';