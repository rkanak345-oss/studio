'use server';

/**
 * @fileOverview Generates personalized referral messages using AI, incorporating current marketing trends.
 *
 * - generatePersonalizedReferralMessage - A function that generates personalized referral messages.
 * - GeneratePersonalizedReferralMessageInput - The input type for the generatePersonalizedReferralMessage function.
 * - GeneratePersonalizedReferralMessageOutput - The return type for the generatePersonalizedReferralMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTrendingTopicsSchema = z.object({
  topics: z.array(z.string()).describe('A list of trending topics from the web.'),
});

const getTrendingTopics = ai.defineTool(
  {
    name: 'getTrendingTopics',
    description: 'Retrieves current trending topics from the web related to marketing and finance.',
    inputSchema: z.object({}),
    outputSchema: GetTrendingTopicsSchema,
  },
  async () => {
    // In a real implementation, this would call a service that scrapes trending topics
    // For this example, we'll just return some hardcoded values.
    return { topics: ['AI Marketing', 'Financial Independence', 'Referral Programs', 'Passive Income'] };
  }
);

const GeneratePersonalizedReferralMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  referralCode: z.string().describe('The referral code of the user.'),
  productName: z.string().describe('The name of the product being referred.'),
});

export type GeneratePersonalizedReferralMessageInput =
  z.infer<typeof GeneratePersonalizedReferralMessageInputSchema>;

const GeneratePersonalizedReferralMessageOutputSchema = z.object({
  message: z.string().describe('The personalized referral message.'),
});

export type GeneratePersonalizedReferralMessageOutput =
  z.infer<typeof GeneratePersonalizedReferralMessageOutputSchema>;

export async function generatePersonalizedReferralMessage(
  input: GeneratePersonalizedReferralMessageInput
): Promise<GeneratePersonalizedReferralMessageOutput> {
  return generatePersonalizedReferralMessageFlow(input);
}

const generatePersonalizedReferralMessagePrompt = ai.definePrompt({
  name: 'generatePersonalizedReferralMessagePrompt',
  input: {schema: GeneratePersonalizedReferralMessageInputSchema},
  output: {schema: GeneratePersonalizedReferralMessageOutputSchema},
  tools: [getTrendingTopics],
  prompt: `You are an AI assistant specialized in creating engaging referral messages for social media.

  The user's name is: {{userName}}
  The referral code is: {{referralCode}}
  The product being referred is: {{productName}}

  Here are some trending topics that you must incorporate into the message to maximize its reach:
  {{#each (await getTrendingTopics).topics}}- {{this}}\n{{/each}}

  Create a short, attention-grabbing referral message that encourages people to sign up using the referral code.
  Make sure the message is friendly, and casual.
  Do not include any hashtags.

  MESSAGE:
`,
});

const generatePersonalizedReferralMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedReferralMessageFlow',
    inputSchema: GeneratePersonalizedReferralMessageInputSchema,
    outputSchema: GeneratePersonalizedReferralMessageOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedReferralMessagePrompt(input);
    return output!;
  }
);
