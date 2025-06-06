
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Compass, Package, CheckCircle, XCircle, RotateCcw, MapPinned, ShoppingCart, Wand2 } from 'lucide-react';

const questDetails = {
  id: 'h_q2',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  type: 'Collaborative',
  difficulty: 'Medium',
  points: 180,
};

type QuestStage = 'intro' | 'navigation' | 'trade' | 'success' | 'failure_navigation' | 'failure_trade';

const pageTranslations = {
  en: {
    questTitle: "Silk Road: Caravan Masters",
    questDescription: "As co-leaders of a Silk Road caravan, make crucial navigation and trade decisions. Both must succeed to prosper!",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    // Intro
    introTitle: "The Journey Begins",
    introText: "You and your partner are entrusted with a valuable caravan traveling the treacherous Silk Road. Your combined wisdom in navigation and trade will determine your fate. First, the Navigator must choose the path...",
    proceedButton: "Understand the Roles",
    // Navigation Stage
    navigationTitle: "The Navigator's Choice",
    navigationScenario: "Scouts report two viable routes ahead: The Northern Pass is shorter but rumored to have bandits. The Southern Desert route is longer but currently reported as clear. Which path does the Navigator choose?",
    optionNorthPass: "Take the Northern Pass (Shorter, Risky)",
    optionSouthDesert: "Take the Southern Desert (Longer, Safer)",
    // Trade Stage
    tradeTitle: "The Merchant's Deal",
    tradeScenario: "Having chosen the path, your caravan arrives at an oasis. A merchant offers fine porcelain for a significant portion of your remaining water. Your water is just adequate. What does the Merchant decide?",
    optionAcceptTrade: "Accept Trade (Gain Porcelain, Risk Water)",
    optionDeclineTrade: "Decline Trade (Conserve Water)",
    // Outcomes
    successTitle: "Journey Successful!",
    successMessage: "Excellent teamwork! Your wise navigation and shrewd trading have led the caravan to its destination safely and profitably. The 'Collaboration Door' to further opportunities is open!",
    failureNavigationTitle: "Navigation Error!",
    failureNavigationMessage: "The chosen path proved too perilous! The caravan suffered losses and delays. The journey cannot continue under these conditions.",
    failureTradeTitle: "Trade Misstep!",
    failureTradeMessage: "The trade decision left the caravan vulnerable. Essential supplies ran critically low before reaching the next major stop. The journey is compromised.",
    // Buttons
    claimRewardButton: "Claim Reward",
    tryAgainButton: "Try Again",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for mastering the Silk Road!`,
    imageAltCaravan: "Stylized image of a Silk Road caravan",
    imageAltMap: "Ancient map with route choices",
    imageAltTrade: "Oasis trade scene",
  },
  id: {
    questTitle: "Jalur Sutra: Master Kafilah",
    questDescription: "Sebagai salah satu pemimpin kafilah Jalur Sutra, buat keputusan navigasi dan perdagangan yang penting. Keduanya harus berhasil untuk makmur!",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    introTitle: "Perjalanan Dimulai",
    introText: "Anda dan rekan Anda dipercayakan dengan kafilah berharga yang melakukan perjalanan di Jalur Sutra yang berbahaya. Gabungan kebijaksanaan Anda dalam navigasi dan perdagangan akan menentukan nasib Anda. Pertama, Navigator harus memilih jalur...",
    proceedButton: "Pahami Peran",
    navigationTitle: "Pilihan Sang Navigator",
    navigationScenario: "Pengintai melaporkan dua rute yang layak di depan: Jalur Utara lebih pendek tetapi dikabarkan ada bandit. Rute Gurun Selatan lebih panjang tetapi saat ini dilaporkan aman. Jalur mana yang dipilih Navigator?",
    optionNorthPass: "Ambil Jalur Utara (Lebih Pendek, Berisiko)",
    optionSouthDesert: "Ambil Gurun Selatan (Lebih Panjang, Lebih Aman)",
    tradeTitle: "Kesepakatan Sang Pedagang",
    tradeScenario: "Setelah memilih jalur, kafilah Anda tiba di sebuah oasis. Seorang pedagang menawarkan porselen halus dengan imbalan sebagian besar sisa air Anda. Persediaan air Anda cukup tetapi tidak berlimpah. Apa yang diputuskan oleh Pedagang?",
    optionAcceptTrade: "Terima Perdagangan (Dapatkan Porselen, Risiko Air)",
    optionDeclineTrade: "Tolak Perdagangan (Hemat Air)",
    successTitle: "Perjalanan Sukses!",
    successMessage: "Kerja tim yang luar biasa! Navigasi bijak dan perdagangan cerdik Anda telah membawa kafilah ke tujuannya dengan aman dan menguntungkan. 'Pintu Kolaborasi' menuju peluang lebih lanjut terbuka!",
    failureNavigationTitle: "Kesalahan Navigasi!",
    failureNavigationMessage: "Jalur yang dipilih terbukti terlalu berbahaya! Kafilah menderita kerugian dan penundaan. Perjalanan tidak dapat dilanjutkan dalam kondisi ini.",
    failureTradeTitle: "Langkah Perdagangan Salah!",
    failureTradeMessage: "Keputusan perdagangan membuat kafilah rentan. Persediaan penting menipis secara kritis sebelum mencapai perhentian besar berikutnya. Perjalanan terganggu.",
    claimRewardButton: "Klaim Hadiah",
    tryAgainButton: "Coba Lagi",
    toastRewardTitle: "Misi Selesai!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena menguasai Jalur Sutra!`,
    imageAltCaravan: "Gambar bergaya kafilah Jalur Sutra",
    imageAltMap: "Peta kuno dengan pilihan rute",
    imageAltTrade: "Adegan perdagangan di oasis",
  }
};

export default function SilkRoadQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentStage, setCurrentStage] = useState<QuestStage>('intro');
  const [navigationChoice, setNavigationChoice] = useState<string | null>(null);
  // tradeChoice could be added if needed for more complex logic

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
        } catch (e) { console.error("Error reading lang for SilkRoadQuestPage", e); }
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

  const handleNavigationChoice = (choice: 'north' | 'south') => {
    setNavigationChoice(choice);
    if (choice === 'south') { // "Correct" navigation choice
      setCurrentStage('trade');
    } else {
      setCurrentStage('failure_navigation');
    }
  };

  const handleTradeChoice = (choice: 'accept' | 'decline') => {
    // setTradeChoice(choice); // if needed later
    if (choice === 'decline') { // "Correct" trade choice
      setCurrentStage('success');
    } else {
      setCurrentStage('failure_trade');
    }
  };

  const handleRestart = () => {
    setCurrentStage('intro');
    setNavigationChoice(null);
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
    // Potentially navigate away or mark quest as completed globally
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 'intro':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Compass className="h-6 w-6 text-primary" /> {t.introTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x300.png" alt={t.imageAltCaravan} width={600} height={300} className="rounded-md mb-4" data-ai-hint="silk road caravan desert" />
              <p className="text-muted-foreground">{t.introText}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setCurrentStage('navigation')} className="w-full">{t.proceedButton}</Button>
            </CardFooter>
          </Card>
        );
      case 'navigation':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPinned className="h-6 w-6 text-primary" /> {t.navigationTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image src="https://placehold.co/600x300.png" alt={t.imageAltMap} width={600} height={300} className="rounded-md mb-4" data-ai-hint="ancient map routes" />
              <p className="italic text-lg">{t.navigationScenario}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleNavigationChoice('north')}>{t.optionNorthPass}</Button>
                <Button variant="outline" onClick={() => handleNavigationChoice('south')}>{t.optionSouthDesert}</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'trade':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-primary" /> {t.tradeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image src="https://placehold.co/600x300.png" alt={t.imageAltTrade} width={600} height={300} className="rounded-md mb-4" data-ai-hint="market oasis trade" />
              <p className="italic text-lg">{t.tradeScenario}</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleTradeChoice('accept')}>{t.optionAcceptTrade}</Button>
                <Button variant="outline" onClick={() => handleTradeChoice('decline')}>{t.optionDeclineTrade}</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'success':
        return (
          <Card className="text-center bg-green-500/10 border-green-500/30">
            <CardHeader>
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <CardTitle className="text-2xl font-bold text-green-700">{t.successTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-green-600">{t.successMessage}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleClaimReward} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> {t.claimRewardButton}
              </Button>
            </CardFooter>
          </Card>
        );
      case 'failure_navigation':
      case 'failure_trade':
        const titleKey = currentStage === 'failure_navigation' ? 'failureNavigationTitle' : 'failureTradeTitle';
        const messageKey = currentStage === 'failure_navigation' ? 'failureNavigationMessage' : 'failureTradeMessage';
        return (
          <Card className="text-center bg-destructive/10 border-destructive/30">
            <CardHeader>
              <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <CardTitle className="text-2xl font-bold text-destructive">{t[titleKey as keyof typeof t]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-destructive">{t[messageKey as keyof typeof t]}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRestart} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" /> {t.tryAgainButton}
              </Button>
            </CardFooter>
          </Card>
        );
      default:
        return <p>Error: Unknown quest stage.</p>;
    }
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

      <div className="max-w-2xl mx-auto">
        {renderStageContent()}
      </div>
    </div>
  );
}

    