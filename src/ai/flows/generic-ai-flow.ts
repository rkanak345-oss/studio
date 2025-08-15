'use server';

/**
 * @fileOverview A generic AI flow for answering questions.
 *
 * - askAi - A function that handles a generic AI query.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAiInputSchema = z.object({
  prompt: z.string().describe('The prompt to send to the AI.'),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;

const AskAiOutputSchema = z.object({
  response: z.string().describe('The response from the AI.'),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
  return genericAiFlow(input);
}

const genericAiFlow = ai.defineFlow(
  {
    name: 'genericAiFlow',
    inputSchema: AskAiInputSchema,
    outputSchema: AskAiOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      prompt: input.prompt,
    });

    return { response: llmResponse.text };
  }
);
