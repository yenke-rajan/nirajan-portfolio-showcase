import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Share2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PostsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('order_index', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))];

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section id="posts" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading posts...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="posts" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Latest Posts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on data science, technology, and my learning journey
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 fade-in-up animation-delay-200">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "btn-glow bg-gradient-primary border-0" 
                  : "glass border-primary/30 hover:bg-primary/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <Card className="glass hover-lift mb-12 fade-in-up animation-delay-400">
            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden">
              {/* Featured Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={featuredPost.image_url || "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop"}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white border-0">
                    Featured
                  </Badge>
                </div>
              </div>

              {/* Featured Content */}
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="glass">
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredPost.created_at)}
                    </div>
                    {featuredPost.read_time && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {featuredPost.read_time}
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-gradient hover:scale-105 transition-transform duration-300">
                    {featuredPost.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  {/* Tags */}
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag: string) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="glass border-primary/30 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Link to={`/post/${featuredPost.id}`}>
                    <Button className="btn-glow bg-gradient-primary border-0 w-fit">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              <Card 
                className="glass hover-lift group cursor-pointer overflow-hidden fade-in-up"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
              {/* Post Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={post.image_url || "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop"}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="glass">
                    {post.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="glass border-primary/30 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Read More Button */}
                  <div className="pt-2 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-accent p-0 h-auto"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300"></div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {/* View More Posts */}
        <div className="text-center mt-16 fade-in-up animation-delay-600">
          <Button 
            variant="outline" 
            className="glass border-primary/30 hover:bg-primary/10 px-8 py-3"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            View More Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostsSection;