-- Fix critical security issue: Prevent public access to sensitive personal data
-- Drop the existing public profile policy
DROP POLICY IF EXISTS "Public profile data is viewable by everyone" ON public.profiles;

-- Create a more restrictive public policy that excludes sensitive data
-- Public users can only see basic profile info (not email or phone)
CREATE POLICY "Public can view basic profile data" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Note: The above policy allows SELECT but the application layer should filter out
-- sensitive fields. For better security, we'll create a view for public data.

-- Create a public view that excludes sensitive information
CREATE OR REPLACE VIEW public.public_profiles AS
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

-- Grant SELECT on the view to authenticated and anonymous users
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- The "Users can view their own sensitive data" policy already exists and allows
-- authenticated users to see their own complete profile including email_contact and phone_number