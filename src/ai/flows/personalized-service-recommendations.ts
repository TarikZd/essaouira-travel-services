
import { z } from 'zod';
import { ai } from '../genkit';

export const PersonalizedServiceRecommendationsInputSchema = z.object({
  searchQuery: z.string(),
  browsingHistory: z.array(z.string()),
  availableServices: z.array(z.string()),
});

export type PersonalizedServiceRecommendationsInput = z.infer<typeof PersonalizedServiceRecommendationsInputSchema>;

export const PersonalizedServiceRecommendationsOutputSchema = z.object({
  recommendedServices: z.array(z.string()),
  reasoning: z.string(),
});

export type PersonalizedServiceRecommendationsOutput = z.infer<typeof PersonalizedServiceRecommendationsOutputSchema>;

export const personalizedServiceRecommendations = ai.defineFlow(
  {
    name: 'personalizedServiceRecommendations',
    inputSchema: PersonalizedServiceRecommendationsInputSchema,
    outputSchema: PersonalizedServiceRecommendationsOutputSchema,
  },
  async (input) => {
    const { searchQuery, browsingHistory, availableServices } = input;

    const prompt = `
      You are an expert travel assistant for Essaouira Travel Services.
      
      Available Services:
      ${availableServices.join(', ')}
      
      User's Search/Request: "${searchQuery}"
      User's Browsing History: ${browsingHistory.join(', ')}
      
      Based on the user's request and history, recommend the top 3 most relevant services from the available list.
      Provide a brief reasoning for your selection, explaining why these specific activities fit their needs.
      
      Return the output as a JSON object with:
      - recommendedServices: an array of strings (exact names from the available list)
      - reasoning: a string explanation
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: PersonalizedServiceRecommendationsOutputSchema },
    });

    if (!output) {
      throw new Error('Failed to generate recommendations');
    }

    return output;
  }
);
