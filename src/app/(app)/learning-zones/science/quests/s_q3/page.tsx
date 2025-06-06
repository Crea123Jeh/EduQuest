
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
import { ArrowLeft, Rocket, Wrench, Fuel, Gauge, Atom, Mountain, CheckCircle, XCircle, Wand2, AlertTriangle, Info, Package } from 'lucide-react';
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
  fuelEfficiency: number; // kg of fuel per second of burn (conceptual for burn time)
  isp: number; // Specific Impulse (seconds)
}

interface PayloadComponent extends RocketComponent {}

const ROCKET_BODIES: RocketComponent[] = [
  { id: 'scout', nameKey: 'bodyScout', mass: 500 },
  { id: 'lander', nameKey: 'bodyLander', mass: 1500 },
  { id: 'heavy', nameKey: 'bodyHeavy', mass: 3000 },
];

const ROCKET_ENGINES: EngineComponent[] = [
  { id: 'ion', nameKey: 'engineIon', mass: 100, thrust: 5000, fuelEfficiency: 0.2, isp: 3000 },
  { id: 'chemical', nameKey: 'engineChemical', mass: 500, thrust: 250000, fuelEfficiency: 2.5, isp: 350 },
  { id: 'plasma', nameKey: 'enginePlasma', mass: 300, thrust: 75000, fuelEfficiency: 1.0, isp: 1200 },
];

const ROCKET_PAYLOADS: PayloadComponent[] = [
  { id: 'none', nameKey: 'payloadNone', mass: 0 },
  { id: 'cubesat', nameKey: 'payloadCubeSat', mass: 20 },
  { id: 'probe', nameKey: 'payloadProbe', mass: 150 },
  { id: 'lander_module', nameKey: 'payloadLanderModule', mass: 500 },
];

const FUEL_UNIT_MASS = 10; // kg per unit of fuel on slider
const MAX_FUEL_UNITS = 100;
const EARTH_GRAVITY = 9.80665; // m/s^2

// Thresholds for success
const TWR_MIN_LAUNCH = 1.2; // Minimum TWR for liftoff

const DELTA_V_TARGETS = {
  LEO: 3500, // m/s - Simplified target for Low Earth Orbit from surface
  MUN_ORBIT: 7400, // m/s - Simplified total for Mun Orbit from surface (LEO + TLI + MOI)
  MUN_LANDING: 9400, // m/s - Simplified total for Mun Landing from surface (Mun Orbit + Descent/Landing)
};

const pageTranslations = {
  en: {
    questTitle: "Rocket Launch: To the Mun and Back!",
    questDescription: "Design, build, and launch a rocket. Balance mass, thrust, fuel, and payload to achieve specific mission objectives like reaching Mun orbit or landing. Key concepts: Thrust-to-Weight Ratio (TWR) for liftoff, and Delta-V (Δv) for total impulse.",
    zoneName: "Science Lab",
    backToZone: "Back to Science Lab",
    designConsoleTitle: "Rocket Design Console",
    selectBodyLabel: "1. Select Rocket Body:",
    bodyScout: "Scout Drone (Light)",
    bodyLander: "Lunar Lander (Medium)",
    bodyHeavy: "Heavy Transporter (Heavy)",
    selectEngineLabel: "2. Select Engine Type:",
    engineIon: "Ion Thruster (Low Thrust, High Isp)",
    engineChemical: "Chemical Engine (High Thrust, Mod Isp)",
    enginePlasma: "Plasma Drive (Med Thrust, High Isp)",
    selectPayloadLabel: "3. Select Payload:",
    payloadNone: "No Payload",
    payloadCubeSat: "CubeSat Array (20kg)",
    payloadProbe: "Mun Probe (150kg)",
    payloadLanderModule: "Small Lander Module (500kg)",
    fuelLoadLabel: "4. Set Fuel Load:",
    fuelUnits: (units: number) => `${units} units (${units * FUEL_UNIT_MASS} kg)`,
    readoutTitle: "Pre-Launch Readout",
    totalMassLabel: "Total Mass:",
    twrLabel: "Thrust-to-Weight Ratio (TWR):",
    twrValueLow: "Too Low!",
    twrValueMarginal: "Marginal",
    twrValueGood: "Good",
    twrValueExcellent: "Excellent",
    engineIspLabel: "Engine Isp:",
    ispUnit: "s",
    totalDeltaVLabel: "Total Δv (Delta-V):",
    deltaVUnit: "m/s",
    maxBurnTimeLabel: "Max Burn Time (Est.):",
    seconds: "s",
    projectedOutcomeLabel: "Projected Mission Outcome:",
    outcomeSurface: "Stuck on Surface",
    outcomeLEO: "Low Earth Orbit",
    outcomeMunOrbit: "Mun Orbit",
    outcomeMunLanding: "Mun Landing Achievable",
    launchPadTitle: "Launch Pad: Destination Mun",
    launchPadAlt: "Rocket on launchpad with Mun in background",
    launchButton: "Launch Rocket!",
    launchingButton: "Launching...",
    statusTitle: "Mission Status",
    statusInitial: "Awaiting design configuration. Configure your rocket above.",
    statusNoSelection: "Please select body, engine, payload, and fuel before launching.",
    statusTwrTooLow: (twr: string) => `TWR (${twr}) too low for liftoff! Rocket stuck on pad.`,
    outcomeTitle: "Mission Report:",
    reportSuccessLanding: "Successful Mun Landing! Your precise calculations and design choices paid off. Mission Accomplished!",
    reportSuccessMunOrbit: "Mun Orbit Achieved! Your rocket successfully entered orbit around the Mun. A major milestone!",
    reportSuccessLEO: "Low Earth Orbit Reached! Your rocket broke free of Earth's grasp. Next stop, the Mun?",
    reportFailureNoOrbit: "Launch Failure. The rocket didn't achieve stable orbit. Review TWR and Δv calculations.",
    reportFailureLaunchpad: "Catastrophic Launch Failure! The rocket couldn't overcome Earth's gravity. Check TWR and total mass!",
    completeQuestButton: "Finalize Mission Report",
    restartDesignButton: "Restart Design",
    toastQuestCompletedTitle: "Mission Report Filed!",
    toastQuestCompletedDescription: (points: number, outcome: string) => `You earned ${points} points. Outcome: ${outcome}`,
    toastMissingPartsTitle: "Configuration Error",
    toastMissingPartsDescription: "Select body, engine, payload, and some fuel.",
    massUnit: "kg",
    twrTooltip: "Thrust-to-Weight Ratio. Must be >1 (ideally >${TWR_MIN_LAUNCH.toFixed(1)}) for liftoff. Higher is generally better for overcoming gravity quickly.",
    ispTooltip: "Specific Impulse (Isp) measures engine efficiency. Higher Isp means more Δv for the same amount of fuel.",
    deltaVTooltip: "Delta-V (Δv) is the total change in velocity your rocket can achieve. Higher Δv allows for more ambitious maneuvers like reaching higher orbits or landing on other bodies. Calculated using Tsiolkovsky Rocket Equation: Isp * g0 * ln(Initial Mass / Final Mass).",
    burnTimeTooltip: "Estimated time the engine can run at full thrust with the current fuel load. Actual mission burn times will vary based on maneuvers.",
    projectedOutcomeTooltip: "Based on your current design's TWR and Total Δv, this is the furthest mission phase you're likely to achieve.",
  },
  id: {
    questTitle: "Peluncuran Roket: Ke Mun dan Kembali!",
    questDescription: "Rancang, bangun, dan luncurkan roket. Seimbangkan massa, daya dorong, bahan bakar, dan muatan untuk mencapai tujuan misi tertentu seperti mencapai orbit Mun atau mendarat. Konsep utama: Rasio Daya Dorong terhadap Berat (TWR) untuk lepas landas, dan Delta-V (Δv) untuk impuls total.",
    zoneName: "Laboratorium Sains",
    backToZone: "Kembali ke Lab Sains",
    designConsoleTitle: "Konsol Desain Roket",
    selectBodyLabel: "1. Pilih Badan Roket:",
    bodyScout: "Drone Pengintai (Ringan)",
    bodyLander: "Pendarat Bulan (Sedang)",
    bodyHeavy: "Pengangkut Berat (Berat)",
    selectEngineLabel: "2. Pilih Jenis Mesin:",
    engineIon: "Pendorong Ion (Daya Dorong Rendah, Isp Tinggi)",
    engineChemical: "Mesin Kimia (Daya Dorong Tinggi, Isp Sedang)",
    enginePlasma: "Penggerak Plasma (Daya Dorong Sedang, Isp Tinggi)",
    selectPayloadLabel: "3. Pilih Muatan:",
    payloadNone: "Tanpa Muatan",
    payloadCubeSat: "Rangkaian CubeSat (20kg)",
    payloadProbe: "Wahana Mun (150kg)",
    payloadLanderModule: "Modul Pendarat Kecil (500kg)",
    fuelLoadLabel: "4. Atur Muatan Bahan Bakar:",
    fuelUnits: (units: number) => `${units} unit (${units * FUEL_UNIT_MASS} kg)`,
    readoutTitle: "Pembacaan Pra-Peluncuran",
    totalMassLabel: "Massa Total:",
    twrLabel: "Rasio Daya Dorong terhadap Berat (TWR):",
    twrValueLow: "Terlalu Rendah!",
    twrValueMarginal: "Marjinal",
    twrValueGood: "Baik",
    twrValueExcellent: "Sangat Baik",
    engineIspLabel: "Isp Mesin:",
    ispUnit: "d", // detik
    totalDeltaVLabel: "Total Δv (Delta-V):",
    deltaVUnit: "m/d",
    maxBurnTimeLabel: "Waktu Bakar Maks (Perk.):",
    seconds: "d",
    projectedOutcomeLabel: "Proyeksi Hasil Misi:",
    outcomeSurface: "Terjebak di Permukaan",
    outcomeLEO: "Orbit Bumi Rendah",
    outcomeMunOrbit: "Orbit Mun",
    outcomeMunLanding: "Pendaratan Mun Dapat Dicapai",
    launchPadTitle: "Landasan Peluncuran: Tujuan Mun",
    launchPadAlt: "Roket di landasan peluncuran dengan Mun di latar belakang",
    launchButton: "Luncurkan Roket!",
    launchingButton: "Meluncurkan...",
    statusTitle: "Status Misi",
    statusInitial: "Menunggu konfigurasi desain. Konfigurasikan roket Anda di atas.",
    statusNoSelection: "Silakan pilih badan, mesin, muatan, dan bahan bakar sebelum meluncurkan.",
    statusTwrTooLow: (twr: string) => `TWR (${twr}) terlalu rendah untuk lepas landas! Roket macet di landasan.`,
    outcomeTitle: "Laporan Misi:",
    reportSuccessLanding: "Pendaratan Mun Sukses! Perhitungan dan pilihan desain Anda yang tepat membuahkan hasil. Misi Selesai!",
    reportSuccessMunOrbit: "Orbit Mun Tercapai! Roket Anda berhasil memasuki orbit di sekitar Mun. Tonggak sejarah besar!",
    reportSuccessLEO: "Orbit Bumi Rendah Tercapai! Roket Anda berhasil lepas dari gravitasi Bumi. Tujuan berikutnya, Mun?",
    reportFailureNoOrbit: "Gagal Mencapai Orbit. Roket tidak mencapai orbit stabil. Tinjau perhitungan TWR dan Δv.",
    reportFailureLaunchpad: "Kegagalan Peluncuran Total! Roket bahkan tidak bisa meninggalkan landasan peluncuran. Periksa TWR dan massa total!",
    completeQuestButton: "Finalisasi Laporan Misi",
    restartDesignButton: "Ulangi Desain",
    toastQuestCompletedTitle: "Laporan Misi Diajukan!",
    toastQuestCompletedDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Hasil: ${outcome}`,
    toastMissingPartsTitle: "Kesalahan Konfigurasi",
    toastMissingPartsDescription: "Pilih badan, mesin, muatan, dan sejumlah bahan bakar.",
    massUnit: "kg",
    twrTooltip: "Rasio Daya Dorong terhadap Berat. Harus >1 (idealnya >${TWR_MIN_LAUNCH.toFixed(1)}) untuk lepas landas. Lebih tinggi umumnya lebih baik untuk mengatasi gravitasi dengan cepat.",
    ispTooltip: "Impuls Spesifik (Isp) mengukur efisiensi mesin. Isp yang lebih tinggi berarti lebih banyak Δv untuk jumlah bahan bakar yang sama.",
    deltaVTooltip: "Delta-V (Δv) adalah total perubahan kecepatan yang dapat dicapai roket Anda. Δv yang lebih tinggi memungkinkan manuver yang lebih ambisius seperti mencapai orbit yang lebih tinggi atau mendarat di benda langit lain. Dihitung menggunakan Persamaan Roket Tsiolkovsky: Isp * g0 * ln(Massa Awal / Massa Akhir).",
    burnTimeTooltip: "Perkiraan waktu mesin dapat berjalan dengan daya dorong penuh dengan muatan bahan bakar saat ini. Waktu bakar misi aktual akan bervariasi berdasarkan manuver.",
    projectedOutcomeTooltip: "Berdasarkan TWR dan Total Δv desain Anda saat ini, ini adalah fase misi terjauh yang kemungkinan akan Anda capai.",
  }
};

export default function RocketLaunchQuestPageEnhanced() {
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(ROCKET_PAYLOADS[0].id);
  const [fuelLoad, setFuelLoad] = useState<number>(50);
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [missionStatus, setMissionStatus] = useState<string>('');
  const [missionOutcome, setMissionOutcome] = useState<{ messageKey: string, details?: string, twr?: string, deltaV?: string } | null>(null);
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
  const selectedPayload = useMemo(() => ROCKET_PAYLOADS.find(p => p.id === selectedPayloadId), [selectedPayloadId]);

  const dryMass = useMemo(() => {
    if (!selectedBody || !selectedEngine || !selectedPayload) return 0;
    return selectedBody.mass + selectedEngine.mass + selectedPayload.mass;
  }, [selectedBody, selectedEngine, selectedPayload]);

  const fuelMass = useMemo(() => fuelLoad * FUEL_UNIT_MASS, [fuelLoad]);

  const initialMass = useMemo(() => dryMass + fuelMass, [dryMass, fuelMass]);

  const thrustToWeightRatio = useMemo(() => {
    if (!selectedEngine || initialMass === 0) return 0;
    return (selectedEngine.thrust / (initialMass * EARTH_GRAVITY));
  }, [selectedEngine, initialMass]);

  const totalDeltaV = useMemo(() => {
    if (!selectedEngine || !selectedPayload || fuelMass <= 0 || dryMass === 0) return 0;
    if (initialMass === dryMass) return 0;
    return selectedEngine.isp * EARTH_GRAVITY * Math.log(initialMass / dryMass);
  }, [selectedEngine, selectedPayload, initialMass, dryMass, fuelMass]);

  const maxBurnTime = useMemo(() => {
    if (!selectedEngine || fuelLoad === 0 || selectedEngine.fuelEfficiency <= 0) return 0;
    return fuelMass / selectedEngine.fuelEfficiency;
  }, [selectedEngine, fuelLoad, fuelMass]);

  const getTWRDisplay = (twrValue: number): string => {
    if (twrValue < TWR_MIN_LAUNCH * 0.9) return t.twrValueLow;
    if (twrValue < TWR_MIN_LAUNCH * 1.1) return t.twrValueMarginal;
    if (twrValue < 2.5) return t.twrValueGood;
    return t.twrValueExcellent;
  };
  
  const getProjectedOutcomeDisplay = (currentDeltaV: number, currentTWR: number): string => {
    if (currentTWR < TWR_MIN_LAUNCH) return t.outcomeSurface;
    if (currentDeltaV >= DELTA_V_TARGETS.MUN_LANDING) return t.outcomeMunLanding;
    if (currentDeltaV >= DELTA_V_TARGETS.MUN_ORBIT) return t.outcomeMunOrbit;
    if (currentDeltaV >= DELTA_V_TARGETS.LEO) return t.outcomeLEO;
    return t.outcomeSurface;
  };

  const handleLaunch = () => {
    if (!selectedBody || !selectedEngine || !selectedPayload || fuelLoad <= 0) {
      setMissionStatus(t.statusNoSelection);
      toast({
        title: t.toastMissingPartsTitle,
        description: t.toastMissingPartsDescription,
        variant: 'destructive',
      });
      return;
    }

    const twrStr = thrustToWeightRatio.toFixed(2);
    const deltaVStr = totalDeltaV.toFixed(0);

    if (thrustToWeightRatio < TWR_MIN_LAUNCH) {
      setMissionStatus(t.statusTwrTooLow(twrStr));
      setMissionOutcome({ messageKey: 'reportFailureLaunchpad', twr: twrStr, deltaV: deltaVStr });
      setQuestAttempted(true);
      toast({
        title: t.reportFailureLaunchpad,
        description: t.statusTwrTooLow(twrStr),
        variant: 'destructive',
      });
      return;
    }

    setIsLaunching(true);
    setMissionOutcome(null);

    setTimeout(() => {
      let outcomeKey = '';
      if (totalDeltaV >= DELTA_V_TARGETS.MUN_LANDING) {
        outcomeKey = 'reportSuccessLanding';
      } else if (totalDeltaV >= DELTA_V_TARGETS.MUN_ORBIT) {
        outcomeKey = 'reportSuccessMunOrbit';
      } else if (totalDeltaV >= DELTA_V_TARGETS.LEO) {
        outcomeKey = 'reportSuccessLEO';
      } else {
        outcomeKey = 'reportFailureNoOrbit';
      }
      
      const bodyName = t[(selectedBody.nameKey) as keyof typeof t] || selectedBody.nameKey;
      const engineName = t[(selectedEngine.nameKey) as keyof typeof t] || selectedEngine.nameKey;
      const payloadName = t[(selectedPayload.nameKey) as keyof typeof t] || selectedPayload.nameKey;
      const outcomeDetails = `Body: ${bodyName}, Engine: ${engineName}, Payload: ${payloadName}, Fuel: ${fuelLoad} units. TWR: ${twrStr}, Δv: ${deltaVStr} ${t.deltaVUnit}`;
      
      setMissionOutcome({ messageKey: outcomeKey, details: outcomeDetails, twr: twrStr, deltaV: deltaVStr });
      setMissionStatus(t[outcomeKey as keyof typeof t] || "Launch sequence complete.");
      setIsLaunching(false);
      setQuestAttempted(true);
    }, 2500);
  };

  const handleRestartDesign = () => {
    setSelectedBodyId(null);
    setSelectedEngineId(null);
    setSelectedPayloadId(ROCKET_PAYLOADS[0].id);
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
    } else if (thrustToWeightRatio < TWR_MIN_LAUNCH && selectedBody && selectedEngine && selectedPayload && fuelLoad > 0){
        outcomeString = t.statusTwrTooLow(thrustToWeightRatio.toFixed(2));
    }
    toast({
      title: t.toastQuestCompletedTitle,
      description: t.toastQuestCompletedDescription(questDetails.points, outcomeString),
    });
  };
  
  const currentRocketBodies = ROCKET_BODIES.map(rc => ({...rc, name: t[rc.nameKey as keyof typeof t] || rc.nameKey}));
  const currentRocketEngines = ROCKET_ENGINES.map(re => ({...re, name: t[re.nameKey as keyof typeof t] || re.nameKey}));
  const currentRocketPayloads = ROCKET_PAYLOADS.map(rp => ({...rp, name: t[rp.nameKey as keyof typeof t] || rp.nameKey}));

  const launchImageKey = useMemo(() => {
    if (isLaunching) return "LAUNCHING";
    if (missionOutcome) {
      if (missionOutcome.messageKey === 'reportSuccessLanding') return "LANDED_ON_MUN";
      if (missionOutcome.messageKey === 'reportSuccessMunOrbit') return "MUN_ORBIT";
      if (missionOutcome.messageKey === 'reportSuccessLEO') return "LEO_ACHIEVED";
      if (missionOutcome.messageKey === 'reportFailureLaunchpad') return "LAUNCHPAD_FAILURE";
      return "FAILED_TO_REACH";
    }
    return "READY_FOR_LAUNCH";
  }, [isLaunching, missionOutcome]);
  
  const getLaunchImageBorder = () => {
     if (missionOutcome) {
      if (missionOutcome.messageKey === 'reportSuccessLanding') return 'border-green-500';
      if (missionOutcome.messageKey === 'reportSuccessMunOrbit' || missionOutcome.messageKey === 'reportSuccessLEO') return 'border-yellow-500';
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
                  <SelectValue placeholder={t.selectBodyLabel.replace("1. ", "")} />
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
                  <SelectValue placeholder={t.selectEngineLabel.replace("2. ", "")} />
                </SelectTrigger>
                <SelectContent>
                  {currentRocketEngines.map(engine => (
                    <SelectItem key={engine.id} value={engine.id}>{engine.name} (T:{engine.thrust/1000}kN, Isp:{engine.isp}s, M:{engine.mass}{t.massUnit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rocketPayload" className="text-base font-semibold">{t.selectPayloadLabel}</Label>
              <Select value={selectedPayloadId || ''} onValueChange={setSelectedPayloadId} disabled={isLaunching || questAttempted}>
                <SelectTrigger id="rocketPayload" className="mt-1">
                  <SelectValue placeholder={t.selectPayloadLabel.replace("3. ", "")} />
                </SelectTrigger>
                <SelectContent>
                  {currentRocketPayloads.map(payload => (
                    <SelectItem key={payload.id} value={payload.id}>{payload.name} ({payload.mass} {t.massUnit})</SelectItem>
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
                step={1}
                value={[fuelLoad]}
                onValueChange={(value) => setFuelLoad(value[0])}
                className="mt-2"
                disabled={isLaunching || questAttempted}
              />
               <Progress value={fuelLoad} max={MAX_FUEL_UNITS} className="mt-2 h-2" />
            </div>

            <Card className="bg-muted/30 p-4 space-y-2 text-sm">
                <CardTitle className="text-md mb-2">{t.readoutTitle}</CardTitle>
                <div className="flex justify-between"><span>{t.totalMassLabel}</span> <span className="font-semibold">{initialMass.toFixed(0)} {t.massUnit}</span></div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.twrLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.twrTooltip.replace('${TWR_MIN_LAUNCH.toFixed(1)}', TWR_MIN_LAUNCH.toFixed(1))}</p></TooltipContent>
                        </Tooltip>
                    </span> 
                    <span className={`font-semibold ${thrustToWeightRatio < TWR_MIN_LAUNCH ? 'text-destructive' : 'text-green-600'}`}>
                        {thrustToWeightRatio.toFixed(2)} ({getTWRDisplay(thrustToWeightRatio)})
                    </span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.engineIspLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.ispTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span>
                    <span className="font-semibold">{selectedEngine?.isp || 0} {t.ispUnit}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center">{t.totalDeltaVLabel}
                         <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.deltaVTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span>
                    <span className="font-semibold">{totalDeltaV.toFixed(0)} {t.deltaVUnit}</span>
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
                    <span className="flex items-center">{t.projectedOutcomeLabel}
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5 ml-1"><Info className="h-3 w-3 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent className="text-xs max-w-xs"><p>{t.projectedOutcomeTooltip}</p></TooltipContent>
                        </Tooltip>
                    </span>
                    <span className="font-semibold">{getProjectedOutcomeDisplay(totalDeltaV, thrustToWeightRatio)}</span>
                </div>
            </Card>

          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleLaunch} 
              disabled={isLaunching || questAttempted || !selectedBodyId || !selectedEngineId || !selectedPayloadId || fuelLoad <= 0} 
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
                <Mountain className={`h-6 w-6 ${missionOutcome?.messageKey.includes('Success') ? 'text-green-500' : missionOutcome?.messageKey.includes('Orbit') ? 'text-yellow-500' : missionOutcome ? 'text-red-500' : 'text-primary'}`} />
                {t.launchPadTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src={`https://placehold.co/600x350.png?text=${launchImageKey}`}
                alt={t.launchPadAlt}
                width={600}
                height={350}
                className={`rounded-md border-2 bg-muted/30 mx-auto transition-all duration-500 ${isLaunching ? 'animate-pulse' : ''} ${getLaunchImageBorder()}`}
                data-ai-hint="rocket launch space moon"
                key={launchImageKey} 
              />
              <p className="text-xs text-muted-foreground mt-2">{missionOutcome?.details || t.launchPadAlt}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-lg ${missionOutcome ? (missionOutcome.messageKey.includes('SuccessLanding') ? 'bg-green-500/10 border-green-500/30' : missionOutcome.messageKey.includes('Success') || missionOutcome.messageKey.includes('Orbit') ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-secondary/30'}`}>
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

    