
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, Music, CheckCircle, Sparkles, Loader2, RotateCcw } from 'lucide-react';

const questDetails = {
  id: 'mu_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'music',
  zoneNameKey: 'zoneName',
  points: 180,
};

type MoodOption = 'serene' | 'majestic' | 'ethereal';
type ThemeOption = 'starlight' | 'galactic' | 'nebula';
type AmbienceOption = 'winds' | 'pulsars' | 'shimmers';
type EffectOption = 'fxComet' | 'fxAsteroid' | 'fxSolarFlare' | 'fxWormhole';

const MAX_EFFECTS = 2;

const pageTranslations = {
  en: {
    questTitle: "Symphony of the Stars",
    questDescription: "Compose an original piece of music inspired by the cosmos. Use unique sound effects to represent planets and nebulae.",
    zoneName: "Music Hall",
    backToZone: "Back to Music Hall",
    compositionConsoleTitle: "Cosmic Composition Console",
    moodLabel: "1. Choose Overall Mood/Tempo:",
    moodPlaceholder: "Select Mood",
    moodSerene: "Serene & Flowing",
    moodMajestic: "Majestic & Grand",
    moodEthereal: "Ethereal & Mysterious",
    themeLayerLabel: "2. Select Primary Theme Layer:",
    themeLayerPlaceholder: "Select Theme",
    themeStarlight: "Starlight Melody (Delicate, twinkling notes)",
    themeGalactic: "Galactic Bassline (Deep, resonant tones)",
    themeNebula: "Nebula Swells (Broad, evolving harmonies)",
    ambienceLayerLabel: "3. Select Secondary Ambience Layer:",
    ambienceLayerPlaceholder: "Select Ambience",
    ambienceWinds: "Cosmic Winds (Gentle, sweeping sounds)",
    ambiencePulsars: "Distant Pulsars (Rhythmic, subtle pulses)",
    ambienceShimmers: "Aurora Shimmers (Shimmering, high-frequency textures)",
    specialEffectsLabel: `4. Choose Special Effects (up to ${MAX_EFFECTS}):`,
    fxComet: "Comet Trail (Whooshing, sparkling decay)",
    fxAsteroid: "Asteroid Impact (Deep boom, rumbling)",
    fxSolarFlare: "Solar Flare (Rising, intense burst)",
    fxWormhole: "Wormhole Whoosh (Swirling, doppler effect)",
    composeButton: "Compose Symphony",
    composingButton: "Composing...",
    compositionResultTitle: "Symphony "Playbacked"",
    compositionFeedbackLabel: "Conductor's Notes:",
    feedbackSereneStarlightWindsComet: "A truly celestial and peaceful symphony! The Serene mood, twinkling Starlight Melody, and gentle Cosmic Winds, accented by a Comet's Trail, paint a beautiful picture of the tranquil cosmos.",
    feedbackMajesticGalacticPulsarsAsteroid: "A majestic masterpiece! The Grand mood, powerful Galactic Bassline, and rhythmic Distant Pulsars, dramatically punctuated by an Asteroid's Impact, evoke the raw power and awe of the universe.",
    feedbackEtherealNebulaShimmersWormhole: "An ethereal and mysterious journey through sound! The Ethereal mood, evolving Nebula Swells, and shimmering Aurora, combined with a Wormhole's Whoosh, transport the listener to the unknown depths of space.",
    feedbackGeneric: "Your cosmic symphony has a unique and imaginative sound! The combination of layers creates a vivid auditory experience of the universe. Well done, Maestro!",
    feedbackSelectAll: "Please select an option for Mood, Theme, Ambience, and at least one Special Effect to compose your symphony.",
    completeQuestButton: "Finalize Composition Report",
    restartCompositionButton: "Restart Composition",
    toastRewardTitle: "Composition Complete!",
    toastRewardDescription: (points: number) => `You earned ${points} points for your "Cosmic Symphony"!`,
    toastErrorTitle: "Composition Error",
  },
  id: {
    questTitle: "Simfoni Bintang-Bintang",
    questDescription: "Ciptakan karya musik orisinal yang terinspirasi oleh kosmos. Gunakan efek suara unik untuk merepresentasikan planet dan nebula.",
    zoneName: "Aula Musik",
    backToZone: "Kembali ke Aula Musik",
    compositionConsoleTitle: "Konsol Komposisi Kosmik",
    moodLabel: "1. Pilih Mood/Tempo Keseluruhan:",
    moodPlaceholder: "Pilih Mood",
    moodSerene: "Tenang & Mengalir",
    moodMajestic: "Megah & Agung",
    moodEthereal: "Halus & Misterius",
    themeLayerLabel: "2. Pilih Lapisan Tema Utama:",
    themeLayerPlaceholder: "Pilih Tema",
    themeStarlight: "Melodi Cahaya Bintang (Nada lembut, berkelap-kelip)",
    themeGalactic: "Bassline Galaksi (Nada dalam, bergema)",
    themeNebula: "Gelombang Nebula (Harmoni luas, berkembang)",
    ambienceLayerLabel: "3. Pilih Lapisan Suasana Sekunder:",
    ambienceLayerPlaceholder: "Pilih Suasana",
    ambienceWinds: "Angin Kosmik (Suara lembut, menyapu)",
    ambiencePulsars: "Pulsar Jauh (Berirama, denyut halus)",
    ambienceShimmers: "Kilau Aurora (Tekstur berkilau, frekuensi tinggi)",
    specialEffectsLabel: `4. Pilih Efek Khusus (hingga ${MAX_EFFECTS}):`,
    fxComet: "Jejak Komet (Desiran, kilau memudar)",
    fxAsteroid: "Hantaman Asteroid (Ledakan dalam, gemuruh)",
    fxSolarFlare: "Lidah Api Matahari (Meningkat, ledakan intens)",
    fxWormhole: "Desiran Lubang Cacing (Berputar, efek doppler)",
    composeButton: "Ciptakan Simfoni",
    composingButton: "Menciptakan...",
    compositionResultTitle: "Simfoni "Diputar"",
    compositionFeedbackLabel: "Catatan Konduktor:",
    feedbackSereneStarlightWindsComet: "Simfoni surgawi yang damai! Mood Tenang, Melodi Cahaya Bintang yang berkelap-kelip, dan Angin Kosmik yang lembut, dihiasi Jejak Komet, melukiskan gambaran indah kosmos yang tenteram.",
    feedbackMajesticGalacticPulsarsAsteroid: "Mahakarya yang megah! Mood Agung, Bassline Galaksi yang kuat, dan Pulsar Jauh yang berirama, secara dramatis diselingi oleh Hantaman Asteroid, membangkitkan kekuatan mentah dan kekaguman alam semesta.",
    feedbackEtherealNebulaShimmersWormhole: "Perjalanan suara yang halus dan misterius! Mood Halus, Gelombang Nebula yang berkembang, dan kilau Aurora, dikombinasikan dengan Desiran Lubang Cacing, membawa pendengar ke kedalaman ruang angkasa yang tidak diketahui.",
    feedbackGeneric: "Simfoni kosmik Anda memiliki suara yang unik dan imajinatif! Kombinasi lapisan menciptakan pengalaman pendengaran alam semesta yang jelas. Bagus sekali, Maestro!",
    feedbackSelectAll: "Silakan pilih opsi untuk Mood, Tema, Suasana, dan setidaknya satu Efek Khusus untuk membuat simfoni Anda.",
    completeQuestButton: "Finalisasi Laporan Komposisi",
    restartCompositionButton: "Ulangi Komposisi",
    toastRewardTitle: "Komposisi Selesai!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin untuk "Simfoni Kosmik" Anda!`,
    toastErrorTitle: "Kesalahan Komposisi",
  }
};

const effectOptions: { id: EffectOption; labelKey: keyof typeof pageTranslations.en }[] = [
  { id: 'fxComet', labelKey: 'fxComet' },
  { id: 'fxAsteroid', labelKey: 'fxAsteroid' },
  { id: 'fxSolarFlare', labelKey: 'fxSolarFlare' },
  { id: 'fxWormhole', labelKey: 'fxWormhole' },
];

export default function SymphonyOfTheStarsPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
  const [selectedAmbience, setSelectedAmbience] = useState<AmbienceOption | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<EffectOption[]>([]);
  
  const [isComposing, setIsComposing] = useState(false);
  const [compositionFeedback, setCompositionFeedback] = useState('');
  const [gameState, setGameState] = useState<'designing' | 'composed'>('designing');

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
        } catch (e) { console.error("Error reading lang for SymphonyQuest", e); }
      }
      setLang(newLangKey);
    };
    updateLang();
    if (typeof window !== 'undefined') {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'user-app-settings') updateLang();
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const t = pageTranslations[lang];
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };
  
  const handleEffectChange = (effectId: EffectOption, checked: boolean) => {
    setSelectedEffects(prev => {
      if (checked) {
        return prev.length < MAX_EFFECTS ? [...prev, effectId] : prev;
      } else {
        return prev.filter(id => id !== effectId);
      }
    });
  };

  const handleCompose = () => {
    if (!selectedMood || !selectedTheme || !selectedAmbience || selectedEffects.length === 0) {
      toast({
        title: t.toastErrorTitle,
        description: t.feedbackSelectAll,
        variant: 'destructive',
      });
      return;
    }

    setIsComposing(true);
    setCompositionFeedback('');

    setTimeout(() => {
      let feedbackKey: keyof typeof pageTranslations.en = 'feedbackGeneric';
      if (selectedMood === 'serene' && selectedTheme === 'starlight' && selectedAmbience === 'winds' && selectedEffects.includes('fxComet')) {
        feedbackKey = 'feedbackSereneStarlightWindsComet';
      } else if (selectedMood === 'majestic' && selectedTheme === 'galactic' && selectedAmbience === 'pulsars' && selectedEffects.includes('fxAsteroid')) {
        feedbackKey = 'feedbackMajesticGalacticPulsarsAsteroid';
      } else if (selectedMood === 'ethereal' && selectedTheme === 'nebula' && selectedAmbience === 'shimmers' && selectedEffects.includes('fxWormhole')) {
        feedbackKey = 'feedbackEtherealNebulaShimmersWormhole';
      }
      setCompositionFeedback(t[feedbackKey] || t.feedbackGeneric);
      setGameState('composed');
      setIsComposing(false);
    }, 1500);
  };

  const restartComposition = () => {
    setSelectedMood(null);
    setSelectedTheme(null);
    setSelectedAmbience(null);
    setSelectedEffects([]);
    setCompositionFeedback('');
    setGameState('designing');
  };

  const handleCompleteQuest = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
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

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              {t.compositionConsoleTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="moodSelect">{t.moodLabel}</Label>
              <Select value={selectedMood || ''} onValueChange={(v) => setSelectedMood(v as MoodOption)} disabled={gameState === 'composed'}>
                <SelectTrigger id="moodSelect"><SelectValue placeholder={t.moodPlaceholder} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="serene">{t.moodSerene}</SelectItem>
                  <SelectItem value="majestic">{t.moodMajestic}</SelectItem>
                  <SelectItem value="ethereal">{t.moodEthereal}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="themeSelect">{t.themeLayerLabel}</Label>
              <Select value={selectedTheme || ''} onValueChange={(v) => setSelectedTheme(v as ThemeOption)} disabled={gameState === 'composed'}>
                <SelectTrigger id="themeSelect"><SelectValue placeholder={t.themeLayerPlaceholder} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starlight">{t.themeStarlight}</SelectItem>
                  <SelectItem value="galactic">{t.themeGalactic}</SelectItem>
                  <SelectItem value="nebula">{t.themeNebula}</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="ambienceSelect">{t.ambienceLayerLabel}</Label>
              <Select value={selectedAmbience || ''} onValueChange={(v) => setSelectedAmbience(v as AmbienceOption)} disabled={gameState === 'composed'}>
                <SelectTrigger id="ambienceSelect"><SelectValue placeholder={t.ambienceLayerPlaceholder} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="winds">{t.ambienceWinds}</SelectItem>
                  <SelectItem value="pulsars">{t.ambiencePulsars}</SelectItem>
                  <SelectItem value="shimmers">{t.ambienceShimmers}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base font-semibold">{t.specialEffectsLabel}</Label>
              <div className="mt-2 space-y-2 grid grid-cols-2 gap-x-4 gap-y-2">
                {effectOptions.map(effect => (
                  <div key={effect.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={effect.id}
                      checked={selectedEffects.includes(effect.id)}
                      onCheckedChange={(checked) => handleEffectChange(effect.id, !!checked)}
                      disabled={gameState === 'composed' || (selectedEffects.length >= MAX_EFFECTS && !selectedEffects.includes(effect.id))}
                    />
                    <Label htmlFor={effect.id} className="text-sm font-normal cursor-pointer">
                      {t[effect.labelKey]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          {gameState === 'designing' && (
            <CardFooter>
              <Button onClick={handleCompose} className="w-full" disabled={isComposing}>
                {isComposing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isComposing ? t.composingButton : t.composeButton}
              </Button>
            </CardFooter>
          )}
        </Card>

        {gameState === 'composed' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                 <CheckCircle className="h-6 w-6 text-green-500" />
                {t.compositionResultTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="text-base font-semibold">{t.compositionFeedbackLabel}</Label>
              <p className="p-4 bg-muted/50 rounded-md border italic text-muted-foreground min-h-[100px]">{compositionFeedback}</p>
            </CardContent>
            <CardFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:justify-between">
              <Button onClick={restartComposition} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> {t.restartCompositionButton}
              </Button>
              <Button onClick={handleCompleteQuest}>
                <CheckCircle className="mr-2 h-4 w-4" /> {t.completeQuestButton}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

