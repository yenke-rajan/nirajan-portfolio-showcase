import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Trash2 } from 'lucide-react';

interface FeaturedSkill {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url: string;
  order_index: number;
}

export function FeaturedSkillsManager() {
  const { user } = useAuth();
  const [featuredSkills, setFeaturedSkills] = useState<FeaturedSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<FeaturedSkill> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      loadFeaturedSkills();
    }
  }, [user]);

  const loadFeaturedSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_skills')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFeaturedSkills(data || []);
    } catch (error) {
      console.error('Error loading featured skills:', error);
      toast.error('Failed to load featured skills');
    }
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/skill-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('skill-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('skill-images')
        .getPublicUrl(fileName);

      setEditingSkill(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!editingSkill?.title || !editingSkill?.description || !editingSkill?.image_url) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    if (featuredSkills.length >= 3 && !editingSkill.id) {
      toast.error('You can only have 3 featured skills. Delete one to add a new skill.');
      return;
    }

    setLoading(true);
    try {
      const technologiesArray = Array.isArray(editingSkill.technologies) 
        ? editingSkill.technologies 
        : (editingSkill.technologies as any)?.split(',').map((t: string) => t.trim()).filter(Boolean) || [];

      const skillData = {
        user_id: user?.id,
        title: editingSkill.title,
        description: editingSkill.description,
        technologies: technologiesArray,
        image_url: editingSkill.image_url,
        order_index: editingSkill.order_index || featuredSkills.length,
      };

      if (editingSkill.id) {
        const { error } = await supabase
          .from('featured_skills')
          .update(skillData)
          .eq('id', editingSkill.id);

        if (error) throw error;
        toast.success('Featured skill updated!');
      } else {
        const { error } = await supabase
          .from('featured_skills')
          .insert(skillData);

        if (error) throw error;
        toast.success('Featured skill added!');
      }

      setEditingSkill(null);
      loadFeaturedSkills();
    } catch (error) {
      console.error('Error saving featured skill:', error);
      toast.error('Failed to save featured skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this featured skill?')) return;

    try {
      const { error } = await supabase
        .from('featured_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Featured skill deleted!');
      loadFeaturedSkills();
    } catch (error) {
      console.error('Error deleting featured skill:', error);
      toast.error('Failed to delete featured skill');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Top 3 Featured Skills</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage up to 3 featured skills that will be displayed prominently on your portfolio.
        </p>
      </div>

      {/* Editing Form */}
      <Card className="glass">
        <CardContent className="p-6 space-y-4">
          <h4 className="font-medium">
            {editingSkill?.id ? 'Edit Featured Skill' : 'Add Featured Skill'}
          </h4>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Skill Icon/Image *</label>
            <div className="flex items-center gap-4">
              {editingSkill?.image_url ? (
                <div className="relative">
                  <img
                    src={editingSkill.image_url}
                    alt="Skill"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingSkill(prev => ({ ...prev, image_url: '' }))}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-primary/20">
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
                  id="skill-image-upload"
                />
                <label
                  htmlFor="skill-image-upload"
                  className="inline-flex items-center px-4 py-2 border border-primary/30 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skill Title *</label>
            <Input
              value={editingSkill?.title || ''}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., DATA ANALYSIS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={editingSkill?.description || ''}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of your skill..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies & Skills *</label>
            <Input
              value={Array.isArray(editingSkill?.technologies) ? editingSkill.technologies.join(', ') : editingSkill?.technologies || ''}
              onChange={(e) => setEditingSkill(prev => ({ ...prev, technologies: e.target.value as any }))}
              placeholder="e.g., Python, R, SQL, Pandas, NumPy"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate technologies with commas</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : editingSkill?.id ? 'Update Skill' : 'Add Skill'}
            </Button>
            {editingSkill && (
              <Button variant="outline" onClick={() => setEditingSkill(null)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Skills List */}
      <div className="space-y-4">
        <h4 className="font-medium">Current Featured Skills ({featuredSkills.length}/3)</h4>
        {featuredSkills.map((skill) => (
          <Card key={skill.id} className="glass">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={skill.image_url}
                  alt={skill.title}
                  className="w-16 h-16 rounded-lg object-cover border border-primary/20"
                />
                <div className="flex-1">
                  <h5 className="font-medium">{skill.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skill.technologies.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSkill(skill)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
