import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Share2, BookOpen } from 'lucide-react';

const PostsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock posts data (in real implementation, this would come from admin dashboard/CMS)
  const posts = [
    {
      id: "1",
      title: "The Future of AI in Data Science: What to Expect in 2024",
      excerpt: "Exploring the latest trends in artificial intelligence and how they're reshaping the data science landscape. From AutoML to explainable AI, here's what every data scientist should know.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop",
      category: "AI & ML",
      publishedAt: "2024-03-20",
      readTime: "8 min read",
      author: "Nirajan Khatiwada",
      tags: ["AI", "Machine Learning", "Future Tech", "Data Science"],
      stats: { likes: 127, comments: 23, shares: 45 },
      featured: true
    },
    {
      id: "2",
      title: "Building Scalable Data Pipelines: Lessons from Production",
      excerpt: "Real-world insights from building and maintaining data pipelines at scale. Common pitfalls, best practices, and tools that actually work in production environments.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      category: "Engineering",
      publishedAt: "2024-03-15",
      readTime: "12 min read",
      author: "Nirajan Khatiwada",
      tags: ["Data Engineering", "Pipelines", "Production", "Best Practices"],
      stats: { likes: 89, comments: 15, shares: 28 },
      featured: false
    },
    {
      id: "3",
      title: "Why Every Data Scientist Should Learn Docker",
      excerpt: "Containerization isn't just for DevOps anymore. Discover how Docker can revolutionize your data science workflow, from reproducible environments to seamless deployment.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop",
      category: "Tools & Tech",
      publishedAt: "2024-03-10",
      readTime: "6 min read",
      author: "Nirajan Khatiwada",
      tags: ["Docker", "DevOps", "Workflow", "Tools"],
      stats: { likes: 156, comments: 32, shares: 67 },
      featured: false
    },
    {
      id: "4",
      title: "My Journey from Student to Data Science Intern",
      excerpt: "A personal account of breaking into the data science field as a student. The challenges, resources that helped, and advice for aspiring data scientists starting their journey.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      category: "Career",
      publishedAt: "2024-03-05",
      readTime: "10 min read",
      author: "Nirajan Khatiwada",
      tags: ["Career", "Student Life", "Internship", "Advice"],
      stats: { likes: 203, comments: 41, shares: 89 },
      featured: true
    },
    {
      id: "5",
      title: "Understanding Neural Networks: A Visual Guide",
      excerpt: "Break down complex neural network concepts with interactive visualizations and simple explanations. Perfect for beginners looking to understand how deep learning really works.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      category: "Education",
      publishedAt: "2024-02-28",
      readTime: "15 min read",
      author: "Nirajan Khatiwada",
      tags: ["Neural Networks", "Deep Learning", "Education", "Visualization"],
      stats: { likes: 178, comments: 27, shares: 52 },
      featured: false
    },
    {
      id: "6",
      title: "Open Source Contributions: How to Get Started",
      excerpt: "Contributing to open source projects as a data scientist. Finding the right projects, making meaningful contributions, and building your reputation in the community.",
      content: "Full article content would be here...",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      category: "Community",
      publishedAt: "2024-02-20",
      readTime: "7 min read",
      author: "Nirajan Khatiwada",
      tags: ["Open Source", "Community", "GitHub", "Contribution"],
      stats: { likes: 134, comments: 19, shares: 38 },
      featured: false
    }
  ];

  const categories = ['All', 'AI & ML', 'Engineering', 'Tools & Tech', 'Career', 'Education', 'Community'];

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

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <Card className="glass hover-lift mb-12 fade-in-up animation-delay-400">
            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden">
              {/* Featured Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover hover:scale-110 transition-transform duration-500"
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
                      {formatDate(featuredPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-gradient hover:scale-105 transition-transform duration-300">
                    {featuredPost.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="glass border-primary/30 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats & Action */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {featuredPost.stats.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {featuredPost.stats.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {featuredPost.stats.shares}
                      </div>
                    </div>
                    
                    <Button className="btn-glow bg-gradient-primary border-0">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <Card 
              key={post.id}
              className="glass hover-lift group cursor-pointer overflow-hidden fade-in-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              {/* Post Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {post.readTime}
                    </div>
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
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="glass border-primary/30 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.stats.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.stats.comments}
                      </div>
                    </div>
                    
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