
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateDynamicQuestsAction } from '@/lib/actions';
import type { GenerateDynamicQuestsInput, GenerateDynamicQuestsOutput, GeneratedQuestion, QuestionType } from '@/ai/flows/generate-dynamic-quests';
import { Loader2, Wand2, AlertTriangle, CheckCircle } from 'lucide-react';

const questFormSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters.' }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().min(1).max(5), // Max 5 for better performance & LLM consistency
  studentLearningHistory: z.string().optional(),
  questionType: z.enum(['open-ended', 'multiple-choice', 'fill-in-the-blank']),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

export default function QuestsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<GeneratedQuestion[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const form = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      topic: '',
      difficultyLevel: 'medium',
      numberOfQuestions: 3,
      studentLearningHistory: 'Example: Student struggles with fractions but is strong in basic algebra. Recently covered geometry.',
      questionType: 'open-ended',
    },
  });

  const onSubmit: SubmitHandler<QuestFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedQuests([]);
    setGenerationError(null);
    try {
      // Ensure data types match GenerateDynamicQuestsInput, especially numberOfQuestions
      const inputForAI: GenerateDynamicQuestsInput = {
        ...data,
        numberOfQuestions: Number(data.numberOfQuestions), 
        questionType: data.questionType as QuestionType, // Zod enum handles this
      };
      const result = await generateDynamicQuestsAction(inputForAI);
      
      if (result.questions && result.questions.length > 0) {
        setGeneratedQuests(result.questions);
        toast({
          title: 'Quests Generated!',
          description: `${result.questions.length} new quests are ready.`,
        });
      } else {
        // This case might occur if the AI returns an empty list but no explicit error
        setGenerationError('The AI generated no quests. Try adjusting your parameters.');
        toast({
          title: 'No Quests Generated',
          description: 'The AI did not return any quests. Please try different inputs.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Quest generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while generating quests.';
      setGenerationError(errorMessage);
      toast({
        title: 'Error Generating Quests',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (quest: GeneratedQuestion, index: number) => {
    switch (quest.type) {
      case 'open-ended':
        return <p>{quest.question}</p>;
      case 'multiple-choice':
        return (
          <div>
            <p className="font-medium">{quest.question}</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
              {quest.options.map((option, i) => (
                <li key={i} className={option === quest.correctAnswer ? 'text-green-600 font-semibold' : ''}>
                  {option}
                  {option === quest.correctAnswer && <CheckCircle className="inline ml-2 h-4 w-4" />}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'fill-in-the-blank':
        return (
          <div>
            <p>{quest.questionWithBlank}</p>
            <p className="text-sm text-green-600">
              Answer: <span className="font-semibold">{quest.answer}</span>
            </p>
          </div>
        );
      default:
        // Should not happen with discriminated union
        return <p>Unknown question type.</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-accent" />
            <CardTitle className="font-headline text-3xl">AI Dynamic Quest Generator</CardTitle>
          </div>
          <CardDescription>
            Craft personalized quests based on student needs or explore new topics.
            Select question types for more tailored learning experiences.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="studentLearningHistory">Student Learning History (Optional)</Label>
              <Textarea
                id="studentLearningHistory"
                placeholder="e.g., Strong in algebra, struggles with geometry proofs. Recently studied trigonometry."
                {...form.register('studentLearningHistory')}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                AI uses this to tailor questions. Integrated with LMS like Google Classroom in full version.
              </p>
            </div>

            <div>
              <Label htmlFor="topic">Quest Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Photosynthesis, World War II, Python Loops"
                {...form.register('topic')}
              />
              {form.formState.errors.topic && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.topic.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <Label htmlFor="questionType">Question Type</Label>
                <Select
                  onValueChange={(value) => form.setValue('questionType', value as QuestFormValues['questionType'])}
                  defaultValue={form.getValues('questionType')}
                >
                  <SelectTrigger id="questionType">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open-ended">Open-ended</SelectItem>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="fill-in-the-blank">Fill in the Blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select
                  onValueChange={(value) => form.setValue('difficultyLevel', value as 'easy' | 'medium' | 'hard')}
                  defaultValue={form.getValues('difficultyLevel')}
                >
                  <SelectTrigger id="difficultyLevel">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div>
                <Label htmlFor="numberOfQuestions">Number of Questions (1-5)</Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="1"
                  max="5"
                  {...form.register('numberOfQuestions')}
                />
                {form.formState.errors.numberOfQuestions && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.numberOfQuestions.message}</p>
                )}
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Quests
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generationError && (
         <Card className="max-w-2xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6"/> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{generationError}</p>
          </CardContent>
        </Card>
      )}

      {!generationError && generatedQuests.length > 0 && (
        <Card className="max-w-2xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Generated Quests</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {generatedQuests.map((quest, index) => (
                <li key={index} className="p-4 bg-muted/50 rounded-md shadow-sm border border-border">
                  <strong className="text-sm text-muted-foreground">Question {index + 1} ({quest.type.replace('-', ' ')})</strong>
                  <div className="mt-1">
                    {renderQuestion(quest, index)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
       {!generationError && !isLoading && generatedQuests.length === 0 && form.formState.isSubmitted && (
         <Card className="max-w-2xl mx-auto mt-8 shadow-xl">
           <CardHeader>
             <CardTitle className="font-headline text-xl">No Quests Yet</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">Quests you generate will appear here. Fill out the form above and click "Generate Quests".</p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}
