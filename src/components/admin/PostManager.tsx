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
import { Plus, Edit, Trash, X, Upload } from 'lucide-react';

interface Post {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  read_time: string;
}

export function PostManager() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Post>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'general',
    tags: [],
    featured: false,
    published: true,
    read_time: '',
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileName = `post-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl,
      }));

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        user_id: user?.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(postData);
        if (error) throw error;
      }

      toast.success(editingId ? 'Post updated!' : 'Post added!');
      resetForm();
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url,
      category: post.category,
      tags: post.tags || [],
      featured: post.featured,
      published: post.published,
      read_time: post.read_time,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Post deleted!');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: 'general',
      tags: [],
      featured: false,
      published: true,
      read_time: '',
    });
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
            rows={2}
            placeholder="Brief description of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
            rows={8}
            placeholder="Full content of the post (supports markdown)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <div className="flex gap-2 mb-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Button type="button" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          {formData.image_url && (
            <img 
              src={formData.image_url} 
              alt="Preview" 
              className="w-32 h-20 object-cover rounded border"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Read Time</label>
            <Input
              value={formData.read_time}
              onChange={(e) => setFormData(prev => ({...prev, read_time: e.target.value}))}
              placeholder="5 min read"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({...prev, featured: !!checked}))}
            />
            <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData(prev => ({...prev, published: !!checked}))}
            />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Post
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {post.title} 
                  {post.featured && <Badge className="ml-2">Featured</Badge>}
                  {!post.published && <Badge variant="secondary" className="ml-2">Draft</Badge>}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(post.id!)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm mb-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post.category} • {post.read_time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}