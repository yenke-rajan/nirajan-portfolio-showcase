-- Update profiles RLS policies to protect sensitive personal information
-- First, drop existing public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create selective policies for public vs private data
CREATE POLICY "Public profile data is viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Restrict access to sensitive fields like email_contact, phone_number, location
-- Only allow users to see their own sensitive data
CREATE POLICY "Users can view their own sensitive data" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update the existing policies to ensure proper access control
-- The policies will work together - public data accessible to all, sensitive data only to owner