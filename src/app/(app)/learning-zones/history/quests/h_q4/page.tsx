
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, CheckCircle, Users, Eye, Lightbulb, ShieldQuestion } from 'lucide-react';

const questDetails = {
  id: 'h_q4',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'history',
  zoneNameKey: 'zoneName',
  type: 'Collaborative',
  difficulty: 'Hard',
  points: 210,
};

type QuestStep = 'intro' | 'reliefCipher' | 'pressurePlates' | 'karmawibhangga' | 'conclusion';

const pageTranslations = {
  en: {
    questTitle: "Borobudur Explorers: The Hidden Stupa",
    questDescription: "Embark on a collaborative expedition to uncover the secrets of Borobudur temple. Work with your team to decipher reliefs, solve ancient puzzles, and navigate the temple's intricate levels to find a legendary hidden stupa. Teamwork is crucial to overcome obstacles that require multiple explorers.",
    zoneName: "History Zone",
    backToZone: "Back to History Zone",
    // Intro
    introTitle: "The Expedition Begins",
    introText: "Your team of explorers stands before the majestic Borobudur. Legends speak of a hidden stupa containing profound wisdom. To find it, you must work together, combining your observations and insights. Communication and collaboration are your most valuable tools.",
    proceedToChallenge1: "Begin Deciphering the Reliefs",
    // Relief Cipher
    reliefCipherTitle: "Challenge 1: The Whispering Reliefs",
    reliefCipherScenario: "A vast, intricate relief stretches before you, depicting scenes from ancient Javanese life and Buddhist teachings. The first clue to the hidden stupa is encoded within. Your team must split up: One explorer focuses on the upper panels (detailing celestial beings), another on the lower panels (depicting earthly life). Both must find a matching symbol or repeated motif and describe it to the team.",
    reliefCipherAction: "Analyze Assigned Relief Section",
    reliefCipherSuccess: "Excellent observation! By combining insights from both upper and lower panels, your team spots a recurring lotus motif that only aligns when viewed from two perspectives. This reveals a hidden inscription: 'Follow the path of enlightenment upward.'",
    proceedToChallenge2: "Ascend to the Next Level",
    // Pressure Plates
    pressurePlatesTitle: "Challenge 2: The Guardians' Test",
    pressurePlatesScenario: "You enter a circular chamber. In the center, a heavy stone dais looks movable, but it's too heavy for one. Around the room are three distinct pressure plates, each bearing a different mudra (hand gesture). The inscription from the previous clue hints that 'Three minds in harmony unlock the way.' Your team must activate all three plates simultaneously.",
    pressurePlatesAction: "Coordinate Pressure Plate Activation",
    pressurePlatesSuccess: "Synchronized! As all three plates are pressed, the stone dais lowers, revealing a hidden staircase leading further up the temple.",
    proceedToChallenge3: "Continue the Ascent",
    // Karmawibhangga
    karmawibhanggaTitle: "Challenge 3: The Karmawibhangga's Lesson",
    karmawibhanggaScenario: "You arrive at the hidden base of Borobudur, revealing the Karmawibhangga reliefs, which depict the law of cause and effect. One panel shows a man committing a selfish act, leading to suffering, while another shows an act of compassion leading to peace. A nearby inscription asks: 'To find the true stupa, which path embodies the temple's highest teaching?' Your team must discuss and choose.",
    karmawibhanggaChoiceCompassion: "Path of Compassion & Shared Merit",
    karmawibhanggaChoiceSelf: "Path of Individual Attainment (Potentially Selfish)",
    karmawibhanggaSuccessCompassion: "Your team chose the Path of Compassion. The air shimmers, and a previously unseen passage opens towards the temple's peak. The spirits of Borobudur acknowledge your wisdom.",
    karmawibhanggaFailureSelf: "While individual effort is valued, the true essence of Borobudur's Mahayana teachings emphasizes universal liberation. This path leads to a dead end. Reconsider your approach as a team.",
    returnToKarmaChoice: "Re-evaluate the Karmawibhangga",
    proceedToConclusion: "Approach the Summit",
    // Conclusion
    conclusionTitle: "The Hidden Stupa Revealed!",
    conclusionText: "Through outstanding teamwork, insightful discussions, and a shared understanding of Borobudur's teachings, your team has reached the summit and discovered the legendary hidden stupa. Its serene presence fills you with a sense of peace and shared accomplishment. You've not only explored a temple but also the depths of collaborative problem-solving.",
    claimRewardButton: "Claim Your Reward & Reflect",
    toastRewardTitle: "Expedition Successful!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for discovering the Hidden Stupa of Borobudur!`,
    borobudurReliefImageAlt: "Intricate stone relief from Borobudur temple",
    borobudurPressurePlateImageAlt: "Chamber with pressure plates in Borobudur",
    borobudurKarmaImageAlt: "Karmawibhangga relief panel from Borobudur",
    borobudurStupaImageAlt: "The main stupa or a hidden stupa of Borobudur",
  },
  id: {
    questTitle: "Penjelajah Borobudur: Stupa Tersembunyi",
    questDescription: "Mulailah ekspedisi kolaboratif untuk mengungkap rahasia Candi Borobudur. Bekerja samalah dengan tim Anda untuk menguraikan relief, memecahkan teka-teki kuno, dan menavigasi tingkat candi yang rumit untuk menemukan stupa tersembunyi yang legendaris. Kerja tim sangat penting untuk mengatasi rintangan yang membutuhkan banyak penjelajah.",
    zoneName: "Zona Sejarah",
    backToZone: "Kembali ke Zona Sejarah",
    introTitle: "Ekspedisi Dimulai",
    introText: "Tim penjelajah Anda berdiri di depan Borobudur yang megah. Legenda berbicara tentang stupa tersembunyi yang berisi kebijaksanaan mendalam. Untuk menemukannya, Anda harus bekerja sama, menggabungkan pengamatan dan wawasan Anda. Komunikasi dan kolaborasi adalah alat Anda yang paling berharga.",
    proceedToChallenge1: "Mulai Menguraikan Relief",
    reliefCipherTitle: "Tantangan 1: Relief yang Berbisik",
    reliefCipherScenario: "Relief yang luas dan rumit terbentang di hadapan Anda, menggambarkan adegan dari kehidupan Jawa kuno dan ajaran Buddha. Petunjuk pertama menuju stupa tersembunyi dikodekan di dalamnya. Tim Anda harus berpisah: Satu penjelajah fokus pada panel atas (merinci makhluk surgawi), yang lain pada panel bawah (menggambarkan kehidupan duniawi). Keduanya harus menemukan simbol yang cocok atau motif berulang dan menjelaskannya kepada tim.",
    reliefCipherAction: "Analisis Bagian Relief yang Ditugaskan",
    reliefCipherSuccess: "Pengamatan yang luar biasa! Dengan menggabungkan wawasan dari panel atas dan bawah, tim Anda menemukan motif teratai berulang yang hanya selaras jika dilihat dari dua perspektif. Ini mengungkapkan prasasti tersembunyi: 'Ikuti jalan pencerahan ke atas.'",
    proceedToChallenge2: "Naik ke Tingkat Berikutnya",
    pressurePlatesTitle: "Tantangan 2: Ujian Para Penjaga",
    pressurePlatesScenario: "Anda memasuki sebuah ruangan melingkar. Di tengah, sebuah panggung batu besar terlihat bisa digerakkan, tetapi terlalu berat untuk satu orang. Di sekitar ruangan ada tiga pelat tekanan yang berbeda, masing-masing dengan mudra (sikap tangan) yang berbeda. Prasasti dari petunjuk sebelumnya mengisyaratkan bahwa 'Tiga pikiran dalam harmoni membuka jalan.' Tim Anda harus mengaktifkan ketiga pelat secara bersamaan.",
    pressurePlatesAction: "Koordinasikan Aktivasi Pelat Tekan",
    pressurePlatesSuccess: "Sinkron! Saat ketiga pelat ditekan, panggung batu itu turun, mengungkapkan tangga tersembunyi yang mengarah lebih jauh ke atas candi.",
    proceedToChallenge3: "Lanjutkan Pendakian",
    karmawibhanggaTitle: "Tantangan 3: Pelajaran Karmawibhangga",
    karmawibhanggaScenario: "Anda tiba di dasar tersembunyi Borobudur, mengungkapkan relief Karmawibhangga, yang menggambarkan hukum sebab akibat. Satu panel menunjukkan seorang pria melakukan tindakan egois, yang mengarah pada penderitaan, sementara panel lain menunjukkan tindakan kasih sayang yang mengarah pada kedamaian. Sebuah prasasti di dekatnya bertanya: 'Untuk menemukan stupa sejati, jalan mana yang mewujudkan ajaran tertinggi candi?' Tim Anda harus berdiskusi dan memilih.",
    karmawibhanggaChoiceCompassion: "Jalan Kasih Sayang & Pahala Bersama",
    karmawibhanggaChoiceSelf: "Jalan Pencapaian Individu (Potensi Egois)",
    karmawibhanggaSuccessCompassion: "Tim Anda memilih Jalan Kasih Sayang. Udara bergetar, dan sebuah lorong yang sebelumnya tak terlihat terbuka menuju puncak candi. Roh-roh Borobudur mengakui kebijaksanaan Anda.",
    karmawibhanggaFailureSelf: "Meskipun upaya individu dihargai, esensi sejati ajaran Mahayana Borobudur menekankan pembebasan universal. Jalan ini menuju jalan buntu. Pertimbangkan kembali pendekatan Anda sebagai sebuah tim.",
    returnToKarmaChoice: "Evaluasi Ulang Karmawibhangga",
    proceedToConclusion: "Dekati Puncak",
    conclusionTitle: "Stupa Tersembunyi Terungkap!",
    conclusionText: "Melalui kerja tim yang luar biasa, diskusi yang mendalam, dan pemahaman bersama tentang ajaran Borobudur, tim Anda telah mencapai puncak dan menemukan stupa tersembunyi yang legendaris. Kehadirannya yang tenang memenuhi Anda dengan rasa damai dan pencapaian bersama. Anda tidak hanya menjelajahi sebuah candi tetapi juga kedalaman pemecahan masalah kolaboratif.",
    claimRewardButton: "Klaim Hadiah & Renungkan",
    toastRewardTitle: "Ekspedisi Berhasil!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena menemukan Stupa Tersembunyi Borobudur!`,
    borobudurReliefImageAlt: "Relief batu rumit dari Candi Borobudur",
    borobudurPressurePlateImageAlt: "Ruangan dengan pelat tekan di Borobudur",
    borobudurKarmaImageAlt: "Panel relief Karmawibhangga dari Borobudur",
    borobudurStupaImageAlt: "Stupa utama atau stupa tersembunyi Borobudur",
  }
};

export default function BorobudurExplorersQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuestStep>('intro');

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
        } catch (e) { console.error("Error reading lang for BorobudurExplorersPage", e); }
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

  const handleAction = (nextStep: QuestStep, success?: boolean, karmaChoice?: 'compassion' | 'self') => {
    // In a real game, this would involve checking team actions or AI states
    if (currentStep === 'karmawibhangga' && karmaChoice) {
        if (karmaChoice === 'compassion') {
            setCurrentStep(nextStep); // success, proceed
        } else {
            // stay on karmawibhangga but show failure message, allow re-choice
            // This logic is simplified for now, direct proceed or specific handling.
             // For prototype, we'll just show "failure" and let them click "re-evaluate"
             // which effectively does nothing new but allows them to click the correct one.
             // A real game would have more state here.
             toast({ title: "Path Chosen", description: t.karmawibhanggaFailureSelf, variant: "destructive"});
             // No state change, user has to click the correct button or a "try again" button
        }
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
    // Potentially navigate or update quest status globally
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card>
            <CardHeader><CardTitle>{t.introTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurReliefImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur temple entrance" />
              <p>{t.introText}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('reliefCipher')} className="w-full">{t.proceedToChallenge1}</Button>
            </CardFooter>
          </Card>
        );
      case 'reliefCipher':
        return (
          <Card>
            <CardHeader><CardTitle>{t.reliefCipherTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurReliefImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur relief detail" />
              <p className="mb-2">{t.reliefCipherScenario}</p>
              <p className="text-sm text-muted-foreground">Simulated: Your team discusses findings...</p>
              <Button onClick={() => { /* Simulate individual action */ }} className="w-full mt-2" variant="outline">{t.reliefCipherAction}</Button>
              <p className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md text-green-700 dark:text-green-300">{t.reliefCipherSuccess}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('pressurePlates')} className="w-full">{t.proceedToChallenge2}</Button>
            </CardFooter>
          </Card>
        );
      case 'pressurePlates':
        return (
          <Card>
            <CardHeader><CardTitle>{t.pressurePlatesTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurPressurePlateImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="ancient puzzle chamber" />
              <p className="mb-2">{t.pressurePlatesScenario}</p>
              <p className="text-sm text-muted-foreground">Simulated: Your team plans their positions...</p>
              <Button onClick={() => { /* Simulate individual action */ }} className="w-full mt-2" variant="outline">{t.pressurePlatesAction}</Button>
               <p className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md text-green-700 dark:text-green-300">{t.pressurePlatesSuccess}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('karmawibhangga')} className="w-full">{t.proceedToChallenge3}</Button>
            </CardFooter>
          </Card>
        );
      case 'karmawibhangga':
        return (
          <Card>
            <CardHeader><CardTitle>{t.karmawibhanggaTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurKarmaImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur karma relief" />
              <p className="mb-4">{t.karmawibhanggaScenario}</p>
              <div className="space-y-2">
                <Button onClick={() => handleAction('conclusion', true, 'compassion')} className="w-full">{t.karmawibhanggaChoiceCompassion}</Button>
                <Button onClick={() => handleAction('karmawibhangga', false, 'self')} className="w-full" variant="outline">{t.karmawibhanggaChoiceSelf}</Button>
              </div>
            </CardContent>
            {/* Footer removed as choices lead to next step or feedback within content */}
          </Card>
        );
      case 'conclusion':
        return (
          <Card className="text-center">
            <CardHeader>
               <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <CardTitle className="text-2xl">{t.conclusionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurStupaImageAlt} width={600} height={350} className="rounded-md mb-4 mx-auto" data-ai-hint="borobudur main stupa" />
              <p>{t.conclusionText}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleClaimReward} className="w-full">{t.claimRewardButton}</Button>
            </CardFooter>
          </Card>
        );
      default:
        return <p>Unknown quest step.</p>;
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
            <Wand2 className="h-7 w-7 text-accent" /> {/* Generic quest icon */}
            <CardTitle className="font-headline text-3xl">{currentQuestDetails.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">{currentQuestDetails.description}</CardDescription>
          <div className="text-sm text-muted-foreground">
            {currentQuestDetails.zoneName} | {questDetails.points} Points | {questDetails.type} | {questDetails.difficulty}
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-2xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
}
