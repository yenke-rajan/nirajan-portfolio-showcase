import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Experience {
  id: string;
  company: string;
  position: string;
  experience_type: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  color: string;
}

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const INITIAL_DISPLAY_COUNT = 3;

  useEffect(() => {
    loadExperiences();
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('phone_number')
        .limit(1)
        .single();

      if (error) throw error;
      setPhoneNumber(data?.phone_number || null);
    } catch (error) {
      console.error('Error loading phone number:', error);
    }
  };

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      // Fallback to hardcoded data if database fails
      setExperiences([
        {
          id: '1',
          company: "DLYTICA",
          position: "Data Science Intern",
          experience_type: "Internship",
          duration: "Present",
          location: "Remote",
          description: "Working on advanced analytics projects, developing machine learning models, and creating data-driven solutions for business problems.",
          technologies: ["Python", "Machine Learning", "Data Analysis", "SQL"],
          color: "bg-gradient-primary"
        },
        {
          id: '2',
          company: "OASIS INFOBYTE",
          position: "Data Science Intern", 
          experience_type: "Internship",
          duration: "2024",
          location: "Remote",
          description: "Completed multiple data science projects including predictive modeling, data visualization, and statistical analysis tasks.",
          technologies: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
          color: "bg-gradient-secondary"
        },
        {
          id: '3',
          company: "The Sparks Foundation",
          position: "Data Science & Business Analytics Intern",
          experience_type: "Internship", 
          duration: "2024",
          location: "Remote",
          description: "Developed business intelligence solutions and performed comprehensive data analysis for various client projects.",
          technologies: ["Business Analytics", "Data Visualization", "Python", "Tableau"],
          color: "bg-gradient-accent"
        },
        {
          id: '4',
          company: "E-Cell IIT, Bombay",
          position: "Campus Executive Intern",
          experience_type: "Leadership",
          duration: "2024",
          location: "Mumbai, India",
          description: "Organized entrepreneurship events, mentored students, and facilitated startup ecosystem development on campus.",
          technologies: ["Leadership", "Event Management", "Networking"],
          color: "bg-gradient-primary"
        },
        {
          id: '5',
          company: "CSITAN",
          position: "Joint Secretary",
          experience_type: "Leadership",
          duration: "2023-2024", 
          location: "Nepal",
          description: "Led technical initiatives, organized coding competitions, and managed student chapter activities for computer science students.",
          technologies: ["Leadership", "Event Planning", "Technical Writing"],
          color: "bg-gradient-secondary"
        },
        {
          id: '6',
          company: "Hult Prize at Amrit Campus",
          position: "Startups Coordinator",
          experience_type: "Leadership",
          duration: "2024",
          location: "Nepal",
          description: "Coordinated startup pitch competitions, mentored teams, and facilitated connections between entrepreneurs and investors.",
          technologies: ["Startup Mentoring", "Business Development", "Networking"],
          color: "bg-gradient-accent"
        }
      ]);
    }
  };

  const handleCollaborationClick = () => {
    if (phoneNumber) {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanedNumber}`, '_blank', 'noopener,noreferrer');
    }
  };

  const displayedExperiences = showAll ? experiences : experiences.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = experiences.length > INITIAL_DISPLAY_COUNT;

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Experience & Organizations</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            My journey through internships, leadership roles, and organizational contributions
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>

          {/* Experience Cards */}
          <div className="space-y-8 sm:space-y-12">
            {displayedExperiences.map((exp, index) => (
              <div 
                key={exp.id}
                className={`fade-in-up flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Timeline Dot */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-6 h-6 rounded-full ${exp.color} shadow-lg animate-glow-pulse`}></div>
                </div>

                {/* Content */}
                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <Card className="glass hover-lift group cursor-pointer">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                            <h3 className="text-lg sm:text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300 truncate">
                              {exp.company}
                            </h3>
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-foreground">
                            {exp.position}
                          </p>
                        </div>
                        <Badge variant="secondary" className="glass text-xs flex-shrink-0">
                          {exp.experience_type}
                        </Badge>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge 
                            key={tech}
                            variant="outline" 
                            className="glass border-primary/30 hover:bg-primary/10 transition-colors duration-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Hover Effect */}
                      <div className={`absolute inset-0 ${exp.color} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden lg:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="text-center mt-8 sm:mt-12 fade-in-up">
            <Button
              variant="outline"
              className="glass border-primary/30 hover:bg-primary/10"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  See Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  See More ({experiences.length - INITIAL_DISPLAY_COUNT} more)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16 fade-in-up animation-delay-600">
          <Card 
            className="glass inline-block cursor-pointer hover-lift"
            onClick={handleCollaborationClick}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <span className="text-base sm:text-lg text-gradient font-medium">Interested in collaborating?</span>
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-bounce" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;