
'use server';
/**
 * @fileOverview A flow for generating a creative name for a creature based on its DNA traits and description.
 *
 * - generateCreatureName - A function that generates a creature name.
 * - GenerateCreatureNameInput - The input type for the generateCreatureName function.
 * - GenerateCreatureNameOutput - The return type for the generateCreatureName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCreatureNameInputSchema = z.object({
  dnaTraits: z.record(z.string()).describe('An object where keys are DNA category names (e.g., "Body Type", "Locomotion") and values are the selected trait names (e.g., "Robust Frame", "Powerful Legs").'),
  creatureCharacteristics: z.string().describe('A short description of the creature\'s main characteristics resulting from its DNA combination.'),
});
export type GenerateCreatureNameInput = z.infer<typeof GenerateCreatureNameInputSchema>;

const GenerateCreatureNameOutputSchema = z.object({
  generatedName: z.string().describe('A creative and fitting name for the creature.'),
});
export type GenerateCreatureNameOutput = z.infer<typeof GenerateCreatureNameOutputSchema>;

export async function generateCreatureName(input: GenerateCreatureNameInput): Promise<GenerateCreatureNameOutput> {
  return generateCreatureNameFlow(input);
}

const generateCreatureNamePrompt = ai.definePrompt({
  name: 'generateCreatureNamePrompt',
  input: {schema: GenerateCreatureNameInputSchema},
  output: {schema: GenerateCreatureNameOutputSchema},
  prompt: `You are a creative biologist and fantasy world-builder specializing in naming newly discovered or designed creatures.
  Based on the provided DNA traits and the resulting characteristics, generate a unique, fitting, and imaginative name for this creature.
  The name should be evocative of its nature. It can be a single word or two short, hyphenated words (e.g., Terra-Striker). Avoid overly complex or long names.

  DNA Traits:
  {{#each dnaTraits}}
  - {{ @key }}: {{this}}
  {{/each}}

  Creature Characteristics:
  {{{creatureCharacteristics}}}

  Suggest a name that is memorable and captures the essence of this creature.
  For example, if the creature is "robust and agile", with "Powerful Legs" and "Eagle Eyesight", a name like "Terra-Striker" or "Galeclaw" might be appropriate.
  If it has "Bioluminescent Glow" and "Aquatic Form", a name like "AquaLume" or "DeepShine" could work.
  If it has "Avian Structure", "Feathered Wings", and "Chameleon Camouflage", perhaps "SkyWhisper" or "Veridian Flitwing".
  `,
});

const generateCreatureNameFlow = ai.defineFlow(
  {
    name: 'generateCreatureNameFlow',
    inputSchema: GenerateCreatureNameInputSchema,
    outputSchema: GenerateCreatureNameOutputSchema,
  },
  async input => {
    const {output} = await generateCreatureNamePrompt(input);
    if (!output || !output.generatedName) {
        console.error("generateCreatureNameFlow: LLM output was null or missing generatedName property.", output);
        // Fallback name if AI fails
        return { generatedName: "Creature Prime" };
    }
    return output;
  }
);
