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
    const { github_url } = await req.json();

    // Extract owner and repo from GitHub URL
    const urlParts = github_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlParts) {
      throw new Error("Invalid GitHub URL");
    }

    const [, owner, repo] = urlParts;
    
    console.log("Fetching GitHub stats for:", owner, repo);

    // Fetch repository data from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repoData = await response.json();

    const stats = {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
    };

    console.log("GitHub stats fetched:", stats);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in fetch-github-stats function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);