import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtube_url } = await req.json();

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(youtube_url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    console.log("Fetching YouTube data for video ID:", videoId);

    // For now, we'll return mock data as YouTube API requires an API key
    // In a real implementation, you would use YouTube Data API v3
    const videoData = {
      youtube_id: videoId,
      title: "Video Title (Auto-generated)",
      description: "Video description would be fetched from YouTube API",
      thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: "10:30",
      views: "1.2K",
      likes: "45",
      published_at: new Date().toISOString().split('T')[0],
    };

    console.log("YouTube data prepared:", videoData);

    return new Response(JSON.stringify(videoData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in fetch-youtube-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

serve(handler);