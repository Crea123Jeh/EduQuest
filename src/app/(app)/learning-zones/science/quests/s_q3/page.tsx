
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Rocket, Wrench, Fuel, Gauge, Atom, Mountain, CheckCircle, XCircle, Wand2, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const questDetails = {
  id: 's_q3',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'science',
  zoneNameKey: 'zoneName',
  points: 150,
};

interface RocketComponent {
  id: string;
  nameKey: string;
  mass: number; // kg
}

interface EngineComponent extends RocketComponent {
  thrust: number; // Newtons
  fuelEfficiency: number; // kg of fuel per second of burn, lower is more efficient for this stat
}

const ROCKET_BODIES: RocketComponent[] = [
  { id: 'scout', nameKey: 'bodyScout', mass: 500 },
  { id: 'lander', nameKey: 'bodyLander', mass: 1500 },
  { id: 'heavy', nameKey: 'bodyHeavy', mass: 3000 },
];

const ROCKET_ENGINES: EngineComponent[] = [
  { id: 'ion', nameKey: 'engineIon', mass: 100, thrust: 5000, fuelEfficiency: 0.5 }, // Low thrust, high efficiency
  { id: 'chemical', nameKey: 'engineChemical', mass: 300, thrust: 50000, fuelEfficiency: 2.5 }, // Med thrust, med efficiency
  { id: 'plasma', nameKey: 'enginePlasma', mass: 700, thrust: 150000, fuelEfficiency: 10 }, // High thrust, low efficiency
];

const FUEL_UNIT_MASS = 10; // kg per unit of fuel on slider
const MAX_FUEL_UNITS = 100;

const EARTH_GRAVITY = 9.81; // m/s^2

// Thresholds for success
const TWR_MIN_LAUNCH = 1.2;
const FLIGHT_POTENTIAL_ORBIT = 50;
const FLIGHT_POTENTIAL_LANDING = 100;


const pageTranslations = {
  en: {
    questTitle: "Rocket Launch: To the Mun and Back!",
    questDescription: "Design, build, and launch a miniature rocket. Calculate trajectories and fuel consumption to land safely on the class \"Mun\".",
    zoneName: "Science Lab",
    backToZone: "Back to Science Lab",
    designConsoleTitle: "Rocket Design Console",
    selectBodyLabel: "1. Select Rocket Body:",
    bodyScout: "Scout Drone (Light)",
    bodyLander: "Lunar Lander (Medium)",
    bodyHeavy: "Heavy Transporter (Heavy)",
    selectEngineLabel: "2. Select Engine Type:",
    engineIon: "Ion Thruster (Low Thrust, High Efficiency)",
    engineChemical: "Chemical Engine (Medium Thrust & Efficiency)",
    enginePlasma: "Plasma Drive (High Thrust, Low Efficiency)",
    fuelLoadLabel: "3. Set Fuel Load:",
    fuelUnits: (units: number) => `${units} units`,
    readoutTitle: "Pre-Launch Readout",
    totalMassLabel: "Total Mass:",
    twrLabel: "Thrust-to-Weight Ratio (TWR):",
    twrValueLow: "Too Low!",
    twrValueMarginal: "Marginal",
    twrValueGood: "Good",
    twrValueExcellent: "Excellent",
    maxBurnTimeLabel: "Max Burn Time (Est.):",
    seconds: "s",
    missionSuccessProbLabel: "Mission Success Probability:",
    probLow: "Low",
    probMedium: "Medium",
    probHigh: "High",
    probVeryHigh: "Very High",
    launchPadTitle: "Launch Pad: Destination Mun",
    launchPadAlt: "Rocket on launchpad with Mun in background",
    launchButton: "Launch Rocket!",
    launchingButton: "Launching...",
    statusTitle: "Mission Status",
    statusInitial: "Awaiting design configuration. Configure your rocket above.",
    statusNoSelection: "Please select body, engine, and fuel before launching.",
    statusTwrTooLow: (twr: string) => `TWR (${twr}) too low for liftoff! Rocket stuck on pad.`,
    outcomeTitle: "Mission Report:",
    outcomeSuccessLanding: "Successful Landing! Your rocket touched down safely on the Mun. Mission Accomplished!",
    outcomeSuccessOrbit: "Mun Orbit Achieved! Your rocket made it to orbit, but couldn't quite stick the landing. Great effort!",
    outcomeFailureNoOrbit: "Launch Failure. The rocket didn't achieve stable orbit around the Mun. More calculations needed!",
    outcomeFailureLaunchpad: "Catastrophic Launch Failure! The rocket couldn't even leave the launchpad. Check TWR and mass!",
    completeQuestButton: "Finalize Mission Report",
    restartDesignButton: "Restart Design",
    toastQuestCompletedTitle: "Mission Report Filed!",
    toastQuestCompletedDescription: (points: number, outcome: string) => `You earned ${points} points. Outcome: ${outcome}`,
    toastMissingPartsTitle: "Configuration Error",
    toastMissingPartsDescription: "Select body, engine, and some fuel.",
    massUnit: "kg",
    twrTooltip: "Thrust-to-Weight Ratio. Must be >1 for liftoff. Higher is generally better for overcoming gravity quickly.",
    burnTimeTooltip: "Estimated time the engine can run at full thrust with the current fuel load.",
    probabilityTooltip: "A qualitative measure of your rocket's potential to reach and land on the Mun based on its design.",
  },
  id: {
    questTitle: "Peluncuran Roket: Ke Mun dan Kembali!",
    questDescription: "Rancang, bangun, dan luncurkan roket mini. Hitung lintasan dan konsumsi bahan bakar untuk mendarat dengan aman di \"Mun\" kelas.",
    zoneName: "Laboratorium Sains",
    backToZone: "Kembali ke Lab Sains",
    designConsoleTitle: "Konsol Desain Roket",
    selectBodyLabel: "1. Pilih Badan Roket:",
    bodyScout: "Drone Pengintai (Ringan)",
    bodyLander: "Pendarat Bulan (Sedang)",
    bodyHeavy: "Pengangkut Berat (Berat)",
    selectEngineLabel: "2. Pilih Jenis Mesin:",
    engineIon: "Pendorong Ion (Daya Dorong Rendah, Efisiensi Tinggi)",
    engineChemical: "Mesin Kimia (Daya Dorong & Efisiensi Sedang)",
    enginePlasma: "Penggerak Plasma (Daya Dorong Tinggi, Efisiensi Rendah)",
    fuelLoadLabel: "3. Atur Muatan Bahan Bakar:",
    fuelUnits: (units: number) => `${units} unit`,
    readoutTitle: "Pembacaan Pra-Peluncuran",
    totalMassLabel: "Massa Total:",
    twrLabel: "Rasio Daya Dorong terhadap Berat (TWR):",
    twrValueLow: "Terlalu Rendah!",
    twrValueMarginal: "Marjinal",
    twrValueGood: "Baik",
    twrValueExcellent: "Sangat Baik",
    maxBurnTimeLabel: "Waktu Bakar Maks (Perk.):",
    seconds: "d",
    missionSuccessProbLabel: "Probabilitas Keberhasilan Misi:",
    probLow: "Rendah",
    probMedium: "Sedang",
    probHigh: "Tinggi",
    probVeryHigh: "Sangat Tinggi",
    launchPadTitle: "Landasan Peluncuran: Tujuan Mun",
    launchPadAlt: "Roket di landasan peluncuran dengan Mun di latar belakang",
    launchButton: "Luncurkan Roket!",
    launchingButton: "Meluncurkan...",
    statusTitle: "Status Misi",
    statusInitial: "Menunggu konfigurasi desain. Konfigurasikan roket Anda di atas.",
    statusNoSelection: "Silakan pilih badan, mesin, dan bahan bakar sebelum meluncurkan.",
    statusTwrTooLow: (twr: string) => `TWR (${twr}) terlalu rendah untuk lepas landas! Roket macet di landasan.`,
    outcomeTitle: "Laporan Misi:",
    outcomeSuccessLanding: "Pendaratan Sukses! Roket Anda mendarat dengan aman di Mun. Misi Selesai!",
    outcomeSuccessOrbit: "Orbit Mun Tercapai! Roket Anda berhasil mencapai orbit, tetapi tidak berhasil mendarat. Usaha yang bagus!",
    outcomeFailureNoOrbit: "Gagal Mencapai Orbit. Roket tidak mencapai orbit stabil di sekitar Mun. Perlu perhitungan lebih lanjut!",
    outcomeFailureLaunchpad: "Kegagalan Peluncuran Total! Roket bahkan tidak bisa meninggalkan landasan peluncuran. Periksa TWR dan massa!",
    completeQuestButton: "Finalisasi Laporan Misi",
    restartDesignButton: "Ulangi Desain",
    toastQuestCompletedTitle: "Laporan Misi Diajukan!",
    toastQuestCompletedDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Hasil: ${outcome}`,
    toastMissingPartsTitle: "Kesalahan Konfigurasi",
    toastMissingPartsDescription: "Pilih badan, mesin, dan sejumlah bahan bakar.",
    massUnit: "kg",
    twrTooltip: "Rasio Daya Dorong terhadap Berat. Harus >1 untuk lepas landas. Lebih tinggi umumnya lebih baik untuk mengatasi gravitasi dengan cepat.",
    burnTimeTooltip: "Perkiraan waktu mesin dapat berjalan dengan daya dorong penuh dengan muatan bahan bakar saat ini.",
    probabilityTooltip: "Ukuran kualitatif potensi roket Anda untuk mencapai dan mendarat di Mun berdasarkan desainnya.",
  }
};

export default function RocketLaunchQuestPage() {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [fuelLoad, setFuelLoad] = useState<number>(50);
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [missionStatus, setMissionStatus] = useState<string>('');
  const [missionOutcome, setMissionOutcome] = useState<{ messageKey: string, details?: string, twr?: string } | null>(null);
  const [questAttempted, setQuestAttempted] = useState(false);
  
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
        } catch (e) { console.error("Error reading lang for RocketLaunchQuestPage", e); }
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
    setMissionStatus(t.statusInitial);
  }, [t.statusInitial]);

  const selectedBody = useMemo(() => ROCKET_BODIES.find(b => b.id === selectedBodyId), [selectedBodyId]);
  const selectedEngine = useMemo(() => ROCKET_ENGINES.find(e => e.id === selectedEngineId), [selectedEngineId]);

  const totalMass = useMemo(() => {
    if (!selectedBody || !selectedEngine) return 0;
    return selectedBody.mass + selectedEngine.mass + (fuelLoad * FUEL_UNIT_MASS);
  }, [selectedBody, selectedEngine, fuelLoad]);

  const thrustToWeightRatio = useMemo(() => {
    if (!selectedEngine || totalMass === 0) return 0;
    return (selectedEngine.thrust / (totalMass * EARTH_GRAVITY));
  }, [selectedEngine, totalMass]);

  const maxBurnTime = useMemo(() => {
    if (!selectedEngine || fuelLoad === 0) return 0;
    // fuelEfficiency is kg/s, so fuelMass / fuelEfficiency = seconds
    return ((fuelLoad * FUEL_UNIT_MASS) / selectedEngine.fuelEfficiency);
  }, [selectedEngine, fuelLoad]);

  const flightPotentialScore = useMemo(() => {
    if (!selectedEngine || totalMass === 0 || thrustToWeightRatio < TWR_MIN_LAUNCH * 0.8) return 0; // Penalize very low TWR heavily
     // Simplified score: (effective_thrust_factor * burn_time_factor)
    // Effective thrust considers TWR. Burn time considers how long it can push.
    // Let TWR contribute more if it's well above 1.
    const twrFactor = Math.max(0, (thrustToWeightRatio - (TWR_MIN_LAUNCH * 0.9))) * 20; // Emphasize TWR
    // Max burn time contributes, but with diminishing returns for extremely long burns if TWR is low.
    const burnFactor = Math.sqrt(maxBurnTime) * 5;
    return Math.max(0, twrFactor + burnFactor);
  }, [thrustToWeightRatio, maxBurnTime, selectedEngine, totalMass]);

  const getTWRDisplay = (twrValue: number): string => {
    if (twrValue < TWR_MIN_LAUNCH * 0.9) return t.twrValueLow; // Adjusted threshold for "Too Low"
    if (twrValue < TWR_MIN_LAUNCH * 1.1) return t.twrValueMarginal;
    if (twrValue < 2.5) return t.twrValueGood;
    return t.twrValueExcellent;
  };
  
  const getMissionProbDisplay = (score: number): string => {
    if (score >= FLIGHT_POTENTIAL_LANDING * 0.9) return t.probVeryHigh;
    if (score >= FLIGHT_POTENTIAL_ORBIT * 1.1) return t.probHigh;
    if (score >= FLIGHT_POTENTIAL_ORBIT * 0.7) return t.probMedium;
    return t.probLow;
  };

  const handleLaunch = () => {
    if (!selectedBody || !selectedEngine || fuelLoad <=0) {
      setMissionStatus(t.statusNoSelection);
      toast({
        title: t.toastMissingPartsTitle,
        description: t.toastMissingPartsDescription,
        variant: 'destructive',
      });
      return;
    }

    if (thrustToWeightRatio < TWR_MIN_LAUNCH) {
      const twrStr = thrustToWeightRatio.toFixed(2);
      setMissionStatus(t.statusTwrTooLow(twrStr));
      setMissionOutcome({ messageKey: 'outcomeFailureLaunchpad', twr: twrStr });
      setQuestAttempted(true);
      toast({
        title: t.outcomeFailureLaunchpad,
        description: t.statusTwrTooLow(twrStr),
        variant: 'destructive',
      });
      return;
    }

    setIsLaunching(true);
    setMissionOutcome(null);

    setTimeout(() => {
      let outcomeKey = '';
      if (flightPotentialScore >= FLIGHT_POTENTIAL_LANDING) {
        outcomeKey = 'outcomeSuccessLanding';
      } else if (flightPotentialScore >= FLIGHT_POTENTIAL_ORBIT) {
        outcomeKey = 'outcomeSuccessOrbit';
      } else {
        outcomeKey = 'outcomeFailureNoOrbit';
      }
      
      const bodyName = t[(selectedBody.nameKey) as keyof typeof t] || selectedBody.nameKey;
      const engineName = t[(selectedEngine.nameKey) as keyof typeof t] || selectedEngine.nameKey;
      const outcomeDetails = `Body: ${bodyName}, Engine: ${engineName}, Fuel: ${fuelLoad} units, TWR: ${thrustToWeightRatio.toFixed(2)}, Potential: ${flightPotentialScore.toFixed(0)}`;
      
      setMissionOutcome({ messageKey: outcomeKey, details: outcomeDetails });
      setMissionStatus(t[outcomeKey as keyof typeof t] || "Launch sequence complete.");
      setIsLaunching(false);
      setQuestAttempted(true);
    }, 2500);
  };

  const handleRestartDesign = () => {
    setSelectedBodyId(null);
    setSelectedEngineId(null);
    setFuelLoad(50);
    setMissionStatus(t.statusInitial);
    setMissionOutcome(null);
    setQuestAttempted(false);
    setIsLaunching(false);
  };

  const handleCompleteQuest = () => {
    let outcomeString = "Attempted";
    if(missionOutcome) {
        outcomeString = t[missionOutcome.messageKey as keyof typeof t] || missionOutcome.messageKey;
    } else if (thrustToWeightRatio < TWR_MIN_LAUNCH && selectedBody && selectedEngine && fuelLoad > 0){
        outcomeString = t.statusTwrTooLow(thrustToWeightRatio.toFixed(2));
    }


    toast({
      title: t.toastQuestCompletedTitle,
      description: t.toastQuestCompletedDescription(questDetails.points, outcomeString),
    });
  };
  
  const currentRocketBodies = ROCKET_BODIES.map(rc => ({...rc, name: t[rc.nameKey as keyof typeof t] || rc.nameKey}));
  const currentRocketEngines = ROCKET_ENGINES.map(re => ({...re, name: t[re.nameKey as keyof typeof t] || re.nameKey}));

  const launchImageSrc = () => {
    if (isLaunching) return `https://placehold.co/600x350.png?text=LAUNCHING...`;
    if (missionOutcome) {
      if (missionOutcome.messageKey === 'outcomeSuccessLanding') return `https://placehold.co/600x350.png?text=LANDED_ON_MUN`;
      if (missionOutcome.messageKey === 'outcomeSuccessOrbit') return `https://placehold.co/600x350.png?text=MUN_ORBIT`;
      if (missionOutcome.messageKey === 'outcomeFailureLaunchpad') return `https://placehold.co/600x350.png?text=LAUNCHPAD_FAILURE`;
      return `https://placehold.co/600x350.png?text=FAILED_TO_REACH`;
    }
    return `https://placehold.co/600x350.png?text=READY_FOR_LAUNCH`;
  }
  
  const getLaunchImageBorder = () => {
     if (missionOutcome) {
      if (missionOutcome.messageKey === 'outcomeSuccessLanding') return 'border-green-500';
      if (missionOutcome.messageKey === 'outcomeSuccessOrbit') return 'border-yellow-500';
      return 'border-red-500';
    }
    return 'border-border';
  }

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

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              {t.designConsoleTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="rocketBody" className="text-base font-semibold">{t.selectBodyLabel}</Label>
              <Select value={selectedBodyId || ''} onValueChange={setSelectedBodyId} disabled={isLaunching || questAttempted}>
                <SelectTrigger id="rocketBody" className="mt-1">
                  <SelectValue placeholder={t.selectBodyLabel} />
                </SelectTrigger>
                <SelectContent>
                  {currentRocketBodies.map(body => (
                    <SelectItem key={body.id} value={body.id}>{body.name} ({body.mass} {t.massUnit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rocketEngine" className="text-base font-semibold">{t.selectEngineLabel}</Label>
              <Select value={selectedEngineId || ''} onValueChange={setSelectedEngineId} disabled={isLaunching || questAttempted}>
                <SelectTrigger id="rocketEngine" className="mt-1">
                  <SelectValue placeholder={t.selectEngineLabel} />
                </SelectTrigger>
                <SelectContent>
                  {currentRocketEngines.map(engine => (
                    <SelectItem key={engine.id} value={engine.id}>{engine.name} (T:{engine.thrust}N, E:{engine.fuelEfficiency}, M:{engine.mass}{t.massUnit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fuelLoad" className="text-base font-semibold">
                {t.fuelLoadLabel} <span className="text-primary font-bold">{t.fuelUnits(fuelLoad)}</span>
              </Label>
              <Slider
                id="fuelLoad"
                min={0}
                max={MAX_FUEL_UNITS}
                step={5}
                value={[fuelLoad]}
                onValueChange={(value) => setFuelLoad(value[0])}
                className="mt-2"
                disabled={isLaunching || questAttempted}
              />
               <Progress value={fuelLoad} max={MAX_FUEL_UNITS} className="mt-2 h-2" />
            </div>

            <Card className="bg-muted/30 p-4 space-y-2 text-sm">
                <CardTitle className="text-md mb-2">{t.readoutTitle}</CardTitle>
                <div className="flex justify-between"><span>{t.totalMassLabel}</span> <span className="font-semibold">{totalMass.toFixed(0)} {t.massUnit}</span></div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.twrLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.twrTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span> 
                    <span className={`font-semibold ${thrustToWeightRatio < TWR_MIN_LAUNCH ? 'text-destructive' : 'text-green-600'}`}>
                        {thrustToWeightRatio.toFixed(2)} ({getTWRDisplay(thrustToWeightRatio)})
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.maxBurnTimeLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.burnTimeTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span>
                    <span className="font-semibold">{maxBurnTime.toFixed(1)} {t.seconds}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.missionSuccessProbLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.probabilityTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span>
                    <span className="font-semibold">{getMissionProbDisplay(flightPotentialScore)}</span>
                </div>
            </Card>

          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleLaunch} 
              disabled={isLaunching || questAttempted || !selectedBodyId || !selectedEngineId || fuelLoad <= 0} 
              className="w-full"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {isLaunching ? t.launchingButton : t.launchButton}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className={`h-6 w-6 ${missionOutcome?.messageKey === 'outcomeSuccessLanding' ? 'text-green-500' : missionOutcome?.messageKey === 'outcomeSuccessOrbit' ? 'text-yellow-500' : missionOutcome ? 'text-red-500' : 'text-primary'}`} />
                {t.launchPadTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src={launchImageSrc()}
                alt={t.launchPadAlt}
                width={600}
                height={350}
                className={`rounded-md border-2 bg-muted/30 mx-auto transition-all duration-500 ${isLaunching ? 'animate-pulse' : ''} ${getLaunchImageBorder()}`}
                data-ai-hint="rocket launch space moon"
                key={missionOutcome ? missionOutcome.messageKey : "initial_launch_image"}
              />
              <p className="text-xs text-muted-foreground mt-2">{missionOutcome?.details || t.launchPadAlt}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg ${missionOutcome ? (missionOutcome.messageKey === 'outcomeSuccessLanding' ? 'bg-green-500/10 border-green-500/30' : missionOutcome.messageKey === 'outcomeSuccessOrbit' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-secondary/30'}`}>
            <CardHeader>
              <CardTitle className="text-lg">{missionOutcome ? t.outcomeTitle : t.statusTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center p-4 rounded-md ${!missionOutcome ? 'bg-muted' : ''}`}>
                {missionStatus}
              </p>
            </CardContent>
          </Card>
           {(questAttempted && !isLaunching) && (
            <CardFooter className="flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={handleRestartDesign} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />{t.restartDesignButton}
                </Button>
                <Button onClick={handleCompleteQuest}>
                    <CheckCircle className="mr-2 h-4 w-4" />{t.completeQuestButton}
                </Button>
            </CardFooter>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}

