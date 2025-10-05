import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z.string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
});

// Profile validation schema
export const profileSchema = z.object({
  display_name: z.string()
    .trim()
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  bio: z.string()
    .trim()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  location: z.string()
    .trim()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  phone_number: z.string()
    .trim()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  email_contact: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  my_story: z.string()
    .trim()
    .max(5000, 'Story must be less than 5000 characters')
    .optional(),
  about_me: z.string()
    .trim()
    .max(1000, 'About me must be less than 1000 characters')
    .optional(),
  github_url: z.string()
    .trim()
    .url('Please enter a valid GitHub URL')
    .refine(url => url.includes('github.com'), 'Must be a GitHub URL')
    .optional()
    .or(z.literal('')),
  linkedin_url: z.string()
    .trim()
    .url('Please enter a valid LinkedIn URL')
    .refine(url => url.includes('linkedin.com'), 'Must be a LinkedIn URL')
    .optional()
    .or(z.literal('')),
  twitter_url: z.string()
    .trim()
    .url('Please enter a valid Twitter URL')
    .refine(url => url.includes('twitter.com') || url.includes('x.com'), 'Must be a Twitter/X URL')
    .optional()
    .or(z.literal('')),
  instagram_url: z.string()
    .trim()
    .url('Please enter a valid Instagram URL')
    .refine(url => url.includes('instagram.com'), 'Must be an Instagram URL')
    .optional()
    .or(z.literal('')),
  avatar_url: z.string().optional(),
  semester: z.string()
    .trim()
    .max(50, 'Semester must be less than 50 characters')
    .optional(),
  years_coding: z.string()
    .trim()
    .max(50, 'Years coding must be less than 50 characters')
    .optional(),
  projects_count: z.string()
    .trim()
    .max(50, 'Projects count must be less than 50 characters')
    .optional()
});

// Skills validation schema
export const skillSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s\+\#\.\-]+$/, 'Skill name contains invalid characters'),
  category: z.enum(['technical', 'design', 'business', 'language', 'other']),
  proficiency_level: z.number()
    .int()
    .min(1, 'Proficiency level must be at least 1')
    .max(5, 'Proficiency level must be at most 5')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type SkillData = z.infer<typeof skillSchema>;