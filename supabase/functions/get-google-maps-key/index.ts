
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!apiKey) {
      console.log('GOOGLE_MAPS_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to your Supabase secrets.' }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    }

    return new Response(
      JSON.stringify({ apiKey }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error('Error fetching API key:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Google Maps API key' }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
  }
})
