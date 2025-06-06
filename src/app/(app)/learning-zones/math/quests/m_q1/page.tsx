
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Cpu, CheckCircle, Wand2, AlertTriangle } from 'lucide-react';

const questDetails = {
  id: 'm_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'math',
  zoneNameKey: 'zoneName',
  points: 200,
};

const fractalTypes = [
  { id: 'sierpinski', nameKey: 'sierpinskiName', complexity: 8 },
  { id: 'mandelbrot', nameKey: 'mandelbrotName', complexity: 7 },
  { id: 'koch', nameKey: 'kochName', complexity: 9 },
];

const pageTranslations = {
  en: {
    questTitle: "Fractal Fortress Defense",
    questDescription: "Design and deploy fractal patterns to defend the Citadel from rogue data streams. The more complex, the stronger your shield!",
    zoneName: "Mathematics Realm",
    backToZone: "Back to Mathematics Realm",
    designConsoleTitle: "Fractal Design Console",
    selectFractalLabel: "Select Fractal Type:",
    sierpinskiName: "Sierpinski Triangle Shield",
    mandelbrotName: "Mandelbrot Set Fragment",
    kochName: "Koch Snowflake Barrier",
    complexityLabel: "Complexity",
    citadelGridTitle: "Citadel Defense Grid",
    citadelGridAlt: "Visualization of the Citadel under attack by data streams",
    deployButton: "Deploy Fractal Shield",
    deployingButton: "Deploying...",
    statusTitle: "System Status",
    statusInitial: "Awaiting fractal deployment orders.",
    statusDeployed: (fractalName: string, complexity: number) => `${fractalName} deployed! Shield strength: ${complexity * 10}. Data streams partially deflected.`,
    statusNoSelection: "Please select a fractal type before deploying.",
    completeQuestButton: "Complete Quest",
    toastQuestCompletedTitle: "Quest Completed!",
    toastQuestCompletedDescription: (points: number) => `You earned ${points} points for defending the Citadel!`,
    toastNoFractalTitle: "Deployment Error",
    toastNoFractalDescription: "No fractal selected. Cannot deploy empty shield.",
  },
  id: {
    questTitle: "Pertahanan Benteng Fraktal",
    questDescription: "Rancang dan terapkan pola fraktal untuk mempertahankan Citadel dari aliran data jahat. Semakin kompleks, semakin kuat perisai Anda!",
    zoneName: "Dunia Matematika",
    backToZone: "Kembali ke Dunia Matematika",
    designConsoleTitle: "Konsol Desain Fraktal",
    selectFractalLabel: "Pilih Jenis Fraktal:",
    sierpinskiName: "Perisai Segitiga Sierpinski",
    mandelbrotName: "Fragmen Set Mandelbrot",
    kochName: "Penghalang Kepingan Salju Koch",
    complexityLabel: "Kompleksitas",
    citadelGridTitle: "Kisi Pertahanan Citadel",
    citadelGridAlt: "Visualisasi Citadel diserang oleh aliran data",
    deployButton: "Terapkan Perisai Fraktal",
    deployingButton: "Menerapkan...",
    statusTitle: "Status Sistem",
    statusInitial: "Menunggu perintah penerapan fraktal.",
    statusDeployed: (fractalName: string, complexity: number) => `${fractalName} diterapkan! Kekuatan perisai: ${complexity * 10}. Aliran data sebagian dibelokkan.`,
    statusNoSelection: "Silakan pilih jenis fraktal sebelum menerapkan.",
    completeQuestButton: "Selesaikan Misi",
    toastQuestCompletedTitle: "Misi Selesai!",
    toastQuestCompletedDescription: (points: number) => `Anda mendapatkan ${points} poin karena mempertahankan Citadel!`,
    toastNoFractalTitle: "Kesalahan Penerapan",
    toastNoFractalDescription: "Tidak ada fraktal yang dipilih. Tidak dapat menerapkan perisai kosong.",
  }
};

export default function FractalFortressDefensePage() {
  const [selectedFractalId, setSelectedFractalId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string>('');
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
    setIsDeploying(true);
    const fractal = fractalTypes.find(f => f.id === selectedFractalId);
    setTimeout(() => {
      if (fractal) {
        const fractalName = t[fractal.nameKey as keyof typeof t] || fractal.nameKey;
        setSystemStatus(t.statusDeployed(fractalName, fractal.complexity));
      }
      setIsDeploying(false);
    }, 1500);
  };

  const handleCompleteQuest = () => {
    toast({
      title: t.toastQuestCompletedTitle,
      description: t.toastQuestCompletedDescription(questDetails.points),
    });
    // Here you would typically navigate away or update quest status
  };
  
  const currentFractalTypes = fractalTypes.map(ft => ({
    ...ft,
    name: t[ft.nameKey as keyof typeof t] || ft.nameKey,
  }));


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

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              {t.designConsoleTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-base">{t.selectFractalLabel}</Label>
            <RadioGroup
              value={selectedFractalId || ''}
              onValueChange={setSelectedFractalId}
              className="mt-2 space-y-3"
            >
              {currentFractalTypes.map((fractal) => (
                <div key={fractal.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={fractal.id} id={fractal.id} />
                  <Label htmlFor={fractal.id} className="flex-1 cursor-pointer">
                    <span className="block font-semibold">{fractal.name}</span>
                    <span className="text-xs text-muted-foreground">{t.complexityLabel}: {fractal.complexity}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDeploy} disabled={isDeploying || !selectedFractalId} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              {isDeploying ? t.deployingButton : t.deployButton}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
                {t.citadelGridTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Image
                src="https://placehold.co/600x300.png"
                alt={t.citadelGridAlt}
                width={600}
                height={300}
                className="rounded-md border bg-muted/30 mx-auto"
                data-ai-hint="cyber security abstract"
              />
              <p className="text-sm text-muted-foreground mt-2">{t.citadelGridAlt}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg">{t.statusTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center p-4 rounded-md ${systemStatus === t.statusInitial || systemStatus === t.statusNoSelection ? 'bg-muted' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
                {systemStatus}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" onClick={handleCompleteQuest} disabled={!selectedFractalId || systemStatus === t.statusInitial || systemStatus === t.statusNoSelection || isDeploying}>
          <CheckCircle className="mr-2 h-5 w-5" />
          {t.completeQuestButton}
        </Button>
      </div>
    </div>
  );
}

    