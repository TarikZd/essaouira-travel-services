
'use server';

import { z } from 'zod';
import {
  personalizedServiceRecommendations,
  PersonalizedServiceRecommendationsInput,
} from '@/ai/flows/personalized-service-recommendations';
import { services, Service } from '@/lib/services';

const bookingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  date: z.string().min(1, 'Date is required.'),
  participants: z.number().min(1, 'At least one participant is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  specialRequests: z.string().optional(),
  serviceName: z.string(),
  time: z.string().optional(),
  extras: z.record(z.string().or(z.number())).optional(),
});

export async function submitBooking(formData: unknown) {
  const parsedData = bookingSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  // In a real application, you would send this data to a Google Apps Script URL
  // const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
  //   method: 'POST',
  //   body: JSON.stringify(parsedData.data),
  // });
  // if (!response.ok) {
  //   return { success: false, error: 'Failed to save booking.' };
  // }

  console.log('Booking data submitted:', parsedData.data);
  return { success: true, data: parsedData.data };
}

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
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { error: 'Failed to get recommendations from AI.' };
  }
}
