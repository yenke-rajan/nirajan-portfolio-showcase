import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface Profile {
  display_name: string;
  bio: string;
  location: string;
  education: string;
  youtube_channel_id: string;
  email_contact: string;
  avatar_url: string;
}

export function ProfileManager() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    bio: 'A man who will need no introduction in the near future, but for now a 6th semester Bsc. CSIT student hustling to create some chaos in the field of Data Science.',
    location: '',
    education: '',
    youtube_channel_id: 'UCJw2gEKhNFlT1MSWMJ-Jt1A',
    email_contact: '',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
          education: data.education || '',
          youtube_channel_id: data.youtube_channel_id || 'UCJw2gEKhNFlT1MSWMJ-Jt1A',
          email_contact: data.email_contact || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
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
        <label className="block text-sm font-medium mb-2">Education</label>
        <Input
          value={profile.education}
          onChange={(e) => handleChange('education', e.target.value)}
          placeholder="Your education background"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">YouTube Channel ID</label>
        <Input
          value={profile.youtube_channel_id}
          onChange={(e) => handleChange('youtube_channel_id', e.target.value)}
          placeholder="Your YouTube channel ID"
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

      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}