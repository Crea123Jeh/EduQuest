
'use client';

import { useState, useEffect } from 'react';
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
  numberOfQuestions: z.coerce.number().min(1).max(10), 
  studentLearningHistory: z.string().optional(),
  questionType: z.enum(['open-ended', 'multiple-choice', 'fill-in-the-blank']),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

const pageTranslations = {
  en: {
    title: "AI Dynamic Quest Generator",
    description: "Craft personalized quests based on student needs or explore new topics. Select question types for more tailored learning experiences.",
    studentLearningHistoryLabel: "Student Learning History (Optional)",
    studentLearningHistoryPlaceholder: "e.g., Strong in algebra, struggles with geometry proofs. Recently studied trigonometry.",
    studentLearningHistoryHelpText: "AI uses this to tailor questions. Integrated with LMS like Google Classroom in full version.",
    topicLabel: "Quest Topic",
    topicPlaceholder: "e.g., Photosynthesis, World War II, Python Loops",
    questionTypeLabel: "Question Type",
    questionTypePlaceholder: "Select question type",
    openEnded: "Open-ended",
    multipleChoice: "Multiple Choice",
    fillInTheBlank: "Fill in the Blank",
    difficultyLevelLabel: "Difficulty Level",
    difficultyPlaceholder: "Select difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    numberOfQuestionsLabel: "Number of Questions (1-10)",
    generateButton: "Generate Quests",
    generatingButton: "Generating Quests...",
    errorTitle: "Error",
    generatedQuestsTitle: "Generated Quests",
    questionLabel: (index: number, type: string) => `Question ${index + 1} (${type.replace('-', ' ')})`,
    answerLabel: "Answer",
    noQuestsYetTitle: "No Quests Yet",
    noQuestsYetDescription: "Quests you generate will appear here. Fill out the form above and click \"Generate Quests\".",
    toastSuccessTitle: "Quests Generated!",
    toastSuccessDescription: (count: number) => `${count} new quests are ready.`,
    toastNoQuestsTitle: "No Quests Generated",
    toastNoQuestsDescription: "The AI did not return any quests. Please try different inputs.",
    toastErrorTitle: "Error Generating Quests",
  },
  id: {
    title: "Generator Misi Dinamis AI",
    description: "Buat misi yang dipersonalisasi berdasarkan kebutuhan siswa atau jelajahi topik baru. Pilih jenis pertanyaan untuk pengalaman belajar yang lebih disesuaikan.",
    studentLearningHistoryLabel: "Riwayat Belajar Siswa (Opsional)",
    studentLearningHistoryPlaceholder: "misalnya, Kuat dalam aljabar, kesulitan dengan pembuktian geometri. Baru-baru ini mempelajari trigonometri.",
    studentLearningHistoryHelpText: "AI menggunakan ini untuk menyesuaikan pertanyaan. Terintegrasi dengan LMS seperti Google Classroom dalam versi lengkap.",
    topicLabel: "Topik Misi",
    topicPlaceholder: "misalnya, Fotosintesis, Perang Dunia II, Perulangan Python",
    questionTypeLabel: "Jenis Pertanyaan",
    questionTypePlaceholder: "Pilih jenis pertanyaan",
    openEnded: "Esai",
    multipleChoice: "Pilihan Ganda",
    fillInTheBlank: "Isian Singkat",
    difficultyLevelLabel: "Tingkat Kesulitan",
    difficultyPlaceholder: "Pilih kesulitan",
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
    numberOfQuestionsLabel: "Jumlah Pertanyaan (1-10)",
    generateButton: "Hasilkan Misi",
    generatingButton: "Menghasilkan Misi...",
    errorTitle: "Kesalahan",
    generatedQuestsTitle: "Misi yang Dihasilkan",
    questionLabel: (index: number, type: string) => `Pertanyaan ${index + 1} (${type.replace('-', ' ')})`,
    answerLabel: "Jawaban",
    noQuestsYetTitle: "Belum Ada Misi",
    noQuestsYetDescription: "Misi yang Anda hasilkan akan muncul di sini. Isi formulir di atas dan klik \"Hasilkan Misi\".",
    toastSuccessTitle: "Misi Dihasilkan!",
    toastSuccessDescription: (count: number) => `${count} misi baru telah siap.`,
    toastNoQuestsTitle: "Tidak Ada Misi yang Dihasilkan",
    toastNoQuestsDescription: "AI tidak mengembalikan misi apa pun. Silakan coba input yang berbeda.",
    toastErrorTitle: "Gagal Menghasilkan Misi",
  }
};

export default function QuestsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<GeneratedQuestion[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'id'>('en');

  useEffect(() => {
    const updateLang = () => {
      const savedSettings = localStorage.getItem('user-app-settings');
      let newLang: 'en' | 'id' = 'en';
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language && (parsed.language === 'en' || parsed.language === 'id')) {
            newLang = parsed.language;
          }
        } catch (e) { console.error("Error reading lang for QuestsPage", e); }
      }
      setLang(newLang);
    };

    updateLang();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') {
        updateLang();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];

  const form = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      topic: '',
      difficultyLevel: 'medium',
      numberOfQuestions: 3,
      studentLearningHistory: lang === 'id' 
        ? 'Contoh: Siswa kesulitan dengan pecahan tetapi kuat dalam aljabar dasar. Baru-baru ini membahas geometri.'
        : 'Example: Student struggles with fractions but is strong in basic algebra. Recently covered geometry.',
      questionType: 'open-ended',
    },
  });

  // Update default placeholder when language changes and field is empty
  useEffect(() => {
    if (!form.getValues('studentLearningHistory')) {
      form.setValue('studentLearningHistory', 
        lang === 'id' 
          ? 'Contoh: Siswa kesulitan dengan pecahan tetapi kuat dalam aljabar dasar. Baru-baru ini membahas geometri.'
          : 'Example: Student struggles with fractions but is strong in basic algebra. Recently covered geometry.'
      );
    }
  }, [lang, form]);

  const onSubmit: SubmitHandler<QuestFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedQuests([]);
    setGenerationError(null);
    try {
      const inputForAI: GenerateDynamicQuestsInput = {
        ...data,
        numberOfQuestions: Number(data.numberOfQuestions), 
        questionType: data.questionType as QuestionType, 
      };
      const result = await generateDynamicQuestsAction(inputForAI);
      
      if (result.questions && result.questions.length > 0) {
        setGeneratedQuests(result.questions);
        toast({
          title: t.toastSuccessTitle,
          description: t.toastSuccessDescription(result.questions.length),
        });
      } else {
        setGenerationError(t.toastNoQuestsDescription);
        toast({
          title: t.toastNoQuestsTitle,
          description: t.toastNoQuestsDescription,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Quest generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while generating quests.';
      setGenerationError(errorMessage);
      toast({
        title: t.toastErrorTitle,
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
              {t.answerLabel}: <span className="font-semibold">{quest.answer}</span>
            </p>
          </div>
        );
      default:
        return <p>Unknown question type.</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-accent" />
            <CardTitle className="font-headline text-3xl">{t.title}</CardTitle>
          </div>
          <CardDescription>
            {t.description}
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="studentLearningHistory">{t.studentLearningHistoryLabel}</Label>
              <Textarea
                id="studentLearningHistory"
                placeholder={t.studentLearningHistoryPlaceholder}
                {...form.register('studentLearningHistory')}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t.studentLearningHistoryHelpText}
              </p>
            </div>

            <div>
              <Label htmlFor="topic">{t.topicLabel}</Label>
              <Input
                id="topic"
                placeholder={t.topicPlaceholder}
                {...form.register('topic')}
              />
              {form.formState.errors.topic && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.topic.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <Label htmlFor="questionType">{t.questionTypeLabel}</Label>
                <Select
                  onValueChange={(value) => form.setValue('questionType', value as QuestFormValues['questionType'])}
                  defaultValue={form.getValues('questionType')}
                >
                  <SelectTrigger id="questionType">
                    <SelectValue placeholder={t.questionTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open-ended">{t.openEnded}</SelectItem>
                    <SelectItem value="multiple-choice">{t.multipleChoice}</SelectItem>
                    <SelectItem value="fill-in-the-blank">{t.fillInTheBlank}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficultyLevel">{t.difficultyLevelLabel}</Label>
                <Select
                  onValueChange={(value) => form.setValue('difficultyLevel', value as 'easy' | 'medium' | 'hard')}
                  defaultValue={form.getValues('difficultyLevel')}
                >
                  <SelectTrigger id="difficultyLevel">
                    <SelectValue placeholder={t.difficultyPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{t.easy}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="hard">{t.hard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div>
                <Label htmlFor="numberOfQuestions">{t.numberOfQuestionsLabel}</Label>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isLoading ? t.generatingButton : t.generateButton}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generationError && (
         <Card className="max-w-2xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6"/> {t.errorTitle}
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
            <CardTitle className="font-headline text-2xl">{t.generatedQuestsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {generatedQuests.map((quest, index) => (
                <li key={index} className="p-4 bg-muted/50 rounded-md shadow-sm border border-border">
                  <strong className="text-sm text-muted-foreground">{t.questionLabel(index, quest.type)}</strong>
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
             <CardTitle className="font-headline text-xl">{t.noQuestsYetTitle}</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground">{t.noQuestsYetDescription}</p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}
