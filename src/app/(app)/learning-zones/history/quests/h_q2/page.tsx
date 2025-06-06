
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Compass, Package, CheckCircle, XCircle, RotateCcw, MapPinned, ShoppingCart, Wand2, Mountain, AlertTriangle } from 'lucide-react';

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

type QuestStage = 
  | 'intro' 
  | 'navigation' 
  | 'mountainPassHazard' 
  | 'trade' 
  | 'success_optimal' 
  | 'success_costly_pass' 
  | 'success_delayed_pass' 
  | 'failure_trade_desert' 
  | 'failure_trade_pass';

type NavigationChoice = 'north' | 'south' | null;
type MountainPassChoice = 'goatTrack' | 'clearRocks' | null;
type TradeChoice = 'accept' | 'decline' | null;

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
    navigationScenario: "Scouts report two viable routes ahead: The Northern Pass is shorter but rumored to have bandits and difficult terrain. The Southern Desert route is longer but currently reported as clear. Which path does the Navigator choose?",
    optionNorthPass: "Take the Northern Pass (Shorter, Riskier Terrain)",
    optionSouthDesert: "Take the Southern Desert (Longer, Safer)",
    // Mountain Pass Hazard Stage
    mountainPassHazardTitle: "The Mountain Pass Hazard",
    mountainPassHazardScenario: "The Northern Pass is treacherous! A recent rockslide has blocked the main path. Scouts report a narrow, risky goat track bypassing it, or you can spend precious time and resources clearing a portion of the rockslide.",
    optionGoatTrack: "Attempt Risky Goat Track (Faster, Risk of Loss)",
    optionClearRocks: "Spend Time Clearing Rocks (Slower, Resource Cost)",
    // Trade Stage
    tradeTitle: "The Merchant's Deal",
    tradeScenarioDefault: "Your caravan arrives at an oasis. A merchant offers fine porcelain for a significant portion of your remaining water. Your water is just adequate. What does the Merchant decide?",
    tradeScenarioAfterNorthPass: "After a challenging journey through the mountains, your weary caravan arrives at an oasis. A merchant offers fine porcelain for a significant portion of your remaining water. Your water is just adequate. What does the Merchant decide?",
    optionAcceptTrade: "Accept Trade (Gain Porcelain, Risk Water)",
    optionDeclineTrade: "Decline Trade (Conserve Water)",
    // Outcomes
    successOptimalTitle: "Journey Masterfully Completed!",
    successOptimalMessage: "Perfect strategy! The Southern Desert route was safe, and conserving water by declining the trade ensured your caravan arrived rich and well-supplied. The 'Collaboration Door' to prosperity is wide open!",
    successCostlyPassTitle: "Hard-Earned Success!",
    successCostlyPassMessage: "The Northern Pass was tough, and the goat track led to some minor losses, but your caravan persevered! Declining the trade at the oasis was wise. You've reached your destination.",
    successDelayedPassTitle: "Success After Delays!",
    successDelayedPassMessage: "Clearing the rockslide in the Northern Pass cost time and resources, but your caravan made it! Conserving water at the oasis was crucial. You've arrived, albeit a bit behind schedule.",
    failureTradeDesertTitle: "Misjudgment at the Oasis!",
    failureTradeDesertMessage: "The Southern Desert route was safe, but trading precious water for porcelain proved disastrous. The caravan ran out of water before the next stop. A harsh lesson in priorities.",
    failureTradePassTitle: "Double Jeopardy!",
    failureTradePassMessage: "The Northern Pass was already challenging. Trading away vital water at the oasis sealed your fate. The caravan is stranded, its resources depleted.",
    // Buttons
    claimRewardButton: "Claim Reward",
    tryAgainButton: "Try Again",
    toastRewardTitle: "Quest Completed!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for mastering the Silk Road!`,
    imageAltCaravan: "Stylized image of a Silk Road caravan",
    imageAltMap: "Ancient map with route choices",
    imageAltMountain: "Treacherous mountain pass with a rockslide",
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
    navigationScenario: "Pengintai melaporkan dua rute yang layak di depan: Jalur Utara lebih pendek tetapi dikabarkan ada bandit dan medan sulit. Rute Gurun Selatan lebih panjang tetapi saat ini dilaporkan aman. Jalur mana yang dipilih Navigator?",
    optionNorthPass: "Ambil Jalur Utara (Lebih Pendek, Medan Berisiko)",
    optionSouthDesert: "Ambil Gurun Selatan (Lebih Panjang, Lebih Aman)",
    mountainPassHazardTitle: "Bahaya Jalur Gunung",
    mountainPassHazardScenario: "Jalur Utara berbahaya! Longsoran batu baru-baru ini memblokir jalur utama. Pengintai melaporkan jalur kambing sempit yang berisiko untuk melewatinya, atau Anda dapat menghabiskan waktu dan sumber daya berharga untuk membersihkan sebagian longsoran.",
    optionGoatTrack: "Coba Jalur Kambing Berisiko (Lebih Cepat, Risiko Kehilangan)",
    optionClearRocks: "Habiskan Waktu Membersihkan Batu (Lebih Lambat, Biaya Sumber Daya)",
    tradeTitle: "Kesepakatan Sang Pedagang",
    tradeScenarioDefault: "Kafilah Anda tiba di sebuah oasis. Seorang pedagang menawarkan porselen halus dengan imbalan sebagian besar sisa air Anda. Persediaan air Anda cukup tetapi tidak berlimpah. Apa yang diputuskan oleh Pedagang?",
    tradeScenarioAfterNorthPass: "Setelah perjalanan yang menantang melalui pegunungan, kafilah Anda yang lelah tiba di sebuah oasis. Seorang pedagang menawarkan porselen halus dengan imbalan sebagian besar sisa air Anda. Persediaan air Anda cukup. Apa yang diputuskan oleh Pedagang?",
    optionAcceptTrade: "Terima Perdagangan (Dapatkan Porselen, Risiko Air)",
    optionDeclineTrade: "Tolak Perdagangan (Hemat Air)",
    successOptimalTitle: "Perjalanan Selesai dengan Sempurna!",
    successOptimalMessage: "Strategi sempurna! Rute Gurun Selatan aman, dan menghemat air dengan menolak perdagangan memastikan kafilah Anda tiba kaya dan dengan pasokan yang baik. 'Pintu Kolaborasi' menuju kemakmuran terbuka lebar!",
    successCostlyPassTitle: "Kesuksesan yang Diraih dengan Susah Payah!",
    successCostlyPassMessage: "Jalur Utara sulit, dan jalur kambing menyebabkan beberapa kerugian kecil, tetapi kafilah Anda bertahan! Menolak perdagangan di oasis adalah bijaksana. Anda telah mencapai tujuan Anda.",
    successDelayedPassTitle: "Sukses Setelah Penundaan!",
    successDelayedPassMessage: "Membersihkan longsoran di Jalur Utara memakan waktu dan sumber daya, tetapi kafilah Anda berhasil! Menghemat air di oasis sangat penting. Anda telah tiba, meskipun sedikit terlambat.",
    failureTradeDesertTitle: "Salah Perhitungan di Oasis!",
    failureTradeDesertMessage: "Rute Gurun Selatan aman, tetapi menukar air berharga dengan porselen terbukti membawa bencana. Kafilah kehabisan air sebelum perhentian berikutnya. Pelajaran pahit tentang prioritas.",
    failureTradePassTitle: "Bahaya Ganda!",
    failureTradePassMessage: "Jalur Utara sudah menantang. Menukar air vital di oasis menyegel nasib Anda. Kafilah terdampar, sumber dayanya habis.",
    claimRewardButton: "Klaim Hadiah",
    tryAgainButton: "Coba Lagi",
    toastRewardTitle: "Misi Selesai!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena menguasai Jalur Sutra!`,
    imageAltCaravan: "Gambar bergaya kafilah Jalur Sutra",
    imageAltMap: "Peta kuno dengan pilihan rute",
    imageAltMountain: "Jalur gunung berbahaya dengan longsoran batu",
    imageAltTrade: "Adegan perdagangan di oasis",
  }
};

export default function SilkRoadQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentStage, setCurrentStage] = useState<QuestStage>('intro');
  const [navigationChoice, setNavigationChoice] = useState<NavigationChoice>(null);
  const [mountainPassChoice, setMountainPassChoice] = useState<MountainPassChoice>(null);
  // tradeChoice could be added if it influenced more complex outcomes

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

  const handleNavigationChoice = (choice: NavigationChoice) => {
    setNavigationChoice(choice);
    if (choice === 'south') {
      setCurrentStage('trade');
    } else if (choice === 'north') {
      setCurrentStage('mountainPassHazard');
    }
  };
  
  const handleMountainPassChoice = (choice: MountainPassChoice) => {
    setMountainPassChoice(choice);
    setCurrentStage('trade'); 
  };

  const handleTradeChoice = (tradeDecision: TradeChoice) => {
    if (navigationChoice === 'south') {
      if (tradeDecision === 'decline') {
        setCurrentStage('success_optimal');
      } else {
        setCurrentStage('failure_trade_desert');
      }
    } else if (navigationChoice === 'north') {
      if (tradeDecision === 'decline') {
        if (mountainPassChoice === 'goatTrack') {
          setCurrentStage('success_costly_pass');
        } else { // clearRocks
          setCurrentStage('success_delayed_pass');
        }
      } else { // accept trade after north pass
        setCurrentStage('failure_trade_pass');
      }
    }
  };

  const handleRestart = () => {
    setCurrentStage('intro');
    setNavigationChoice(null);
    setMountainPassChoice(null);
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
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
      case 'mountainPassHazard':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mountain className="h-6 w-6 text-primary" /> {t.mountainPassHazardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Image src="https://placehold.co/600x300.png" alt={t.imageAltMountain} width={600} height={300} className="rounded-md mb-4" data-ai-hint="mountain rockslide path" />
              <p className="italic text-lg">{t.mountainPassHazardScenario}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleMountainPassChoice('goatTrack')}>{t.optionGoatTrack}</Button>
                <Button variant="outline" onClick={() => handleMountainPassChoice('clearRocks')}>{t.optionClearRocks}</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'trade':
        const tradeScenario = navigationChoice === 'north' ? t.tradeScenarioAfterNorthPass : t.tradeScenarioDefault;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-primary" /> {t.tradeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image src="https://placehold.co/600x300.png" alt={t.imageAltTrade} width={600} height={300} className="rounded-md mb-4" data-ai-hint="market oasis trade" />
              <p className="italic text-lg">{tradeScenario}</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleTradeChoice('accept')}>{t.optionAcceptTrade}</Button>
                <Button variant="outline" onClick={() => handleTradeChoice('decline')}>{t.optionDeclineTrade}</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'success_optimal':
      case 'success_costly_pass':
      case 'success_delayed_pass':
        let successTitle = t.successOptimalTitle;
        let successMessage = t.successOptimalMessage;
        if (currentStage === 'success_costly_pass') {
          successTitle = t.successCostlyPassTitle;
          successMessage = t.successCostlyPassMessage;
        } else if (currentStage === 'success_delayed_pass') {
          successTitle = t.successDelayedPassTitle;
          successMessage = t.successDelayedPassMessage;
        }
        return (
          <Card className="text-center bg-green-500/10 border-green-500/30">
            <CardHeader>
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <CardTitle className="text-2xl font-bold text-green-700">{successTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-green-600">{successMessage}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleClaimReward} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> {t.claimRewardButton}
              </Button>
            </CardFooter>
          </Card>
        );
      case 'failure_trade_desert':
      case 'failure_trade_pass':
        const failureTitleKey = currentStage === 'failure_trade_desert' ? 'failureTradeDesertTitle' : 'failureTradePassTitle';
        const failureMessageKey = currentStage === 'failure_trade_desert' ? 'failureTradeDesertMessage' : 'failureTradePassMessage';
        return (
          <Card className="text-center bg-destructive/10 border-destructive/30">
            <CardHeader>
              <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <CardTitle className="text-2xl font-bold text-destructive">{t[failureTitleKey as keyof typeof t]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-destructive">{t[failureMessageKey as keyof typeof t]}</p>
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

    
