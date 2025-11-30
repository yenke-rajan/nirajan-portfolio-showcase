import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, ExternalLink, Calendar, Eye, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VideosSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedVideos = showAll ? videos : videos.slice(0, 4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section id="videos" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading videos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Latest Videos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Educational content about data science, machine learning, and programming tutorials
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {displayedVideos.map((video, index) => (
            <Card 
              key={video.id}
              className="glass hover-lift group cursor-pointer overflow-hidden fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => window.open(video.youtube_url, '_blank')}
            >
              {/* Video Thumbnail */}
              <div className="relative overflow-hidden">
                <img 
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=225&fit=crop"}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0">
                    {video.duration}
                  </Badge>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <CardContent className="p-6">
                {/* Video Info */}
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {video.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {video.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {video.views}
                        </div>
                      )}
                      {video.likes && (
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {video.likes}
                        </div>
                      )}
                    </div>
                    {video.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(video.published_at)}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full glass border-primary/30 hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More / View Less */}
        {videos.length > 4 && (
          <div className="text-center fade-in-up animation-delay-600">
            <div className="space-y-4">
              <Button 
                onClick={() => setShowAll(!showAll)}
                variant="outline" 
                className="glass border-primary/30 hover:bg-primary/10 px-8 py-3"
              >
                {showAll ? 'Show Less' : 'View More Videos'}
              </Button>
              
              {!showAll && (
                <p className="text-muted-foreground text-sm">
                  Showing {displayedVideos.length} of {videos.length} videos
                </p>
              )}
            </div>
          </div>
        )}

        {/* YouTube Channel CTA */}
        <div className="text-center mt-16 fade-in-up animation-delay-800">
          <Card className="glass inline-block border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gradient">Subscribe for More</h4>
                  <p className="text-muted-foreground text-sm">Get notified when I upload new tutorials</p>
                </div>
                <Button 
                  className="btn-glow bg-gradient-accent border-0 ml-4"
                  onClick={() => window.open('https://www.youtube.com/@MrNKRajan', '_blank')}
                >
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VideosSection;