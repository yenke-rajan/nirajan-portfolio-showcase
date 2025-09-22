import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowDown, MessageCircle, Download } from 'lucide-react';
import heroBackground from '../assets/hero-bg.jpg';
import profilePhoto from '../assets/profile-photo.jpg';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Heyy there!! You can call me the Sherlock Holmes of data.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden neural-bg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-20 animate-float"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (3 + Math.random() * 2) + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="space-y-8 fade-in-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="text-gradient">Nirajan</span>
                <br />
                <span className="text-foreground">Khatiwada</span>
              </h1>
              
              <div className="text-xl lg:text-2xl text-muted-foreground min-h-[3rem]">
                <span className="inline-block border-r-2 border-primary animate-pulse">
                  {displayText}
                </span>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                A man who will need no introduction in the near future, but for now a 6th semester 
                Bsc. CSIT student hustling to create some chaos in the field of Data Science.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-glow bg-gradient-primary border-0 hover:shadow-glow-primary px-8 py-4 text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with Me
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="glass border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Button>
            </div>

            {/* Fun Prediction Text */}
            <div className="text-sm text-accent animate-pulse">
              btw, I predicted your visit to this site before 2 seconds ✨
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative fade-in-right animation-delay-400">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 animate-glow-pulse"></div>
              
              {/* Profile Photo */}
              <div className="relative glass rounded-full p-2">
                <img
                  src={profilePhoto}
                  alt="Nirajan Khatiwada"
                  className="w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-primary/20"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-float animation-delay-200"></div>
              <div className="absolute -bottom-8 -left-8 w-6 h-6 bg-primary rounded-full animate-float animation-delay-600"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;