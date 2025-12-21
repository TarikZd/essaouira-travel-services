import { NextResponse } from 'next/server';
import { services } from '@/lib/services';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();


export async function POST(req: Request) {
  if (!OPENAI_API_KEY) {
    console.error("AI Route: OPENAI_API_KEY is missing.");
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

  const systemPrompt = `
    You are an expert travel assistant for "Taxi Essaouira".
    
    Available Services:
    ${availableServiceNames}
    
    Recommend the top 3 most relevant services based on the user's request and history.
    
    Return ONLY a JSON object with this exact structure:
    {
      "recommendedServices": ["exact_service_name_1", "exact_service_name_2"],
      "reasoning": "brief explanation"
    }
  `;

  const userMessage = `User Request: "${searchQuery}"\nBrowsing History: ${historyStr}`;

  try {
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" } // Enforce JSON mode
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Route: OpenAI generation Error:", response.status, errorText);
        return NextResponse.json({ error: `AI Provider Error (${response.status})` }, { status: 500 });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
       return NextResponse.json({ error: 'AI returned empty response.' }, { status: 500 });
    }

    let parsedResult;
    try {
        parsedResult = JSON.parse(generatedText);
    } catch (e) {
        console.error("AI Route: JSON Parse Error", generatedText);
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
