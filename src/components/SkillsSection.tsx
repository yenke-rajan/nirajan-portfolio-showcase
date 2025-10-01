import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  order_index: number;
}

interface FeaturedSkill {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url: string;
  order_index: number;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featuredSkills, setFeaturedSkills] = useState<FeaturedSkill[]>([]);

  useEffect(() => {
    loadSkills();
    loadFeaturedSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const loadFeaturedSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_skills')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(3);

      if (error) throw error;
      setFeaturedSkills(data || []);
    } catch (error) {
      console.error('Error loading featured skills:', error);
    }
  };

  const gradients = ["bg-gradient-primary", "bg-gradient-secondary", "bg-gradient-accent"];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getProficiencyLabel = (level: number) => {
    if (level <= 1) return 'Beginner';
    if (level <= 3) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">My Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expertise across the data science spectrum, from analysis to visualization
          </p>
        </div>

        {/* Featured Skills Display */}
        {featuredSkills.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredSkills.map((skill, index) => (
              <Card 
                key={skill.id}
                className={`glass hover-lift cursor-pointer group fade-in-up transition-all duration-500`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8 text-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-20 h-20 mx-auto rounded-full ${gradients[index % 3]} p-0.5 animate-glow-pulse`}>
                      <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                        <img 
                          src={skill.image_url} 
                          alt={skill.title}
                          className="w-12 h-12 object-contain opacity-90 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full animate-float"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent rounded-full animate-float animation-delay-400"></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                    {skill.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Technical Skills */}
                  <div className="flex flex-wrap gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {skill.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 ${gradients[index % 3]} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dynamic Skills from Database */}
        {skills.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gradient mb-4">Interests & Expertise</h3>
              <p className="text-muted-foreground">Skills and technologies I work with</p>
            </div>
            
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category} className="glass">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-semibold text-primary mb-4 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map((skill, index) => (
                        <Badge 
                          key={skill.id}
                          variant="secondary"
                          className="glass hover:bg-primary/20 transition-colors duration-300 cursor-pointer hover-lift px-4 py-2"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="mr-2">{skill.name}</span>
                          <span className="text-xs opacity-70">
                            {getProficiencyLabel(skill.proficiency_level)}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in-up animation-delay-600">
          <div className="inline-flex items-center gap-2 text-accent">
            <span className="text-lg">Ready to see these skills in action?</span>
            <span className="animate-bounce">⚡</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;