import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { profileSchema, type ProfileData } from '@/lib/validation';
import { FeaturedSkillsManager } from './FeaturedSkillsManager';
import { Separator } from '@/components/ui/separator';

interface Profile {
  display_name: string;
  bio: string;
  location: string;
  phone_number: string;
  email_contact: string;
  avatar_url: string;
  my_story: string;
  about_me: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  semester: string;
  years_coding: string;
  projects_count: string;
}

export function ProfileManager() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    bio: 'A man who will need no introduction in the near future, but for now a 6th semester Bsc. CSIT student hustling to create some chaos in the field of Data Science.',
    location: '',
    phone_number: '',
    email_contact: '',
    avatar_url: '',
    my_story: '',
    about_me: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    semester: '6th',
    years_coding: '3+',
    projects_count: '10+',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          bio: data.bio || 'A man who will need no introduction in the near future, but for now a 6th semester Bsc. CSIT student hustling to create some chaos in the field of Data Science.',
          location: data.location || '',
          phone_number: data.phone_number || '',
          email_contact: data.email_contact || '',
          avatar_url: data.avatar_url || '',
          my_story: data.my_story || '',
          about_me: data.about_me || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          instagram_url: data.instagram_url || '',
          semester: data.semester || '6th',
          years_coding: data.years_coding || '3+',
          projects_count: data.projects_count || '10+',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Validate profile data
      const validation = profileSchema.safeParse(profile);
      
      if (!validation.success) {
        const formErrors: Partial<ProfileData> = {};
        validation.error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const field = issue.path[0] as keyof ProfileData;
            formErrors[field] = issue.message;
          }
        });
        setErrors(formErrors);
        toast.error('Please check your input and try again.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...validation.data,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      // Upload to Supabase Storage with user folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setProfile(prev => ({ ...prev, avatar_url: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/20">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center px-4 py-2 border border-primary/30 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadingImage ? 'Uploading...' : 'Upload Photo'}
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <Input
          value={profile.display_name}
          onChange={(e) => handleChange('display_name', e.target.value)}
          placeholder="Your display name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <Textarea
          value={profile.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Tell about yourself..."
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <Input
          value={profile.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Your location"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <Input
          value={profile.phone_number}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          placeholder="Your phone number"
        />
      </div>


      <div>
        <label className="block text-sm font-medium mb-2">Contact Email</label>
        <Input
          type="email"
          value={profile.email_contact}
          onChange={(e) => handleChange('email_contact', e.target.value)}
          placeholder="Your contact email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">About Me</label>
        <Textarea
          value={profile.about_me}
          onChange={(e) => handleChange('about_me', e.target.value)}
          placeholder="Write about yourself for the About Me section..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">My Story</label>
        <Textarea
          value={profile.my_story}
          onChange={(e) => handleChange('my_story', e.target.value)}
          placeholder="Tell your story..."
          rows={5}
        />
      </div>

      {/* About Section Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">About Section Stats</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Semester</label>
          <Input
            value={profile.semester}
            onChange={(e) => handleChange('semester', e.target.value)}
            placeholder="e.g., 6th"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Years Coding</label>
          <Input
            value={profile.years_coding}
            onChange={(e) => handleChange('years_coding', e.target.value)}
            placeholder="e.g., 3+"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Projects Count</label>
          <Input
            value={profile.projects_count}
            onChange={(e) => handleChange('projects_count', e.target.value)}
            placeholder="e.g., 10+"
          />
        </div>
      </div>

      {/* Profile Links Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Links</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <Input
            value={profile.github_url}
            onChange={(e) => handleChange('github_url', e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
          <Input
            value={profile.linkedin_url}
            onChange={(e) => handleChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Twitter URL</label>
          <Input
            value={profile.twitter_url}
            onChange={(e) => handleChange('twitter_url', e.target.value)}
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Instagram URL</label>
          <Input
            value={profile.instagram_url}
            onChange={(e) => handleChange('instagram_url', e.target.value)}
            placeholder="https://instagram.com/yourusername"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>

      {/* Featured Skills Section */}
      <Separator className="my-8" />
      <FeaturedSkillsManager />
    </form>
  );
}