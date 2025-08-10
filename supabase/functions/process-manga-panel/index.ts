import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scene } = await req.json();
    console.log('Processing manga panel request...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Generate me manga panel from this image and the scene I have written: "${scene}". Make me multiple scenes on a page like an actual manga also use black and white theme with black outline of the character and white background. Transform this into a professional manga style with clear panels, speech bubbles if needed, and dynamic action sequences.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    // For now, we'll return the text response since GPT-4o with vision doesn't generate images
    // In a real implementation, you'd want to use DALL-E for image generation
    const mangaDescription = data.choices[0].message.content;

    // Generate the actual manga panel using DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Create a manga panel based on this description: ${mangaDescription}. Style: Black and white manga art with bold black outlines, white background, dynamic poses, professional manga layout with clear panel divisions. Multiple scenes arranged like a real manga page.`,
        size: '1024x1024',
        quality: 'hd',
        n: 1
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      console.error('DALL-E API error:', errorData);
      throw new Error(`DALL-E API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await imageResponse.json();
    const mangaPanelUrl = imageData.data[0].url;

    console.log('Manga panel generated successfully');

    return new Response(JSON.stringify({ 
      mangaPanelUrl,
      description: mangaDescription 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-manga-panel function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process manga panel' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});