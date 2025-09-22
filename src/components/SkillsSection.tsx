import React from 'react';
import { Card, CardContent } from './ui/card';
import dataAnalysisIcon from '../assets/data-analysis-icon.png';
import mlIcon from '../assets/ml-icon.png';
import graphicsIcon from '../assets/graphics-icon.png';

const SkillsSection = () => {
  const skills = [
    {
      title: "DATA ANALYSIS",
      description: "Transforming raw data into actionable insights with precision and creativity.",
      icon: dataAnalysisIcon,
      gradient: "bg-gradient-primary",
      details: ["Python", "R", "SQL", "Pandas", "NumPy", "Statistical Analysis"]
    },
    {
      title: "MACHINE LEARNING", 
      description: "Have been training Jarvis in the leisure period.",
      icon: mlIcon,
      gradient: "bg-gradient-secondary",
      details: ["TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning", "NLP", "Computer Vision"]
    },
    {
      title: "GRAPHICS & VISUALIZATION",
      description: "A modern day Picasso crafting beautiful data stories.", 
      icon: graphicsIcon,
      gradient: "bg-gradient-accent",
      details: ["Matplotlib", "Seaborn", "Plotly", "D3.js", "Tableau", "Power BI"]
    }
  ];

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

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <Card 
              key={skill.title}
              className={`glass hover-lift cursor-pointer group fade-in-up transition-all duration-500`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-8 text-center space-y-6">
                {/* Icon */}
                <div className="relative">
                  <div className={`w-20 h-20 mx-auto rounded-full ${skill.gradient} p-0.5 animate-glow-pulse`}>
                    <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                      <img 
                        src={skill.icon} 
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
                  {skill.details.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 ${skill.gradient} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

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