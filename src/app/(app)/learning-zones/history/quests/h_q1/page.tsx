
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, KeyRound, Eye, Sun, Gem, CheckCircle, Wand2, PuzzleIcon } from 'lucide-react'; // Changed VenetianMask to Sun, Users to PuzzleIcon

const questDetails = {
  id: 'h_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  points: 120,
};

const riddleSolution = 'sphinx'; // Correct answer key for multiple choice
const scarabRiddleSolution = 'tomorrow';

const pageTranslations = {
  en: {
    questTitle: "The Pharaoh's Lost Scepter",
    questDescription: "Navigate booby-trapped pyramids and decipher hieroglyphs to find the legendary scepter before rival explorers!",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    stepLabel: (current: number, total: number) => `Main Step ${current} of ${total}`,
    submitAnswer: "Submit Answer",
    nextStep: "Proceed to Next Chamber",
    claimReward: "Claim Scepter & Reward",
    returnToCorridor: "Return to Corridor",
    // Step 1: Antechamber Riddle
    antechamberTitle: "The Antechamber Riddle",
    antechamberRiddle: "I have a head of a human, the body of a lion, and guard the great pyramids. What am I?",
    optionSphinx: "Sphinx",
    optionMummy: "Mummy",
    optionPharaoh: "Pharaoh",
    optionScarab: "Scarab Beetle",
    feedbackCorrectRiddle: "The great stone door rumbles open! You've solved the guardian's riddle.",
    feedbackIncorrectRiddle: "The guardian remains silent. That is not the correct answer.",
    // Step 2: Corridor of Choices
    corridorTitle: "The Corridor of Choices",
    corridorScenario: "Before you lie three passages. Hieroglyphs above them depict: Left - A Scarab (symbol of rebirth), Center - An Ankh (symbol of life), Right - A Jackal (symbol of the afterlife). Which passage do you choose to find what was lost, not what is to come?",
    choiceScarab: "Path of the Scarab",
    choiceAnkh: "Path of the Ankh",
    choiceJackal: "Path of the Jackal",
    feedbackCorrectChoiceAnkh: "You chose wisely. The Ankh guides you towards the pharaoh's treasures.",
    // Step 2A (New Step 4): Scarab's Wisdom Chamber
    scarabChamberTitle: "Scarab's Wisdom Chamber",
    scarabChamberIntro: "The Scarab path leads you to a small chamber. An inscription glows faintly: 'What is always coming, but never arrives?'",
    optionYesterday: "Yesterday",
    optionToday: "Today",
    optionTomorrow: "Tomorrow",
    feedbackCorrectScarabRiddle: "Wise. Like the Scarab, you look to the future. Remember, the Ankh represents life, the direct path to what was lost...",
    feedbackIncorrectScarabRiddle: "The inscription remains a mystery. Consider another answer.",
    // Step 2B (New Step 5): Jackal's Snare Chamber
    jackalChamberTitle: "Jackal's Snare Chamber",
    jackalChamberDescription: "The Path of the Jackal leads to a dark, narrow passage. A sudden gust of wind extinguishes your torch, plunging you into momentary darkness! After fumbling for a moment, you relight it, but this path feels ominous and misleading.",
    // Step 3: Sarcophagus Chamber
    sarcophagusTitle: "The Sarcophagus Chamber",
    sarcophagusPuzzle: "The pharaoh's sarcophagus is sealed by three rotating discs, each bearing a symbol. To reveal the scepter, align the symbols of 'Power', 'Protection', and 'Prosperity' in that order.",
    symbolPower: "Symbol of Power (Crook)",
    symbolProtection: "Symbol of Protection (Eye of Horus)",
    symbolProsperity: "Symbol of Prosperity (Lotus)",
    currentSequence: "Current Sequence:",
    resetSequence: "Reset Discs",
    feedbackCorrectSequence: "The discs click into place! The sarcophagus opens, revealing the magnificent scepter!",
    feedbackIncorrectSequence: "The discs do not align. The mechanism remains locked.",
    // Quest Completion (Step 6)
    questCompleteTitle: "Scepter Recovered!",
    questCompleteMessage: "You've successfully navigated the pyramid and recovered the Pharaoh's Lost Scepter. Your knowledge of ancient Egypt has served you well!",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for recovering the Pharaoh's Scepter!`,
    errorNoAnswer: "Please select an answer.",
  },
  id: {
    questTitle: "Pencarian Tongkat Firaun yang Hilang",
    questDescription: "Navigasi piramida penuh jebakan dan pecahkan hieroglif untuk menemukan tongkat legendaris sebelum para penjelajah saingan!",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    stepLabel: (current: number, total: number) => `Langkah Utama ${current} dari ${total}`,
    submitAnswer: "Kirim Jawaban",
    nextStep: "Lanjutkan ke Ruang Berikutnya",
    claimReward: "Klaim Tongkat & Hadiah",
    returnToCorridor: "Kembali ke Koridor",
    antechamberTitle: "Teka-Teki Ruang Depan",
    antechamberRiddle: "Aku berkepala manusia, bertubuh singa, dan menjaga piramida agung. Siapakah aku?",
    optionSphinx: "Sfinga",
    optionMummy: "Mumi",
    optionPharaoh: "Firaun",
    optionScarab: "Kumbang Scarab",
    feedbackCorrectRiddle: "Pintu batu besar berderak terbuka! Kamu telah memecahkan teka-teki penjaga.",
    feedbackIncorrectRiddle: "Penjaga tetap diam. Itu bukan jawaban yang benar.",
    corridorTitle: "Koridor Pilihan",
    corridorScenario: "Di hadapanmu ada tiga lorong. Hieroglif di atasnya menggambarkan: Kiri - Kumbang Scarab (simbol kelahiran kembali), Tengah - Ankh (simbol kehidupan), Kanan - Jakal (simbol alam baka). Lorong mana yang kamu pilih untuk menemukan apa yang hilang, bukan apa yang akan datang?",
    choiceScarab: "Jalur Scarab",
    choiceAnkh: "Jalur Ankh",
    choiceJackal: "Jalur Jakal",
    feedbackCorrectChoiceAnkh: "Kamu memilih dengan bijak. Ankh membimbingmu menuju harta karun firaun.",
    scarabChamberTitle: "Ruang Kebijaksanaan Scarab",
    scarabChamberIntro: "Jalur Scarab membawamu ke sebuah ruangan kecil. Sebuah tulisan bersinar samar: 'Apa yang selalu datang, tetapi tidak pernah tiba?'",
    optionYesterday: "Kemarin",
    optionToday: "Hari Ini",
    optionTomorrow: "Besok",
    feedbackCorrectScarabRiddle: "Bijaksana. Seperti Scarab, kamu melihat ke masa depan. Ingat, Ankh melambangkan kehidupan, jalan langsung menuju apa yang hilang...",
    feedbackIncorrectScarabRiddle: "Tulisan itu tetap menjadi misteri. Pertimbangkan jawaban lain.",
    jackalChamberTitle: "Ruang Jebakan Jakal",
    jackalChamberDescription: "Jalur Jakal menuju lorong gelap dan sempit. Embusan angin tiba-tiba memadamkan obormu, menjerumuskanmu ke dalam kegelapan sesaat! Setelah meraba-raba sejenak, kamu menyalakannya kembali, tetapi jalur ini terasa tidak menyenangkan dan menyesatkan.",
    sarcophagusTitle: "Ruang Sarkofagus",
    sarcophagusPuzzle: "Sarkofagus firaun disegel oleh tiga cakram berputar, masing-masing dengan simbol. Untuk mengungkap tongkat, sejajarkan simbol 'Kekuasaan', 'Perlindungan', dan 'Kemakmuran' sesuai urutan itu.",
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
    errorNoAnswer: "Silakan pilih jawaban.",
  }
};

const TOTAL_MAIN_STEPS = 3;
const SARCOPHAGUS_SYMBOLS = ['power', 'protection', 'prosperity'] as const;
type SarcophagusSymbol = typeof SARCOPHAGUS_SYMBOLS[number];

export default function PharaohScepterQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRiddleOption, setSelectedRiddleOption] = useState('');
  const [selectedScarabRiddleOption, setSelectedScarabRiddleOption] = useState('');
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
    if (!selectedRiddleOption) {
      setFeedback(t.errorNoAnswer);
      return;
    }
    if (selectedRiddleOption === riddleSolution) {
      setFeedback(t.feedbackCorrectRiddle);
      setCurrentStep(2); // Proceed to Corridor of Choices
      setSelectedRiddleOption(''); 
      setFeedback(''); // Clear feedback for next step
    } else {
      setFeedback(t.feedbackIncorrectRiddle);
    }
  };

  const handleCorridorChoice = (choice: 'ankh' | 'scarab' | 'jackal') => {
    setFeedback(''); // Clear previous feedback
    if (choice === 'ankh') {
      setCurrentStep(3); // Proceed to Sarcophagus Chamber
    } else if (choice === 'scarab') {
      setCurrentStep(4); // Proceed to Scarab's Wisdom Chamber
    } else { // jackal
      setCurrentStep(5); // Proceed to Jackal's Snare Chamber
    }
  };
  
  const handleScarabRiddleSubmit = () => {
    if (!selectedScarabRiddleOption) {
      setFeedback(t.errorNoAnswer);
      return;
    }
    if (selectedScarabRiddleOption === scarabRiddleSolution) {
      setFeedback(t.feedbackCorrectScarabRiddle);
      // Button to return to corridor will be shown via feedback state
    } else {
      setFeedback(t.feedbackIncorrectScarabRiddle);
    }
  };

  const returnToCorridor = () => {
    setCurrentStep(2);
    setFeedback('');
    setSelectedScarabRiddleOption('');
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
    if (currentStep === 3 && sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) {
      const isCorrect = sarcophagusSequence.every((symbol, index) => symbol === SARCOPHAGUS_SYMBOLS[index]);
      if (isCorrect) {
        setFeedback(t.feedbackCorrectSequence);
        setQuestCompleted(true);
        setCurrentStep(6); // Move to completion step
      } else {
        setFeedback(t.feedbackIncorrectSequence);
        setTimeout(() => {
          // Only reset if still on this step and sequence is full (failed attempt)
          if(currentStep === 3 && sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) { 
             setSarcophagusSequence([]);
          }
        }, 1500);
      }
    }
  }, [sarcophagusSequence, t.feedbackCorrectSequence, t.feedbackIncorrectSequence, currentStep]);


  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Antechamber Riddle - Multiple Choice
        const riddleOptions = [
          { id: 'sphinx', label: t.optionSphinx },
          { id: 'mummy', label: t.optionMummy },
          { id: 'pharaoh', label: t.optionPharaoh },
          { id: 'scarab', label: t.optionScarab },
        ];
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.antechamberTitle}</CardTitle>
              <CardDescription>{t.stepLabel(1, TOTAL_MAIN_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.antechamberRiddle}</p>
              <RadioGroup value={selectedRiddleOption} onValueChange={setSelectedRiddleOption} className="space-y-2">
                {riddleOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`} className="text-base">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {feedback && <p className={`mt-4 text-sm ${selectedRiddleOption === riddleSolution && feedback === t.feedbackCorrectRiddle ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
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
              <CardDescription>{t.stepLabel(2, TOTAL_MAIN_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.corridorScenario}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => handleCorridorChoice('scarab')}>
                  <Sun className="mr-2 h-4 w-4" /> {t.choiceScarab} {/* Changed Icon */}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('ankh')}>
                  <KeyRound className="mr-2 h-4 w-4" /> {t.choiceAnkh}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('jackal')}>
                  <Eye className="mr-2 h-4 w-4" /> {t.choiceJackal}
                </Button>
              </div>
              {feedback && <p className={`mt-4 text-sm ${feedback === t.feedbackCorrectChoiceAnkh ? 'text-green-600' : 'text-muted-foreground'}`}>{feedback}</p>}
            </CardContent>
          </Card>
        );
      case 3: // Sarcophagus Chamber
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.sarcophagusTitle}</CardTitle>
              <CardDescription>{t.stepLabel(3, TOTAL_MAIN_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.sarcophagusPuzzle}</p>
              <div className="flex justify-center space-x-4 my-4">
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('power')} disabled={sarcophagusSequence.length >= 3}>
                  <Wand2 className="mr-2 h-5 w-5" /> {t.symbolPower.split('(')[0].trim()} 
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('protection')} disabled={sarcophagusSequence.length >= 3}>
                  <Eye className="mr-2 h-5 w-5" /> {t.symbolProtection.split('(')[0].trim()}
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('prosperity')} disabled={sarcophagusSequence.length >= 3}>
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
      case 4: // Scarab's Wisdom Chamber
        const scarabRiddleOptions = [
          { id: 'yesterday', label: t.optionYesterday },
          { id: 'today', label: t.optionToday },
          { id: 'tomorrow', label: t.optionTomorrow },
        ];
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.scarabChamberTitle}</CardTitle>
              <CardDescription>{t.stepLabel(2, TOTAL_MAIN_STEPS)} (Detour)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.scarabChamberIntro}</p>
              <RadioGroup value={selectedScarabRiddleOption} onValueChange={setSelectedScarabRiddleOption} className="space-y-2">
                {scarabRiddleOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`scarab-option-${option.id}`} />
                    <Label htmlFor={`scarab-option-${option.id}`} className="text-base">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {feedback && <p className={`mt-4 text-sm ${selectedScarabRiddleOption === scarabRiddleSolution && feedback === t.feedbackCorrectScarabRiddle ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button 
                onClick={handleScarabRiddleSubmit} 
                className="w-full" 
                disabled={feedback === t.feedbackCorrectScarabRiddle}>
                  {t.submitAnswer}
              </Button>
              {(feedback === t.feedbackCorrectScarabRiddle || feedback === t.feedbackIncorrectScarabRiddle) && (
                 <Button onClick={returnToCorridor} className="w-full" variant="outline">{t.returnToCorridor}</Button>
              )}
            </CardFooter>
          </Card>
        );
      case 5: // Jackal's Snare Chamber
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.jackalChamberTitle}</CardTitle>
              <CardDescription>{t.stepLabel(2, TOTAL_MAIN_STEPS)} (Detour)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.jackalChamberDescription}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={returnToCorridor} className="w-full">{t.returnToCorridor}</Button>
            </CardFooter>
          </Card>
        );
       case 6: // Quest Completion
          return (
            <Card className="text-center">
              <CardHeader>
                <Gem className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
                <CardTitle className="text-2xl font-bold text-green-600">{t.questCompleteTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{t.questCompleteMessage}</p>
                <p className="mt-2 text-sm text-muted-foreground">{feedback}</p> {/* Shows "Discs click into place..." */}
              </CardContent>
              <CardFooter>
                <Button onClick={handleClaimReward} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" /> {t.claimReward}
                </Button>
              </CardFooter>
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
             <PuzzleIcon className="h-7 w-7 text-accent" /> {/* Changed Icon */}
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

      