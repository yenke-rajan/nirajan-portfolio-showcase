import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash, RefreshCw, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Video {
  id?: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  duration: string;
  views: string;
  likes: string;
  published_at: string;
}

function SortableVideoItem({ video, onEdit, onDelete }: { 
  video: any; 
  onEdit: (vid: any) => void; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            <span>{video.title}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(video)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(video.id)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {video.thumbnail_url && (
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-32 h-20 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <p className="text-sm mb-2">{video.description}</p>
            <p className="text-xs text-muted-foreground">
              {video.duration} • {video.views} views • {video.likes} likes • {video.published_at}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VideoManager() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Video>({
    title: '',
    description: '',
    youtube_url: '',
    youtube_id: '',
    thumbnail_url: '',
    duration: '',
    views: '',
    likes: '',
    published_at: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    if (user) {
      loadVideos();
    }
  }, [user]);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('order_index', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos');
    }
  };

  const fetchYouTubeData = async (youtubeUrl: string) => {
    try {
      const response = await supabase.functions.invoke('fetch-youtube-data', {
        body: { youtube_url: youtubeUrl }
      });

      if (response.error) throw response.error;

      const videoData = response.data;
      setFormData(prev => ({
        ...prev,
        title: videoData.title || prev.title,
        description: videoData.description || prev.description,
        youtube_id: videoData.youtube_id || prev.youtube_id,
        thumbnail_url: videoData.thumbnail_url || prev.thumbnail_url,
        duration: videoData.duration || prev.duration,
        views: videoData.views || prev.views,
        likes: videoData.likes || prev.likes,
        published_at: videoData.published_at || prev.published_at,
      }));
      
      toast.success('YouTube data fetched!');
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      toast.error('Failed to fetch YouTube data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoData = {
        ...formData,
        user_id: user?.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('videos')
          .insert(videoData);
        if (error) throw error;
      }

      toast.success(editingId ? 'Video updated!' : 'Video added!');
      resetForm();
      loadVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: any) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      youtube_url: video.youtube_url,
      youtube_id: video.youtube_id,
      thumbnail_url: video.thumbnail_url,
      duration: video.duration,
      views: video.views,
      likes: video.likes,
      published_at: video.published_at,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Video deleted!');
      loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingThumbnail(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/video-thumbnail-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      youtube_id: '',
      thumbnail_url: '',
      duration: '',
      views: '',
      likes: '',
      published_at: '',
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((vid) => vid.id === active.id);
      const newIndex = videos.findIndex((vid) => vid.id === over.id);

      const reorderedVideos = arrayMove(videos, oldIndex, newIndex);
      setVideos(reorderedVideos);

      // Update order_index in database
      try {
        const updates = reorderedVideos.map((vid, index) => 
          supabase
            .from('videos')
            .update({ order_index: reorderedVideos.length - index })
            .eq('id', vid.id)
        );

        await Promise.all(updates);
        toast.success('Order updated!');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update order');
        loadVideos();
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">YouTube URL</label>
          <div className="flex gap-2">
            <Input
              value={formData.youtube_url}
              onChange={(e) => setFormData(prev => ({...prev, youtube_url: e.target.value}))}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <Button 
              type="button" 
              onClick={() => fetchYouTubeData(formData.youtube_url)}
              disabled={!formData.youtube_url}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            required
          />
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
            <label className="block text-sm font-medium mb-2">Duration</label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
              placeholder="10:30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Published Date</label>
            <Input
              value={formData.published_at}
              onChange={(e) => setFormData(prev => ({...prev, published_at: e.target.value}))}
              placeholder="2023-12-01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Views</label>
            <Input
              value={formData.views}
              onChange={(e) => setFormData(prev => ({...prev, views: e.target.value}))}
              placeholder="1.2K"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Likes</label>
            <Input
              value={formData.likes}
              onChange={(e) => setFormData(prev => ({...prev, likes: e.target.value}))}
              placeholder="45"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <div className="space-y-2">
            <Input
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({...prev, thumbnail_url: e.target.value}))}
              placeholder="Auto-filled from YouTube or paste URL"
            />
            <div className="text-sm text-muted-foreground">OR</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {formData.thumbnail_url && (
              <img 
                src={formData.thumbnail_url} 
                alt="Thumbnail preview"
                className="w-32 h-20 object-cover rounded border"
              />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Video
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={videos.map(vid => vid.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {videos.map((video) => (
              <SortableVideoItem
                key={video.id}
                video={video}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}