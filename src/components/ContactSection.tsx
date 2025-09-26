import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Mail, MessageCircle, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: profile?.email_contact || "nirajan.khatiwada@email.com",
      href: `mailto:${profile?.email_contact || "nirajan.khatiwada@email.com"}`,
      color: "text-primary"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+977 98X-XXX-XXXX",
      href: "tel:+977981234567",
      color: "text-accent"
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile?.location || "Kathmandu, Nepal",
      href: "#",
      color: "text-success"
    },
    {
      icon: MessageCircle,
      label: "Response Time",
      value: "Within 24 hours",
      href: "#",
      color: "text-warning"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/nirajan",
      color: "hover:text-primary"
    },
    {
      icon: Linkedin,
      label: "LinkedIn", 
      href: "https://linkedin.com/in/nirajan-khatiwada",
      color: "hover:text-accent"
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/nirajan_k",
      color: "hover:text-primary"
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/nirajan.k",
      color: "hover:text-accent"
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Let's Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to chat about data science? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="glass fade-in-left">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gradient">Send a Message</h3>
                  <p className="text-muted-foreground">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="glass border-primary/30 focus:border-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="glass border-primary/30 focus:border-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="glass border-primary/30 focus:border-primary"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="glass border-primary/30 focus:border-primary resize-none"
                      placeholder="Tell me about your project or just say hello..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-glow bg-gradient-primary border-0 py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info & Social */}
          <div className="space-y-8 fade-in-right animation-delay-400">
            {/* Contact Information */}
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gradient mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={info.label}
                      className="flex items-center gap-4 group cursor-pointer hover-lift"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center group-hover:animate-bounce`}>
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        <p className={`font-medium ${info.color} group-hover:scale-105 transition-transform duration-300`}>
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gradient mb-6">Follow Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={social.label}
                      variant="outline"
                      className={`glass border-primary/30 hover:bg-primary/10 ${social.color} transition-colors duration-300 justify-start`}
                      onClick={() => window.open(social.href, '_blank')}
                    >
                      <social.icon className="h-5 w-5 mr-2" />
                      {social.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="glass border-success/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-bold text-success">Available for Projects</h4>
                    <p className="text-muted-foreground text-sm">
                      Currently accepting new opportunities and collaborations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fun Contact Fact */}
            <Card className="glass bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">🎯</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gradient">Quick Response Guarantee</h4>
                    <p className="text-muted-foreground text-sm">
                      I typically respond to messages within 24 hours. Let's make something amazing together!
                    </p>
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

export default ContactSection;