import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, Github, Play, Star, GitFork } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Ashutosh Wife Prediction",
      description: "A humorous machine learning project that predicts relationship compatibility using various personality and behavioral factors. Built with advanced ML algorithms and deployed as a web application.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      technologies: ["Python", "Scikit-learn", "Flask", "Pandas", "Machine Learning"],
      github: "#",
      demo: "#",
      status: "Active",
      stats: { stars: 15, forks: 8 },
      gradient: "bg-gradient-primary"
    },
    {
      title: "Data Analysis Dashboard",
      description: "Interactive dashboard for real-time data visualization and analytics. Features dynamic charts, filters, and export capabilities for business intelligence applications.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
      github: "#",
      demo: "#", 
      status: "In Progress",
      stats: { stars: 23, forks: 12 },
      gradient: "bg-gradient-secondary"
    },
    {
      title: "Neural Network Visualizer",
      description: "Educational tool for visualizing how neural networks learn and make decisions. Interactive playground for experimenting with different architectures and datasets.",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop",
      technologies: ["JavaScript", "TensorFlow.js", "Three.js", "React", "WebGL"],
      github: "#",
      demo: "#",
      status: "Completed",
      stats: { stars: 45, forks: 18 },
      gradient: "bg-gradient-accent"
    },
    {
      title: "Sentiment Analysis API",
      description: "RESTful API for real-time sentiment analysis of text data. Supports multiple languages and provides confidence scores with detailed emotional breakdowns.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      technologies: ["Python", "NLTK", "Transformers", "FastAPI", "Docker"],
      github: "#",
      demo: "#",
      status: "Active",
      stats: { stars: 31, forks: 14 },
      gradient: "bg-gradient-primary"
    },
    {
      title: "Crypto Price Predictor", 
      description: "Time series forecasting model for cryptocurrency price prediction using LSTM networks. Includes market sentiment analysis and technical indicators.",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop",
      technologies: ["Python", "TensorFlow", "Pandas", "Streamlit", "CoinGecko API"],
      github: "#",
      demo: "#",
      status: "Active",
      stats: { stars: 67, forks: 29 },
      gradient: "bg-gradient-secondary"
    },
    {
      title: "Computer Vision Scanner",
      description: "Mobile-ready web application for document scanning and text extraction using computer vision. Features automatic edge detection and OCR capabilities.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      technologies: ["OpenCV", "Tesseract", "React Native", "Python", "Firebase"],
      github: "#",
      demo: "#",
      status: "Beta",
      stats: { stars: 28, forks: 11 },
      gradient: "bg-gradient-accent"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-white';
      case 'Completed': return 'bg-primary text-white';
      case 'In Progress': return 'bg-warning text-black';
      case 'Beta': return 'bg-accent text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my latest work in data science, machine learning, and web development
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="glass hover-lift group cursor-pointer overflow-hidden fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Status Badge */}
                <Badge 
                  className={`absolute top-4 right-4 ${getStatusColor(project.status)} border-0`}
                >
                  {project.status}
                </Badge>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="glass">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="btn-glow bg-gradient-primary border-0">
                    <Play className="h-4 w-4 mr-2" />
                    Try This Model
                  </Button>
                  <Button size="sm" variant="secondary" className="glass">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Project Header */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                    {project.title}
                  </h3>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {project.stats.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {project.stats.forks}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech}
                      variant="outline" 
                      className="glass border-primary/30 text-xs hover:bg-primary/10 transition-colors duration-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 glass border-primary/30 hover:bg-primary/10"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 btn-glow bg-gradient-primary border-0"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Demo
                  </Button>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 ${project.gradient} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-16 fade-in-up animation-delay-600">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Want to see more projects? Check out my GitHub for the complete collection.
            </p>
            <Button 
              variant="outline" 
              className="glass border-primary/30 hover:bg-primary/10 px-8 py-3"
            >
              <Github className="h-5 w-5 mr-2" />
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;