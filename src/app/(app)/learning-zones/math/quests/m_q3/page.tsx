
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, InfinityIcon, CheckCircle, XCircle, Sigma, Wand2 } from 'lucide-react';

const PI_DIGITS_SEQUENCE = "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"; // First 100 decimal places, starting with 3.
const NUM_OPTIONS = 4; // Number of choices for the next digit

const questDetails = {
  id: 'm_q3',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'math',
  zoneNameKey: 'zoneName',
  points: 170,
};

const pageTranslations = {
  en: {
    questTitle: "The Infinite Labyrinth of Pi",
    questDescription: "Navigate a maze where each turn is decided by a digit of Pi. How far can you go before getting lost in infinity?",
    zoneName: "Mathematics Realm",
    backToZone: "Back to Mathematics Realm",
    gameAreaTitle: "Pi Labyrinth Navigation",
    scoreLabel: "Depth Reached:",
    currentPiDigitLabel: "Current Pi Digit:",
    selectNextDigitLabel: "Select the NEXT digit of Pi:",
    startGameButton: "Start Navigating",
    restartGameButton: "Restart Labyrinth",
    claimRewardButton: "Claim Reward",
    feedbackCorrect: "Correct! Proceed deeper...",
    feedbackIncorrect: (correctDigit: string) => `Incorrect! The next digit was ${correctDigit}. Labyrinth resets.`,
    feedbackGameOver: "You've reached the end of this Pi segment!",
    toastRewardTitle: "Reward Claimed!",
    toastRewardDescription: (points: number, score: number) => `You navigated to depth ${score} and earned ${points} points. Well done, Pi Explorer!`,
    initialMessage: "Press 'Start Navigating' to begin your journey into Pi.",
  },
  id: {
    questTitle: "Labirin Pi Tak Terhingga",
    questDescription: "Navigasi labirin di mana setiap belokan ditentukan oleh digit Pi. Seberapa jauh Anda bisa melangkah sebelum tersesat dalam ketidakterhinggaan?",
    zoneName: "Dunia Matematika",
    backToZone: "Kembali ke Dunia Matematika",
    gameAreaTitle: "Navigasi Labirin Pi",
    scoreLabel: "Kedalaman Dicapai:",
    currentPiDigitLabel: "Digit Pi Saat Ini:",
    selectNextDigitLabel: "Pilih digit Pi BERIKUTNYA:",
    startGameButton: "Mulai Navigasi",
    restartGameButton: "Ulangi Labirin",
    claimRewardButton: "Klaim Hadiah",
    feedbackCorrect: "Benar! Lanjutkan lebih dalam...",
    feedbackIncorrect: (correctDigit: string) => `Salah! Digit berikutnya adalah ${correctDigit}. Labirin diatur ulang.`,
    feedbackGameOver: "Anda telah mencapai akhir segmen Pi ini!",
    toastRewardTitle: "Hadiah Diklaim!",
    toastRewardDescription: (points: number, score: number) => `Anda bernavigasi hingga kedalaman ${score} dan mendapatkan ${points} poin. Selamat, Penjelajah Pi!`,
    initialMessage: "Tekan 'Mulai Navigasi' untuk memulai perjalanan Anda ke dalam Pi.",
  }
};

export default function InfinitePiLabyrinthPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [currentPiIndex, setCurrentPiIndex] = useState(0); // Index in PI_DIGITS_SEQUENCE
  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [options, setOptions] = useState<string[]>([]);

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
        } catch (e) { console.error("Error reading lang for PiLabyrinthPage", e); }
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

   const generateOptions = useCallback(() => {
    if (currentPiIndex + 1 >= PI_DIGITS_SEQUENCE.length) {
      setGameState('gameOver');
      setFeedbackMessage(t.feedbackGameOver);
      setOptions([]);
      return;
    }

    const correctNextDigit = PI_DIGITS_SEQUENCE[currentPiIndex + 1];
    const newOptions: Set<string> = new Set([correctNextDigit]);

    while (newOptions.size < NUM_OPTIONS) {
      const randomDigit = Math.floor(Math.random() * 10).toString();
      newOptions.add(randomDigit);
    }
    
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
  }, [currentPiIndex, t.feedbackGameOver]);

  useEffect(() => {
    if (gameState === 'playing') {
      generateOptions();
      setFeedbackMessage(t.initialMessage)
    } else if (gameState === 'idle') {
        setFeedbackMessage(t.initialMessage);
    }
  }, [gameState, generateOptions, t.initialMessage]);


  const startGame = () => {
    setCurrentPiIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const handleOptionClick = (selectedDigit: string) => {
    if (gameState !== 'playing' || currentPiIndex + 1 >= PI_DIGITS_SEQUENCE.length) return;

    const correctNextDigit = PI_DIGITS_SEQUENCE[currentPiIndex + 1];

    if (selectedDigit === correctNextDigit) {
      setScore(prevScore => prevScore + 1);
      setCurrentPiIndex(prevIndex => prevIndex + 1);
      setFeedbackMessage(t.feedbackCorrect);
      // generateOptions will be called by useEffect due to currentPiIndex change if still playing
       if (currentPiIndex + 2 >= PI_DIGITS_SEQUENCE.length) { // Check if next iteration will be end
            setGameState('gameOver');
            setFeedbackMessage(t.feedbackGameOver);
            setOptions([]);
       } else {
            generateOptions(); // Manually call if not relying on useEffect, or ensure useEffect deps are correct
       }
    } else {
      setFeedbackMessage(t.feedbackIncorrect(correctNextDigit));
      setGameState('gameOver');
    }
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, score),
    });
    // Potentially navigate away or reset further
    setGameState('idle');
    setCurrentPiIndex(0);
    setScore(0);
    setOptions([]);
    setFeedbackMessage(t.initialMessage);
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfinityIcon className="h-6 w-6 text-primary" />
            {t.gameAreaTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">{t.scoreLabel} <span className="font-bold text-2xl text-primary">{score}</span></p>
          </div>

          {gameState === 'playing' && (
            <>
              <div className="text-center p-4 bg-muted/50 rounded-md">
                <p className="text-md text-muted-foreground">{t.currentPiDigitLabel}</p>
                <p className="text-6xl font-mono text-accent my-2">{PI_DIGITS_SEQUENCE[currentPiIndex]}</p>
                <p className="text-md font-semibold">{t.selectNextDigitLabel}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {options.map((digit) => (
                  <Button
                    key={digit}
                    variant="outline"
                    size="lg"
                    className="text-2xl h-20"
                    onClick={() => handleOptionClick(digit)}
                  >
                    {digit}
                  </Button>
                ))}
              </div>
            </>
          )}
          
          <div className={`text-center p-3 rounded-md min-h-[60px] flex items-center justify-center ${
             gameState === 'gameOver' && feedbackMessage.startsWith(t.feedbackIncorrect('').substring(0,5)) ? 'bg-destructive/10 text-destructive' : 
             feedbackMessage === t.feedbackCorrect ? 'bg-green-500/10 text-green-700' : 'bg-secondary/30'
            }`}>
            <p className="font-medium">{feedbackMessage}</p>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {gameState === 'idle' && (
            <Button onClick={startGame} className="w-full">
              {t.startGameButton}
            </Button>
          )}
          {gameState === 'playing' && (
             <p className="text-sm text-muted-foreground">Navigating the Labyrinth...</p>
          )}
          {gameState === 'gameOver' && (
            <>
              <Button onClick={startGame} className="w-full" variant="outline">
                {t.restartGameButton}
              </Button>
              <Button onClick={handleClaimReward} className="w-full">
                {t.claimRewardButton}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    