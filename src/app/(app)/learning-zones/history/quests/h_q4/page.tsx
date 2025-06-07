
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, CheckCircle, Users, Eye, Lightbulb, ShieldQuestion, Flower, Tablet, HandHeart } from 'lucide-react';

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

type QuestStep = 'intro' | 'reliefCipher' | 'offeringChoice' | 'pressurePlates' | 'karmawibhangga' | 'conclusion';

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
    proceedToOfferingChoice: "Approach the Sacred Shrine", // New button text
    // Offering Choice (New Step)
    offeringChoiceTitle: "Challenge 1.5: The Shrine of Offerings",
    offeringChoiceScenario: "Following the inscription, your team discovers a small, serene shrine. Three items are presented as offerings. Your team may choose one to carry for guidance, or leave them undisturbed out of respect.",
    offeringChoiceLotus: "Take the Lotus Blossom (Wisdom & Purity)",
    offeringChoiceTablet: "Take the Stone Tablet (Guidance & Knowledge)",
    offeringChoiceLeave: "Leave Offerings Undisturbed (Respect Sanctity)",
    offeringFeedbackLotus: "You carefully take the Lotus Blossom. A sense of clarity and calm washes over your team.",
    offeringFeedbackTablet: "The Stone Tablet feels ancient and heavy with knowledge. Its inscriptions seem to shift subtly.",
    offeringFeedbackLeave: "Your team chooses to respect the sanctity of the shrine. A gentle breeze seems to approve.",
    proceedToChallenge2: "Continue the Ascent", // Shared button for next step
    // Pressure Plates
    pressurePlatesTitle: "Challenge 2: The Guardians' Test",
    pressurePlatesScenario: "You enter a circular chamber. In the center, a heavy stone dais looks movable, but it's too heavy for one. Around the room are three distinct pressure plates, each bearing a different mudra (hand gesture). The inscription from the previous clue hints that 'Three minds in harmony unlock the way.' Your team must activate all three plates simultaneously.",
    pressurePlatesAction: "Coordinate Pressure Plate Activation",
    pressurePlatesSuccess: "Synchronized! As all three plates are pressed, the stone dais lowers, revealing a hidden staircase leading further up the temple.",
    proceedToChallenge3: "Descend to the Hidden Base", // Text updated
    // Karmawibhangga
    karmawibhanggaTitle: "Challenge 3: The Karmawibhangga's Lesson",
    karmawibhanggaScenario: "You arrive at the hidden base of Borobudur, revealing the Karmawibhangga reliefs, which depict the law of cause and effect. One panel shows a man committing a selfish act, leading to suffering, while another shows an act of compassion leading to peace. A nearby inscription asks: 'To find the true stupa, which path embodies the temple's highest teaching?' Your team must discuss and choose.",
    karmawibhanggaChoiceCompassion: "Path of Compassion & Shared Merit",
    karmawibhanggaChoiceSelf: "Path of Individual Attainment",
    karmawibhanggaSuccessCompassion: "Your team chose the Path of Compassion. The air shimmers, and a previously unseen passage opens towards the temple's peak. The spirits of Borobudur acknowledge your wisdom.",
    karmawibhanggaFeedbackSelfPath: "Choosing this path, you find a secluded meditation spot with scriptures praising individual focus. While you gain personal insight, the path to the *hidden communal stupa* remains elusive. The inscriptions here suggest a different approach is needed for that greater discovery.",
    returnToKarmaChoice: "Re-evaluate the Karmawibhangga",
    proceedToConclusion: "Approach the Summit",
    // Conclusion
    conclusionTitle: "The Hidden Stupa Revealed!",
    conclusionText: "Through outstanding teamwork, insightful discussions, and a shared understanding of Borobudur's teachings, your team has reached the summit and discovered the legendary hidden stupa. Its serene presence fills you with a sense of peace and shared accomplishment. You've not only explored a temple but also the depths of collaborative problem-solving.",
    claimRewardButton: "Claim Your Reward & Reflect",
    toastRewardTitle: "Expedition Successful!",
    toastRewardDescription: (points: number) => `You've earned ${points} points for discovering the Hidden Stupa of Borobudur!`,
    borobudurReliefImageAlt: "Intricate stone relief from Borobudur temple",
    borobudurOfferingImageAlt: "Ancient shrine with offerings at Borobudur",
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
    proceedToOfferingChoice: "Dekati Kuil Suci",
    offeringChoiceTitle: "Tantangan 1.5: Kuil Persembahan",
    offeringChoiceScenario: "Mengikuti prasasti, tim Anda menemukan sebuah kuil kecil yang tenang. Tiga benda disajikan sebagai persembahan. Tim Anda dapat memilih satu untuk dibawa sebagai panduan, atau membiarkannya tidak terganggu sebagai tanda hormat.",
    offeringChoiceLotus: "Ambil Bunga Teratai (Kebijaksanaan & Kemurnian)",
    offeringChoiceTablet: "Ambil Lempeng Batu (Petunjuk & Pengetahuan)",
    offeringChoiceLeave: "Biarkan Persembahan Tidak Terganggu (Hormati Kesucian)",
    offeringFeedbackLotus: "Anda dengan hati-hati mengambil Bunga Teratai. Rasa kejernihan dan ketenangan meliputi tim Anda.",
    offeringFeedbackTablet: "Lempeng Batu terasa kuno dan berat dengan pengetahuan. Prasastinya tampak berubah secara halus.",
    offeringFeedbackLeave: "Tim Anda memilih untuk menghormati kesucian kuil. Angin sepoi-sepoi tampak menyetujuinya.",
    proceedToChallenge2: "Lanjutkan Pendakian",
    pressurePlatesTitle: "Tantangan 2: Ujian Para Penjaga",
    pressurePlatesScenario: "Anda memasuki sebuah ruangan melingkar. Di tengah, sebuah panggung batu besar terlihat bisa digerakkan, tetapi terlalu berat untuk satu orang. Di sekitar ruangan ada tiga pelat tekanan yang berbeda, masing-masing dengan mudra (sikap tangan) yang berbeda. Prasasti dari petunjuk sebelumnya mengisyaratkan bahwa 'Tiga pikiran dalam harmoni membuka jalan.' Tim Anda harus mengaktifkan ketiga pelat secara bersamaan.",
    pressurePlatesAction: "Koordinasikan Aktivasi Pelat Tekan",
    pressurePlatesSuccess: "Sinkron! Saat ketiga pelat ditekan, panggung batu itu turun, mengungkapkan tangga tersembunyi yang mengarah lebih jauh ke atas candi.",
    proceedToChallenge3: "Turun ke Dasar Tersembunyi",
    karmawibhanggaTitle: "Tantangan 3: Pelajaran Karmawibhangga",
    karmawibhanggaScenario: "Anda tiba di dasar tersembunyi Borobudur, mengungkapkan relief Karmawibhangga, yang menggambarkan hukum sebab akibat. Satu panel menunjukkan seorang pria melakukan tindakan egois, yang mengarah pada penderitaan, sementara panel lain menunjukkan tindakan kasih sayang yang mengarah pada kedamaian. Sebuah prasasti di dekatnya bertanya: 'Untuk menemukan stupa sejati, jalan mana yang mewujudkan ajaran tertinggi candi?' Tim Anda harus berdiskusi dan memilih.",
    karmawibhanggaChoiceCompassion: "Jalan Kasih Sayang & Pahala Bersama",
    karmawibhanggaChoiceSelf: "Jalan Pencapaian Individu",
    karmawibhanggaSuccessCompassion: "Tim Anda memilih Jalan Kasih Sayang. Udara bergetar, dan sebuah lorong yang sebelumnya tak terlihat terbuka menuju puncak candi. Roh-roh Borobudur mengakui kebijaksanaan Anda.",
    karmawibhanggaFeedbackSelfPath: "Memilih jalan ini, Anda menemukan tempat meditasi terpencil dengan kitab suci yang memuji fokus individu. Meskipun Anda mendapatkan wawasan pribadi, jalan menuju *stupa komunal tersembunyi* tetap sulit dipahami. Prasasti di sini menyarankan pendekatan yang berbeda diperlukan untuk penemuan yang lebih besar itu.",
    returnToKarmaChoice: "Evaluasi Ulang Karmawibhangga",
    proceedToConclusion: "Dekati Puncak",
    conclusionTitle: "Stupa Tersembunyi Terungkap!",
    conclusionText: "Melalui kerja tim yang luar biasa, diskusi yang mendalam, dan pemahaman bersama tentang ajaran Borobudur, tim Anda telah mencapai puncak dan menemukan stupa tersembunyi yang legendaris. Kehadirannya yang tenang memenuhi Anda dengan rasa damai dan pencapaian bersama. Anda tidak hanya menjelajahi sebuah candi tetapi juga kedalaman pemecahan masalah kolaboratif.",
    claimRewardButton: "Klaim Hadiah & Renungkan",
    toastRewardTitle: "Ekspedisi Berhasil!",
    toastRewardDescription: (points: number) => `Anda mendapatkan ${points} poin karena menemukan Stupa Tersembunyi Borobudur!`,
    borobudurReliefImageAlt: "Relief batu rumit dari Candi Borobudur",
    borobudurOfferingImageAlt: "Kuil kuno dengan persembahan di Borobudur",
    borobudurPressurePlateImageAlt: "Ruangan dengan pelat tekan di Borobudur",
    borobudurKarmaImageAlt: "Panel relief Karmawibhangga dari Borobudur",
    borobudurStupaImageAlt: "Stupa utama atau stupa tersembunyi Borobudur",
  }
};

export default function BorobudurExplorersQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuestStep>('intro');
  const [karmaChoiceMade, setKarmaChoiceMade] = useState<'compassion' | 'self' | null>(null);
  const [offeringChoiceFeedback, setOfferingChoiceFeedback] = useState<string>('');


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

  const handleAction = (nextStep: QuestStep, actionContext?: 'offering' | 'karma', choice?: 'lotus' | 'tablet' | 'leave' | 'compassion' | 'self') => {
    if (actionContext === 'offering') {
      if (choice === 'lotus') setOfferingChoiceFeedback(t.offeringFeedbackLotus);
      else if (choice === 'tablet') setOfferingChoiceFeedback(t.offeringFeedbackTablet);
      else if (choice === 'leave') setOfferingChoiceFeedback(t.offeringFeedbackLeave);
      // For offerings, we always proceed to the next main step after showing feedback.
      // The button to proceed will be enabled by the feedback being set.
      setCurrentStep(nextStep); // This is actually setting currentStep to 'offeringChoice' stage itself
                                // The actual advancement will be handled by a separate "Proceed" button in that stage.
                                // Let's adjust: handleAction from offering choice screen should lead to pressurePlates
    } else if (actionContext === 'karma') {
      if (choice === 'compassion') {
        setKarmaChoiceMade('compassion');
        setCurrentStep(nextStep); // This should be 'conclusion'
      } else if (choice === 'self') {
        setKarmaChoiceMade('self');
        // Stay on 'karmawibhangga' step to show specific feedback for 'self' path.
        // The user will then have to click the "Re-evaluate" button which resets karmaChoiceMade
        // or conceptually click the "Compassion" path button next.
        setCurrentStep('karmawibhangga'); // Stay on the same step, feedback will change
      }
    } else {
      setCurrentStep(nextStep);
    }
  };
  
  const handleOfferingProceed = () => {
    setCurrentStep('pressurePlates');
    setOfferingChoiceFeedback(''); // Clear feedback for next stage
  };

  const handleKarmaReevaluate = () => {
    setKarmaChoiceMade(null); // Allow making a new choice
  };


  const handleClaimReward = () => {
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card>
            <CardHeader><CardTitle>{t.introTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurReliefImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur temple entrance ancient" />
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
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurReliefImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur relief detail carving" />
              <p className="mb-2">{t.reliefCipherScenario}</p>
              <p className="text-sm text-muted-foreground">Simulated: Your team discusses findings...</p>
              <Button onClick={() => { /* Simulate individual action */ }} className="w-full mt-2" variant="outline">{t.reliefCipherAction}</Button>
              <p className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md text-green-700 dark:text-green-300">{t.reliefCipherSuccess}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAction('offeringChoice')} className="w-full">{t.proceedToOfferingChoice}</Button>
            </CardFooter>
          </Card>
        );
      case 'offeringChoice':
        return (
          <Card>
            <CardHeader><CardTitle>{t.offeringChoiceTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurOfferingImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="shrine offering temple" />
              <p className="mb-4">{t.offeringChoiceScenario}</p>
              <div className="space-y-2">
                <Button onClick={() => handleAction('offeringChoice', 'offering', 'lotus')} className="w-full flex items-center justify-start" variant="outline">
                  <Flower className="mr-2 h-5 w-5 text-pink-500" /> {t.offeringChoiceLotus}
                </Button>
                <Button onClick={() => handleAction('offeringChoice', 'offering', 'tablet')} className="w-full flex items-center justify-start" variant="outline">
                  <Tablet className="mr-2 h-5 w-5 text-gray-500" /> {t.offeringChoiceTablet}
                </Button>
                <Button onClick={() => handleAction('offeringChoice', 'offering', 'leave')} className="w-full flex items-center justify-start" variant="outline">
                  <HandHeart className="mr-2 h-5 w-5 text-green-500" /> {t.offeringChoiceLeave}
                </Button>
              </div>
              {offeringChoiceFeedback && (
                <p className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md text-blue-700 dark:text-blue-300">
                  {offeringChoiceFeedback}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleOfferingProceed} className="w-full" disabled={!offeringChoiceFeedback}>{t.proceedToChallenge2}</Button>
            </CardFooter>
          </Card>
        );
      case 'pressurePlates':
        return (
          <Card>
            <CardHeader><CardTitle>{t.pressurePlatesTitle}</CardTitle></CardHeader>
            <CardContent>
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurPressurePlateImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="ancient puzzle chamber floor" />
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
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurKarmaImageAlt} width={600} height={350} className="rounded-md mb-4" data-ai-hint="borobudur karma relief detail" />
              <p className="mb-4">{t.karmawibhanggaScenario}</p>
              {!karmaChoiceMade || karmaChoiceMade === 'self' ? (
                <div className="space-y-2">
                  <Button onClick={() => handleAction('conclusion', 'karma', 'compassion')} className="w-full" disabled={karmaChoiceMade === 'self'}>
                    {t.karmawibhanggaChoiceCompassion}
                  </Button>
                  <Button onClick={() => handleAction('karmawibhangga', 'karma', 'self')} className="w-full" variant="outline" disabled={karmaChoiceMade === 'self'}>
                    {t.karmawibhanggaChoiceSelf}
                  </Button>
                </div>
              ) : null}

              {karmaChoiceMade === 'compassion' && (
                 <p className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md text-green-700 dark:text-green-300">{t.karmawibhanggaSuccessCompassion}</p>
              )}
              {karmaChoiceMade === 'self' && (
                <>
                  <p className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300">{t.karmawibhanggaFeedbackSelfPath}</p>
                  <Button onClick={handleKarmaReevaluate} className="w-full mt-3" variant="link">{t.returnToKarmaChoice}</Button>
                </>
              )}
            </CardContent>
            {karmaChoiceMade === 'compassion' && (
                <CardFooter>
                    <Button onClick={() => handleAction('conclusion')} className="w-full">{t.proceedToConclusion}</Button>
                </CardFooter>
            )}
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
              <Image src="https://placehold.co/600x350.png" alt={t.borobudurStupaImageAlt} width={600} height={350} className="rounded-md mb-4 mx-auto" data-ai-hint="borobudur main stupa serene" />
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
        {renderStepContent()}
      </div>
    </div>
  );
}

