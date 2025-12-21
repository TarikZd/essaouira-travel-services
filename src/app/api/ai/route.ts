import { NextResponse } from 'next/server';
import { services } from '@/lib/services';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY?.trim();

export async function POST(req: Request) {
  // Debug Logging for Environment
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

  try {
    const attempts = [
        { model: 'gemini-1.5-flash', version: 'v1beta' },
        { model: 'gemini-1.5-flash', version: 'v1' },
        { model: 'gemini-1.5-flash-001', version: 'v1beta' },
        { model: 'gemini-pro', version: 'v1beta' },
    ];

    let data = null;
    let lastError = null;

    for (const attempt of attempts) {
        try {
            console.log(`AI Route: Attempting ${attempt.model} (${attempt.version})...`);
            const url = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${GOOGLE_API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                data = await response.json();
                console.log(`AI Route: Success with ${attempt.model} (${attempt.version})`);
                break; 
            } else {
                 const errorText = await response.text();
                 console.warn(`AI Route: Failed ${attempt.model}:`, response.status, errorText);
                 lastError = `${attempt.model} (${response.status}): ${errorText.substring(0, 100)}`;
            }
        } catch (e: any) {
            console.warn(`AI Route: Network error ${attempt.model}:`, e.message);
            lastError = `${attempt.model} Network: ${e.message}`;
        }
    }

    if (!data) {
       console.error("AI Route: All models failed.");
       return NextResponse.json({ error: `AI Error: All attempts failed. Last: ${lastError}` }, { status: 500 });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
       console.error("AI Route: No content generated", data);
       return NextResponse.json({ error: 'AI returned empty response.' }, { status: 500 });
    }

    // Clean markdown
    const cleanedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
        parsedResult = JSON.parse(cleanedText);
    } catch (e) {
        console.error("AI Route: JSON Parse Error", cleanedText);
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
