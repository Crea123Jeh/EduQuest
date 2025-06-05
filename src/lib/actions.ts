'use server';

import { generateDynamicQuests as genkitGenerateDynamicQuests } from '@/ai/flows/generate-dynamic-quests';
import type { GenerateDynamicQuestsInput, GenerateDynamicQuestsOutput } from '@/ai/flows/generate-dynamic-quests';

export async function generateDynamicQuestsAction(
  input: GenerateDynamicQuestsInput
): Promise<GenerateDynamicQuestsOutput> {
  try {
    // Assuming studentLearningHistory might come from a database or another service in a real app.
    // For now, we'll pass it through if provided, or use a default.
    const fullInput: GenerateDynamicQuestsInput = {
      studentLearningHistory: input.studentLearningHistory || "No specific learning history available. Focus on general concepts.",
      topic: input.topic,
      difficultyLevel: input.difficultyLevel,
      numberOfQuestions: input.numberOfQuestions,
    };
    
    const result = await genkitGenerateDynamicQuests(fullInput);
    return result;
  } catch (error) {
    console.error('Error generating dynamic quests:', error);
    // It's good practice to return a structured error or throw a custom error
    // that the client can handle gracefully.
    return { questions: [`Error generating questions: ${error instanceof Error ? error.message : 'Unknown error'}`] };
  }
}

// Placeholder for summarizeStudentInteractions if needed later
// import { summarizeStudentInteractions as genkitSummarizeStudentInteractions } from '@/ai/flows/summarize-student-interactions';
// import type { SummarizeStudentInteractionsInput, SummarizeStudentInteractionsOutput } from '@/ai/flows/summarize-student-interactions';

// export async function summarizeStudentInteractionsAction(
//   input: SummarizeStudentInteractionsInput
// ): Promise<SummarizeStudentInteractionsOutput> {
//   // ... implementation
// }
