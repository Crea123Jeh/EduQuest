
'use server';

import { generateDynamicQuests as genkitGenerateDynamicQuests } from '@/ai/flows/generate-dynamic-quests';
import type { GenerateDynamicQuestsInput, GenerateDynamicQuestsOutput } from '@/ai/flows/generate-dynamic-quests';
import { generateCreatureName as genkitGenerateCreatureName } from '@/ai/flows/generate-creature-name-flow';
import type { GenerateCreatureNameInput, GenerateCreatureNameOutput } from '@/ai/flows/generate-creature-name-flow';


export async function generateDynamicQuestsAction(
  input: GenerateDynamicQuestsInput
): Promise<GenerateDynamicQuestsOutput> {
  try {
    // Ensure studentLearningHistory is a string, even if empty or undefined from client
    const fullInput: GenerateDynamicQuestsInput = {
      ...input,
      studentLearningHistory: input.studentLearningHistory || "No specific learning history available. Focus on general concepts.",
      // Ensure numberOfQuestions is a number, though zod coercion on the client should handle it
      numberOfQuestions: Number(input.numberOfQuestions),
    };
    
    const result = await genkitGenerateDynamicQuests(fullInput);

    // The AI flow should ideally always return a 'questions' array, even if empty.
    // Zod validation in the flow itself should catch malformed outputs from the LLM.
    if (!result || typeof result.questions === 'undefined') {
      console.error('Error generating dynamic quests: AI flow returned invalid data structure.', result);
      // Throw an error that the client-side catch block will handle
      throw new Error('AI failed to return expected quest structure.');
    }
    return result;

  } catch (error) {
    console.error('Error in generateDynamicQuestsAction:', error);
    // Re-throw the error so the client-side try/catch can handle it and update UI
    // This gives more control to the client for displaying specific error messages.
    if (error instanceof Error) {
      throw new Error(`Failed to generate quests: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating quests.');
  }
}

export async function generateCreatureNameAction(
  input: GenerateCreatureNameInput
): Promise<GenerateCreatureNameOutput> {
  try {
    const result = await genkitGenerateCreatureName(input);
    if (!result || !result.generatedName) {
      console.error('Error generating creature name: AI flow returned invalid data structure.', result);
      throw new Error('AI failed to return a creature name.');
    }
    return result;
  } catch (error) {
    console.error('Error in generateCreatureNameAction:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate creature name: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the creature name.');
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
