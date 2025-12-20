
'use server';

import { z } from 'zod';
import {
  personalizedServiceRecommendations,
  PersonalizedServiceRecommendationsInput,
} from '@/ai/flows/personalized-service-recommendations';
import { services, Service } from '@/lib/services';

export async function getRecommendations(
  searchQuery: string,
  browsingHistory: string[]
): Promise<{ recommendedServices: Service[], reasoning: string } | { error: string }> {
  if (!searchQuery) {
    return { error: 'Please enter a search query.' };
  }

  try {
    const availableServiceNames = services.map((s) => s.name);

    const input: PersonalizedServiceRecommendationsInput = {
      searchQuery,
      browsingHistory,
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

    return {
      recommendedServices: recommendedServices,
      reasoning: result.reasoning
    };
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    if (!process.env.GOOGLE_GENAI_API_KEY) {
       console.error('GOOGLE_GENAI_API_KEY is missing');
       return { error: 'Configuration Error: Missing AI API Key.' };
    }
    return { error: 'Failed to get recommendations from AI.' };
  }
}
