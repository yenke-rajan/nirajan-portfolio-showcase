import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ExternalLink, Github, Play, Star, GitFork } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-white';
      case 'completed': return 'bg-primary text-white';
      case 'in_progress': return 'bg-warning text-black';
      case 'beta': return 'bg-accent text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGradientClass = (index: number) => {
    const gradients = ['bg-gradient-primary', 'bg-gradient-secondary', 'bg-gradient-accent'];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            A showcase of my latest work in data science, machine learning, and web development
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.id}
              className="glass hover-lift group overflow-hidden fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url || "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
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
                  {project.github_url && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="glass"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.github_url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button 
                      size="sm" 
                      className="btn-glow bg-gradient-primary border-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.demo_url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Try Demo
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                {/* Project Header */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                    {project.title}
                  </h3>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {project.github_stars || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      {project.github_forks || 0}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.technologies?.map((tech: string) => (
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
                  {project.github_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 glass border-primary/30 hover:bg-primary/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.github_url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button 
                      size="sm" 
                      className="flex-1 btn-glow bg-gradient-primary border-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.demo_url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 ${getGradientClass(index)} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300 pointer-events-none`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12 sm:mt-16 fade-in-up animation-delay-600">
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Want to see more projects? Check out my GitHub for the complete collection.
            </p>
            <Button 
              variant="outline" 
              className="glass border-primary/30 hover:bg-primary/10 px-6 sm:px-8 py-2 sm:py-3"
              onClick={() => window.open('https://github.com/yenke-rajan', '_blank')}
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;