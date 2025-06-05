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
import type { GenerateDynamicQuestsInput } from '@/ai/flows/generate-dynamic-quests';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';

const questFormSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters.' }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().min(1).max(10),
  studentLearningHistory: z.string().optional(),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

export default function QuestsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<string[]>([]);

  const form = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      topic: '',
      difficultyLevel: 'medium',
      numberOfQuestions: 3,
      studentLearningHistory: 'Example: Student struggles with fractions but is strong in basic algebra. Recently covered geometry.',
    },
  });

  const onSubmit: SubmitHandler<QuestFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedQuests([]);
    try {
      const result = await generateDynamicQuestsAction(data as GenerateDynamicQuestsInput);
      if (result.questions && result.questions.length > 0 && !result.questions[0].startsWith("Error generating questions")) {
        setGeneratedQuests(result.questions);
        toast({
          title: 'Quests Generated!',
          description: `${result.questions.length} new quests are ready.`,
        });
      } else {
        throw new Error(result.questions[0] || 'Failed to generate quests.');
      }
    } catch (error) {
      console.error('Quest generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Error Generating Quests',
        description: errorMessage,
        variant: 'destructive',
      });
       setGeneratedQuests([`Failed to generate quests: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
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
            Integrates with Google Classroom data for tailored experiences (simulated).
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
              <div>
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input
                  id="numberOfQuestions"
                  type="number"
                  min="1"
                  max="10"
                  {...form.register('numberOfQuestions')}
                />
                {form.formState.errors.numberOfQuestions && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.numberOfQuestions.message}</p>
                )}
              </div>
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

      {generatedQuests.length > 0 && (
        <Card className="max-w-2xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Generated Quests</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedQuests[0].startsWith("Failed to generate quests") ? (
                 <div className="flex items-center p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                    <AlertTriangle className="h-6 w-6 text-destructive mr-3" />
                    <p className="text-destructive">{generatedQuests[0]}</p>
                </div>
            ) : (
            <ul className="space-y-3 list-decimal list-inside">
              {generatedQuests.map((quest, index) => (
                <li key={index} className="p-3 bg-muted/50 rounded-md shadow-sm">
                  {quest}
                </li>
              ))}
            </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
