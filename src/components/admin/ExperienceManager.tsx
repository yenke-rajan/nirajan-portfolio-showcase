import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash, X } from 'lucide-react';

interface Experience {
  id?: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  experience_type: string;
  color: string;
}

export function ExperienceManager() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    company: '',
    position: '',
    duration: '',
    location: '',
    description: '',
    technologies: [],
    experience_type: 'work',
    color: '#3B82F6',
  });
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadExperiences();
    }
  }, [user]);

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experienceData = {
        ...formData,
        user_id: user?.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from('experiences')
          .update(experienceData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert(experienceData);
        if (error) throw error;
      }

      toast.success(editingId ? 'Experience updated!' : 'Experience added!');
      resetForm();
      loadExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: any) => {
    setEditingId(experience.id);
    setFormData({
      company: experience.company,
      position: experience.position,
      duration: experience.duration,
      location: experience.location,
      description: experience.description,
      technologies: experience.technologies || [],
      experience_type: experience.experience_type,
      color: experience.color,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Experience deleted!');
      loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      company: '',
      position: '',
      duration: '',
      location: '',
      description: '',
      technologies: [],
      experience_type: 'work',
      color: '#3B82F6',
    });
  };

  const addTechnology = () => {
    if (newTech.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData(prev => ({...prev, position: e.target.value}))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Select 
              value={formData.experience_type} 
              onValueChange={(value) => setFormData(prev => ({...prev, experience_type: value}))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({...prev, color: e.target.value}))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            />
            <Button type="button" onClick={addTechnology}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tech}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeTechnology(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Experience
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{experience.company} - {experience.position}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(experience)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(experience.id!)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {experience.duration} • {experience.location}
              </p>
              <p className="mb-2">{experience.description}</p>
              <div className="flex flex-wrap gap-2">
                {experience.technologies?.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}