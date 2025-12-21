import { NextResponse } from 'next/server';
import {
  personalizedServiceRecommendations,
  PersonalizedServiceRecommendationsInput,
} from '@/ai/flows/personalized-service-recommendations';
import { services } from '@/lib/services';

export const runtime = 'edge'; // Ensure we use Edge runtime for Cloudflare
export const dynamic = 'force-dynamic'; // Prevent static caching

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchQuery, browsingHistory } = body;

    if (!searchQuery) {
      return NextResponse.json({ error: 'Please enter a search query.' }, { status: 400 });
    }

    const availableServiceNames = services.map((s) => s.name);

    const input: PersonalizedServiceRecommendationsInput = {
      searchQuery,
      browsingHistory: browsingHistory || [],
      availableServices: availableServiceNames,
    };

    const result = await personalizedServiceRecommendations(input);

    const recommendedServices = services.filter((service) =>
      result.recommendedServices.includes(service.name)
    );
    
    // Ensure the order from the AI is preserved
    recommendedServices.sort((a, b) => {
      return result.recommendedServices.indexOf(a.name) - result.recommendedServices.indexOf(b.name);
    });

    return NextResponse.json({
      recommendedServices: recommendedServices,
      reasoning: result.reasoning
    });

  } catch (error: any) {
    console.error('Error getting recommendations API:', error);
    if (!process.env.GOOGLE_GENAI_API_KEY) {
       console.error('GOOGLE_GENAI_API_KEY is missing');
       return NextResponse.json({ error: 'Configuration Error: Missing AI API Key.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to get recommendations from AI.' }, { status: 500 });
  }
}
