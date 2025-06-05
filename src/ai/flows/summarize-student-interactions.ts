// SummarizeStudentInteractions story implementation.
'use server';
/**
 * @fileOverview Summarizes student interactions within the EduQuest platform to provide teachers
 * with insights into collaboration, communication skills, and student struggles in group dynamics.
 *
 * - summarizeStudentInteractions - A function to summarize student interactions.
 * - SummarizeStudentInteractionsInput - The input type for the summarizeStudentInteractions function.
 * - SummarizeStudentInteractionsOutput - The return type for the summarizeStudentInteractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStudentInteractionsInputSchema = z.object({
  voiceChatAnalytics: z
    .string()
    .describe('The analytics data from voice chats during the EduQuest session.'),
  reflectionChamberLogs: z
    .string()
    .describe('Logs of student interactions within the Reflection Chamber.'),
});
export type SummarizeStudentInteractionsInput = z.infer<typeof SummarizeStudentInteractionsInputSchema>;

const SummarizeStudentInteractionsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of student interactions, highlighting collaboration, communication skills, and potential struggles.'
    ),
  strugglingStudents: z
    .array(z.string())
    .describe(
      'A list of student IDs who may be struggling with group dynamics or emotional expression.'
    ),
});
export type SummarizeStudentInteractionsOutput = z.infer<typeof SummarizeStudentInteractionsOutputSchema>;

export async function summarizeStudentInteractions(input: SummarizeStudentInteractionsInput): Promise<SummarizeStudentInteractionsOutput> {
  return summarizeStudentInteractionsFlow(input);
}

const summarizeStudentInteractionsPrompt = ai.definePrompt({
  name: 'summarizeStudentInteractionsPrompt',
  input: {schema: SummarizeStudentInteractionsInputSchema},
  output: {schema: SummarizeStudentInteractionsOutputSchema},
  prompt: `You are an AI assistant helping teachers understand student interactions within the EduQuest platform.

  Analyze the provided voice chat analytics and Reflection Chamber logs to provide a summary of student interactions.
  Highlight collaboration and communication skills demonstrated during the session.
  Identify students who may be struggling with group dynamics or emotional expression.

  Voice Chat Analytics:
  {{voiceChatAnalytics}}

  Reflection Chamber Logs:
  {{reflectionChamberLogs}}`,
});

const summarizeStudentInteractionsFlow = ai.defineFlow(
  {
    name: 'summarizeStudentInteractionsFlow',
    inputSchema: SummarizeStudentInteractionsInputSchema,
    outputSchema: SummarizeStudentInteractionsOutputSchema,
  },
  async input => {
    const {output} = await summarizeStudentInteractionsPrompt(input);
    return output!;
  }
);
