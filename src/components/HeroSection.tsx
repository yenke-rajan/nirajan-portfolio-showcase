import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowDown, MessageCircle, Download, Sun, Moon } from 'lucide-react';
import heroBackground from '../assets/hero-bg.jpg';
import profilePhoto from '../assets/profile-photo.jpg';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [profileClicked, setProfileClicked] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const fullText = "Heyy there!! You can call me the Sherlock Holmes of data.";
  
  const photoPosition = theme === 'light' ? 'right' : 'left';
  
  const handlePhotoClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
                {profile?.bio || "A man who will need no introduction in the near future, but for now a 6th semester Bsc. CSIT student hustling to create some chaos in the field of Data Science."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-glow bg-gradient-primary border-0 hover:shadow-glow-primary px-8 py-4 text-lg"
                onClick={() => {
                  const phoneNumber = profile?.phone_number;
                  if (phoneNumber) {
                    // Remove any non-digit characters and ensure it starts with country code
                    const cleanNumber = phoneNumber.replace(/\D/g, '');
                    window.open(`https://wa.me/${cleanNumber}`, '_blank');
                  } else {
                    alert('Phone number not available. Please add it in the Admin Dashboard.');
                  }
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with Me
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="glass border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg"
                onClick={async () => {
                  try {
                    // Get the latest CV file
                    const { data, error } = await supabase.storage
                      .from('cv-files')
                      .list('', {
                        limit: 1,
                        sortBy: { column: 'created_at', order: 'desc' }
                      });

                    if (error) throw error;

                    if (data && data.length > 0) {
                      const fileName = data[0].name;
                      const { data: publicUrl } = supabase.storage
                        .from('cv-files')
                        .getPublicUrl(fileName);
                      
                      window.open(publicUrl.publicUrl, '_blank');
                    } else {
                      alert('CV not available yet. Please check back later!');
                    }
                  } catch (error) {
                    console.error('Error downloading CV:', error);
                    alert('Failed to download CV');
                  }
                }}
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

          {/* Profile Image Slider */}
          <div className="relative fade-in-right animation-delay-400">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20 animate-glow-pulse"></div>
              
              {/* Slider Container */}
              <div className="relative w-[400px] h-80 lg:w-[480px] lg:h-96 bg-muted/20 rounded-full glass cursor-pointer overflow-hidden" onClick={handlePhotoClick}>
                
                {/* Slider Track Background */}
                <div className={`absolute inset-0 transition-all duration-500 rounded-full ${
                  photoPosition === 'right' 
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20' 
                    : 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20'
                }`}></div>
                
                {/* Profile Image - Slides from left to right */}
                <div className={`absolute top-4 transition-all duration-500 ease-in-out ${
                  photoPosition === 'right' 
                    ? 'right-4 transform-none' 
                    : 'left-4 transform-none'
                }`}>
                  <img
                    src={profile?.avatar_url || profilePhoto}
                    alt={profile?.display_name || "Nirajan Khatiwada"}
                    className="w-72 h-72 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
                
                {/* Theme Icons */}
                <div className={`absolute top-1/2 left-6 transform -translate-y-1/2 transition-all duration-300 ${
                  photoPosition === 'left' ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                }`}>
                  <Moon className="h-8 w-8 text-indigo-400" />
                </div>
                <div className={`absolute top-1/2 right-6 transform -translate-y-1/2 transition-all duration-300 ${
                  photoPosition === 'right' ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                }`}>
                  <Sun className="h-8 w-8 text-yellow-500" />
                </div>
                
                {/* Slider Indicator */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${photoPosition === 'left' ? 'bg-indigo-400' : 'bg-muted-foreground/50'}`}></div>
                  <div className="w-8 h-1 bg-muted-foreground/30 rounded-full relative">
                    <div className={`absolute top-0 w-3 h-1 bg-primary rounded-full transition-transform duration-500 ${
                      photoPosition === 'right' ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </div>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${photoPosition === 'right' ? 'bg-yellow-500' : 'bg-muted-foreground/50'}`}></div>
                </div>
                
                {/* Click hint text */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  Click to toggle theme
                </div>
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