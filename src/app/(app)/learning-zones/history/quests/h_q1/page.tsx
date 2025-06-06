
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, KeyRound, Eye, VenetianMask, Gem, CheckCircle, Wand2 } from 'lucide-react';

const questDetails = {
  id: 'h_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  points: 120,
};

const riddleSolutions = {
  step1: 'SPHINX', // English solution
  step1_id: 'SFINKS', // Indonesian solution
};

const pageTranslations = {
  en: {
    questTitle: "The Pharaoh's Lost Scepter",
    questDescription: "Navigate booby-trapped pyramids and decipher hieroglyphs to find the legendary scepter before rival explorers!",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    stepLabel: (current: number, total: number) => `Step ${current} of ${total}`,
    submitAnswer: "Submit Answer",
    nextStep: "Proceed to Next Chamber",
    claimReward: "Claim Scepter & Reward",
    // Step 1: Antechamber Riddle
    antechamberTitle: "The Antechamber Riddle",
    antechamberRiddle: "I have a head of a human, the body of a lion, and guard the great pyramids. What am I?",
    antechamberPlaceholder: "Your answer (one word)",
    feedbackCorrectRiddle: "The great stone door rumbles open! You've solved the guardian's riddle.",
    feedbackIncorrectRiddle: "The guardian remains silent. That is not the correct answer.",
    // Step 2: Corridor of Choices
    corridorTitle: "The Corridor of Choices",
    corridorScenario: "Before you lie three passages. Hieroglyphs above them depict: Left - A Scarab (symbol of rebirth), Center - An Ankh (symbol of life), Right - A Jackal (symbol of the afterlife). Which passage do you choose to find what was lost, not what is to come?",
    choiceScarab: "Path of the Scarab",
    choiceAnkh: "Path of the Ankh",
    choiceJackal: "Path of the Jackal",
    feedbackCorrectChoiceAnkh: "You chose wisely. The Ankh guides you towards the pharaoh's treasures.",
    feedbackIncorrectChoiceScarab: "The Scarab path leads to a dead end. You retrace your steps.",
    feedbackIncorrectChoiceJackal: "The Jackal's path feels ominous and leads away from your goal. You turn back.",
    // Step 3: Sarcophagus Chamber
    sarcophagusTitle: "The Sarcophagus Chamber",
    sarcophagusPuzzle: "The pharaoh's sarcophagus is sealed by three rotating discs, each bearing a symbol. To reveal the scepter, align the symbols of 'Power', 'Protection', and 'Prosperity'.",
    symbolPower: "Symbol of Power (Crook)",
    symbolProtection: "Symbol of Protection (Eye of Horus)",
    symbolProsperity: "Symbol of Prosperity (Lotus)",
    currentSequence: "Current Sequence:",
    resetSequence: "Reset Discs",
    feedbackCorrectSequence: "The discs click into place! The sarcophagus opens, revealing the magnificent scepter!",
    feedbackIncorrectSequence: "The discs do not align. The mechanism remains locked.",
    // Quest Completion
    questCompleteTitle: "Scepter Recovered!",
    questCompleteMessage: "You've successfully navigated the pyramid and recovered the Pharaoh's Lost Scepter. Your knowledge of ancient Egypt has served you well!",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for recovering the Pharaoh's Scepter!`,
    errorNoAnswer: "Please enter an answer for the riddle.",
  },
  id: {
    questTitle: "Pencarian Tongkat Firaun yang Hilang",
    questDescription: "Navigasi piramida penuh jebakan dan pecahkan hieroglif untuk menemukan tongkat legendaris sebelum para penjelajah saingan!",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    stepLabel: (current: number, total: number) => `Langkah ${current} dari ${total}`,
    submitAnswer: "Kirim Jawaban",
    nextStep: "Lanjutkan ke Ruang Berikutnya",
    claimReward: "Klaim Tongkat & Hadiah",
    antechamberTitle: "Teka-Teki Ruang Depan",
    antechamberRiddle: "Aku berkepala manusia, bertubuh singa, dan menjaga piramida agung. Siapakah aku?",
    antechamberPlaceholder: "Jawabanmu (satu kata)",
    feedbackCorrectRiddle: "Pintu batu besar berderak terbuka! Kamu telah memecahkan teka-teki penjaga.",
    feedbackIncorrectRiddle: "Penjaga tetap diam. Itu bukan jawaban yang benar.",
    corridorTitle: "Koridor Pilihan",
    corridorScenario: "Di hadapanmu ada tiga lorong. Hieroglif di atasnya menggambarkan: Kiri - Kumbang Scarab (simbol kelahiran kembali), Tengah - Ankh (simbol kehidupan), Kanan - Jakal (simbol alam baka). Lorong mana yang kamu pilih untuk menemukan apa yang hilang, bukan apa yang akan datang?",
    choiceScarab: "Jalur Scarab",
    choiceAnkh: "Jalur Ankh",
    choiceJackal: "Jalur Jakal",
    feedbackCorrectChoiceAnkh: "Kamu memilih dengan bijak. Ankh membimbingmu menuju harta karun firaun.",
    feedbackIncorrectChoiceScarab: "Jalur Scarab menuju jalan buntu. Kamu kembali.",
    feedbackIncorrectChoiceJackal: "Jalur Jakal terasa tidak menyenangkan dan menjauh dari tujuanmu. Kamu berbalik.",
    sarcophagusTitle: "Ruang Sarkofagus",
    sarcophagusPuzzle: "Sarkofagus firaun disegel oleh tiga cakram berputar, masing-masing dengan simbol. Untuk mengungkap tongkat, sejajarkan simbol 'Kekuatan', 'Perlindungan', dan 'Kemakmuran'.",
    symbolPower: "Simbol Kekuasaan (Tongkat Gembala)",
    symbolProtection: "Simbol Perlindungan (Mata Horus)",
    symbolProsperity: "Simbol Kemakmuran (Teratai)",
    currentSequence: "Urutan Saat Ini:",
    resetSequence: "Atur Ulang Cakram",
    feedbackCorrectSequence: "Cakram berbunyi klik! Sarkofagus terbuka, memperlihatkan tongkat yang megah!",
    feedbackIncorrectSequence: "Cakram tidak sejajar. Mekanisme tetap terkunci.",
    questCompleteTitle: "Tongkat Ditemukan!",
    questCompleteMessage: "Kamu telah berhasil menavigasi piramida dan menemukan Tongkat Firaun yang Hilang. Pengetahuanmu tentang Mesir kuno sangat berguna!",
    toastRewardTitle: "Misi Selesai!",
    toastRewardDescription: (points: number) => `Kamu mendapatkan ${points} poin karena menemukan Tongkat Firaun!`,
    errorNoAnswer: "Silakan masukkan jawaban untuk teka-teki.",
  }
};

const TOTAL_STEPS = 3;
const SARCOPHAGUS_SYMBOLS = ['power', 'protection', 'prosperity'] as const;
type SarcophagusSymbol = typeof SARCOPHAGUS_SYMBOLS[number];

export default function PharaohScepterQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questCompleted, setQuestCompleted] = useState(false);
  const [sarcophagusSequence, setSarcophagusSequence] = useState<SarcophagusSymbol[]>([]);

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
        } catch (e) { console.error("Error reading lang for PharaohScepterQuestPage", e); }
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

  const handleRiddleSubmit = () => {
    if (!userInput.trim()) {
      setFeedback(t.errorNoAnswer);
      return;
    }
    const solution = lang === 'id' ? riddleSolutions.step1_id : riddleSolutions.step1;
    if (userInput.trim().toUpperCase() === solution) {
      setFeedback(t.feedbackCorrectRiddle);
      setCurrentStep(2);
      setUserInput('');
    } else {
      setFeedback(t.feedbackIncorrectRiddle);
    }
  };

  const handleCorridorChoice = (choice: 'ankh' | 'scarab' | 'jackal') => {
    if (choice === 'ankh') {
      setFeedback(t.feedbackCorrectChoiceAnkh);
      setCurrentStep(3);
    } else if (choice === 'scarab') {
      setFeedback(t.feedbackIncorrectChoiceScarab);
    } else { // jackal
      setFeedback(t.feedbackIncorrectChoiceJackal);
    }
  };

  const handleSymbolClick = (symbol: SarcophagusSymbol) => {
    if (sarcophagusSequence.length < SARCOPHAGUS_SYMBOLS.length) {
      setSarcophagusSequence(prev => [...prev, symbol]);
      setFeedback('');
    }
  };

  const handleResetSequence = () => {
    setSarcophagusSequence([]);
    setFeedback('');
  };
  
  useEffect(() => {
    if (sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) {
      const isCorrect = sarcophagusSequence.every((symbol, index) => symbol === SARCOPHAGUS_SYMBOLS[index]);
      if (isCorrect) {
        setFeedback(t.feedbackCorrectSequence);
        setQuestCompleted(true);
      } else {
        setFeedback(t.feedbackIncorrectSequence);
        // Optionally auto-reset or let user reset
        setTimeout(() => {
          if(sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) { // Check again in case it was reset manually
             setSarcophagusSequence([]);
          }
        }, 1500);
      }
    }
  }, [sarcophagusSequence, t.feedbackCorrectSequence, t.feedbackIncorrectSequence]);


  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
    // Potentially navigate away or mark quest as completed in a global state
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Antechamber Riddle
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.antechamberTitle}</CardTitle>
              <CardDescription>{t.stepLabel(1, TOTAL_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.antechamberRiddle}</p>
              <div>
                <Label htmlFor="riddleAnswer">{t.antechamberPlaceholder}</Label>
                <Input
                  id="riddleAnswer"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t.antechamberPlaceholder}
                  className="mt-1"
                />
              </div>
              {feedback && <p className={`text-sm ${feedback === t.feedbackCorrectRiddle ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleRiddleSubmit} className="w-full">{t.submitAnswer}</Button>
            </CardFooter>
          </Card>
        );
      case 2: // Corridor of Choices
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.corridorTitle}</CardTitle>
              <CardDescription>{t.stepLabel(2, TOTAL_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.corridorScenario}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => handleCorridorChoice('scarab')}>
                  <VenetianMask className="mr-2 h-4 w-4" /> {t.choiceScarab}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('ankh')}>
                  <KeyRound className="mr-2 h-4 w-4" /> {t.choiceAnkh}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('jackal')}>
                  <Eye className="mr-2 h-4 w-4" /> {t.choiceJackal}
                </Button>
              </div>
              {feedback && <p className={`mt-4 text-sm ${feedback === t.feedbackCorrectChoiceAnkh ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
            </CardContent>
          </Card>
        );
      case 3: // Sarcophagus Chamber
        if (questCompleted) {
          return (
            <Card className="text-center">
              <CardHeader>
                <Gem className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
                <CardTitle className="text-2xl font-bold text-green-600">{t.questCompleteTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{t.questCompleteMessage}</p>
                <p className="mt-2 text-sm text-muted-foreground">{feedback}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleClaimReward} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" /> {t.claimReward}
                </Button>
              </CardFooter>
            </Card>
          );
        }
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.sarcophagusTitle}</CardTitle>
              <CardDescription>{t.stepLabel(3, TOTAL_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.sarcophagusPuzzle}</p>
              <div className="flex justify-center space-x-4 my-4">
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('power')} disabled={sarcophagusSequence.length >= 3}>
                  {/* Using Wand2 as a proxy for Crook */}
                  <Wand2 className="mr-2 h-5 w-5" /> {t.symbolPower.split('(')[0].trim()} 
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('protection')} disabled={sarcophagusSequence.length >= 3}>
                  <Eye className="mr-2 h-5 w-5" /> {t.symbolProtection.split('(')[0].trim()}
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('prosperity')} disabled={sarcophagusSequence.length >= 3}>
                  {/* Using Gem as a proxy for Lotus/Prosperity */}
                  <Gem className="mr-2 h-5 w-5" /> {t.symbolProsperity.split('(')[0].trim()}
                </Button>
              </div>
              <div>
                <p className="text-sm font-medium">{t.currentSequence}
                  <span className="ml-2 font-mono text-accent">
                    {sarcophagusSequence.map(s => {
                        if(s === 'power') return t.symbolPower.split('(')[0].trim();
                        if(s === 'protection') return t.symbolProtection.split('(')[0].trim();
                        if(s === 'prosperity') return t.symbolProsperity.split('(')[0].trim();
                        return '';
                    }).join(' - ') || "---"}
                  </span>
                </p>
              </div>
               <Button variant="link" onClick={handleResetSequence} className="text-sm p-0 h-auto" disabled={sarcophagusSequence.length === 0}>
                {t.resetSequence}
              </Button>
              {feedback && <p className={`mt-2 text-sm ${feedback === t.feedbackCorrectSequence ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
            </CardContent>
          </Card>
        );
      default:
        return <p>Error: Unknown quest step.</p>;
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
            {currentQuestDetails.zoneName} | {questDetails.points} Points
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-2xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
}
