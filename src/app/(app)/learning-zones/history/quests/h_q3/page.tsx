
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Scale, ShieldAlert, Megaphone, EyeOff, CheckCircle, Edit3, Wand2 } from 'lucide-react';

const questDetails = {
  id: 'h_q3',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  type: 'Ethical Dilemma',
  difficulty: 'Hard',
  points: 100,
};

type QuestStage = 'dilemma' | 'outcome' | 'reflection';
type PlayerChoice = 'expose' | 'silent' | null;

const pageTranslations = {
  en: {
    questTitle: "Ethical Dilemma: The Revolutionary's Choice",
    questDescription: "You've uncovered a plot that could change a nation. Expose it and risk chaos, or stay silent and maintain order? The fate of many rests on your decision.",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    // Dilemma Stage
    dilemmaStageTitle: "The Weight of Decision",
    dilemmaScenario: "You are a respected figure in a growing revolutionary movement aiming for a more just society. You've just discovered a secret plot by a radical faction within your own movement. They plan to assassinate a key, albeit unpopular and somewhat corrupt, official of the current oppressive regime. This act could indeed spark widespread chaos, potentially toppling the regime faster. However, it goes against the core non-violent principles your movement publicly champions and could lead to an uncontrollable spiral of violence, legitimizing the regime's claims about your movement being extremist. What do you do?",
    choiceExposePlot: "Expose the Plot to the Movement's Council",
    choiceStaySilent: "Stay Silent and Allow the Plot to Proceed",
    // Outcome Stage
    outcomeStageTitle: "The Unfolding Path",
    outcomeExposePlot: "Your council is thrown into turmoil. Some accuse you of treason, others of cowardice. The plot is narrowly averted, but your movement is fractured and weakened. The revolution is delayed, but your commitment to its stated ideals is clear, gaining some international sympathy. The path ahead is long and uncertain, but perhaps more principled.",
    outcomeStaySilent: "The assassination succeeds, and the city erupts. The regime, though shaken, cracks down brutally. While some factions of your movement gain power through the chaos, the overall violence escalates dramatically, and many innocent lives are lost. The path to a 'just society' becomes bloodier and more uncertain. The regime is weakened, but at what cost?",
    proceedToReflectionButton: "Proceed to Reflection",
    // Reflection Stage
    reflectionStageTitle: "Reflect on Your Choice",
    reflectionPrompt: "Consider the path you've chosen. What values guided your decision? What were the potential alternatives, and what might be the unforeseen long-term consequences of your action (or inaction)? There are no right or wrong answers here, only learning.",
    yourReflectionLabel: "Your Personal Reflection:",
    reflectionPlaceholder: "Jot down your thoughts on the dilemma and its outcome...",
    // General
    completeQuestButton: "Complete Quest & Claim Reward",
    toastRewardTitle: "Quest Completed",
    toastRewardDescription: (points: number) => `You've confronted a difficult choice and earned ${points} points for your engagement.`,
    imageAltDilemma: "A revolutionary figure pondering a difficult choice amidst a historical backdrop",
    imageAltOutcome: "A scene depicting the consequences of the player's choice",
  },
  id: {
    questTitle: "Dilema Etis: Pilihan Sang Revolusioner",
    questDescription: "Anda telah menemukan sebuah rencana yang dapat mengubah sebuah bangsa. Membongkarnya dan mengambil risiko kekacauan, atau tetap diam dan menjaga ketertiban? Nasib banyak orang ada di tangan Anda.",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    dilemmaStageTitle: "Beban Keputusan",
    dilemmaScenario: "Anda adalah tokoh yang dihormati dalam gerakan revolusioner yang berkembang yang bertujuan untuk masyarakat yang lebih adil. Anda baru saja menemukan rencana rahasia oleh faksi radikal dalam gerakan Anda sendiri. Mereka berencana untuk membunuh seorang pejabat penting rezim yang berkuasa, meskipun tidak populer dan agak korup. Tindakan ini memang dapat memicu kekacauan luas, yang berpotensi meruntuhkan rezim lebih cepat. Namun, ini bertentangan dengan prinsip-prinsip non-kekerasan inti yang dijunjung tinggi gerakan Anda secara publik dan dapat menyebabkan spiral kekerasan yang tidak terkendali, melegitimasi klaim rezim tentang gerakan Anda yang ekstremis. Apa yang Anda lakukan?",
    choiceExposePlot: "Bongkar Rencana ke Dewan Gerakan",
    choiceStaySilent: "Tetap Diam dan Biarkan Rencana Berlanjut",
    outcomeStageTitle: "Jalan yang Terbentang",
    outcomeExposePlot: "Dewan Anda dilanda kekacauan. Beberapa menuduh Anda berkhianat, yang lain pengecut. Rencana itu nyaris digagalkan, tetapi gerakan Anda retak dan melemah. Revolusi tertunda, tetapi komitmen Anda pada cita-cita yang dinyatakan jelas, mendapatkan simpati internasional. Jalan di depan panjang dan tidak pasti, tetapi mungkin lebih berprinsip.",
    outcomeStaySilent: "Pembunuhan berhasil, dan kota meletus. Rezim, meskipun terguncang, menindak dengan brutal. Sementara beberapa faksi gerakan Anda mendapatkan kekuasaan melalui kekacauan, kekerasan secara keseluruhan meningkat secara dramatis, dan banyak nyawa tak berdosa hilang. Jalan menuju 'masyarakat yang adil' menjadi lebih berdarah dan tidak pasti. Rezim melemah, tetapi dengan biaya berapa?",
    proceedToReflectionButton: "Lanjutkan ke Refleksi",
    reflectionStageTitle: "Renungkan Pilihan Anda",
    reflectionPrompt: "Pertimbangkan jalan yang telah Anda pilih. Nilai-nilai apa yang memandu keputusan Anda? Apa alternatif potensialnya, dan apa konsekuensi jangka panjang yang tak terduga dari tindakan (atau kelambanan) Anda? Tidak ada jawaban benar atau salah di sini, hanya pembelajaran.",
    yourReflectionLabel: "Refleksi Pribadi Anda:",
    reflectionPlaceholder: "Tuliskan pemikiran Anda tentang dilema dan hasilnya...",
    completeQuestButton: "Selesaikan Misi & Klaim Hadiah",
    toastRewardTitle: "Misi Selesai",
    toastRewardDescription: (points: number) => `Anda telah menghadapi pilihan sulit dan mendapatkan ${points} poin atas keterlibatan Anda.`,
    imageAltDilemma: "Seorang tokoh revolusioner merenungkan pilihan sulit di tengah latar belakang sejarah",
    imageAltOutcome: "Adegan yang menggambarkan konsekuensi dari pilihan pemain",
  }
};

export default function RevolutionaryChoiceQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [questStage, setQuestStage] = useState<QuestStage>('dilemma');
  const [playerChoice, setPlayerChoice] = useState<PlayerChoice>(null);
  const [reflectionText, setReflectionText] = useState('');

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
        } catch (e) { console.error("Error reading lang for RevolutionaryChoicePage", e); }
      }
      setLang(newLang);
    };
    updateLang();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') updateLang();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };

  const handleChoice = (choice: PlayerChoice) => {
    setPlayerChoice(choice);
    setQuestStage('outcome');
  };

  const handleProceedToReflection = () => {
    setQuestStage('reflection');
  };

  const handleCompleteQuest = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
    // In a real app, would likely navigate away or update quest status
  };

  const renderDilemmaStage = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Scale className="h-6 w-6 text-primary" /> {t.dilemmaStageTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Image src="https://placehold.co/600x300.png" alt={t.imageAltDilemma} width={600} height={300} className="rounded-md mb-4" data-ai-hint="revolution moral choice" />
        <p className="italic text-lg">{t.dilemmaScenario}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Button variant="outline" size="lg" onClick={() => handleChoice('expose')} className="h-auto py-3">
            <Megaphone className="mr-2 h-5 w-5" /> {t.choiceExposePlot}
          </Button>
          <Button variant="destructive" size="lg" onClick={() => handleChoice('silent')} className="h-auto py-3">
            <EyeOff className="mr-2 h-5 w-5" /> {t.choiceStaySilent}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderOutcomeStage = () => {
    const outcomeText = playerChoice === 'expose' ? t.outcomeExposePlot : t.outcomeStaySilent;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-6 w-6 text-primary" /> {t.outcomeStageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Image src="https://placehold.co/600x300.png" alt={t.imageAltOutcome} width={600} height={300} className="rounded-md mb-4" data-ai-hint="history consequences city" />
          <p className="text-lg">{outcomeText}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProceedToReflection} className="w-full">{t.proceedToReflectionButton}</Button>
        </CardFooter>
      </Card>
    );
  };

  const renderReflectionStage = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Edit3 className="h-6 w-6 text-primary" /> {t.reflectionStageTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="italic text-lg">{t.reflectionPrompt}</p>
        <div>
          <Label htmlFor="reflectionText" className="font-semibold">{t.yourReflectionLabel}</Label>
          <Textarea
            id="reflectionText"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={t.reflectionPlaceholder}
            className="min-h-[150px] mt-2"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCompleteQuest} className="w-full">
          <CheckCircle className="mr-2 h-4 w-4" /> {t.completeQuestButton}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderContent = () => {
    switch (questStage) {
      case 'dilemma':
        return renderDilemmaStage();
      case 'outcome':
        return renderOutcomeStage();
      case 'reflection':
        return renderReflectionStage();
      default:
        return <p>Error: Unknown quest stage.</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Button variant="outline" asChild className="mb-6">
        <Link href={`/learning-zones/${questDetails.zoneId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToZone}
        </Link>
      </Button>

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="h-7 w-7 text-accent" />
            <CardTitle className="font-headline text-3xl">{currentQuestDetails.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">{currentQuestDetails.description}</CardDescription>
          <div className="text-sm text-muted-foreground">
            {currentQuestDetails.zoneName} | {questDetails.points} Points | {questDetails.type} | {questDetails.difficulty}
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}


    