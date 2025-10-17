'use server';
/**
 * @fileOverview A Genkit flow to provide personalized service recommendations based on user search queries and browsing history.
 *
 * - personalizedServiceRecommendations - A function that returns personalized service recommendations.
 * - PersonalizedServiceRecommendationsInput - The input type for the personalizedServiceRecommendations function.
 * - PersonalizedServiceRecommendationsOutput - The return type for the personalizedServiceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedServiceRecommendationsInputSchema = z.object({
  searchQuery: z.string().describe('The user\'s search query.'),
  browsingHistory: z.array(z.string()).describe('The user\'s browsing history (list of service names or page URLs).'),
  availableServices: z.array(z.string()).describe('The list of available tourism services.'),
});
export type PersonalizedServiceRecommendationsInput = z.infer<typeof PersonalizedServiceRecommendationsInputSchema>;

const PersonalizedServiceRecommendationsOutputSchema = z.object({
  recommendedServices: z.array(z.string()).describe('A list of recommended tourism services based on the user\'s search query and browsing history.'),
  reasoning: z.string().describe('Explanation of why the services were recommended.'),
});
export type PersonalizedServiceRecommendationsOutput = z.infer<typeof PersonalizedServiceRecommendationsOutputSchema>;

export async function personalizedServiceRecommendations(input: PersonalizedServiceRecommendationsInput): Promise<PersonalizedServiceRecommendationsOutput> {
  return personalizedServiceRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedServiceRecommendationsPrompt',
  input: {schema: PersonalizedServiceRecommendationsInputSchema},
  output: {schema: PersonalizedServiceRecommendationsOutputSchema},
  prompt: `You are a tourism recommendation expert. Given a user's search query, browsing history, and available services, you will recommend the most relevant services to the user.

Search Query: {{{searchQuery}}}
Browsing History: {{#if browsingHistory}}{{#each browsingHistory}}- {{{this}}}{{/each}}{{else}}No browsing history{{/if}}
Available Services: {{#each availableServices}}- {{{this}}}{{/each}}

Based on the above information, recommend the top services and briefly explain your reasoning for each recommendation.

Format your response as follows:

Recommended Services:
- Service 1: Reasoning
- Service 2: Reasoning
...

{{#each availableServices}}
{{/each}}`,
});

const personalizedServiceRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedServiceRecommendationsFlow',
    inputSchema: PersonalizedServiceRecommendationsInputSchema,
    outputSchema: PersonalizedServiceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const parsedOutput = output!.text.split('\n').reduce((acc, line) => {
      if (line.startsWith("-")) {
        const [service, reasoning] = line.substring(2).split(":").map(s => s.trim());
        acc.recommendedServices.push(service);
        acc.reasoning += `- ${service}: ${reasoning}\n`;
      }
      return acc;
    }, {recommendedServices: [], reasoning: ''});

    return {
      recommendedServices: parsedOutput.recommendedServices,
      reasoning: parsedOutput.reasoning,
    };
  }
);

