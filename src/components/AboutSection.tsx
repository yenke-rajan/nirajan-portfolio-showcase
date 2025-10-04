import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, GraduationCap, Calendar, Code2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  category: string;
}

const AboutSection = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    loadProfile();
    loadSkills();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('id, name, category')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const stats = [
    { number: profile?.semester || "6th", label: "Semester", icon: GraduationCap },
    { number: profile?.years_coding || "3+", label: "Years Coding", icon: Code2 },
    { number: profile?.projects_count || "10+", label: "Projects", icon: Calendar },
    { number: profile?.location || "Nepal", label: "Based in", icon: MapPin },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Passionate about turning data into meaningful insights and building intelligent systems
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* About Content */}
          <div className="space-y-6 sm:space-y-8 fade-in-left">
            <Card className="glass">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-4 sm:mb-6">About Me</h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    {profile?.about_me || "Passionate about turning data into meaningful insights and building intelligent systems."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-4 sm:mb-6">My Story</h3>
                <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <p>
                    {profile?.my_story || profile?.bio || "Hello! I'm Nirajan Khatiwada, a passionate data science enthusiast currently pursuing my Bsc. CSIT degree. What started as curiosity about how data can tell stories has evolved into a deep fascination with machine learning and artificial intelligence."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interests & Expertise - Dynamically loaded from Skills table */}
            {skills.length > 0 && (
              <Card className="glass">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-4 sm:mb-6">Interests & Expertise</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">Check out the Skills section below for my detailed expertise areas</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={skill.id}
                        variant="secondary"
                        className="glass hover:bg-primary/20 transition-colors duration-300 cursor-pointer hover-lift"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-6 fade-in-right animation-delay-400">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Card 
                  key={stat.label}
                  className="glass hover-lift text-center group cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center group-hover:animate-bounce">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quote Card */}
            <Card className="glass bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-4xl sm:text-6xl text-primary/30">"</div>
                  <blockquote className="text-base sm:text-lg font-medium text-gradient italic">
                    Data is the new oil, but like oil, it has to be refined to be valuable.
                  </blockquote>
                  <div className="text-sm sm:text-base text-muted-foreground">— My Data Philosophy</div>
                </div>
              </CardContent>
            </Card>

            {/* Fun Fact */}
            <Card className="glass border-accent/30">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse flex-shrink-0 mt-1 sm:mt-0"></div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <span className="text-accent font-medium">Fun Fact:</span> I can predict your next scroll position with 87.3% accuracy! 
                    (Just kidding, but I do love working with predictive models 😄)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;