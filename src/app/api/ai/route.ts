import { NextResponse } from 'next/server';
import { services } from '@/lib/services';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY?.trim();

export async function POST(req: Request) {
  console.log("AI Route: API Key Length:", GOOGLE_API_KEY ? GOOGLE_API_KEY.length : "Undefined");

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Config Error: API Key missing on server.' }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { searchQuery, browsingHistory } = body;

  if (!searchQuery) {
    return NextResponse.json({ error: 'Please enter a search query.' }, { status: 400 });
  }

  const availableServiceNames = services.map((s) => s.name).join(', ');
  const historyStr = browsingHistory && Array.isArray(browsingHistory) ? browsingHistory.join(', ') : 'None';

  const prompt = `
    You are an expert travel assistant for "Taxi Essaouira".
    
    Available Services:
    ${availableServiceNames}
    
    User's Search/Request: "${searchQuery}"
    User's Browsing History: ${historyStr}
    
    Recommend the top 3 most relevant services.
    
    Return ONLY a JSON object:
    {
      "recommendedServices": ["exact_service_name_1", "exact_service_name_2"],
      "reasoning": "brief explanation"
    }
  `;

  let selectedModel = 'gemini-1.5-flash'; // Fallback default

  try {
      // Step 1: Dynamically discover available models
      console.log("AI Route: Discovering available models...");
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GOOGLE_API_KEY}`);
      
      if (listRes.ok) {
          const listData = await listRes.json();
          const models = listData.models || [];
          
          // Filter for models that support content generation
          const viableModels = models.filter((m: any) => 
              m.supportedGenerationMethods?.includes('generateContent')
          );

          // Priority selection
          const bestModel = viableModels.find((m: any) => m.name.includes('gemini-1.5-flash')) ||
                            viableModels.find((m: any) => m.name.includes('gemini-1.5-pro')) ||
                            viableModels.find((m: any) => m.name.includes('gemini-pro')) ||
                            viableModels[0];

          if (bestModel) {
              // API returns "models/gemini-1.5-flash", we usually need just the ID if we construct URL with models/ prefix
              // But if we use the full name from the API, it's safer.
              // The API expects: /v1beta/{model=models/*}:generateContent
              // So we can use the full name directly.
              selectedModel = bestModel.name; 
              console.log(`AI Route: Creating content with discovered model: ${selectedModel}`);
          }
      } else {
          console.warn("AI Route: Model discovery failed status:", listRes.status);
          // If 403, key is bad. If 404, endpoint bad.
          if (listRes.status === 400 || listRes.status === 403) {
             const err = await listRes.text();
             return NextResponse.json({ error: `API Key Error during discovery: ${err}` }, { status: 500 });
          }
      }
  } catch (e) {
      console.warn("AI Route: Discovery network error:", e);
  }

  try {
    // Step 2: Generate Content
    // Note: selectedModel might be "models/gemini-1.5-flash" or just "gemini-1.5-flash" (if default).
    // The endpoint is .../v1beta/{model}:generateContent
    // If selectedModel is "models/gemini...", the URL becomes .../v1beta/models/gemini... which works?
    // Actually, documentation says POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
    // So if selectedModel is "models/gemini-pro", the path is .../v1beta/models/gemini-pro... which duplicates 'models'?
    // Wait. "models/gemini-pro" is the resource name.
    // The URL pattern is `https://generativelanguage.googleapis.com/v1beta/{name}:generateContent`
    // So if name is `models/gemini-1.5-flash`, the URL is `.../v1beta/models/gemini-1.5-flash:generateContent`.
    // My previous code did `.../v1beta/models/${model}:g...` where model was just ID.
    // So if selectedModel has "models/" prefix, I should NOT add it again in URL or use it as {name}.
    
    let modelResourceName = selectedModel;
    if (!modelResourceName.startsWith('models/')) {
        modelResourceName = `models/${modelResourceName}`;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/${modelResourceName}:generateContent?key=${GOOGLE_API_KEY}`;
    
    console.log(`AI Route: Generating with ${url.split('?')[0]}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Route: Generation Error:", response.status, errorText);
        return NextResponse.json({ error: `Generation Failed (${response.status}): ${errorText.substring(0, 200)}` }, { status: 500 });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
       return NextResponse.json({ error: 'AI returned empty response.' }, { status: 500 });
    }

    // Clean markdown
    const cleanedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
        parsedResult = JSON.parse(cleanedText);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to parse AI response.' }, { status: 500 });
    }

    const recommendedServices = services.filter((service) =>
      parsedResult.recommendedServices.includes(service.name)
    );
    
    return NextResponse.json({
      recommendedServices: recommendedServices,
      reasoning: parsedResult.reasoning
    });

  } catch (error: any) {
    console.error('AI Route: Critical Error:', error);
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
