import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash, X, RefreshCw } from 'lucide-react';

interface Project {
  id?: string;
  title: string;
  description: string;
  github_url: string;
  demo_url: string;
  image_url: string;
  technologies: string[];
  status: string;
  featured: boolean;
  github_stars: number;
  github_forks: number;
}

export function ProjectManager() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    image_url: '',
    technologies: [],
    status: 'active',
    featured: false,
    github_stars: 0,
    github_forks: 0,
  });
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const fetchGitHubStats = async (githubUrl: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-github-stats', {
        body: { github_url: githubUrl }
      });

      if (response.error) throw response.error;

      const { stars, forks } = response.data;
      setFormData(prev => ({
        ...prev,
        github_stars: stars || 0,
        github_forks: forks || 0,
      }));
      
      toast.success('GitHub stats fetched!');
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      toast.error('Failed to fetch GitHub stats');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        user_id: user?.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(projectData);
        if (error) throw error;
      }

      toast.success(editingId ? 'Project updated!' : 'Project added!');
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      github_url: project.github_url,
      demo_url: project.demo_url,
      image_url: project.image_url,
      technologies: project.technologies || [],
      status: project.status,
      featured: project.featured,
      github_stars: project.github_stars,
      github_forks: project.github_forks,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted!');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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
      const fileName = `${user?.id}/project-image-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      github_url: '',
      demo_url: '',
      image_url: '',
      technologies: [],
      status: 'active',
      featured: false,
      github_stars: 0,
      github_forks: 0,
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
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Input
              value={formData.status}
              onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
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
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <div className="flex gap-2">
              <Input
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({...prev, github_url: e.target.value}))}
                placeholder="https://github.com/user/repo"
              />
              <Button 
                type="button" 
                onClick={() => fetchGitHubStats(formData.github_url)}
                disabled={!formData.github_url}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL</label>
            <Input
              value={formData.demo_url}
              onChange={(e) => setFormData(prev => ({...prev, demo_url: e.target.value}))}
              placeholder="https://your-demo.vercel.app"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Project Image</label>
          <div className="space-y-2">
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({...prev, image_url: e.target.value}))}
              placeholder="https://example.com/image.jpg"
            />
            <div className="text-sm text-muted-foreground">OR</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {formData.image_url && (
              <img 
                src={formData.image_url} 
                alt="Project preview"
                className="w-32 h-20 object-cover rounded border"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Stars</label>
            <Input
              type="number"
              value={formData.github_stars}
              onChange={(e) => setFormData(prev => ({...prev, github_stars: parseInt(e.target.value) || 0}))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Forks</label>
            <Input
              type="number"
              value={formData.github_forks}
              onChange={(e) => setFormData(prev => ({...prev, github_forks: parseInt(e.target.value) || 0}))}
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({...prev, featured: !!checked}))}
          />
          <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Project
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.title} {project.featured && <Badge>Featured</Badge>}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project.id!)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{project.description}</p>
              <p className="text-sm text-muted-foreground mb-2">
                ⭐ {project.github_stars} stars • 🍴 {project.github_forks} forks
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, index) => (
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