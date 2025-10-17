
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
  date: z.string(), // Can be empty if not provided
  adults: z.coerce.number().min(1, 'At least one adult is required.'),
  children: z.coerce.number().min(0, 'Number of children cannot be negative.').optional(),
  phone: z.string().min(1, 'Phone number is required.'),
  specialRequests: z.string().optional(),
  serviceName: z.string(),
  time: z.string().optional(),
  // Use .any() for extras to allow any structure
  pickupLocation: z.any().optional(),
  dropoffLocation: z.any().optional(),
  packageType: z.any().optional(),
  dishPreference: z.any().optional(),
  dietaryRestrictions: z.any().optional(),
  lunchPreference: z.any().optional(),
});


export async function submitBooking(formData: unknown) {
  const parsedData = bookingSchema.safeParse(formData);

  if (!parsedData.success) {
    console.error('Booking validation error:', parsedData.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data provided.' };
  }

  if (!process.env.GOOGLE_APPS_SCRIPT_URL) {
    console.log('Booking data submitted (Google Apps Script URL not configured):', parsedData.data);
    // In a production environment, you might want to return an error here.
    // For now, we'll proceed as if successful for the WhatsApp redirect.
    return { success: true, data: parsedData.data };
  }

  try {
    const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedData.data),
    });

    if (!response.ok) {
       const errorText = await response.text();
      console.error('Failed to save booking:', errorText);
      return { success: false, error: `Failed to save booking. Server responded with: ${errorText}` };
    }

    console.log('Booking data successfully submitted:', parsedData.data);
    return { success: true, data: parsedData.data };

  } catch (error) {
    console.error('Error submitting booking to Google Apps Script:', error);
    if (error instanceof Error) {
        return { success: false, error: `An network error occurred: ${error.message}` };
    }
    return { success: false, error: 'An unknown network error occurred while submitting the booking.' };
  }
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

    