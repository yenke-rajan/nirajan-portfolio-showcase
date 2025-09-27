-- Create skills table for managing skills in admin dashboard
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'technical',
  proficiency_level INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills
CREATE POLICY "Skills are viewable by everyone" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own skills" 
ON public.skills 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add new columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS my_story TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Create trigger for skills updated_at
CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();