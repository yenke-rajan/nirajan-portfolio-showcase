import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-pulse">Loading post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post not found</h1>
            <Link to="/#posts">
              <Button className="btn-glow bg-gradient-primary border-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/#posts">
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.image_url && (
            <div className="relative overflow-hidden rounded-lg mb-8 fade-in-up">
              <img 
                src={post.image_url}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
              {post.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white border-0">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Category & Meta */}
          <div className="flex items-center gap-4 mb-6 text-muted-foreground fade-in-up animation-delay-200">
            <Badge variant="secondary" className="glass">
              {post.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
            </div>
            {post.read_time && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {post.read_time}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient fade-in-up animation-delay-400">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 fade-in-up animation-delay-600">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 fade-in-up animation-delay-800">
              {post.tags.map((tag: string) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="glass border-primary/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share Button */}
          <div className="mb-12 fade-in-up animation-delay-1000">
            <Button 
              variant="outline"
              onClick={handleShare}
              className="glass border-primary/30 hover:bg-primary/10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12 fade-in-up animation-delay-1200">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-border/50 pt-8 fade-in-up animation-delay-1400">
            <Link to="/#posts">
              <Button className="btn-glow bg-gradient-primary border-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Posts
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Post;
