
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Cpu, CheckCircle, Wand2, AlertTriangle, Zap, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const questDetails = {
  id: 'm_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'math',
  zoneNameKey: 'zoneName',
  points: 200,
};

const INITIAL_ENERGY_BUDGET = 100;
const MIN_ITERATIONS = 1;
const MAX_ITERATIONS = 5;
const ATTACK_STRENGTH_THRESHOLD = 750; // Example attack strength the player needs to beat

const fractalTypes = [
  { id: 'sierpinski', nameKey: 'sierpinskiName', baseShieldFactor: 15, baseCostFactor: 8 },
  { id: 'mandelbrot', nameKey: 'mandelbrotName', baseShieldFactor: 12, baseCostFactor: 10 }, // Mandelbrot might be "denser" but more costly
  { id: 'koch', nameKey: 'kochName', baseShieldFactor: 18, baseCostFactor: 6 }, // Koch might be more "efficient"
];

const pageTranslations = {
  en: {
    questTitle: "Fractal Fortress Defense",
    questDescription: "Configure and deploy a fractal shield to protect the Citadel from incoming data corruption. Balance shield strength with energy cost based on fractal type and iteration complexity.",
    zoneName: "Mathematics Realm",
    backToZone: "Back to Mathematics Realm",
    designConsoleTitle: "Fractal Configuration Console",
    selectFractalLabel: "1. Select Fractal Type:",
    sierpinskiName: "Sierpinski Triangle Shield",
    mandelbrotName: "Mandelbrot Set Fragment",
    kochName: "Koch Snowflake Barrier",
    iterationLevelLabel: "2. Set Iteration Level:",
    iterationLevelValue: (level: number) => `Level ${level}`,
    energyBudgetLabel: "Energy Budget:",
    currentCostLabel: "Deployment Cost:",
    shieldStrengthLabel: "Projected Shield Strength:",
    unitEnergy: "Energy Units",
    unitStrength: "Strength Units",
    costTooHigh: "Cost exceeds budget!",
    citadelGridTitle: "Citadel Defense Grid",
    citadelGridAlt: "Visualization of the Citadel under attack by data streams",
    deployButton: "Deploy Fractal Shield",
    deployingButton: "Deploying...",
    statusTitle: "System Status",
    statusInitial: "Awaiting fractal deployment orders. Configure your shield above.",
    statusNoSelection: "Please select a fractal type and iteration level before deploying.",
    statusCostExceeded: (cost: number, budget: number) => `Deployment cost (${cost} EU) exceeds budget (${budget} EU). Adjust parameters.`,
    deploymentOutcomeTitle: "Deployment Report:",
    outcomeFullDefense: "Full Defense! The Citadel is secure. Excellent work, Commander!",
    outcomePartialDefense: "Partial Defense. The shield held, but the Citadel sustained minor data corruption.",
    outcomeShieldBreached: "Shield Breached! Critical data corruption detected. The Citadel is vulnerable!",
    completeQuestButton: "Finalize Mission Report",
    toastQuestCompletedTitle: "Mission Report Filed!",
    toastQuestCompletedDescription: (points: number) => `You earned ${points} points for your efforts in defending the Citadel!`,
    toastNoFractalTitle: "Configuration Error",
    toastNoFractalDescription: "Missing fractal type or iteration level. Configure your shield.",
    formulaHintCost: "Cost ≈ BaseCost × Iterations²",
    formulaHintStrength: "Strength ≈ BaseStrength × Iterations¹·⁵ × 10",
    lowStrengthWarning: "Warning: Projected strength is critically low!",
    mediumStrengthWarning: "Caution: Shield strength is moderate. Consider increasing iterations if budget allows.",
    highStrengthInfo: "Projected shield strength is high.",
  },
  id: {
    questTitle: "Pertahanan Benteng Fraktal",
    questDescription: "Konfigurasi dan terapkan perisai fraktal untuk melindungi Citadel dari korupsi data yang masuk. Seimbangkan kekuatan perisai dengan biaya energi berdasarkan jenis fraktal dan kompleksitas iterasi.",
    zoneName: "Dunia Matematika",
    backToZone: "Kembali ke Dunia Matematika",
    designConsoleTitle: "Konsol Konfigurasi Fraktal",
    selectFractalLabel: "1. Pilih Jenis Fraktal:",
    sierpinskiName: "Perisai Segitiga Sierpinski",
    mandelbrotName: "Fragmen Set Mandelbrot",
    kochName: "Penghalang Kepingan Salju Koch",
    iterationLevelLabel: "2. Atur Tingkat Iterasi:",
    iterationLevelValue: (level: number) => `Tingkat ${level}`,
    energyBudgetLabel: "Anggaran Energi:",
    currentCostLabel: "Biaya Penerapan:",
    shieldStrengthLabel: "Proyeksi Kekuatan Perisai:",
    unitEnergy: "Unit Energi",
    unitStrength: "Unit Kekuatan",
    costTooHigh: "Biaya melebihi anggaran!",
    citadelGridTitle: "Kisi Pertahanan Citadel",
    citadelGridAlt: "Visualisasi Citadel diserang oleh aliran data",
    deployButton: "Terapkan Perisai Fraktal",
    deployingButton: "Menerapkan...",
    statusTitle: "Status Sistem",
    statusInitial: "Menunggu perintah penerapan fraktal. Konfigurasikan perisai Anda di atas.",
    statusNoSelection: "Silakan pilih jenis fraktal dan tingkat iterasi sebelum menerapkan.",
    statusCostExceeded: (cost: number, budget: number) => `Biaya penerapan (${cost} EU) melebihi anggaran (${budget} EU). Sesuaikan parameter.`,
    deploymentOutcomeTitle: "Laporan Penerapan:",
    outcomeFullDefense: "Pertahanan Penuh! Citadel aman. Kerja bagus, Komandan!",
    outcomePartialDefense: "Pertahanan Sebagian. Perisai bertahan, tetapi Citadel mengalami korupsi data ringan.",
    outcomeShieldBreached: "Perisai Ditembus! Korupsi data kritis terdeteksi. Citadel rentan!",
    completeQuestButton: "Finalisasi Laporan Misi",
    toastQuestCompletedTitle: "Laporan Misi Diajukan!",
    toastQuestCompletedDescription: (points: number) => `Anda mendapatkan ${points} poin atas usaha Anda mempertahankan Citadel!`,
    toastNoFractalTitle: "Kesalahan Konfigurasi",
    toastNoFractalDescription: "Jenis fraktal atau tingkat iterasi tidak ada. Konfigurasikan perisai Anda.",
    formulaHintCost: "Biaya ≈ BiayaDasar × Iterasi²",
    formulaHintStrength: "Kekuatan ≈ KekuatanDasar × Iterasi¹·⁵ × 10",
    lowStrengthWarning: "Peringatan: Proyeksi kekuatan sangat rendah!",
    mediumStrengthWarning: "Perhatian: Kekuatan perisai sedang. Pertimbangkan meningkatkan iterasi jika anggaran memungkinkan.",
    highStrengthInfo: "Proyeksi kekuatan perisai tinggi.",
  }
};

export default function FractalFortressDefensePage() {
  const [selectedFractalId, setSelectedFractalId] = useState<string | null>(null);
  const [iterationLevel, setIterationLevel] = useState<number>(MIN_ITERATIONS);
  const [isDeploying, setIsDeploying] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string>('');
  const [deploymentResult, setDeploymentResult] = useState<{ messageKey: string, details?: string } | null>(null);
  const [currentEnergyCost, setCurrentEnergyCost] = useState(0);
  const [projectedShieldStrength, setProjectedShieldStrength] = useState(0);
  const [questCompleted, setQuestCompleted] = useState(false);
  
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

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
        } catch (e) { console.error("Error reading lang for FractalFortressDefensePage", e); }
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
    setSystemStatus(t.statusInitial);
  }, [t.statusInitial]);

  useEffect(() => {
    if (!selectedFractalId) {
      setCurrentEnergyCost(0);
      setProjectedShieldStrength(0);
      return;
    }
    const fractal = fractalTypes.find(f => f.id === selectedFractalId);
    if (fractal) {
      const cost = Math.round(fractal.baseCostFactor * iterationLevel * iterationLevel);
      const strength = Math.round(fractal.baseShieldFactor * Math.pow(iterationLevel, 1.5) * 10);
      setCurrentEnergyCost(cost);
      setProjectedShieldStrength(strength);
    }
  }, [selectedFractalId, iterationLevel]);

  const handleDeploy = () => {
    if (!selectedFractalId) {
      setSystemStatus(t.statusNoSelection);
      toast({
        title: t.toastNoFractalTitle,
        description: t.toastNoFractalDescription,
        variant: 'destructive',
      });
      return;
    }

    if (currentEnergyCost > INITIAL_ENERGY_BUDGET) {
        setSystemStatus(t.statusCostExceeded(currentEnergyCost, INITIAL_ENERGY_BUDGET));
        toast({
            title: t.toastNoFractalTitle,
            description: t.statusCostExceeded(currentEnergyCost, INITIAL_ENERGY_BUDGET),
            variant: 'destructive',
        });
        return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    // Simulate deployment and attack
    setTimeout(() => {
      let outcomeMessageKey = '';
      if (projectedShieldStrength > ATTACK_STRENGTH_THRESHOLD * 1.1) {
        outcomeMessageKey = 'outcomeFullDefense';
      } else if (projectedShieldStrength > ATTACK_STRENGTH_THRESHOLD * 0.7) {
        outcomeMessageKey = 'outcomePartialDefense';
      } else {
        outcomeMessageKey = 'outcomeShieldBreached';
      }
      
      const fractalName = t[(fractalTypes.find(f=>f.id === selectedFractalId)?.nameKey || '') as keyof typeof t];
      const resultDetails = `${fractalName} (Level ${iterationLevel}), Strength: ${projectedShieldStrength}, Cost: ${currentEnergyCost}`;
      
      setDeploymentResult({ messageKey: outcomeMessageKey, details: resultDetails });
      setSystemStatus(t[outcomeMessageKey as keyof typeof t] || "Deployment complete.");
      setIsDeploying(false);
      setQuestCompleted(true); // Mark quest as "attempted"
    }, 2000);
  };

  const handleCompleteQuest = () => {
    toast({
      title: t.toastQuestCompletedTitle,
      description: t.toastQuestCompletedDescription(questDetails.points),
    });
    // Potentially navigate away or update global quest status
    // For now, just shows a toast.
  };
  
  const currentFractalTypes = fractalTypes.map(ft => ({
    ...ft,
    name: t[ft.nameKey as keyof typeof t] || ft.nameKey,
  }));

  const getStrengthFeedback = () => {
    if (projectedShieldStrength < ATTACK_STRENGTH_THRESHOLD * 0.5) return { text: t.lowStrengthWarning, color: "text-red-500" };
    if (projectedShieldStrength < ATTACK_STRENGTH_THRESHOLD * 0.9) return { text: t.mediumStrengthWarning, color: "text-yellow-500" };
    if (projectedShieldStrength > 0) return { text: t.highStrengthInfo, color: "text-green-500" };
    return { text: "", color: ""};
  };
  const strengthFeedback = getStrengthFeedback();


  return (
    <TooltipProvider>
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

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              {t.designConsoleTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-semibold">{t.selectFractalLabel}</Label>
              <RadioGroup
                value={selectedFractalId || ''}
                onValueChange={setSelectedFractalId}
                className="mt-2 space-y-2"
              >
                {currentFractalTypes.map((fractal) => (
                  <div key={fractal.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors has-[:checked]:bg-accent/20 has-[:checked]:border-accent">
                    <RadioGroupItem value={fractal.id} id={fractal.id} />
                    <Label htmlFor={fractal.id} className="flex-1 cursor-pointer text-sm">
                      {fractal.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="iterationLevel" className="text-base font-semibold">
                {t.iterationLevelLabel} <span className="text-primary font-bold">{t.iterationLevelValue(iterationLevel)}</span>
              </Label>
              <Slider
                id="iterationLevel"
                min={MIN_ITERATIONS}
                max={MAX_ITERATIONS}
                step={1}
                value={[iterationLevel]}
                onValueChange={(value) => setIterationLevel(value[0])}
                className="mt-2"
                disabled={!selectedFractalId || isDeploying || questCompleted}
              />
            </div>

            <Card className="bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-muted-foreground">{t.energyBudgetLabel}</Label>
                <span className="font-bold text-primary">{INITIAL_ENERGY_BUDGET} {t.unitEnergy}</span>
              </div>
              <Progress value={(INITIAL_ENERGY_BUDGET - currentEnergyCost) / INITIAL_ENERGY_BUDGET * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  {t.currentCostLabel}
                   <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><HelpCircle className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                    <TooltipContent className="text-xs"><p>{t.formulaHintCost}</p></TooltipContent>
                  </Tooltip>
                </Label>
                <span className={`font-semibold ${currentEnergyCost > INITIAL_ENERGY_BUDGET ? 'text-destructive' : 'text-foreground'}`}>
                  {currentEnergyCost} {t.unitEnergy}
                </span>
              </div>
               {currentEnergyCost > INITIAL_ENERGY_BUDGET && (
                <p className="text-xs text-destructive text-center">{t.costTooHigh}</p>
              )}

              <div className="flex justify-between items-center">
                 <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  {t.shieldStrengthLabel}
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><HelpCircle className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                    <TooltipContent className="text-xs"><p>{t.formulaHintStrength}</p></TooltipContent>
                  </Tooltip>
                 </Label>
                <span className="font-semibold text-foreground">{projectedShieldStrength} {t.unitStrength}</span>
              </div>
              {projectedShieldStrength > 0 && (
                  <p className={`text-xs text-center ${strengthFeedback.color}`}>{strengthFeedback.text}</p>
              )}
            </Card>

          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleDeploy} 
              disabled={isDeploying || !selectedFractalId || currentEnergyCost > INITIAL_ENERGY_BUDGET || questCompleted} 
              className="w-full"
            >
              <Shield className="mr-2 h-4 w-4" />
              {isDeploying ? t.deployingButton : t.deployButton}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className={`h-6 w-6 ${deploymentResult ? (deploymentResult.messageKey === 'outcomeFullDefense' ? 'text-green-500' : deploymentResult.messageKey === 'outcomePartialDefense' ? 'text-yellow-500' : 'text-red-500') : 'text-primary'}`} />
                {t.citadelGridTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src={`https://placehold.co/600x300.png?text=${isDeploying ? "DEPLOYING..." : deploymentResult ? deploymentResult.messageKey.toUpperCase() : "AWAITING_COMMAND"}`}
                alt={t.citadelGridAlt}
                width={600}
                height={300}
                className={`rounded-md border bg-muted/30 mx-auto transition-all duration-500 ${
                  isDeploying ? 'animate-pulse' : ''
                } ${
                  deploymentResult ? 
                  (deploymentResult.messageKey === 'outcomeFullDefense' ? 'border-green-500' :
                   deploymentResult.messageKey === 'outcomePartialDefense' ? 'border-yellow-500' :
                   'border-red-500') : 'border-border'
                }`}
                data-ai-hint="cyber security abstract data stream"
                key={deploymentResult ? deploymentResult.messageKey : "initial"} // Force re-render for image text
              />
              <p className="text-sm text-muted-foreground mt-2">{deploymentResult?.details || t.citadelGridAlt}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg ${deploymentResult ? (deploymentResult.messageKey === 'outcomeFullDefense' ? 'bg-green-500/10 border-green-500/30' : deploymentResult.messageKey === 'outcomePartialDefense' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-secondary/30'}`}>
            <CardHeader>
              <CardTitle className="text-lg">{deploymentResult ? t.deploymentOutcomeTitle : t.statusTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center p-4 rounded-md ${!deploymentResult ? 'bg-muted' : ''}`}>
                {systemStatus}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {questCompleted && !isDeploying && (
        <div className="mt-12 text-center">
          <Button size="lg" onClick={handleCompleteQuest}>
            <CheckCircle className="mr-2 h-5 w-5" />
            {t.completeQuestButton}
          </Button>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}

