import React, { useState, useEffect } from 'react';
import { Heart, Github, Linkedin, Twitter, Mail, ArrowUp, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#skills', label: 'Skills' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
  ];

  const projectLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#videos', label: 'Videos' },
    { href: '#posts', label: 'Posts' },
    { href: '#contact', label: 'Contact' },
  ];

  const socialLinks = [
    { 
      icon: Github, 
      href: profile?.github_url || 'https://github.com/yenke-rajan', 
      label: 'GitHub',
      show: profile?.github_url || true
    },
    { 
      icon: Linkedin, 
      href: profile?.linkedin_url || 'https://www.linkedin.com/in/yenke-rajan/', 
      label: 'LinkedIn',
      show: profile?.linkedin_url || true
    },
    { 
      icon: Twitter, 
      href: profile?.twitter_url || 'https://twitter.com/Mr_NKrajan', 
      label: 'Twitter',
      show: profile?.twitter_url || true
    },
    { 
      icon: Instagram, 
      href: profile?.instagram_url, 
      label: 'Instagram',
      show: !!profile?.instagram_url
    },
    { 
      icon: Mail, 
      href: `mailto:${profile?.email_contact || 'nirajan.khatiwada@email.com'}`, 
      label: 'Email',
      show: true
    },
  ].filter(link => link.show);

  return (
    <footer className="relative bg-card border-t border-border/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(240 100% 70%) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, hsl(280 100% 70%) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gradient">Nirajan Khatiwada</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Data Science enthusiast turning raw data into meaningful insights. 
                Currently pursuing Bsc. CSIT and building the future, one algorithm at a time.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="sm"
                  className="glass border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 p-2"
                  onClick={() => window.open(social.href, '_blank')}
                >
                  <social.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Fun Quote */}
            <div className="text-sm text-accent italic">
              "Data is the compass that guides us through the wilderness of uncertainty."
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Portfolio</h4>
            <ul className="space-y-2">
              {projectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2024 Nirajan Khatiwada. Built with</span>
            <Heart className="h-4 w-4 text-accent animate-pulse" />
            <span>and lots of coffee</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Scroll to top
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="glass border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 p-2"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 btn-glow bg-gradient-primary border-0 w-12 h-12 rounded-full p-0 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          opacity: typeof window !== 'undefined' && window.scrollY > 500 ? 1 : 0
        }}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;