
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, MessageSquare, Users, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const pageTranslations = {
  en: {
    title: "Reflection Chamber",
    description: "A quiet space to reflect on your learning journey, teamwork, and personal growth.",
    promptLabel: "Contemplate this:",
    yourThoughtsLabel: "Your Thoughts:",
    thoughtsPlaceholder: "Share your feelings, insights, and what you've learned...",
    roleRotationHint: "Consider how the <span class=\"font-semibold\">Role Rotation System</span> (leader, recorder, mediator) helped you understand different perspectives.",
    ethicalDilemmaHint: "Reflect on any <span class=\"font-semibold\">Ethical Dilemmas</span> encountered. How did your team decide?",
    nextPromptButton: "Next Prompt",
    saveReflectionButton: "Save Reflection",
    savingReflectionButton: "Saving...",
    toastEmptyTitle: "Empty Reflection",
    toastEmptyDescription: "Please write your thoughts before saving.",
    toastSavedTitle: "Reflection Saved!",
    toastSavedDescription: "Your thoughts have been recorded.",
    prompts: [
      "What was the most challenging part of today's quest, and how did your team overcome it?",
      "Describe a moment when you felt your contribution was truly valued by your team.",
      "How did your team handle disagreements or different opinions during the quest?",
      "What is one thing you learned about collaboration today?",
      "Reflect on an ethical choice you or your team faced. What was the outcome?",
      "How did the Role Rotation System impact your understanding of different team responsibilities?",
      "What's one way you could have supported a teammate better today?",
      "Describe a moment you felt proud of your team's achievement."
    ]
  },
  id: {
    title: "Ruang Refleksi",
    description: "Ruang tenang untuk merenungkan perjalanan belajar Anda, kerja tim, dan pertumbuhan pribadi.",
    promptLabel: "Renungkan ini:",
    yourThoughtsLabel: "Pikiran Anda:",
    thoughtsPlaceholder: "Bagikan perasaan, wawasan, dan apa yang telah Anda pelajari...",
    roleRotationHint: "Pertimbangkan bagaimana <span class=\"font-semibold\">Sistem Rotasi Peran</span> (pemimpin, pencatat, mediator) membantu Anda memahami perspektif yang berbeda.",
    ethicalDilemmaHint: "Renungkan setiap <span class=\"font-semibold\">Dilema Etis</span> yang dihadapi. Bagaimana tim Anda memutuskan?",
    nextPromptButton: "Prompt Berikutnya",
    saveReflectionButton: "Simpan Refleksi",
    savingReflectionButton: "Menyimpan...",
    toastEmptyTitle: "Refleksi Kosong",
    toastEmptyDescription: "Silakan tulis pemikiran Anda sebelum menyimpan.",
    toastSavedTitle: "Refleksi Tersimpan!",
    toastSavedDescription: "Pemikiran Anda telah direkam.",
    prompts: [
      "Apa bagian tersulit dari misi hari ini, dan bagaimana tim Anda mengatasinya?",
      "Jelaskan momen ketika Anda merasa kontribusi Anda benar-benar dihargai oleh tim Anda.",
      "Bagaimana tim Anda menangani ketidaksepakatan atau perbedaan pendapat selama misi?",
      "Apa satu hal yang Anda pelajari tentang kolaborasi hari ini?",
      "Renungkan pilihan etis yang Anda atau tim Anda hadapi. Apa hasilnya?",
      "Bagaimana Sistem Rotasi Peran memengaruhi pemahaman Anda tentang tanggung jawab tim yang berbeda?",
      "Apa satu cara Anda bisa mendukung rekan tim dengan lebih baik hari ini?",
      "Jelaskan momen ketika Anda merasa bangga dengan pencapaian tim Anda."
    ]
  }
};

export default function ReflectionChamberPage() {
  const { toast } = useToast();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
        } catch (e) { console.error("Error reading lang for ReflectionChamberPage", e); }
      }
      setLang(newLang);
    };

    updateLang(); // Initial call
    
    // Reset prompt index and text if language changes to avoid stale prompt/text mismatch
    const prevLangRef = { current: lang };
    if (prevLangRef.current !== lang) {
        setCurrentPromptIndex(0);
        setReflectionText('');
        prevLangRef.current = lang;
    }


    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') {
        updateLang();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [lang]); // Rerun effect if lang changes

  const t = pageTranslations[lang];
  const reflectionPrompts = t.prompts;

  const handleNextPrompt = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % reflectionPrompts.length);
    setReflectionText(''); 
  };

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) {
      toast({
        title: t.toastEmptyTitle,
        description: t.toastEmptyDescription,
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Reflection for prompt:", reflectionPrompts[currentPromptIndex]);
    console.log("Reflection text:", reflectionText);
    toast({
      title: t.toastSavedTitle,
      description: t.toastSavedDescription,
    });
    setIsSaving(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-10 w-10 text-accent" />
            <div>
              <CardTitle className="font-headline text-3xl">{t.title}</CardTitle>
              <CardDescription className="text-lg">
                {t.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="reflectionPrompt" className="text-lg font-semibold text-muted-foreground">
              {t.promptLabel}
            </Label>
            <p id="reflectionPrompt" className="mt-2 p-4 bg-muted/50 rounded-md text-foreground text-lg italic">
              {reflectionPrompts[currentPromptIndex]}
            </p>
          </div>
          
          <div>
            <Label htmlFor="reflectionText" className="text-lg font-semibold text-muted-foreground">{t.yourThoughtsLabel}</Label>
            <Textarea
              id="reflectionText"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder={t.thoughtsPlaceholder}
              className="min-h-[200px] mt-2 text-base"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2" dangerouslySetInnerHTML={{ __html: t.roleRotationHint }} />
            <p className="flex items-center gap-2 mt-1" dangerouslySetInnerHTML={{ __html: t.ethicalDilemmaHint }} />
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handleNextPrompt}>
            {t.nextPromptButton}
          </Button>
          <Button onClick={handleSaveReflection} disabled={isSaving}>
            {isSaving ? <Save className="mr-2 h-4 w-4 animate-pulse" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? t.savingReflectionButton : t.saveReflectionButton}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
