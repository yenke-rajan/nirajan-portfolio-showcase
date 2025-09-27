import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, GraduationCap, Calendar, Code2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AboutSection = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
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

  const stats = [
    { number: "6th", label: "Semester", icon: GraduationCap },
    { number: "3+", label: "Years Coding", icon: Code2 },
    { number: "10+", label: "Projects", icon: Calendar },
    { number: profile?.location || "Nepal", label: "Based in", icon: MapPin },
  ];

  const interests = [
    "Data Science", "Machine Learning", "Deep Learning", "Computer Vision",
    "Natural Language Processing", "Statistical Analysis", "Data Visualization",
    "Web Development", "Cloud Computing", "Open Source"
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about turning data into meaningful insights and building intelligent systems
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* About Content */}
          <div className="space-y-8 fade-in-left">
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gradient mb-6">About Me</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {profile?.about_me || "Passionate about turning data into meaningful insights and building intelligent systems."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gradient mb-6">My Story</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {profile?.my_story || profile?.bio || "Hello! I'm Nirajan Khatiwada, a passionate data science enthusiast currently pursuing my Bsc. CSIT degree. What started as curiosity about how data can tell stories has evolved into a deep fascination with machine learning and artificial intelligence."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interests - Now sourced from Skills table */}
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gradient mb-6">Interests & Expertise</h3>
                <p className="text-muted-foreground mb-4">Check out the Skills section below for my detailed expertise areas</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge 
                      key={interest}
                      variant="secondary"
                      className="glass hover:bg-primary/20 transition-colors duration-300 cursor-pointer hover-lift"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6 fade-in-right animation-delay-400">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card 
                  key={stat.label}
                  className="glass hover-lift text-center group cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center group-hover:animate-bounce">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quote Card */}
            <Card className="glass bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-6xl text-primary/30">"</div>
                  <blockquote className="text-lg font-medium text-gradient italic">
                    Data is the new oil, but like oil, it has to be refined to be valuable.
                  </blockquote>
                  <div className="text-muted-foreground">— My Data Philosophy</div>
                </div>
              </CardContent>
            </Card>

            {/* Fun Fact */}
            <Card className="glass border-accent/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <div className="text-sm text-muted-foreground">
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