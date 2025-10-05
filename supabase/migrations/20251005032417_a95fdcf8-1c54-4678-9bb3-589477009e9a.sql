-- Make phone_number and email_contact public as intended
-- Drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view WITH phone_number and email_contact
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
  phone_number,
  email_contact,
  created_at,
  updated_at
FROM public.profiles;

-- Grant SELECT on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Update comment
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles including contact information for portfolio display';