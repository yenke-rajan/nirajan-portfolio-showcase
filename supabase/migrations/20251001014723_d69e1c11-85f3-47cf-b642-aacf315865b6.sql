-- Create featured_skills table
CREATE TABLE public.featured_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Featured skills are viewable by everyone" 
ON public.featured_skills 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own featured skills" 
ON public.featured_skills 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_featured_skills_updated_at
BEFORE UPDATE ON public.featured_skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for skill images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('skill-images', 'skill-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for skill images
CREATE POLICY "Skill images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'skill-images');

CREATE POLICY "Users can upload skill images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'skill-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own skill images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'skill-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own skill images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'skill-images' AND auth.uid()::text = (storage.foldername(name))[1]);