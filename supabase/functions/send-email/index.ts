import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client for authentication verification
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Input validation function
function validateContactData(data: any): ContactEmailRequest {
  const { name, email, subject, message } = data;
  
  // Basic validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw new Error('Name must be between 2 and 100 characters');
  }
  
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    throw new Error('Invalid email address');
  }
  
  if (!subject || typeof subject !== 'string' || subject.trim().length < 3 || subject.trim().length > 200) {
    throw new Error('Subject must be between 3 and 200 characters');
  }
  
  if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
    throw new Error('Message must be between 10 and 2000 characters');
  }

  // Sanitize inputs
  return {
    name: name.trim().replace(/[<>]/g, ''),
    email: email.trim().toLowerCase(),
    subject: subject.trim().replace(/[<>]/g, ''),
    message: message.trim().replace(/[<>]/g, '')
  };
}

// HTML sanitization for email content
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\n/g, '<br>');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData = await req.json();
    const validatedData = validateContactData(requestData);

    // Get recipient email from environment or default
    const recipientEmail = Deno.env.get("CONTACT_RECIPIENT_EMAIL") || "your-email@example.com";
    
    if (recipientEmail === "your-email@example.com") {
      throw new Error("Contact recipient email not configured");
    }

    const emailResponse = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizeHtml(validatedData.name)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(validatedData.email)}</p>
        <p><strong>Subject:</strong> ${sanitizeHtml(validatedData.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizeHtml(validatedData.message)}</p>
      `,
      reply_to: validatedData.email,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);