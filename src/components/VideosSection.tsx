import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, ExternalLink, Calendar, Eye, ThumbsUp } from 'lucide-react';

const VideosSection = () => {
  const [showAll, setShowAll] = useState(false);

  // Mock YouTube videos data (in real implementation, this would come from YouTube API)
  const videos = [
    {
      id: "1",
      title: "Introduction to Machine Learning: From Zero to Hero",
      description: "A comprehensive guide to getting started with machine learning, covering basic concepts, algorithms, and practical implementations.",
      thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=225&fit=crop",
      duration: "15:42",
      views: "12.5K",
      likes: "486",
      publishedAt: "2024-01-15",
      url: "https://youtube.com/watch?v=example1"
    },
    {
      id: "2", 
      title: "Data Visualization with Python: Creating Beautiful Charts",
      description: "Learn how to create stunning data visualizations using Python libraries like Matplotlib, Seaborn, and Plotly.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      duration: "22:18",
      views: "8.9K",
      likes: "321",
      publishedAt: "2024-02-01",
      url: "https://youtube.com/watch?v=example2"
    },
    {
      id: "3",
      title: "Building Your First Neural Network: Step by Step Tutorial",
      description: "Complete walkthrough of building a neural network from scratch, including theory, implementation, and optimization techniques.",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "28:33",
      views: "15.2K", 
      likes: "678",
      publishedAt: "2024-02-15",
      url: "https://youtube.com/watch?v=example3"
    },
    {
      id: "4",
      title: "Data Science Career Guide: Tips from My Journey",
      description: "Sharing insights about breaking into data science, essential skills, interview preparation, and career growth strategies.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      duration: "18:45",
      views: "6.7K",
      likes: "234",
      publishedAt: "2024-03-01",
      url: "https://youtube.com/watch?v=example4"
    },
    {
      id: "5",
      title: "Web Scraping for Data Science: Practical Examples",
      description: "Learn how to collect data from websites using Python, covering BeautifulSoup, Scrapy, and ethical scraping practices.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      duration: "25:12",
      views: "9.8K",
      likes: "412",
      publishedAt: "2024-03-15",
      url: "https://youtube.com/watch?v=example5"
    },
    {
      id: "6",
      title: "Docker for Data Scientists: Containerizing ML Projects",
      description: "Master Docker for data science workflows, including containerizing Jupyter notebooks, ML models, and entire pipelines.",
      thumbnail: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=225&fit=crop",
      duration: "32:07",
      views: "4.3K",
      likes: "189",
      publishedAt: "2024-04-01",
      url: "https://youtube.com/watch?v=example6"
    }
  ];

  const displayedVideos = showAll ? videos : videos.slice(0, 4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
              onClick={() => window.open(video.url, '_blank')}
            >
              {/* Video Thumbnail */}
              <div className="relative overflow-hidden">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <Badge className="absolute bottom-3 right-3 bg-black/80 text-white border-0">
                  {video.duration}
                </Badge>

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
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {video.likes}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(video.publishedAt)}
                    </div>
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