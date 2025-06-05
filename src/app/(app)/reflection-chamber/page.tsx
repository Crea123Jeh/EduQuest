'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, MessageSquare, Users, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reflectionPrompts = [
  "What was the most challenging part of today's quest, and how did your team overcome it?",
  "Describe a moment when you felt your contribution was truly valued by your team.",
  "How did your team handle disagreements or different opinions during the quest?",
  "What is one thing you learned about collaboration today?",
  "Reflect on an ethical choice you or your team faced. What was the outcome?",
  "How did the Role Rotation System impact your understanding of different team responsibilities?",
  "What's one way you could have supported a teammate better today?",
  "Describe a moment you felt proud of your team's achievement."
];

export default function ReflectionChamberPage() {
  const { toast } = useToast();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleNextPrompt = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % reflectionPrompts.length);
    setReflectionText(''); // Clear text for new prompt
  };

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) {
      toast({
        title: "Empty Reflection",
        description: "Please write your thoughts before saving.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Reflection for prompt:", reflectionPrompts[currentPromptIndex]);
    console.log("Reflection text:", reflectionText);
    toast({
      title: "Reflection Saved!",
      description: "Your thoughts have been recorded.",
    });
    setIsSaving(false);
    // Optionally clear text or move to next prompt after saving
    // handleNextPrompt(); 
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-10 w-10 text-accent" />
            <div>
              <CardTitle className="font-headline text-3xl">Reflection Chamber</CardTitle>
              <CardDescription className="text-lg">
                A quiet space to reflect on your learning journey, teamwork, and personal growth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="reflectionPrompt" className="text-lg font-semibold text-muted-foreground">
              Contemplate this:
            </Label>
            <p id="reflectionPrompt" className="mt-2 p-4 bg-muted/50 rounded-md text-foreground text-lg italic">
              {reflectionPrompts[currentPromptIndex]}
            </p>
          </div>
          
          <div>
            <Label htmlFor="reflectionText" className="text-lg font-semibold text-muted-foreground">Your Thoughts:</Label>
            <Textarea
              id="reflectionText"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Share your feelings, insights, and what you've learned..."
              className="min-h-[200px] mt-2 text-base"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Consider how the <span className="font-semibold">Role Rotation System</span> (leader, recorder, mediator) helped you understand different perspectives.</p>
            <p className="flex items-center gap-2 mt-1"><MessageSquare className="h-4 w-4 text-primary" /> Reflect on any <span className="font-semibold">Ethical Dilemmas</span> encountered. How did your team decide?</p>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handleNextPrompt}>
            Next Prompt
          </Button>
          <Button onClick={handleSaveReflection} disabled={isSaving}>
            {isSaving ? <Save className="mr-2 h-4 w-4 animate-pulse" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
