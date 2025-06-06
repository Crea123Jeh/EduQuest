
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, KeyRound, Eye, Sun, Gem, CheckCircle, Wand2, PuzzleIcon, Feather, Shield } from 'lucide-react';

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
    nextStep: "Proceed", // Generic proceed button
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
    // Step 3 (New): Hall of Sacred Offerings
    hallOfOfferingsTitle: "The Hall of Sacred Offerings",
    hallOfOfferingsScenario: "The Path of the Ankh leads you into a serene hall. On a central pedestal rest two items: a 'Feather of Ma'at' (symbolizing truth and balance) and a 'Scarab of Khepri' (symbolizing rebirth and protection). You may choose one to carry with you, or leave them undisturbed.",
    choiceFeather: "Take Feather of Ma'at",
    choiceScarabKhepri: "Take Scarab of Khepri",
    choiceLeaveOfferings: "Leave Offerings Undisturbed",
    feedbackFeather: "You take the Feather of Ma'at. It feels light and reassuring.",
    feedbackScarabKhepri: "You take the Scarab of Khepri. It feels solid and protective.",
    feedbackLeaveOfferings: "You decide to leave the offerings undisturbed, respecting their sanctity.",
    // Step 4 (was 3): Sarcophagus Chamber
    sarcophagusTitle: "The Sarcophagus Chamber",
    sarcophagusPuzzle: "The pharaoh's sarcophagus is sealed by three rotating discs, each bearing a symbol. To reveal the scepter, align the symbols of 'Power', 'Protection', and 'Prosperity' in that order.",
    symbolPower: "Symbol of Power (Crook)",
    symbolProtection: "Symbol of Protection (Eye of Horus)",
    symbolProsperity: "Symbol of Prosperity (Lotus)",
    currentSequence: "Current Sequence:",
    resetSequence: "Reset Discs",
    feedbackCorrectSequence: "The discs click into place! The sarcophagus opens, revealing the magnificent scepter!",
    feedbackIncorrectSequence: "The discs do not align. The mechanism remains locked.",
    // Step 5 (was 4): Scarab's Wisdom Chamber
    scarabChamberTitle: "Scarab's Wisdom Chamber",
    scarabChamberIntro: "The Scarab path leads you to a small chamber. An inscription glows faintly: 'What is always coming, but never arrives?'",
    optionYesterday: "Yesterday",
    optionToday: "Today",
    optionTomorrow: "Tomorrow",
    feedbackCorrectScarabRiddle: "Wise. Like the Scarab, you look to the future. Remember, the Ankh represents life, the direct path to what was lost...",
    feedbackIncorrectScarabRiddle: "The inscription remains a mystery. Consider another answer.",
    // Step 6 (was 5): Jackal's Snare Chamber
    jackalChamberTitle: "Jackal's Snare Chamber",
    jackalChamberDescription: "The Path of the Jackal leads to a dark, narrow passage. A sudden gust of wind extinguishes your torch, plunging you into momentary darkness! After fumbling for a moment, you relight it, but this path feels ominous and misleading.",
    // Quest Completion (Step 7)
    questCompleteTitle: "Scepter Recovered!",
    questCompleteMessage: "You've successfully navigated the pyramid and recovered the Pharaoh's Lost Scepter. Your knowledge of ancient Egypt has served you well!",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for recovering the Pharaoh's Scepter!`,
    errorNoAnswer: "Please select an answer.",
    errorNoChoice: "Please make a choice.",
  },
  id: {
    questTitle: "Pencarian Tongkat Firaun yang Hilang",
    questDescription: "Navigasi piramida penuh jebakan dan pecahkan hieroglif untuk menemukan tongkat legendaris sebelum para penjelajah saingan!",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    stepLabel: (current: number, total: number) => `Langkah Utama ${current} dari ${total}`,
    submitAnswer: "Kirim Jawaban",
    nextStep: "Lanjutkan",
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
    hallOfOfferingsTitle: "Aula Persembahan Suci",
    hallOfOfferingsScenario: "Jalur Ankh membawamu ke aula yang tenang. Di atas alas tengah terdapat dua benda: 'Bulu Ma'at' (melambangkan kebenaran dan keseimbangan) dan 'Scarab Khepri' (melambangkan kelahiran kembali dan perlindungan). Kamu boleh memilih satu untuk dibawa, atau membiarkannya tidak terganggu.",
    choiceFeather: "Ambil Bulu Ma'at",
    choiceScarabKhepri: "Ambil Scarab Khepri",
    choiceLeaveOfferings: "Biarkan Persembahan Tidak Terganggu",
    feedbackFeather: "Kamu mengambil Bulu Ma'at. Terasa ringan dan menenangkan.",
    feedbackScarabKhepri: "Kamu mengambil Scarab Khepri. Terasa kokoh dan protektif.",
    feedbackLeaveOfferings: "Kamu memutuskan untuk membiarkan persembahan tidak terganggu, menghormati kesuciannya.",
    sarcophagusTitle: "Ruang Sarkofagus",
    sarcophagusPuzzle: "Sarkofagus firaun disegel oleh tiga cakram berputar, masing-masing dengan simbol. Untuk mengungkap tongkat, sejajarkan simbol 'Kekuasaan', 'Perlindungan', dan 'Kemakmuran' sesuai urutan itu.",
    symbolPower: "Simbol Kekuasaan (Tongkat Gembala)",
    symbolProtection: "Simbol Perlindungan (Mata Horus)",
    symbolProsperity: "Simbol Kemakmuran (Teratai)",
    currentSequence: "Urutan Saat Ini:",
    resetSequence: "Atur Ulang Cakram",
    feedbackCorrectSequence: "Cakram berbunyi klik! Sarkofagus terbuka, memperlihatkan tongkat yang megah!",
    feedbackIncorrectSequence: "Cakram tidak sejajar. Mekanisme tetap terkunci.",
    scarabChamberTitle: "Ruang Kebijaksanaan Scarab",
    scarabChamberIntro: "Jalur Scarab membawamu ke sebuah ruangan kecil. Sebuah tulisan bersinar samar: 'Apa yang selalu datang, tetapi tidak pernah tiba?'",
    optionYesterday: "Kemarin",
    optionToday: "Hari Ini",
    optionTomorrow: "Besok",
    feedbackCorrectScarabRiddle: "Bijaksana. Seperti Scarab, kamu melihat ke masa depan. Ingat, Ankh melambangkan kehidupan, jalan langsung menuju apa yang hilang...",
    feedbackIncorrectScarabRiddle: "Tulisan itu tetap menjadi misteri. Pertimbangkan jawaban lain.",
    jackalChamberTitle: "Ruang Jebakan Jakal",
    jackalChamberDescription: "Jalur Jakal menuju lorong gelap dan sempit. Embusan angin tiba-tiba memadamkan obormu, menjerumuskanmu ke dalam kegelapan sesaat! Setelah meraba-raba sejenak, kamu menyalakannya kembali, tetapi jalur ini terasa tidak menyenangkan dan menyesatkan.",
    questCompleteTitle: "Tongkat Ditemukan!",
    questCompleteMessage: "Kamu telah berhasil menavigasi piramida dan menemukan Tongkat Firaun yang Hilang. Pengetahuanmu tentang Mesir kuno sangat berguna!",
    toastRewardTitle: "Misi Selesai!",
    toastRewardDescription: (points: number) => `Kamu mendapatkan ${points} poin karena menemukan Tongkat Firaun!`,
    errorNoAnswer: "Silakan pilih jawaban.",
    errorNoChoice: "Silakan buat pilihan.",
  }
};

const TOTAL_MAIN_STEPS = 4; // Antechamber, Corridor, Hall of Offerings, Sarcophagus
const SARCOPHAGUS_SYMBOLS = ['power', 'protection', 'prosperity'] as const;
type SarcophagusSymbol = typeof SARCOPHAGUS_SYMBOLS[number];
type OfferingChoice = 'feather' | 'scarab_khepri' | 'leave';

export default function PharaohScepterQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRiddleOption, setSelectedRiddleOption] = useState('');
  const [selectedScarabRiddleOption, setSelectedScarabRiddleOption] = useState('');
  const [selectedOffering, setSelectedOffering] = useState<OfferingChoice | null>(null);
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
      // No automatic advance, button will do it.
    } else {
      setFeedback(t.feedbackIncorrectRiddle);
    }
  };

  const advanceFromRiddle = () => {
    if (selectedRiddleOption === riddleSolution) {
        setCurrentStep(2); // Proceed to Corridor of Choices
        setSelectedRiddleOption(''); 
        setFeedback(''); // Clear feedback for next step
    }
  };

  const handleCorridorChoice = (choice: 'ankh' | 'scarab' | 'jackal') => {
    setFeedback(''); 
    if (choice === 'ankh') {
      setCurrentStep(3); // Proceed to Hall of Offerings
    } else if (choice === 'scarab') {
      setCurrentStep(5); // Proceed to Scarab's Wisdom Chamber
    } else { // jackal
      setCurrentStep(6); // Proceed to Jackal's Snare Chamber
    }
  };
  
  const handleOfferingChoice = (choice: OfferingChoice) => {
    setSelectedOffering(choice);
    if (choice === 'feather') setFeedback(t.feedbackFeather);
    else if (choice === 'scarab_khepri') setFeedback(t.feedbackScarabKhepri);
    else setFeedback(t.feedbackLeaveOfferings);
    // Button will handle advance
  };

  const advanceFromOffering = () => {
    if(selectedOffering !== null) {
        setCurrentStep(4); // Proceed to Sarcophagus Chamber
        setFeedback('');
    } else {
        setFeedback(t.errorNoChoice);
    }
  }

  const handleScarabRiddleSubmit = () => {
    if (!selectedScarabRiddleOption) {
      setFeedback(t.errorNoAnswer);
      return;
    }
    if (selectedScarabRiddleOption === scarabRiddleSolution) {
      setFeedback(t.feedbackCorrectScarabRiddle);
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
    if (currentStep === 4 && sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) {
      const isCorrect = sarcophagusSequence.every((symbol, index) => symbol === SARCOPHAGUS_SYMBOLS[index]);
      if (isCorrect) {
        setFeedback(t.feedbackCorrectSequence);
        setQuestCompleted(true);
        // No automatic advance to completion, button will handle it
      } else {
        setFeedback(t.feedbackIncorrectSequence);
        setTimeout(() => {
          if(currentStep === 4 && sarcophagusSequence.length === SARCOPHAGUS_SYMBOLS.length) { 
             setSarcophagusSequence([]);
             setFeedback(''); // Clear feedback after reset
          }
        }, 1500);
      }
    }
  }, [sarcophagusSequence, t.feedbackCorrectSequence, t.feedbackIncorrectSequence, currentStep]);

  const advanceFromSarcophagus = () => {
      if (questCompleted) {
          setCurrentStep(7); // Move to completion step
          setFeedback('');
      }
  }

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Antechamber Riddle
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
              {feedback === t.feedbackCorrectRiddle ? (
                <Button onClick={advanceFromRiddle} className="w-full">{t.nextStep}</Button>
              ) : (
                <Button onClick={handleRiddleSubmit} className="w-full">{t.submitAnswer}</Button>
              )}
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
                  <Sun className="mr-2 h-4 w-4" /> {t.choiceScarab}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('ankh')}>
                  <KeyRound className="mr-2 h-4 w-4" /> {t.choiceAnkh}
                </Button>
                <Button variant="outline" onClick={() => handleCorridorChoice('jackal')}>
                  <Eye className="mr-2 h-4 w-4" /> {t.choiceJackal}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3: // Hall of Sacred Offerings
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.hallOfOfferingsTitle}</CardTitle>
              <CardDescription>{t.stepLabel(3, TOTAL_MAIN_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.hallOfOfferingsScenario}</p>
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" onClick={() => handleOfferingChoice('feather')} className={selectedOffering === 'feather' ? 'ring-2 ring-primary' : ''}>
                  <Feather className="mr-2 h-4 w-4" /> {t.choiceFeather}
                </Button>
                <Button variant="outline" onClick={() => handleOfferingChoice('scarab_khepri')} className={selectedOffering === 'scarab_khepri' ? 'ring-2 ring-primary' : ''}>
                  <Shield className="mr-2 h-4 w-4" /> {t.choiceScarabKhepri}
                </Button>
                <Button variant="outline" onClick={() => handleOfferingChoice('leave')} className={selectedOffering === 'leave' ? 'ring-2 ring-primary' : ''}>
                  {t.choiceLeaveOfferings}
                </Button>
              </div>
              {feedback && <p className={`mt-4 text-sm ${feedback === t.errorNoChoice ? 'text-destructive' : 'text-green-600'}`}>{feedback}</p>}
            </CardContent>
            <CardFooter>
                <Button onClick={advanceFromOffering} className="w-full" disabled={!selectedOffering}>{t.nextStep}</Button>
            </CardFooter>
          </Card>
        );
      case 4: // Sarcophagus Chamber
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t.sarcophagusTitle}</CardTitle>
              <CardDescription>{t.stepLabel(4, TOTAL_MAIN_STEPS)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="italic text-lg">{t.sarcophagusPuzzle}</p>
              <div className="flex justify-center space-x-4 my-4">
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('power')} disabled={sarcophagusSequence.length >= 3 || questCompleted}>
                  <Wand2 className="mr-2 h-5 w-5" /> {t.symbolPower.split('(')[0].trim()} 
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('protection')} disabled={sarcophagusSequence.length >= 3 || questCompleted}>
                  <Eye className="mr-2 h-5 w-5" /> {t.symbolProtection.split('(')[0].trim()}
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleSymbolClick('prosperity')} disabled={sarcophagusSequence.length >= 3 || questCompleted}>
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
               <Button variant="link" onClick={handleResetSequence} className="text-sm p-0 h-auto" disabled={sarcophagusSequence.length === 0 || questCompleted}>
                {t.resetSequence}
              </Button>
              {feedback && <p className={`mt-2 text-sm ${feedback === t.feedbackCorrectSequence ? 'text-green-600' : 'text-destructive'}`}>{feedback}</p>}
            </CardContent>
            <CardFooter>
                {questCompleted && feedback === t.feedbackCorrectSequence ? (
                    <Button onClick={advanceFromSarcophagus} className="w-full">{t.nextStep}</Button>
                ): (
                    <Button onClick={() => { /* Optional: action if needed, or disable */ }} className="w-full" disabled={!sarcophagusSequence.length || sarcophagusSequence.length < SARCOPHAGUS_SYMBOLS.length || questCompleted}>
                        {t.submitAnswer}
                    </Button>
                )}
            </CardFooter>
          </Card>
        );
      case 5: // Scarab's Wisdom Chamber
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
      case 6: // Jackal's Snare Chamber
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
       case 7: // Quest Completion
          return (
            <Card className="text-center">
              <CardHeader>
                <Gem className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
                <CardTitle className="text-2xl font-bold text-green-600">{t.questCompleteTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{t.questCompleteMessage}</p>
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
             <PuzzleIcon className="h-7 w-7 text-accent" />
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
