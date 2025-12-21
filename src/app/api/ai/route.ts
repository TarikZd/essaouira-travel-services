import { NextResponse } from 'next/server';
import { services } from '@/lib/services';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY;

export async function POST(req: Request) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Configuration Error: Missing AI API Key.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { searchQuery, browsingHistory } = body;

    if (!searchQuery) {
      return NextResponse.json({ error: 'Please enter a search query.' }, { status: 400 });
    }

    const availableServiceNames = services.map((s) => s.name).join(', ');
    const historyStr = browsingHistory && browsingHistory.length > 0 ? browsingHistory.join(', ') : 'None';

    const prompt = `
      You are an expert travel assistant for Essaouira Travel Services.
      
      Available Services:
      ${availableServiceNames}
      
      User's Search/Request: "${searchQuery}"
      User's Browsing History: ${historyStr}
      
      Based on the user's request and history, recommend the top 3 most relevant services from the available list.
      Provide a brief reasoning for your selection.
      
      Return ONLY a JSON object with this exact structure (no markdown formatting):
      {
        "recommendedServices": ["service_name_1", "service_name_2"],
        "reasoning": "explanation here"
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
       throw new Error('No content generated');
    }

    // Clean up markdown code blocks if present (Gemini often wraps JSON in ```json ... ```)
    const cleanedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult;
    try {
        parsedResult = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("AI returned invalid data format.");
    }

    const recommendedServices = services.filter((service) =>
      parsedResult.recommendedServices.includes(service.name)
    );
    
    // Sort based on AI order
    recommendedServices.sort((a, b) => {
      const indexA = parsedResult.recommendedServices.indexOf(a.name);
      const indexB = parsedResult.recommendedServices.indexOf(b.name);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    return NextResponse.json({
      recommendedServices: recommendedServices,
      reasoning: parsedResult.reasoning
    });

  } catch (error: any) {
    console.error('Error in AI route:', error);
    return NextResponse.json({ error: 'Failed to get recommendations from AI.' }, { status: 500 });
  }
}
