
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Dna, FlaskConical, CheckCircle, RotateCcw, Wand2, Sparkles } from 'lucide-react';

const questDetails = {
  id: 's_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'science',
  zoneNameKey: 'zoneName',
  points: 130,
};

interface DnaTrait {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
}

interface DnaCategory {
  key: string;
  nameKey: string;
  traits: DnaTrait[];
}

const DNA_CATEGORIES: DnaCategory[] = [
  {
    key: 'bodyType',
    nameKey: 'dnaCatBodyType',
    traits: [
      { id: 'b1', nameKey: 'traitBodyRobust', categoryKey: 'bodyType', descriptionKey: 'descBodyRobust' },
      { id: 'b2', nameKey: 'traitBodySlender', categoryKey: 'bodyType', descriptionKey: 'descBodySlender' },
      { id: 'b3', nameKey: 'traitBodyAvian', categoryKey: 'bodyType', descriptionKey: 'descBodyAvian' },
    ],
  },
  {
    key: 'locomotion',
    nameKey: 'dnaCatLocomotion',
    traits: [
      { id: 'l1', nameKey: 'traitLocoLegs', categoryKey: 'locomotion', descriptionKey: 'descLocoLegs' },
      { id: 'l2', nameKey: 'traitLocoWings', categoryKey: 'locomotion', descriptionKey: 'descLocoWings' },
      { id: 'l3', nameKey: 'traitLocoFins', categoryKey: 'locomotion', descriptionKey: 'descLocoFins' },
    ],
  },
  {
    key: 'sensory',
    nameKey: 'dnaCatSensory',
    traits: [
      { id: 's1', nameKey: 'traitSenseEagleEyes', categoryKey: 'sensory', descriptionKey: 'descSenseEagleEyes' },
      { id: 's2', nameKey: 'traitSenseSonar', categoryKey: 'sensory', descriptionKey: 'descSenseSonar' },
      { id: 's3', nameKey: 'traitSenseAntennae', categoryKey: 'sensory', descriptionKey: 'descSenseAntennae' },
    ],
  },
  {
    key: 'adaptation',
    nameKey: 'dnaCatAdaptation',
    traits: [
      { id: 'a1', nameKey: 'traitAdaptCamouflage', categoryKey: 'adaptation', descriptionKey: 'descAdaptCamouflage' },
      { id: 'a2', nameKey: 'traitAdaptBiolum', categoryKey: 'adaptation', descriptionKey: 'descAdaptBiolum' },
      { id: 'a3', nameKey: 'traitAdaptArmor', categoryKey: 'adaptation', descriptionKey: 'descAdaptArmor' },
    ],
  },
];

type SelectedDnaTraits = {
  [key: string]: string | null; // categoryKey: traitId
};

const pageTranslations = {
  en: {
    questTitle: "Creature Feature: Build-A-Beast",
    questDescription: "Combine DNA samples to design and nurture your own unique creature. Will it be cute, cuddly, or catastrophically chaotic?",
    zoneName: "Science Lab",
    backToZone: "Back to Science Lab",
    designConsoleTitle: "DNA Splicing Console",
    selectTraitPlaceholder: "Select DNA Trait",
    creatureBlueprintTitle: "Creature Blueprint",
    creatureImageAlt: "Conceptual image of your designed creature",
    nurtureButton: "Nurture Creature",
    nurturingButton: "Nurturing...",
    statusTitle: "Incubation Status",
    statusInitial: "Select DNA traits above and click 'Nurture Creature' to begin.",
    statusNoSelection: "Please select a trait for each DNA category.",
    outcomeTitle: "Nurturing Report:",
    outcomeDefault: "Your creature has developed! It seems unique.",
    outcomeRobustAgile: "Your creature is robust and agile, a formidable hunter perhaps!",
    outcomeSlenderWingedSonar: "A slender, winged creature with keen sonar emerges. It's an agile aerial navigator!",
    outcomeArmoredAntennae: "This heavily armored creature uses its antennae to sense the world. A resilient survivor!",
    outcomeBioluminescentFins: "A beautiful creature with bioluminescent fins that gracefully swims. Truly enchanting!",
    completeQuestButton: "Finalize Creature Report",
    restartDesignButton: "Restart Design",
    toastQuestCompletedTitle: "Creature Report Filed!",
    toastQuestCompletedDescription: (points: number) => `You earned ${points} points for your genetic masterpiece!`,
    toastMissingTraitsTitle: "Incomplete DNA",
    toastMissingTraitsDescription: "Select a trait for all categories before nurturing.",
    dnaCatBodyType: "Body Type",
    dnaCatLocomotion: "Locomotion",
    dnaCatSensory: "Sensory Organs",
    dnaCatAdaptation: "Special Adaptation",
    traitBodyRobust: "Robust Frame",
    descBodyRobust: "A sturdy and strong physique.",
    traitBodySlender: "Slender Build",
    descBodySlender: "Lightweight and agile.",
    traitBodyAvian: "Avian Structure",
    descBodyAvian: "Hollow bones, built for flight.",
    traitLocoLegs: "Powerful Legs",
    descLocoLegs: "For running and jumping.",
    traitLocoWings: "Feathered Wings",
    descLocoWings: "Enables flight or gliding.",
    traitLocoFins: "Aquatic Fins",
    descLocoFins: "Designed for swimming.",
    traitSenseEagleEyes: "Eagle Eyesight",
    descSenseEagleEyes: "Exceptional long-distance vision.",
    traitSenseSonar: "Echolocation Sonar",
    descSenseSonar: "Navigates and hunts using sound.",
    traitSenseAntennae: "Sensitive Antennae",
    descSenseAntennae: "Detects subtle environmental changes.",
    traitAdaptCamouflage: "Chameleon Camouflage",
    descAdaptCamouflage: "Blends seamlessly with surroundings.",
    traitAdaptBiolum: "Bioluminescent Glow",
    descAdaptBiolum: "Emits a natural, captivating light.",
    traitAdaptArmor: "Plated Armor",
    descAdaptArmor: "A tough, protective exoskeleton.",
    selectedTraitsTitle: "Selected DNA Traits:",
    noTraitsSelected: "No traits selected yet.",
  },
  id: {
    questTitle: "Fitur Makhluk: Ciptakan Monster",
    questDescription: "Gabungkan sampel DNA untuk merancang dan memelihara makhluk unik Anda sendiri. Akankah ia lucu, menggemaskan, atau sangat kacau?",
    zoneName: "Laboratorium Sains",
    backToZone: "Kembali ke Lab Sains",
    designConsoleTitle: "Konsol Penyambungan DNA",
    selectTraitPlaceholder: "Pilih Sifat DNA",
    creatureBlueprintTitle: "Cetak Biru Makhluk",
    creatureImageAlt: "Gambar konseptual makhluk yang Anda rancang",
    nurtureButton: "Pelihara Makhluk",
    nurturingButton: "Memelihara...",
    statusTitle: "Status Inkubasi",
    statusInitial: "Pilih sifat DNA di atas dan klik 'Pelihara Makhluk' untuk memulai.",
    statusNoSelection: "Silakan pilih sifat untuk setiap kategori DNA.",
    outcomeTitle: "Laporan Pemeliharaan:",
    outcomeDefault: "Makhluk Anda telah berkembang! Tampaknya unik.",
    outcomeRobustAgile: "Makhluk Anda kuat dan lincah, mungkin pemburu yang tangguh!",
    outcomeSlenderWingedSonar: "Makhluk ramping bersayap dengan sonar tajam muncul. Navigator udara yang gesit!",
    outcomeArmoredAntennae: "Makhluk berlapis baja ini menggunakan antenanya untuk merasakan dunia. Penyintas yang tangguh!",
    outcomeBioluminescentFins: "Makhluk cantik dengan sirip berpendar hayati yang berenang dengan anggun. Sungguh memesona!",
    completeQuestButton: "Finalisasi Laporan Makhluk",
    restartDesignButton: "Ulangi Desain",
    toastQuestCompletedTitle: "Laporan Makhluk Diajukan!",
    toastQuestCompletedDescription: (points: number) => `Anda mendapatkan ${points} poin untuk mahakarya genetik Anda!`,
    toastMissingTraitsTitle: "DNA Tidak Lengkap",
    toastMissingTraitsDescription: "Pilih sifat untuk semua kategori sebelum memelihara.",
    dnaCatBodyType: "Tipe Tubuh",
    dnaCatLocomotion: "Penggerak",
    dnaCatSensory: "Organ Sensorik",
    dnaCatAdaptation: "Adaptasi Khusus",
    traitBodyRobust: "Kerangka Kuat",
    descBodyRobust: "Fisik yang kokoh dan kuat.",
    traitBodySlender: "Bentuk Ramping",
    descBodySlender: "Ringan dan lincah.",
    traitBodyAvian: "Struktur Unggas",
    descBodyAvian: "Tulang berongga, dirancang untuk terbang.",
    traitLocoLegs: "Kaki Kuat",
    descLocoLegs: "Untuk berlari dan melompat.",
    traitLocoWings: "Sayap Berbulu",
    descLocoWings: "Memungkinkan terbang atau meluncur.",
    traitLocoFins: "Sirip Akuatik",
    descLocoFins: "Dirancang untuk berenang.",
    traitSenseEagleEyes: "Penglihatan Elang",
    descSenseEagleEyes: "Penglihatan jarak jauh yang luar biasa.",
    traitSenseSonar: "Sonar Ekolokasi",
    descSenseSonar: "Menavigasi dan berburu menggunakan suara.",
    traitSenseAntennae: "Antena Sensitif",
    descSenseAntennae: "Mendeteksi perubahan lingkungan yang halus.",
    traitAdaptCamouflage: "Kamuflase Bunglon",
    descAdaptCamouflage: "Menyatu sempurna dengan lingkungan sekitar.",
    traitAdaptBiolum: "Pendar Bioluminesen",
    descAdaptBiolum: "Memancarkan cahaya alami yang menawan.",
    traitAdaptArmor: "Pelindung Lapis Baja",
    descAdaptArmor: "Eksoskeleton pelindung yang kuat.",
    selectedTraitsTitle: "Sifat DNA Terpilih:",
    noTraitsSelected: "Belum ada sifat yang dipilih.",
  }
};

export default function CreatureFeatureQuestPage() {
  const [selectedTraits, setSelectedTraits] = useState<SelectedDnaTraits>({});
  const [isNurturing, setIsNurturing] = useState(false);
  const [nurturingStatus, setNurturingStatus] = useState<string>('');
  const [nurturingOutcome, setNurturingOutcome] = useState<{ messageKey: string, details?: string } | null>(null);
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
        } catch (e) { console.error("Error reading lang for CreatureFeaturePage", e); }
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
    setNurturingStatus(t.statusInitial);
  }, [t.statusInitial]);

  const handleTraitSelect = (categoryKey: string, traitId: string) => {
    setSelectedTraits(prev => ({ ...prev, [categoryKey]: traitId }));
    setQuestAttempted(false); // Allow re-nurturing if traits change
    setNurturingOutcome(null);
    setNurturingStatus(t.statusInitial);
  };

  const allCategoriesSelected = useMemo(() => {
    return DNA_CATEGORIES.every(cat => selectedTraits[cat.key] !== null && typeof selectedTraits[cat.key] !== 'undefined');
  }, [selectedTraits]);

  const getSelectedTraitName = (categoryKey: string) => {
    const traitId = selectedTraits[categoryKey];
    if (!traitId) return null;
    const category = DNA_CATEGORIES.find(c => c.key === categoryKey);
    const trait = category?.traits.find(tr => tr.id === traitId);
    return trait ? (t[trait.nameKey as keyof typeof t] || trait.nameKey) : null;
  };
  
  const creatureImageText = useMemo(() => {
    if (!allCategoriesSelected) return "INCOMPLETE_DNA";
    if (isNurturing) return "NURTURING";
    if (nurturingOutcome) return t[nurturingOutcome.messageKey as keyof typeof t].substring(0,20).toUpperCase().replace(/\s/g, '_');
    
    const body = getSelectedTraitName('bodyType')?.substring(0,5) || "BODY";
    const loco = getSelectedTraitName('locomotion')?.substring(0,5) || "LOCO";
    return `${body}_${loco}_CREATURE`;
  }, [allCategoriesSelected, isNurturing, nurturingOutcome, selectedTraits, t]);


  const handleNurture = () => {
    if (!allCategoriesSelected) {
      setNurturingStatus(t.statusNoSelection);
      toast({
        title: t.toastMissingTraitsTitle,
        description: t.toastMissingTraitsDescription,
        variant: 'destructive',
      });
      return;
    }

    setIsNurturing(true);
    setNurturingOutcome(null);
    setNurturingStatus(t.nurturingButton);

    // Simulate nurturing process and outcome determination
    setTimeout(() => {
      let outcomeKey = 'outcomeDefault';
      // Simple logic for varied outcomes based on selections
      if (selectedTraits['bodyType'] === 'b1' && selectedTraits['locomotion'] === 'l1') {
        outcomeKey = 'outcomeRobustAgile';
      } else if (selectedTraits['bodyType'] === 'b2' && selectedTraits['locomotion'] === 'l2' && selectedTraits['sensory'] === 's2') {
        outcomeKey = 'outcomeSlenderWingedSonar';
      } else if (selectedTraits['adaptation'] === 'a3' && selectedTraits['sensory'] === 's3') {
        outcomeKey = 'outcomeArmoredAntennae';
      } else if (selectedTraits['adaptation'] === 'a2' && selectedTraits['locomotion'] === 'l3') {
        outcomeKey = 'outcomeBioluminescentFins';
      }
      
      const selectedTraitNames = DNA_CATEGORIES.map(cat => {
        const traitId = selectedTraits[cat.key];
        const trait = cat.traits.find(tr => tr.id === traitId);
        return trait ? (t[trait.nameKey as keyof typeof t] || trait.nameKey) : 'Unknown';
      }).join(', ');
      
      const outcomeDetails = `Traits: ${selectedTraitNames}.`;
      
      setNurturingOutcome({ messageKey: outcomeKey, details: outcomeDetails });
      setNurturingStatus(t[outcomeKey as keyof typeof t] || "Nurturing complete.");
      setIsNurturing(false);
      setQuestAttempted(true);
    }, 2000);
  };

  const handleRestartDesign = () => {
    setSelectedTraits({});
    setNurturingStatus(t.statusInitial);
    setNurturingOutcome(null);
    setQuestAttempted(false);
    setIsNurturing(false);
  };

  const handleCompleteQuest = () => {
    toast({
      title: t.toastQuestCompletedTitle,
      description: t.toastQuestCompletedDescription(questDetails.points),
    });
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

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-6 w-6 text-primary" />
              {t.designConsoleTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DNA_CATEGORIES.map(category => (
              <div key={category.key}>
                <label htmlFor={category.key} className="text-base font-semibold block mb-1">
                  {t[category.nameKey as keyof typeof t] || category.nameKey}
                </label>
                <Select
                  value={selectedTraits[category.key] || ''}
                  onValueChange={(value) => handleTraitSelect(category.key, value)}
                  disabled={isNurturing}
                >
                  <SelectTrigger id={category.key}>
                    <SelectValue placeholder={t.selectTraitPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {category.traits.map(trait => (
                      <SelectItem key={trait.id} value={trait.id}>
                        <div className="flex flex-col">
                          <span>{t[trait.nameKey as keyof typeof t] || trait.nameKey}</span>
                          <span className="text-xs text-muted-foreground">
                            {t[trait.descriptionKey as keyof typeof t] || trait.descriptionKey}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleNurture} 
              disabled={isNurturing || !allCategoriesSelected || questAttempted} 
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isNurturing ? t.nurturingButton : t.nurtureButton}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary" />
                {t.creatureBlueprintTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src={`https://placehold.co/600x350.png?text=${creatureImageText}`}
                alt={t.creatureImageAlt}
                width={600}
                height={350}
                className={`rounded-md border bg-muted/30 mx-auto transition-all duration-300 ${isNurturing ? 'animate-pulse' : ''}`}
                data-ai-hint="abstract creature genetic evolution"
                key={creatureImageText} 
              />
               <div className="mt-4 text-left">
                <h4 className="font-semibold mb-2">{t.selectedTraitsTitle}</h4>
                {allCategoriesSelected ? (
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    {DNA_CATEGORIES.map(cat => {
                      const traitName = getSelectedTraitName(cat.key);
                      return traitName ? <li key={cat.key}><strong>{t[cat.nameKey as keyof typeof t] || cat.nameKey}:</strong> {traitName}</li> : null;
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">{t.noTraitsSelected}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-lg ${nurturingOutcome ? 'bg-green-500/10 border-green-500/30' : 'bg-secondary/30'}`}>
            <CardHeader>
              <CardTitle className="text-lg">{nurturingOutcome ? t.outcomeTitle : t.statusTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center p-4 rounded-md ${!nurturingOutcome ? 'bg-muted' : ''}`}>
                {nurturingStatus}
              </p>
              {nurturingOutcome && nurturingOutcome.details && (
                <p className="text-xs text-muted-foreground mt-2 text-center">{nurturingOutcome.details}</p>
              )}
            </CardContent>
          </Card>

          {(questAttempted && !isNurturing) && (
            <CardFooter className="flex-col sm:flex-row gap-2 justify-center pt-4">
                <Button onClick={handleRestartDesign} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />{t.restartDesignButton}
                </Button>
                <Button onClick={handleCompleteQuest}>
                    <CheckCircle className="mr-2 h-4 w-4" />{t.completeQuestButton}
                </Button>
            </CardFooter>
          )}
        </div>
      </div>
    </div>
  );
}

        
    