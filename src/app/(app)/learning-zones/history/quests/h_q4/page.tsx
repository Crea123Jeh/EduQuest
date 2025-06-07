
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, CheckCircle, Users, MapPin, HelpCircle, ArrowUp, ArrowDown, ArrowLeftIcon as MoveLeftIcon, ArrowRightIcon as MoveRightIcon, Move } from 'lucide-react';

const questDetails = {
  id: 'h_q4',
  titleKey: 'questTitle',
  descriptionKey: 'questDescriptionUpdated', // Updated key for new description
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  type: 'Collaborative',
  difficulty: 'Hard',
  points: 210,
};

interface InteractiveSpot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  questionKey: string;
  questionType: 'info' | 'multiple-choice';
  optionsKey?: string; // For multiple choice options
  correctAnswerKey?: string; // For multiple choice correct answer
  isAnswered: boolean;
  requiredTool?: string; // For simulated collaborative tool requirement
}

const MAP_WIDTH = 800; // px, adjust as needed
const MAP_HEIGHT = 800; // px, adjust as needed
const PLAYER_SIZE = 32; // px
const MOVE_STEP = 20; // px
const INTERACTION_RADIUS = 40; // px

const pageTranslations = {
  en: {
    questTitle: "Borobudur Explorers: The Hidden Stupa",
    questDescriptionOriginal: "Embark on a collaborative expedition to uncover the secrets of Borobudur temple. Work with your team to decipher reliefs, solve ancient puzzles, and navigate the temple's intricate levels to find a legendary hidden stupa. Teamwork is crucial to overcome obstacles that require multiple explorers.",
    questDescriptionUpdated: "Navigate the ancient Borobudur temple map. Discover hidden knowledge spots, answer historical questions, and work with your (simulated) team to uncover the secrets of the Hidden Stupa. Use WASD or Arrow Keys to move.",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    playerAvatarAlt: "Player Avatar",
    interactionPrompt: "Press 'E' or Click to Interact",
    questionTitle: "Knowledge Check!",
    submitAnswer: "Submit Answer",
    closeDialog: "Close",
    infoSpot1Question: "Borobudur is the world's largest Buddhist temple, located in Magelang, Central Java, Indonesia. It was built in the 9th century during the reign of the Sailendra Dynasty.",
    mcSpot1Question: "Which of these is NOT one of the three main levels of Borobudur's cosmology?",
    mcSpot1Options: ["Kamadhatu (world of desire)", "Arupadhatu (world of formlessness)", "Rupadhatu (world of forms)", "Swargaloka (heavenly realm)"],
    mcSpot1CorrectAnswer: "Swargaloka (heavenly realm)",
    infoSpot2Question: "The temple is decorated with 2,672 relief panels and 504 Buddha statues. The central dome is surrounded by 72 Buddha statues, each seated inside a perforated stupa.",
    feedbackCorrect: "Correct! Your knowledge deepens.",
    feedbackIncorrect: "Not quite. The correct answer was: {answer}.",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've explored Borobudur and earned ${points} points!`,
    allSpotsVisited: "All knowledge spots visited! You've uncovered the temple's secrets.",
    imagePlaceholderText: "IMPORTANT: Replace 'borobudur_map_placeholder.jpg' in public/images with your actual 'borobudur_map.jpg'",
    controlsTitle: "Controls",
    controlsWASD: "WASD or Arrow Keys to Move",
    controlsInteract: "E or Click Spot to Interact",
    scoreLabel: "Score:",
    spotNotYetAvailable: "You need the 'Ancient Compass' (from a teammate) to access this hidden area.",
  },
  id: {
    questTitle: "Penjelajah Borobudur: Stupa Tersembunyi",
    questDescriptionOriginal: "Mulailah ekspedisi kolaboratif untuk mengungkap rahasia Candi Borobudur. Bekerja samalah dengan tim Anda untuk menguraikan relief, memecahkan teka-teki kuno, dan menavigasi tingkat candi yang rumit untuk menemukan stupa tersembunyi yang legendaris. Kerja tim sangat penting untuk mengatasi rintangan yang membutuhkan banyak penjelajah.",
    questDescriptionUpdated: "Navigasi peta Candi Borobudur kuno. Temukan titik pengetahuan tersembunyi, jawab pertanyaan sejarah, dan bekerja samalah dengan tim (simulasi) Anda untuk mengungkap rahasia Stupa Tersembunyi. Gunakan WASD atau Tombol Panah untuk bergerak.",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    playerAvatarAlt: "Avatar Pemain",
    interactionPrompt: "Tekan 'E' atau Klik untuk Berinteraksi",
    questionTitle: "Cek Pengetahuan!",
    submitAnswer: "Kirim Jawaban",
    closeDialog: "Tutup",
    infoSpot1Question: "Borobudur adalah candi Buddha terbesar di dunia, terletak di Magelang, Jawa Tengah, Indonesia. Dibangun pada abad ke-9 pada masa pemerintahan Dinasti Sailendra.",
    mcSpot1Question: "Manakah dari berikut ini yang BUKAN merupakan salah satu dari tiga tingkat utama kosmologi Borobudur?",
    mcSpot1Options: ["Kamadhatu (alam keinginan)", "Arupadhatu (alam tanpa rupa)", "Rupadhatu (alam berwujud)", "Swargaloka (alam surga)"],
    mcSpot1CorrectAnswer: "Swargaloka (alam surga)",
    infoSpot2Question: "Candi ini dihiasi dengan 2.672 panel relief dan 504 arca Buddha. Kubah pusat dikelilingi oleh 72 arca Buddha, masing-masing duduk di dalam stupa berlubang.",
    feedbackCorrect: "Benar! Pengetahuanmu semakin mendalam.",
    feedbackIncorrect: "Kurang tepat. Jawaban yang benar adalah: {answer}.",
    toastRewardTitle: "Misi Selesai!",
    toastRewardDescription: (points: number) => `Anda telah menjelajahi Borobudur dan mendapatkan ${points} poin!`,
    allSpotsVisited: "Semua titik pengetahuan telah dikunjungi! Anda telah mengungkap rahasia candi.",
    imagePlaceholderText: "PENTING: Ganti 'borobudur_map_placeholder.jpg' di public/images dengan 'borobudur_map.jpg' Anda yang sebenarnya.",
    controlsTitle: "Kontrol",
    controlsWASD: "WASD atau Tombol Panah untuk Bergerak",
    controlsInteract: "E atau Klik Titik untuk Berinteraksi",
    scoreLabel: "Skor:",
    spotNotYetAvailable: "Anda memerlukan 'Kompas Kuno' (dari rekan tim) untuk mengakses area tersembunyi ini.",
  }
};


export default function BorobudurExplorersMapPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 }); // Initial position (percentage)
  const [activeSpot, setActiveSpot] = useState<InteractiveSpot | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const [interactiveSpots, setInteractiveSpots] = useState<InteractiveSpot[]>([
    { id: 'spot1', x: 20, y: 25, questionKey: 'infoSpot1Question', questionType: 'info', isAnswered: false },
    { id: 'spot2', x: 70, y: 60, questionKey: 'mcSpot1Question', questionType: 'multiple-choice', optionsKey: 'mcSpot1Options', correctAnswerKey: 'mcSpot1CorrectAnswer', isAnswered: false },
    { id: 'spot3', x: 45, y: 80, questionKey: 'infoSpot2Question', questionType: 'info', isAnswered: false, requiredTool: 'Ancient Compass'},
    // Add up to 7 more spots here
  ]);

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
        } catch (e) { console.error("Error reading lang for Borobudur Map Page", e); }
      }
      setLang(newLangKey);
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

  const handleMovement = useCallback((dx: number, dy: number) => {
    setPlayerPosition(prev => ({
      x: Math.max(0, Math.min(100 - (PLAYER_SIZE / MAP_WIDTH * 100), prev.x + dx)),
      y: Math.max(0, Math.min(100 - (PLAYER_SIZE / MAP_HEIGHT * 100), prev.y + dy)),
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const stepPercentageX = (MOVE_STEP / MAP_WIDTH) * 100;
      const stepPercentageY = (MOVE_STEP / MAP_HEIGHT) * 100;
      switch (event.key.toLowerCase()) {
        case 'w': case 'arrowup': handleMovement(0, -stepPercentageY); break;
        case 's': case 'arrowdown': handleMovement(0, stepPercentageY); break;
        case 'a': case 'arrowleft': handleMovement(-stepPercentageX, 0); break;
        case 'd': case 'arrowright': handleMovement(stepPercentageX, 0); break;
        case 'e':
          const nearbySpot = interactiveSpots.find(spot => !spot.isAnswered && isNearby(spot));
          if (nearbySpot) handleSpotInteraction(nearbySpot);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMovement, interactiveSpots]);

  const isNearby = (spot: InteractiveSpot) => {
    const playerCenterX = playerPosition.x + (PLAYER_SIZE / MAP_WIDTH * 100) / 2;
    const playerCenterY = playerPosition.y + (PLAYER_SIZE / MAP_HEIGHT * 100) / 2;
    const spotCenterX = spot.x + (PLAYER_SIZE / MAP_WIDTH * 100) / 2; // Assuming spots are same size for interaction
    const spotCenterY = spot.y + (PLAYER_SIZE / MAP_HEIGHT * 100) / 2;
    
    const interactionRadiusPercentX = (INTERACTION_RADIUS / MAP_WIDTH) * 100;
    const interactionRadiusPercentY = (INTERACTION_RADIUS / MAP_HEIGHT) * 100;

    const dx = playerCenterX - spotCenterX;
    const dy = playerCenterY - spotCenterY;
    return Math.abs(dx) < interactionRadiusPercentX && Math.abs(dy) < interactionRadiusPercentY;
  };
  
  const handleSpotInteraction = (spot: InteractiveSpot) => {
    if (spot.isAnswered) return;

    // Simulate tool requirement
    if (spot.requiredTool) {
        toast({ title: "Tool Required", description: t.spotNotYetAvailable, variant: "destructive" });
        return;
    }
    setActiveSpot(spot);
    setSelectedAnswer(null); // Reset selected answer for MCQs
  };

  const handleCloseDialog = () => {
    setActiveSpot(null);
  };

  const handleSubmitAnswer = () => {
    if (!activeSpot) return;

    if (activeSpot.questionType === 'multiple-choice') {
      const correctAnswer = t[activeSpot.correctAnswerKey as keyof typeof t];
      if (selectedAnswer === correctAnswer) {
        toast({ title: t.feedbackCorrect, variant: "default" });
        setScore(prev => prev + 10); // Add points for correct answer
      } else {
        toast({ title: t.feedbackIncorrect({ answer: correctAnswer }), variant: "destructive" });
      }
    }
    // For 'info' type, just closing is enough. Points could be awarded on visit.
    setScore(prev => prev + 5); // Add points for visiting/interacting

    setInteractiveSpots(prevSpots =>
      prevSpots.map(s => (s.id === activeSpot.id ? { ...s, isAnswered: true } : s))
    );
    setActiveSpot(null);

    if (interactiveSpots.every(s => s.id === activeSpot.id || s.isAnswered)) {
        checkCompletion();
    }
  };
  
  const checkCompletion = () => {
     if (interactiveSpots.filter(s => !s.requiredTool).every(s => s.isAnswered)) {
      toast({
        title: t.toastRewardTitle,
        description: t.toastRewardDescription(questDetails.points + score),
      });
      // Potentially navigate away or show a completion message on the page
    }
  };
  
  const allNonToolSpotsAnswered = interactiveSpots.filter(s => !s.requiredTool).every(s => s.isAnswered);

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

      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Borobudur Temple Map</CardTitle>
                <p className="text-lg font-semibold">{t.scoreLabel} <span className="text-accent">{score}</span></p>
            </div>
            <CardDescription>{t.imagePlaceholderText}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div ref={mapRef} className="relative border-2 border-primary rounded-md overflow-hidden" style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}>
            <Image
              src="/images/borobudur_map_placeholder.jpg" // User needs to replace this
              alt="Borobudur Map"
              layout="fill"
              objectFit="cover"
              data-ai-hint="borobudur temple aerial"
            />
            {/* Player Avatar */}
            <div
              style={{
                position: 'absolute',
                left: `${playerPosition.x}%`,
                top: `${playerPosition.y}%`,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
                backgroundColor: 'rgba(0, 123, 255, 0.7)',
                borderRadius: '50%',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'left 0.1s linear, top 0.1s linear',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
              }}
              title={t.playerAvatarAlt}
            >
              <Move size={PLAYER_SIZE * 0.6} className="text-white" />
            </div>

            {/* Interactive Spots */}
            {interactiveSpots.map(spot => (
              <button
                key={spot.id}
                onClick={() => handleSpotInteraction(spot)}
                disabled={spot.isAnswered}
                className={`absolute p-1 rounded-full transition-all duration-200
                            ${spot.isAnswered ? 'bg-green-500 opacity-50 cursor-default' : 'bg-yellow-400 hover:bg-yellow-300 animate-pulse'}
                            ${isNearby(spot) && !spot.isAnswered ? 'ring-4 ring-yellow-300' : ''}`}
                style={{
                  left: `calc(${spot.x}% - ${PLAYER_SIZE/2}px)`,
                  top: `calc(${spot.y}% - ${PLAYER_SIZE/2}px)`,
                  width: `${PLAYER_SIZE}px`,
                  height: `${PLAYER_SIZE}px`,
                }}
                title={spot.isAnswered ? "Visited" : t.interactionPrompt}
              >
                {spot.isAnswered ? <CheckCircle size={PLAYER_SIZE * 0.7} className="text-white" /> : <HelpCircle size={PLAYER_SIZE * 0.7} className="text-black" />}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 border rounded-lg bg-muted w-full max-w-md">
            <h3 className="font-semibold text-center mb-2">{t.controlsTitle}</h3>
            <div className="flex justify-around items-center">
                <p className="text-sm text-muted-foreground">{t.controlsWASD}</p>
                <div className="grid grid-cols-3 gap-1">
                    <div></div>
                    <Button variant="outline" size="icon" onClick={() => handleMovement(0, -(MOVE_STEP / MAP_HEIGHT) * 100)} aria-label="Move Up"><ArrowUp/></Button>
                    <div></div>
                    <Button variant="outline" size="icon" onClick={() => handleMovement(-(MOVE_STEP / MAP_WIDTH) * 100, 0)} aria-label="Move Left"><MoveLeftIcon/></Button>
                    <Button variant="outline" size="icon" onClick={() => handleMovement(0, (MOVE_STEP / MAP_HEIGHT) * 100)} aria-label="Move Down"><ArrowDown/></Button>
                    <Button variant="outline" size="icon" onClick={() => handleMovement((MOVE_STEP / MAP_WIDTH) * 100, 0)} aria-label="Move Right"><MoveRightIcon/></Button>
                </div>
            </div>
             <p className="text-sm text-muted-foreground text-center mt-2">{t.controlsInteract}</p>
          </div>
          {allNonToolSpotsAnswered && (
            <p className="mt-4 text-green-600 font-semibold">{t.allSpotsVisited}</p>
          )}
        </CardContent>
      </Card>

      {activeSpot && (
        <Dialog open={!!activeSpot} onOpenChange={() => activeSpot && !activeSpot.isAnswered ? setActiveSpot(null) : null}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.questionTitle}</DialogTitle>
              <DialogDescription>
                {t[activeSpot.questionKey as keyof typeof t]}
              </DialogDescription>
            </DialogHeader>
            {activeSpot.questionType === 'multiple-choice' && activeSpot.optionsKey && (
              <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="my-4 space-y-2">
                {(t[activeSpot.optionsKey as keyof typeof t] as string[]).map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>{t.closeDialog}</Button>
              {(activeSpot.questionType === 'info' || (activeSpot.questionType === 'multiple-choice' && selectedAnswer)) && (
                <Button onClick={handleSubmitAnswer}>{t.submitAnswer}</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    