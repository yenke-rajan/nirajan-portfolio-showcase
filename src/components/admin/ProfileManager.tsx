import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Profile {
  display_name: string;
  bio: string;
  location: string;
  education: string;
  youtube_channel_id: string;
  email_contact: string;
}

export function ProfileManager() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    bio: '',
    location: '',
    education: '',
    youtube_channel_id: '',
    email_contact: '',
  });
  const [loading, setLoading] = useState(false);

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
          bio: data.bio || '',
          location: data.location || '',
          education: data.education || '',
          youtube_channel_id: data.youtube_channel_id || '',
          email_contact: data.email_contact || '',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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