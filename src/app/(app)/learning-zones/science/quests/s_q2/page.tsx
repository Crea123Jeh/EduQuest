
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, Droplets, Wind, Leaf, PackageSearch, CheckCircle, XCircle, RotateCcw, AlertTriangle, FlaskConical, Recycle, Microscope, Sprout, Bug } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label'; // Added import

const questDetails = {
  id: 's_q2',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'science',
  zoneNameKey: 'zoneName',
  type: 'Collaborative', // Simulated as single player
  difficulty: 'Hard',
  points: 190,
};

interface BiosphereVital {
  id: 'waterQuality' | 'airQuality' | 'plantHealth' | 'biodiversityScore';
  labelKey: string;
  value: number;
  icon: React.ElementType;
  target: number;
}

interface InterventionAction {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  cost: number; // Cycles it costs
  effect: (currentVitals: BiosphereVital[], currentProblems: string[]) => { newVitals: BiosphereVital[], newProblems: string[], logMessageKey: string };
  prerequisite?: (currentVitals: BiosphereVital[], currentProblems: string[]) => boolean;
}

const INITIAL_CYCLES = 6;
const WIN_THRESHOLD = 75;
const CRITICAL_THRESHOLD = 10;

const pageTranslations = {
  en: {
    questTitle: "Eco-Challenge: Operation Biosphere Rescue",
    questDescription: "A miniature ecosystem is collapsing! Identify pollutants, introduce helpful species, and restore balance before it's too late. Each intervention uses one cycle.",
    zoneName: "Science Lab",
    backToZone: "Back to Science Lab",
    biosphereStatusTitle: "Biosphere Vital Signs",
    waterQualityLabel: "Water Quality",
    airQualityLabel: "Air Quality",
    plantHealthLabel: "Plant Health",
    biodiversityScoreLabel: "Biodiversity Score",
    interventionPanelTitle: "Available Interventions",
    cyclesRemaining: (cycles: number) => `${cycles} Cycles Remaining`,
    systemLogTitle: "System Log & Advisor",
    initialLogMessage: "The biosphere is in a critical state. Analyze the situation and choose your interventions wisely.",
    actionButton: "Perform Intervention",
    restartButton: "Restart Simulation",
    claimRewardButton: "Finalize Biosphere Report",
    toastRewardTitle: "Biosphere Report Filed!",
    toastRewardDescription: (points: number, outcome: string) => `You earned ${points} points. Outcome: ${outcome}`,
    toastNoCycles: "No cycles left to perform this action.",
    toastPrerequisiteNotMet: "Prerequisites for this action are not met.",
    // Game Outcomes
    outcomeWin: "Biosphere Stabilized! Excellent ecological management!",
    outcomeLossCycles: "Intervention cycles depleted. The biosphere could not be fully restored in time.",
    outcomeLossCritical: "Catastrophic Collapse! A vital sign dropped too low. The biosphere is lost.",
    // Interventions
    actionAnalyzeWater: "Analyze Water Sample",
    descAnalyzeWater: "Identifies primary water contaminants.",
    effectAnalyzeWaterAcid: "Water analysis reveals high acidity is a major problem.",
    effectAnalyzeWaterChemical: "Water analysis shows significant chemical pollutants.",
    effectAnalyzeWaterClear: "Water analysis shows no specific dominant pollutant, focus on general filtration.",
    actionInstallFilter: "Install Advanced Water Filter",
    descInstallFilter: "Significantly improves general water quality.",
    effectInstallFilter: "Advanced filter installed. Water quality is improving.",
    actionNeutralizeAcidity: "Neutralize Acidity",
    descNeutralizeAcidity: "Adds buffering agents to counteract acidic water. Requires 'Acidic Contaminant' identified.",
    effectNeutralizeAcidity: "Acidity neutralized. Water quality has greatly improved.",
    actionPlantTrees: "Plant Native Trees & Flora",
    descPlantTrees: "Improves air quality and plant health over time.",
    effectPlantTrees: "New flora planted. Air quality and overall plant health are on the rise.",
    actionIntroduceMicrobes: "Introduce Beneficial Microbes",
    descIntroduceMicrobes: "Aids in breaking down organic pollutants and boosts plant nutrient uptake. Requires 'Chemical Contaminant' identified or moderate water quality.",
    effectIntroduceMicrobes: "Microbes introduced. They are starting to break down pollutants and aid plant life.",
    actionRestoreWetlands: "Restore Wetland Area",
    descRestoreWetlands: "Improves water filtration naturally and boosts biodiversity.",
    effectRestoreWetlands: "Wetland area restored, enhancing natural filtration and biodiversity.",
    problemAcidicContaminant: "Problem: Acidic Contaminant",
    problemChemicalContaminant: "Problem: Chemical Contaminant",
    problemLowBiodiversity: "Problem: Low Biodiversity",
    problemPoorAir: "Problem: Poor Air Quality",
    noProblemsIdentified: "No specific problems identified yet beyond general degradation.",
    identifiedProblemsTitle: "Identified Problems:",
  },
  id: {
    questTitle: "Tantangan Eko: Operasi Penyelamatan Biosfer",
    questDescription: "Ekosistem mini runtuh! Identifikasi polutan, perkenalkan spesies yang membantu, dan pulihkan keseimbangan sebelum terlambat. Setiap intervensi menggunakan satu siklus.",
    zoneName: "Laboratorium Sains",
    backToZone: "Kembali ke Lab Sains",
    biosphereStatusTitle: "Tanda Vital Biosfer",
    waterQualityLabel: "Kualitas Air",
    airQualityLabel: "Kualitas Udara",
    plantHealthLabel: "Kesehatan Tanaman",
    biodiversityScoreLabel: "Skor Keanekaragaman Hayati",
    interventionPanelTitle: "Intervensi yang Tersedia",
    cyclesRemaining: (cycles: number) => `${cycles} Siklus Tersisa`,
    systemLogTitle: "Log Sistem & Penasihat",
    initialLogMessage: "Biosfer dalam kondisi kritis. Analisis situasi dan pilih intervensi Anda dengan bijak.",
    actionButton: "Lakukan Intervensi",
    restartButton: "Ulangi Simulasi",
    claimRewardButton: "Finalisasi Laporan Biosfer",
    toastRewardTitle: "Laporan Biosfer Diajukan!",
    toastRewardDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Hasil: ${outcome}`,
    toastNoCycles: "Tidak ada siklus tersisa untuk melakukan tindakan ini.",
    toastPrerequisiteNotMet: "Prasyarat untuk tindakan ini tidak terpenuhi.",
    outcomeWin: "Biosfer Stabil! Manajemen ekologi yang sangat baik!",
    outcomeLossCycles: "Siklus intervensi habis. Biosfer tidak dapat dipulihkan sepenuhnya tepat waktu.",
    outcomeLossCritical: "Runtuh Total! Tanda vital turun terlalu rendah. Biosfer hilang.",
    actionAnalyzeWater: "Analisis Sampel Air",
    descAnalyzeWater: "Mengidentifikasi kontaminan air utama.",
    effectAnalyzeWaterAcid: "Analisis air menunjukkan keasaman tinggi adalah masalah utama.",
    effectAnalyzeWaterChemical: "Analisis air menunjukkan polutan kimia yang signifikan.",
    effectAnalyzeWaterClear: "Analisis air tidak menunjukkan polutan dominan tertentu, fokus pada filtrasi umum.",
    actionInstallFilter: "Pasang Filter Air Canggih",
    descInstallFilter: "Meningkatkan kualitas air umum secara signifikan.",
    effectInstallFilter: "Filter canggih dipasang. Kualitas air membaik.",
    actionNeutralizeAcidity: "Netralkan Keasaman",
    descNeutralizeAcidity: "Menambahkan agen penyangga untuk mengatasi air asam. Membutuhkan identifikasi 'Kontaminan Asam'.",
    effectNeutralizeAcidity: "Keasaman dinetralkan. Kualitas air telah sangat meningkat.",
    actionPlantTrees: "Tanam Pohon & Flora Asli",
    descPlantTrees: "Meningkatkan kualitas udara dan kesehatan tanaman seiring waktu.",
    effectPlantTrees: "Flora baru ditanam. Kualitas udara dan kesehatan tanaman secara keseluruhan meningkat.",
    actionIntroduceMicrobes: "Perkenalkan Mikroba Bermanfaat",
    descIntroduceMicrobes: "Membantu memecah polutan organik dan meningkatkan penyerapan nutrisi tanaman. Membutuhkan identifikasi 'Kontaminan Kimia' atau kualitas air sedang.",
    effectIntroduceMicrobes: "Mikroba diperkenalkan. Mereka mulai memecah polutan dan membantu kehidupan tanaman.",
    actionRestoreWetlands: "Pulihkan Area Lahan Basah",
    descRestoreWetlands: "Meningkatkan penyaringan air secara alami dan meningkatkan keanekaragaman hayati.",
    effectRestoreWetlands: "Area lahan basah dipulihkan, meningkatkan filtrasi alami dan keanekaragaman hayati.",
    problemAcidicContaminant: "Masalah: Kontaminan Asam",
    problemChemicalContaminant: "Masalah: Kontaminan Kimia",
    problemLowBiodiversity: "Masalah: Keanekaragaman Hayati Rendah",
    problemPoorAir: "Masalah: Kualitas Udara Buruk",
    noProblemsIdentified: "Belum ada masalah spesifik yang teridentifikasi selain degradasi umum.",
    identifiedProblemsTitle: "Masalah Teridentifikasi:",
  }
};

const initialVitals: BiosphereVital[] = [
  { id: 'waterQuality', labelKey: 'waterQualityLabel', value: 30, icon: Droplets, target: WIN_THRESHOLD },
  { id: 'airQuality', labelKey: 'airQualityLabel', value: 40, icon: Wind, target: WIN_THRESHOLD },
  { id: 'plantHealth', labelKey: 'plantHealthLabel', value: 25, icon: Leaf, target: WIN_THRESHOLD },
  { id: 'biodiversityScore', labelKey: 'biodiversityScoreLabel', value: 20, icon: Bug, target: WIN_THRESHOLD },
];

const INTERVENTION_ACTIONS_CONFIG = (t: typeof pageTranslations.en): InterventionAction[] => [
  {
    id: 'analyzeWater', labelKey: 'actionAnalyzeWater', descriptionKey: 'descAnalyzeWater', icon: Microscope, cost: 1,
    effect: (vitals, problems) => {
      const rand = Math.random();
      let newProblems = [...problems.filter(p => p !== 'Unknown Contaminant')];
      let logMessageKey: string;
      if (rand < 0.45 && !newProblems.includes('Acidic Contaminant')) {
        newProblems.push('Acidic Contaminant');
        logMessageKey = 'effectAnalyzeWaterAcid';
      } else if (rand < 0.9 && !newProblems.includes('Chemical Contaminant')) {
        newProblems.push('Chemical Contaminant');
        logMessageKey = 'effectAnalyzeWaterChemical';
      } else {
        logMessageKey = 'effectAnalyzeWaterClear';
      }
      return { newVitals: [...vitals], newProblems, logMessageKey };
    },
    prerequisite: (vitals, problems) => problems.includes('Unknown Contaminant'),
  },
  {
    id: 'installFilter', labelKey: 'actionInstallFilter', descriptionKey: 'descInstallFilter', icon: Recycle, cost: 1,
    effect: (vitals, problems) => ({
      newVitals: vitals.map(v => v.id === 'waterQuality' ? { ...v, value: Math.min(100, v.value + 25) } : v),
      newProblems: [...problems], logMessageKey: 'effectInstallFilter'
    }),
  },
  {
    id: 'neutralizeAcidity', labelKey: 'actionNeutralizeAcidity', descriptionKey: 'descNeutralizeAcidity', icon: FlaskConical, cost: 1,
    effect: (vitals, problems) => ({
      newVitals: vitals.map(v => v.id === 'waterQuality' ? { ...v, value: Math.min(100, v.value + 40) } : v),
      newProblems: problems.filter(p => p !== 'Acidic Contaminant'), logMessageKey: 'effectNeutralizeAcidity'
    }),
    prerequisite: (vitals, problems) => problems.includes('Acidic Contaminant'),
  },
  {
    id: 'plantTrees', labelKey: 'actionPlantTrees', descriptionKey: 'descPlantTrees', icon: Sprout, cost: 1,
    effect: (vitals, problems) => ({
      newVitals: vitals.map(v => {
        if (v.id === 'airQuality') return { ...v, value: Math.min(100, v.value + 20) };
        if (v.id === 'plantHealth') return { ...v, value: Math.min(100, v.value + 15) };
        return v;
      }),
      newProblems: [...problems], logMessageKey: 'effectPlantTrees'
    }),
  },
  {
    id: 'introduceMicrobes', labelKey: 'actionIntroduceMicrobes', descriptionKey: 'descIntroduceMicrobes', icon: PackageSearch, cost: 1,
    effect: (vitals, problems) => ({
        newVitals: vitals.map(v => {
            if (v.id === 'waterQuality') return { ...v, value: Math.min(100, v.value + (problems.includes('Chemical Contaminant') ? 20: 10)) };
            if (v.id === 'plantHealth') return { ...v, value: Math.min(100, v.value + 10) };
            if (v.id === 'biodiversityScore') return { ...v, value: Math.min(100, v.value + 5) };
            return v;
        }),
        newProblems: problems.filter(p => p !== 'Chemical Contaminant'), logMessageKey: 'effectIntroduceMicrobes'
    }),
    prerequisite: (vitals, problems) => problems.includes('Chemical Contaminant') || (vitals.find(v => v.id === 'waterQuality')?.value ?? 0) > 40,
  },
  {
    id: 'restoreWetlands', labelKey: 'actionRestoreWetlands', descriptionKey: 'descRestoreWetlands', icon: Droplets, cost: 1,
    effect: (vitals, problems) => ({
        newVitals: vitals.map(v => {
            if (v.id === 'waterQuality') return { ...v, value: Math.min(100, v.value + 15)};
            if (v.id === 'airQuality') return { ...v, value: Math.min(100, v.value + 10)};
            if (v.id === 'biodiversityScore') return { ...v, value: Math.min(100, v.value + 15)};
            return v;
        }),
        newProblems: [...problems], logMessageKey: 'effectRestoreWetlands'
    })
  }
];


export default function EcoChallengeQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [biosphereVitals, setBiosphereVitals] = useState<BiosphereVital[]>(initialVitals);
  const [interventionCycles, setInterventionCycles] = useState(INITIAL_CYCLES);
  const [systemLog, setSystemLog] = useState<string>('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [identifiedProblems, setIdentifiedProblems] = useState<string[]>(['Unknown Contaminant']);

  const t = pageTranslations[lang];
  const INTERVENTIONS = INTERVENTION_ACTIONS_CONFIG(t);
  
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };

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
        } catch (e) { console.error("Error reading lang for EcoChallengePage", e); }
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

  useEffect(() => {
    setSystemLog(t.initialLogMessage);
  }, [t.initialLogMessage]);
  
  const checkGameStatus = useCallback(() => {
    if (gameState !== 'playing') return;

    const allWon = biosphereVitals.every(v => v.value >= v.target);
    if (allWon) {
      setGameState('won');
      setSystemLog(t.outcomeWin);
      return;
    }

    const anyCritical = biosphereVitals.some(v => v.value <= CRITICAL_THRESHOLD);
    if (anyCritical) {
      setGameState('lost');
      setSystemLog(t.outcomeLossCritical);
      return;
    }

    if (interventionCycles <= 0) {
      setGameState('lost');
      setSystemLog(t.outcomeLossCycles);
    }
  }, [biosphereVitals, interventionCycles, gameState, t]);

  useEffect(() => {
    checkGameStatus();
  }, [checkGameStatus]);


  const handleIntervention = (action: InterventionAction) => {
    if (gameState !== 'playing' || interventionCycles < action.cost) {
      toast({ title: t.toastNoCycles, variant: 'destructive' });
      return;
    }
    if (action.prerequisite && !action.prerequisite(biosphereVitals, identifiedProblems)) {
        toast({ title: t.toastPrerequisiteNotMet, description: `Check if ${t[action.labelKey as keyof typeof t] || action.labelKey} dependencies are met.`, variant: 'destructive'});
        return;
    }

    const { newVitals, newProblems, logMessageKey } = action.effect([...biosphereVitals], [...identifiedProblems]);
    
    setBiosphereVitals(newVitals.map(v => ({...v, value: Math.max(0, Math.min(100, v.value))}))); // Ensure values are capped
    setIdentifiedProblems(newProblems);
    setInterventionCycles(prev => prev - action.cost);
    setSystemLog(t[logMessageKey as keyof typeof t] || "Intervention applied.");
  };

  const restartGame = () => {
    setBiosphereVitals(initialVitals.map(v => ({...v}))); // Reset with new objects
    setInterventionCycles(INITIAL_CYCLES);
    setSystemLog(t.initialLogMessage);
    setIdentifiedProblems(['Unknown Contaminant']);
    setGameState('playing');
  };

  const handleClaimReward = () => {
    let outcomeMessage = "Simulation Attempted";
    if (gameState === 'won') outcomeMessage = t.outcomeWin;
    else if (gameState === 'lost' && systemLog === t.outcomeLossCycles) outcomeMessage = t.outcomeLossCycles;
    else if (gameState === 'lost' && systemLog === t.outcomeLossCritical) outcomeMessage = t.outcomeLossCritical;
    
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, outcomeMessage),
    });
  };
  
  const getProblemDisplayName = (problemId: string) => {
    const key = problemId.startsWith('Problem: ') ? `problem${problemId.substring('Problem: '.length).replace(/\s/g, '')}` : problemId;
    return t[key as keyof typeof t] || problemId;
  }

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
            <CardTitle className="text-xl">{t.biosphereStatusTitle}</CardTitle>
            <CardDescription>{t.cyclesRemaining(interventionCycles)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {biosphereVitals.map(vital => (
              <div key={vital.id}>
                <Label className="text-sm font-medium flex items-center">
                  <vital.icon className={`mr-2 h-5 w-5 ${vital.value < CRITICAL_THRESHOLD * 2 ? 'text-destructive' : vital.value < vital.target * 0.7 ? 'text-yellow-500' : 'text-green-500' }`} />
                  {t[vital.labelKey as keyof typeof t] || vital.labelKey}: {vital.value} / {vital.target}
                </Label>
                <Progress value={vital.value} max={vital.target > 0 ? vital.target : 100} className="h-3 mt-1" 
                   indicatorClassName={vital.value < CRITICAL_THRESHOLD * 2 ? 'bg-destructive' : vital.value < vital.target * 0.7 ? 'bg-yellow-500' : 'bg-green-500'}
                />
              </div>
            ))}
             <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">{t.identifiedProblemsTitle}</h4>
                {identifiedProblems.length === 0 || (identifiedProblems.length === 1 && identifiedProblems[0] === 'Unknown Contaminant' && !INTERVENTIONS.find(act => act.id === 'analyzeWater')?.prerequisite?.(biosphereVitals, identifiedProblems)) ? (
                    <p className="text-xs text-muted-foreground">{t.noProblemsIdentified}</p>
                ) : (
                    <div className="flex flex-wrap gap-1">
                        {identifiedProblems.map(problem => (
                           problem !== 'Unknown Contaminant' && <Badge key={problem} variant="destructive" className="text-xs">{getProblemDisplayName(problem)}</Badge>
                        ))}
                         {identifiedProblems.includes('Unknown Contaminant') && INTERVENTIONS.find(act => act.id === 'analyzeWater')?.prerequisite?.(biosphereVitals, identifiedProblems) && (
                           <Badge variant="outline" className="text-xs border-dashed">Unknown Contaminant</Badge>
                        )}
                    </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sprout className="h-6 w-6 text-primary" />
              {t.interventionPanelTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {INTERVENTIONS.map(action => {
              const isDisabledByPrereq = action.prerequisite && !action.prerequisite(biosphereVitals, identifiedProblems);
              const isDisabled = gameState !== 'playing' || interventionCycles < action.cost || isDisabledByPrereq;
              
              let tooltipContent = t[action.descriptionKey as keyof typeof t] || action.descriptionKey;
              if (isDisabledByPrereq) {
                tooltipContent += ` (Requires: ${action.id === 'neutralizeAcidity' ? getProblemDisplayName('problemAcidicContaminant') : action.id === 'introduceMicrobes' && !problems.includes('Chemical Contaminant') ? 'Moderate Water Quality' : action.id === 'introduceMicrobes' ? getProblemDisplayName('problemChemicalContaminant') : 'specific conditions'})`;
              }

              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleIntervention(action)}
                  disabled={isDisabled}
                  title={tooltipContent}
                >
                  <action.icon className="mr-3 h-5 w-5 shrink-0 text-accent" />
                  <div className="flex-grow">
                    <span className="font-semibold">{t[action.labelKey as keyof typeof t] || action.labelKey}</span>
                    <p className="text-xs text-muted-foreground">{tooltipContent}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto shrink-0">{action.cost} Cycle{action.cost > 1 ? 's': ''}</Badge>
                </Button>
              );
            })}
          </CardContent>
          <CardFooter>
             <div className="w-full p-3 bg-muted/50 rounded-md border">
                <h4 className="font-semibold text-sm mb-1">{t.systemLogTitle}</h4>
                <p className={`text-sm ${gameState === 'won' ? 'text-green-600' : gameState==='lost' ? 'text-destructive' : 'text-muted-foreground'}`}>{systemLog}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {(gameState === 'won' || gameState === 'lost') && (
        <Card className="mt-8 max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className={`font-headline text-2xl ${gameState === 'won' ? 'text-green-600' : 'text-destructive'}`}>
              {gameState === 'won' ? <CheckCircle className="inline mr-2 h-7 w-7"/> : <AlertTriangle className="inline mr-2 h-7 w-7"/>}
              {gameState === 'won' ? t.outcomeWin : (systemLog === t.outcomeLossCritical ? t.outcomeLossCritical : t.outcomeLossCycles) }
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={restartGame} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t.restartButton}
              </Button>
              <Button onClick={handleClaimReward} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t.claimRewardButton}
              </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    
