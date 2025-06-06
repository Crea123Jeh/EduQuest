
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, Puzzle, ArrowRightLeft, CheckCircle, XCircle, RotateCcw, Trash2, Coins, CircleDollarSign, Target } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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
  cost: number;
}

const MAX_BUDGET = 75;

const ALL_COMPONENTS: AlgorithmComponent[] = [
  { id: 'INPUT_VALUE', nameKey: 'compInputValue', cost: 5 },
  { id: 'VALIDATE_TYPE_NUMBER', nameKey: 'compValidateTypeNumber', cost: 10 },
  { id: 'VALIDATE_TYPE_STRING', nameKey: 'compValidateTypeString', cost: 8 }, // Distractor, cheaper but wrong type
  { id: 'CHECK_RANGE_POSITIVE', nameKey: 'compCheckRangePositive', cost: 15 },
  { id: 'CHECK_RANGE_NEGATIVE', nameKey: 'compCheckRangeNegative', cost: 12 }, // Distractor
  { id: 'PERFORM_SQUARE_OPERATION', nameKey: 'compPerformSquare', cost: 20 },
  { id: 'PERFORM_ADD_TEN_OPERATION', nameKey: 'compPerformAddTen', cost: 10 }, // Distractor
  { id: 'FORMAT_OUTPUT_SCIENTIFIC', nameKey: 'compFormatScientific', cost: 10 },
  { id: 'FORMAT_OUTPUT_FIXED_DECIMAL', nameKey: 'compFormatFixed', cost: 7 }, // Distractor
  { id: 'SEND_TO_LOG', nameKey: 'compSendToLog', cost: 5 },
  { id: 'DISPLAY_RESULT', nameKey: 'compDisplayResult', cost: 5 },
  { id: 'TERMINATE_PROCESS', nameKey: 'compTerminateProcess', cost: 2 },
];

const CORRECT_SEQUENCE_IDS: string[] = [
    'INPUT_VALUE', 
    'VALIDATE_TYPE_NUMBER', 
    'CHECK_RANGE_POSITIVE', 
    'PERFORM_SQUARE_OPERATION', 
    'FORMAT_OUTPUT_SCIENTIFIC', 
    'DISPLAY_RESULT', 
    'SEND_TO_LOG', 
    'TERMINATE_PROCESS'
];

const pageTranslations = {
  en: {
    questTitle: "Algorithm Assembly Challenge: Precision Protocol",
    questDescription: "Construct a precise data validation and calculation protocol. Each component has a computational cost. Assemble the correct sequence within the given budget to succeed!",
    zoneName: "Mathematics Realm",
    backToZone: "Back to Mathematics Realm",
    gameAreaTitle: "Protocol Assembly Console",
    componentToolboxTitle: "Component Toolbox (Name - Cost)",
    assemblyLineTitle: "Current Protocol Assembly (Click to remove)",
    assembleButton: "Execute Protocol",
    assemblingButton: "Executing...",
    clearAssemblyButton: "Clear Assembly",
    feedbackSuccess: "Protocol Executed Successfully! Data processed accurately and within budget.",
    feedbackFailureOrder: (correctCount: number, totalCorrect: number) => `Sequence Incorrect. ${correctCount}/${totalCorrect} components in the right order. Protocol unstable. Try again!`,
    feedbackFailureBudget: (cost: number, budget: number) => `Budget Exceeded! Protocol cost (${cost}) is over budget (${budget}). Optimize your components.`,
    feedbackFailureOrderAndBudget: (correctCount: number, totalCorrect: number, cost: number, budget: number) => `Sequence Incorrect (${correctCount}/${totalCorrect} correct) AND Budget Exceeded (Cost: ${cost} > Budget: ${budget}). Critical failure!`,
    feedbackEmpty: "Assembly line is empty. Add components from the toolbox.",
    statusTitle: "Assembly Status",
    initialStatus: "Drag components or click to add to the assembly line. Mind the budget!",
    restartButton: "Restart Assembly",
    claimRewardButton: "Finalize Protocol Report",
    toastRewardTitle: "Protocol Report Filed!",
    toastRewardDescription: (points: number) => `You earned ${points} points for successfully designing the protocol!`,
    costLabel: "Cost",
    totalCostLabel: "Total Cost:",
    budgetLabel: "Budget:",
    remainingBudgetLabel: "Remaining:",
    // Component Names
    compInputValue: "Receive Input Data",
    compValidateTypeNumber: "Check: Is Numeric?",
    compValidateTypeString: "Check: Is Text?",
    compCheckRangePositive: "Check: Is Positive Number?",
    compCheckRangeNegative: "Check: Is Negative Number?",
    compPerformSquare: "Calculate: Square of Input",
    compPerformAddTen: "Calculate: Add 10 to Input",
    compFormatScientific: "Format Output: Scientific Notation",
    compFormatFixed: "Format Output: Fixed Decimal",
    compSendToLog: "Log: Send to System Log",
    compDisplayResult: "Output: Display Result",
    compTerminateProcess: "End: Terminate Process",
  },
  id: {
    questTitle: "Tantangan Perakitan Algoritma: Protokol Presisi",
    questDescription: "Susun protokol validasi dan kalkulasi data yang presisi. Setiap komponen memiliki biaya komputasi. Susun urutan yang benar sesuai anggaran yang diberikan untuk berhasil!",
    zoneName: "Dunia Matematika",
    backToZone: "Kembali ke Dunia Matematika",
    gameAreaTitle: "Konsol Perakitan Protokol",
    componentToolboxTitle: "Kotak Alat Komponen (Nama - Biaya)",
    assemblyLineTitle: "Susunan Protokol Saat Ini (Klik untuk menghapus)",
    assembleButton: "Jalankan Protokol",
    assemblingButton: "Menjalankan...",
    clearAssemblyButton: "Kosongkan Susunan",
    feedbackSuccess: "Protokol Berhasil Dijalankan! Data diproses secara akurat dan sesuai anggaran.",
    feedbackFailureOrder: (correctCount: number, totalCorrect: number) => `Urutan Salah. ${correctCount}/${totalCorrect} komponen dalam urutan yang benar. Protokol tidak stabil. Coba lagi!`,
    feedbackFailureBudget: (cost: number, budget: number) => `Anggaran Terlampaui! Biaya protokol (${cost}) melebihi anggaran (${budget}). Optimalkan komponen Anda.`,
    feedbackFailureOrderAndBudget: (correctCount: number, totalCorrect: number, cost: number, budget: number) => `Urutan Salah (${correctCount}/${totalCorrect} benar) DAN Anggaran Terlampaui (Biaya: ${cost} > Anggaran: ${budget}). Kegagalan kritis!`,
    feedbackEmpty: "Baris perakitan kosong. Tambahkan komponen dari kotak alat.",
    statusTitle: "Status Perakitan",
    initialStatus: "Seret komponen atau klik untuk menambahkan ke baris perakitan. Perhatikan anggaran!",
    restartButton: "Ulangi Perakitan",
    claimRewardButton: "Finalisasi Laporan Protokol",
    toastRewardTitle: "Laporan Protokol Diajukan!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena berhasil merancang protokol!`,
    costLabel: "Biaya",
    totalCostLabel: "Total Biaya:",
    budgetLabel: "Anggaran:",
    remainingBudgetLabel: "Sisa:",
    // Component Names
    compInputValue: "Terima Data Input",
    compValidateTypeNumber: "Periksa: Apakah Numerik?",
    compValidateTypeString: "Periksa: Apakah Teks?",
    compCheckRangePositive: "Periksa: Apakah Bilangan Positif?",
    compCheckRangeNegative: "Periksa: Apakah Bilangan Negatif?",
    compPerformSquare: "Hitung: Kuadrat dari Input",
    compPerformAddTen: "Hitung: Tambah 10 ke Input",
    compFormatScientific: "Format Output: Notasi Ilmiah",
    compFormatFixed: "Format Output: Desimal Tetap",
    compSendToLog: "Log: Kirim ke Log Sistem",
    compDisplayResult: "Output: Tampilkan Hasil",
    compTerminateProcess: "Selesai: Hentikan Proses",
  }
};

export default function BrokenBridgeQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [assembledSequence, setAssembledSequence] = useState<AlgorithmComponent[]>([]);
  const [isAssembling, setIsAssembling] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [questOutcome, setQuestOutcome] = useState<'pending' | 'success' | 'failure'>('pending');
  
  const currentCost = useMemo(() => {
    return assembledSequence.reduce((sum, comp) => sum + comp.cost, 0);
  }, [assembledSequence]);

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
    if (questOutcome === 'success') return; 
    setAssembledSequence(prev => [...prev, component]);
    setFeedbackMessage(t.initialStatus); 
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
      let correctInOrderCount = 0;
      for (let i = 0; i < Math.min(assembledIds.length, CORRECT_SEQUENCE_IDS.length); i++) {
        if (assembledIds[i] === CORRECT_SEQUENCE_IDS[i]) {
          correctInOrderCount++;
        } else {
          break; 
        }
      }
      
      const isSequenceCorrect = correctInOrderCount === CORRECT_SEQUENCE_IDS.length && assembledIds.length === CORRECT_SEQUENCE_IDS.length;
      const isWithinBudget = currentCost <= MAX_BUDGET;

      if (isSequenceCorrect && isWithinBudget) {
        setFeedbackMessage(t.feedbackSuccess);
        setQuestOutcome('success');
      } else {
        if (!isSequenceCorrect && !isWithinBudget) {
            setFeedbackMessage(t.feedbackFailureOrderAndBudget(correctInOrderCount, CORRECT_SEQUENCE_IDS.length, currentCost, MAX_BUDGET));
        } else if (!isSequenceCorrect) {
            setFeedbackMessage(t.feedbackFailureOrder(correctInOrderCount, CORRECT_SEQUENCE_IDS.length));
        } else { // !isWithinBudget
            setFeedbackMessage(t.feedbackFailureBudget(currentCost, MAX_BUDGET));
        }
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
  };
  
  const remainingBudget = MAX_BUDGET - currentCost;
  const budgetProgress = (remainingBudget / MAX_BUDGET) * 100;

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
          <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
            {translatedComponents.map((comp) => (
              <Button
                key={comp.id}
                variant="outline"
                className="w-full justify-between text-left h-auto py-2"
                onClick={() => handleAddComponent(comp)}
                disabled={isAssembling || questOutcome === 'success'}
              >
                <span>{comp.name}</span>
                <Badge variant="secondary">{comp.cost} {t.costLabel}</Badge>
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
            <Card className="p-4 bg-muted/30">
                <div className="flex justify-between items-center mb-1">
                    <Label className="text-sm font-medium text-muted-foreground">{t.budgetLabel} <span className="text-primary font-bold">{MAX_BUDGET}</span></Label>
                    <Label className="text-sm font-medium text-muted-foreground">{t.totalCostLabel} <span className={`font-bold ${currentCost > MAX_BUDGET ? 'text-destructive' : 'text-primary'}`}>{currentCost}</span></Label>
                </div>
                <Progress value={currentCost <= MAX_BUDGET ? budgetProgress : 0} 
                    indicatorClassName={currentCost > MAX_BUDGET ? "bg-destructive" : "bg-primary"}
                    className="h-2"/>
                {currentCost > MAX_BUDGET && <p className="text-xs text-destructive text-right mt-1">{t.feedbackFailureBudget(currentCost, MAX_BUDGET)}</p>}
            </Card>

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
                      {t[comp.nameKey as keyof typeof t] || comp.nameKey} ({comp.cost} {t.costLabel})
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
                disabled={isAssembling || assembledSequence.length === 0 || questOutcome === 'success' || currentCost > MAX_BUDGET} 
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

