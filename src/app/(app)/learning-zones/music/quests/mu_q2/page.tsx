
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, Music2, Zap, CheckCircle, XCircle, RotateCcw, Drum, Square, Triangle, Circle as LucideCircle } from 'lucide-react'; // Renamed Circle to LucideCircle

const questDetails = {
  id: 'mu_q2',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'music',
  zoneNameKey: 'zoneName',
  type: 'Individual',
  difficulty: 'Medium',
  points: 160,
};

type PadId = 'pad1' | 'pad2' | 'pad3' | 'pad4';
interface BeatPattern {
  sequence: PadId[];
  playbackSpeed: number; // ms per beat
}

const PATTERNS: BeatPattern[] = [
  { sequence: ['pad1', 'pad2', 'pad1', 'pad2'], playbackSpeed: 700 },
  { sequence: ['pad1', 'pad3', 'pad2', 'pad4'], playbackSpeed: 650 },
  { sequence: ['pad1', 'pad2', 'pad3', 'pad4', 'pad1'], playbackSpeed: 600 },
  { sequence: ['pad4', 'pad3', 'pad2', 'pad1', 'pad4', 'pad3'], playbackSpeed: 550 },
  { sequence: ['pad1', 'pad1', 'pad2', 'pad2', 'pad3', 'pad4', 'pad3', 'pad4'], playbackSpeed: 500 },
];

const MAX_ROUNDS = PATTERNS.length;
const POINTS_PER_CORRECT_BEAT = 10;
const ROUND_BONUS = 50;

const pageTranslations = {
  en: {
    questTitle: "Rhythm Renegade: Beat Master Challenge",
    questDescription: "Test your rhythmic precision! Listen to (or watch) complex beats and recreate them using a virtual drum pad.",
    zoneName: "Music Hall",
    backToZone: "Back to Music Hall",
    gameAreaTitle: "Rhythm Pad Console",
    roundLabel: (current: number, total: number) => `Round ${current} of ${total}`,
    scoreLabel: "Score:",
    watchPatternButton: "Watch Pattern",
    yourTurnMessage: "Your turn! Replicate the pattern.",
    feedbackCorrectBeat: "Correct Beat!",
    feedbackIncorrectBeat: "Incorrect! Try again from the start of this pattern.",
    feedbackRoundComplete: "Round Complete! Get ready for the next one.",
    feedbackGameWon: "Challenge Mastered! You've got perfect rhythm!",
    feedbackGameOver: "Game Over. Practice makes perfect!",
    startGameButton: "Start Challenge",
    nextRoundButton: "Next Round",
    restartGameButton: "Restart Challenge",
    claimRewardButton: "Claim Reward",
    toastRewardTitle: "Rhythm Mastered!",
    toastRewardDescription: (points: number, score: number) => `You scored ${score} and earned ${points} quest points!`,
    pad1Label: "Kick",
    pad2Label: "Snare",
    pad3Label: "Hi-Hat",
    pad4Label: "Clap",
  },
  id: {
    questTitle: "Pemberontak Irama: Tantangan Master Ketukan",
    questDescription: "Uji ketepatan irama Anda! Dengarkan (atau saksikan) ketukan kompleks dan buat ulang menggunakan pad drum virtual.",
    zoneName: "Aula Musik",
    backToZone: "Kembali ke Aula Musik",
    gameAreaTitle: "Konsol Pad Irama",
    roundLabel: (current: number, total: number) => `Ronde ${current} dari ${total}`,
    scoreLabel: "Skor:",
    watchPatternButton: "Lihat Pola",
    yourTurnMessage: "Giliran Anda! Tiru polanya.",
    feedbackCorrectBeat: "Ketukan Benar!",
    feedbackIncorrectBeat: "Salah! Coba lagi dari awal pola ini.",
    feedbackRoundComplete: "Ronde Selesai! Bersiap untuk ronde berikutnya.",
    feedbackGameWon: "Tantangan Dikuasai! Irama Anda sempurna!",
    feedbackGameOver: "Permainan Selesai. Latihan membuat sempurna!",
    startGameButton: "Mulai Tantangan",
    nextRoundButton: "Ronde Berikutnya",
    restartGameButton: "Ulangi Tantangan",
    claimRewardButton: "Klaim Hadiah",
    toastRewardTitle: "Irama Dikuasai!",
    toastRewardDescription: (points: number, score: number) => `Anda mencetak ${score} dan mendapatkan ${points} poin misi!`,
    pad1Label: "Tendang",
    pad2Label: "Jerat",
    pad3Label: "Hi-Hat",
    pad4Label: "Tepuk",
  }
};

const padIcons: Record<PadId, React.ElementType> = {
  pad1: Drum,
  pad2: Square,
  pad3: Triangle,
  pad4: LucideCircle,
};

export default function RhythmRenegadeQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [playerSequence, setPlayerSequence] = useState<PadId[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'showingPattern' | 'playerTurn' | 'roundEnd' | 'gameOver'>('idle');
  const [activePad, setActivePad] = useState<PadId | null>(null);

  useEffect(() => {
    const updateLang = () => {
      const savedSettings = localStorage.getItem('user-app-settings');
      let newLangKey: 'en' | 'id' = 'en';
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language && (parsed.language === 'en' || parsed.language === 'id')) {
            newLangKey = parsed.language;
          }
        } catch (e) { console.error("Error reading lang for RhythmRenegadePage", e); }
      }
      setLang(newLangKey);
      // Reset game state if language changes mid-game to avoid inconsistencies with text
      if (lang !== newLangKey) {
        resetGame();
      }
    };
    updateLang();
    if (typeof window !== 'undefined') {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'user-app-settings') updateLang();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [lang]); // Add lang as a dependency

  const t = pageTranslations[lang];
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };
  
  const currentPattern = PATTERNS[currentRound];

  const playPattern = useCallback(async () => {
    if (!currentPattern) return;
    setGameState('showingPattern');
    setFeedbackMessage(t.watchPatternButton + '...');
    setPlayerSequence([]);

    for (let i = 0; i < currentPattern.sequence.length; i++) {
      const beat = currentPattern.sequence[i];
      await new Promise(resolve => setTimeout(resolve, currentPattern.playbackSpeed / 2));
      setActivePad(beat);
      // Conceptually, play a sound here if audio was implemented
      await new Promise(resolve => setTimeout(resolve, currentPattern.playbackSpeed / 2));
      setActivePad(null);
    }
    setGameState('playerTurn');
    setFeedbackMessage(t.yourTurnMessage);
  }, [currentPattern, t]);

  const handlePadClick = (padId: PadId) => {
    if (gameState !== 'playerTurn' || !currentPattern) return;

    const newPlayerSequence = [...playerSequence, padId];
    setPlayerSequence(newPlayerSequence);

    const targetBeat = currentPattern.sequence[newPlayerSequence.length - 1];

    if (padId === targetBeat) {
      setScore(prev => prev + POINTS_PER_CORRECT_BEAT);
      setFeedbackMessage(t.feedbackCorrectBeat);

      if (newPlayerSequence.length === currentPattern.sequence.length) {
        // Pattern complete
        setScore(prev => prev + ROUND_BONUS);
        setFeedbackMessage(t.feedbackRoundComplete);
        setGameState('roundEnd');
      }
    } else {
      // Incorrect beat
      setFeedbackMessage(t.feedbackIncorrectBeat);
      // Reset player sequence for this round, they have to try the current pattern again
      setPlayerSequence([]);
      // Optionally, add a small delay or visual cue for error before they can try again
      // For now, they can immediately try the pattern again from the start
    }
  };
  
  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setPlayerSequence([]);
    setFeedbackMessage('');
    setGameState('idle');
    setActivePad(null);
  };

  const startNextRound = () => {
    if (currentRound < MAX_ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
      setPlayerSequence([]);
      setGameState('showingPattern'); // Will trigger playPattern via useEffect or explicit call
       // Need to call playPattern explicitly if not relying on useEffect for this transition
      if(PATTERNS[currentRound+1]) {
        // Simulating the effect call if playPattern was in useEffect for currentPattern
        // This requires careful handling if playPattern itself has dependencies
        // A simpler way: trigger playPattern on button click or a state change for "startShowNextPattern"
        // For now, just set to showingPattern and let the button handle the explicit call
        setFeedbackMessage(t.watchPatternButton + '...');
      }
    } else {
      setFeedbackMessage(t.feedbackGameWon);
      setGameState('gameOver');
    }
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, score),
    });
    // Potentially navigate away or reset game
  };

  const pads: { id: PadId; labelKey: keyof typeof t; Icon: React.ElementType }[] = [
    { id: 'pad1', labelKey: 'pad1Label', Icon: Drum },
    { id: 'pad2', labelKey: 'pad2Label', Icon: Square },
    { id: 'pad3', labelKey: 'pad3Label', Icon: Triangle },
    { id: 'pad4', labelKey: 'pad4Label', Icon: LucideCircle },
  ];

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
            {currentQuestDetails.zoneName} | {questDetails.points} Points | {currentQuestDetails.type} | {currentQuestDetails.difficulty}
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Music2 className="h-6 w-6 text-primary" />
            {t.gameAreaTitle}
          </CardTitle>
          {gameState !== 'idle' && gameState !== 'gameOver' && (
            <CardDescription>{t.roundLabel(currentRound + 1, MAX_ROUNDS)}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted/30 rounded-md">
            <p className="text-lg font-semibold">{t.scoreLabel} <span className="text-2xl text-accent">{score}</span></p>
          </div>

          {gameState === 'idle' && (
            <Button onClick={() => {setGameState('showingPattern'); playPattern();}} className="w-full">
              <Zap className="mr-2 h-5 w-5" /> {t.startGameButton}
            </Button>
          )}
          
          {(gameState === 'showingPattern' || gameState === 'playerTurn' || gameState === 'roundEnd') && (
            <>
              <div className="flex justify-center space-x-2 my-4">
                {pads.map(pad => (
                  <div key={pad.id} className={`w-16 h-16 rounded-md border-2 flex items-center justify-center transition-all duration-150
                    ${activePad === pad.id ? 'bg-primary scale-110 shadow-lg' : 'bg-secondary'}
                    ${gameState === 'playerTurn' ? 'cursor-pointer hover:bg-primary/80' : 'cursor-default opacity-70'}`}
                    onClick={() => gameState === 'playerTurn' && handlePadClick(pad.id)}
                    aria-label={t[pad.labelKey]}
                  >
                    <pad.Icon className={`h-8 w-8 ${activePad === pad.id ? 'text-primary-foreground' : 'text-secondary-foreground'}`} />
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground min-h-[20px]">
                {feedbackMessage}
              </p>
              {gameState === 'showingPattern' && !activePad && (
                 <Button onClick={playPattern} className="w-full mt-2" variant="outline">
                    <Zap className="mr-2 h-4 w-4" /> {t.watchPatternButton} Again
                </Button>
              )}
            </>
          )}

          {gameState === 'roundEnd' && (
            <Button onClick={startNextRound} className="w-full">
              {t.nextRoundButton}
            </Button>
          )}
          
          {gameState === 'gameOver' && (
            <div className="text-center space-y-4">
              <p className={`font-bold text-xl ${feedbackMessage === t.feedbackGameWon ? 'text-green-600' : 'text-destructive'}`}>
                {feedbackMessage}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" /> {t.restartGameButton}
                </Button>
                <Button onClick={handleClaimReward}>
                  <CheckCircle className="mr-2 h-4 w-4" /> {t.claimRewardButton}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

