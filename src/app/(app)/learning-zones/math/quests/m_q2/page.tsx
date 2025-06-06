
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, Puzzle, ArrowRightLeft, CheckCircle, XCircle, RotateCcw, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

const questDetails = {
  id: 'm_q2',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'math',
  zoneNameKey: 'zoneName',
  type: 'Collaborative', // For display, actual game is single player
  difficulty: 'Medium',
  points: 150,
};

interface AlgorithmComponent {
  id: string;
  nameKey: string; // Key for translation
}

const ALL_COMPONENTS: AlgorithmComponent[] = [
  { id: 'INIT', nameKey: 'compInit' },
  { id: 'FETCH_USER', nameKey: 'compFetchUser' },
  { id: 'AUTH_USER', nameKey: 'compAuthUser' },
  { id: 'LOAD_SETTINGS', nameKey: 'compLoadSettings' }, // Distractor
  { id: 'LOAD_DASH', nameKey: 'compLoadDash' },
  { id: 'DISPLAY_ADS', nameKey: 'compDisplayAds' },     // Distractor
  { id: 'RENDER_UI', nameKey: 'compRenderUi' },
  { id: 'LOG_ERROR', nameKey: 'compLogError' },         // Distractor
  { id: 'COMPLETE_SESSION', nameKey: 'compCompleteSession' },
  { id: 'SEND_EMAIL', nameKey: 'compSendEmail' },       // Distractor
];

const CORRECT_SEQUENCE_IDS: string[] = ['INIT', 'FETCH_USER', 'AUTH_USER', 'LOAD_DASH', 'RENDER_UI', 'COMPLETE_SESSION'];

const pageTranslations = {
  en: {
    questTitle: "Broken Bridge: The Algorithm Assembly",
    questDescription: "Repair a vital data bridge by correctly assembling algorithmic components. One wrong piece could corrupt the entire network!",
    zoneName: "Mathematics Realm",
    backToZone: "Back to Mathematics Realm",
    gameAreaTitle: "Algorithm Assembly Console",
    componentToolboxTitle: "Component Toolbox",
    assemblyLineTitle: "Current Assembly Line (Click to remove)",
    assembleButton: "Assemble Algorithm",
    assemblingButton: "Assembling...",
    clearAssemblyButton: "Clear Assembly",
    feedbackSuccess: "Bridge Repaired! Data flow restored. Excellent work, Engineer!",
    feedbackFailure: (correctCount: number, totalCorrect: number) => `Assembly Incorrect. ${correctCount}/${totalCorrect} components in the right order. The data bridge remains unstable. Try again!`,
    feedbackEmpty: "Assembly line is empty. Add components from the toolbox.",
    statusTitle: "Assembly Status",
    initialStatus: "Drag components or click to add to the assembly line below.",
    restartButton: "Restart Assembly",
    claimRewardButton: "Finalize Bridge Report",
    toastRewardTitle: "Bridge Report Filed!",
    toastRewardDescription: (points: number) => `You earned ${points} points for successfully repairing the data bridge!`,
    // Component Names
    compInit: "Initialize Data Stream",
    compFetchUser: "Fetch User Profile",
    compAuthUser: "Authenticate User",
    compLoadSettings: "Load User Settings",
    compLoadDash: "Load Dashboard Data",
    compDisplayAds: "Display Advertisements",
    compRenderUi: "Render User Interface",
    compLogError: "Log Background Error",
    compCompleteSession: "Finalize Session",
    compSendEmail: "Send Welcome Email",
  },
  id: {
    questTitle: "Jembatan Rusak: Perakitan Algoritma",
    questDescription: "Perbaiki jembatan data vital dengan merakit komponen algoritma dengan benar. Satu bagian salah dapat merusak seluruh jaringan!",
    zoneName: "Dunia Matematika",
    backToZone: "Kembali ke Dunia Matematika",
    gameAreaTitle: "Konsol Perakitan Algoritma",
    componentToolboxTitle: "Kotak Alat Komponen",
    assemblyLineTitle: "Baris Perakitan Saat Ini (Klik untuk menghapus)",
    assembleButton: "Rakit Algoritma",
    assemblingButton: "Merakit...",
    clearAssemblyButton: "Kosongkan Perakitan",
    feedbackSuccess: "Jembatan Diperbaiki! Aliran data dipulihkan. Kerja bagus, Insinyur!",
    feedbackFailure: (correctCount: number, totalCorrect: number) => `Perakitan Salah. ${correctCount}/${totalCorrect} komponen dalam urutan yang benar. Jembatan data masih tidak stabil. Coba lagi!`,
    feedbackEmpty: "Baris perakitan kosong. Tambahkan komponen dari kotak alat.",
    statusTitle: "Status Perakitan",
    initialStatus: "Seret komponen atau klik untuk menambahkan ke baris perakitan di bawah.",
    restartButton: "Ulangi Perakitan",
    claimRewardButton: "Finalisasi Laporan Jembatan",
    toastRewardTitle: "Laporan Jembatan Diajukan!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena berhasil memperbaiki jembatan data!`,
    // Component Names
    compInit: "Inisialisasi Aliran Data",
    compFetchUser: "Ambil Profil Pengguna",
    compAuthUser: "Autentikasi Pengguna",
    compLoadSettings: "Muat Pengaturan Pengguna",
    compLoadDash: "Muat Data Dasbor",
    compDisplayAds: "Tampilkan Iklan",
    compRenderUi: "Render Antarmuka Pengguna",
    compLogError: "Catat Kesalahan Latar Belakang",
    compCompleteSession: "Finalisasi Sesi",
    compSendEmail: "Kirim Email Selamat Datang",
  }
};

export default function BrokenBridgeQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [assembledSequence, setAssembledSequence] = useState<AlgorithmComponent[]>([]);
  const [isAssembling, setIsAssembling] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [questOutcome, setQuestOutcome] = useState<'pending' | 'success' | 'failure'>('pending');

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
        } catch (e) { console.error("Error reading lang for BrokenBridgeQuestPage", e); }
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
  
  useEffect(() => {
    setFeedbackMessage(t.initialStatus);
  }, [t.initialStatus]);

  const translatedComponents = ALL_COMPONENTS.map(comp => ({
    ...comp,
    name: t[comp.nameKey as keyof typeof t] || comp.nameKey,
  }));

  const handleAddComponent = (component: AlgorithmComponent) => {
    if (questOutcome === 'success') return; // Don't allow changes after success
    setAssembledSequence(prev => [...prev, component]);
    setFeedbackMessage(t.initialStatus); // Reset feedback on new component add
    setQuestOutcome('pending');
  };

  const handleRemoveComponent = (indexToRemove: number) => {
    if (questOutcome === 'success') return;
    setAssembledSequence(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAssembly = () => {
    setAssembledSequence([]);
    setFeedbackMessage(t.initialStatus);
    setQuestOutcome('pending');
  };

  const handleAssemble = () => {
    if (assembledSequence.length === 0) {
      setFeedbackMessage(t.feedbackEmpty);
      setQuestOutcome('failure');
      return;
    }

    setIsAssembling(true);
    setFeedbackMessage('');

    setTimeout(() => {
      const assembledIds = assembledSequence.map(c => c.id);
      let correctCount = 0;
      for (let i = 0; i < CORRECT_SEQUENCE_IDS.length; i++) {
        if (i < assembledIds.length && assembledIds[i] === CORRECT_SEQUENCE_IDS[i]) {
          correctCount++;
        } else {
          // If even one is wrong in sequence, or sequence is too short
          if (assembledIds.length !== CORRECT_SEQUENCE_IDS.length || assembledIds[i] !== CORRECT_SEQUENCE_IDS[i]) {
             // Stop counting further correct items if order is broken or length mismatch
            if (assembledIds.length === CORRECT_SEQUENCE_IDS.length && correctCount === CORRECT_SEQUENCE_IDS.length){
                 // This case should not be hit if logic is correct, but as a safeguard
            } else {
                // If sequence is not perfect, break from counting more correct items unless it's a prefix match
                if (assembledIds[i] !== CORRECT_SEQUENCE_IDS[i] && i < assembledIds.length) break;
            }
          }
        }
      }
      
      if (correctCount === CORRECT_SEQUENCE_IDS.length && assembledIds.length === CORRECT_SEQUENCE_IDS.length) {
        setFeedbackMessage(t.feedbackSuccess);
        setQuestOutcome('success');
      } else {
        // Provide more specific feedback about how many were correct IN ORDER from the start
        let prefixCorrectCount = 0;
        for(let i=0; i < Math.min(assembledIds.length, CORRECT_SEQUENCE_IDS.length); i++){
            if(assembledIds[i] === CORRECT_SEQUENCE_IDS[i]){
                prefixCorrectCount++;
            } else {
                break;
            }
        }
        setFeedbackMessage(t.feedbackFailure(prefixCorrectCount, CORRECT_SEQUENCE_IDS.length));
        setQuestOutcome('failure');
      }
      setIsAssembling(false);
    }, 1500);
  };
  
  const handleRestart = () => {
    handleClearAssembly();
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
    // Potentially navigate away or lock the game
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

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t.componentToolboxTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {translatedComponents.map((comp) => (
              <Button
                key={comp.id}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleAddComponent(comp)}
                disabled={isAssembling || questOutcome === 'success'}
              >
                {comp.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-6 w-6 text-primary" />
              {t.gameAreaTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-semibold">{t.assemblyLineTitle}</Label>
              <div className="mt-2 p-4 min-h-[120px] bg-muted/50 rounded-md border border-dashed flex flex-wrap gap-2 items-start">
                {assembledSequence.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No components added yet.</p>
                ) : (
                  assembledSequence.map((comp, index) => (
                    <Badge
                      key={`${comp.id}-${index}`}
                      variant="secondary"
                      className="text-sm p-2 cursor-pointer hover:bg-destructive/20 hover:border-destructive"
                      onClick={() => handleRemoveComponent(index)}
                      title={`Remove ${t[comp.nameKey as keyof typeof t] || comp.nameKey}`}
                    >
                      {t[comp.nameKey as keyof typeof t] || comp.nameKey}
                      <XCircle className="ml-2 h-3 w-3 opacity-70" />
                    </Badge>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
               <Button 
                onClick={handleClearAssembly} 
                variant="outline" 
                className="flex-1"
                disabled={isAssembling || assembledSequence.length === 0 || questOutcome === 'success'}
               >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearAssemblyButton}
              </Button>
              <Button 
                onClick={handleAssemble} 
                disabled={isAssembling || assembledSequence.length === 0 || questOutcome === 'success'} 
                className="flex-1"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                {isAssembling ? t.assemblingButton : t.assembleButton}
              </Button>
            </div>

            <div>
              <Label className="text-base font-semibold">{t.statusTitle}</Label>
              <div className={`mt-2 p-4 rounded-md text-center font-medium
                ${questOutcome === 'success' ? 'bg-green-500/10 text-green-700' : ''}
                ${questOutcome === 'failure' ? 'bg-destructive/10 text-destructive' : ''}
                ${questOutcome === 'pending' && feedbackMessage !== t.initialStatus ? 'bg-yellow-500/10 text-yellow-700' : ''}
                ${feedbackMessage === t.initialStatus ? 'bg-secondary/30' : ''}
              `}>
                {feedbackMessage || (isAssembling ? t.assemblingButton : t.initialStatus)}
              </div>
            </div>

          </CardContent>
          {(questOutcome === 'success' || questOutcome === 'failure') && !isAssembling && (
            <CardFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button onClick={handleRestart} variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t.restartButton}
              </Button>
              {questOutcome === 'success' && (
                <Button onClick={handleClaimReward} className="w-full sm:w-auto">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t.claimRewardButton}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

