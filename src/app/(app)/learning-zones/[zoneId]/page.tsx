
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LearningZone, Quest } from '@/types';
import { ArrowLeft, Users, Puzzle, Star, Zap, BookOpen, Atom, BrainCog, Rocket, Globe, Palette, Music, Languages, History, Calculator, FlaskConical, type LucideIcon } from 'lucide-react';
import { useState, useEffect, use } from 'react';

const iconMap: Record<string, LucideIcon> = {
  History,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
  Music,
  Languages,
  Rocket,
  Atom,
  BrainCog,
};

const MOCK_ZONES_DATA: Omit<LearningZone, 'iconKey'> & { iconKey: string }[] = [
  { 
    id: 'history', name: 'History Zone: Time Travelers\' Guild HQ', 
    description: 'Welcome, Time Agent! Your mission, should you choose to accept it, involves navigating pivotal moments in history. From decoding ancient scrolls in Egypt to strategizing D-Day landings, your choices will shape the past (or at least your grade!). Watch out for temporal paradoxes!', 
    iconKey: 'History', subject: 'History', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'ancient library time portal',
    quests: [
      { id: 'h_q1', title: 'The Pharaoh\'s Lost Scepter', description: 'Navigate booby-trapped pyramids and decipher hieroglyphs to find the legendary scepter before rival explorers!', zoneId: 'history', type: 'Individual', difficulty: 'Medium', points: 120 },
      { id: 'h_q2', title: 'Collaboration Door: Silk Road Caravan Masters', description: 'Team up to manage a perilous Silk Road journey. One navigates, the other trades. Success means riches, failure... bandits!', zoneId: 'history', type: 'Collaborative', difficulty: 'Medium', points: 180 },
      { id: 'h_q3', title: 'Ethical Dilemma: The Revolutionary\'s Choice', description: 'You\'ve uncovered a plot that could change a nation. Expose it and risk chaos, or stay silent and maintain order? The fate of many rests on your decision.', zoneId: 'history', type: 'Ethical Dilemma', difficulty: 'Hard', points: 100 },
    ]
  },
  { 
    id: 'math', name: 'Mathematics Realm: The Number Ninjas\' Citadel', 
    description: 'Master the art of calculation and logic in this high-tech dojo. Solve cryptic numerical puzzles, duel with equation-wielding robots, and prove your worth as a true Number Ninja. Only the sharpest minds will prevail!', 
    iconKey: 'Calculator', subject: 'Mathematics', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'futuristic dojo numbers',
    quests: [
      { id: 'm_q1', title: 'Fractal Fortress Defense', description: 'Design and deploy fractal patterns to defend the Citadel from rogue data streams. The more complex, the stronger your shield!', zoneId: 'math', type: 'Individual', difficulty: 'Hard', points: 200 },
      { id: 'm_q2', title: 'Broken Bridge: The Algorithm Assembly', description: 'Work together to repair a vital data bridge by correctly assembling algorithmic components. One wrong piece could corrupt the entire network!', zoneId: 'math', type: 'Collaborative', difficulty: 'Medium', points: 150 },
      { id: 'm_q3', title: 'The Infinite Labyrinth of Pi', description: 'Navigate a maze where each turn is decided by a digit of Pi. How far can you go before getting lost in infinity?', zoneId: 'math', type: 'Individual', difficulty: 'Hard', points: 170 },
    ]
  },
   { 
    id: 'science', name: 'Science Lab: The Mad Scientist\'s Playground', 
    description: 'Don your lab coat and goggles! Here, you\'ll concoct explosive potions (safely!), build bizarre contraptions, and maybe even reanimate a friendly creature or two. Expect the unexpected, and remember: it\'s not a mistake, it\'s a discovery!', 
    iconKey: 'FlaskConical', subject: 'Science', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'quirky science lab',
    quests: [
      { id: 's_q1', title: 'Creature Feature: Build-A-Beast', description: 'Combine DNA samples to design and nurture your own unique creature. Will it be cute, cuddly, or catastrophically chaotic?', zoneId: 'science', type: 'Individual', difficulty: 'Medium', points: 130 },
      { id: 's_q2', title: 'Eco-Challenge: Operation Biosphere Rescue', description: 'A miniature ecosystem is collapsing! Collaborate to identify pollutants, introduce helpful species, and restore balance before it\'s too late.', zoneId: 'science', type: 'Collaborative', difficulty: 'Hard', points: 190 },
      { id: 's_q3', title: 'Rocket Launch: To the Mun and Back!', description: 'Design, build, and launch a miniature rocket. Calculate trajectories and fuel consumption to land safely on the class "Mun".', zoneId: 'science', type: 'Individual', difficulty: 'Medium', points: 150 },
    ]
  },
  { 
    id: 'geography', name: 'World Explorer: The Cartographer\'s Compass HQ', 
    description: 'Grab your compass and map! Explore dense jungles, navigate vast oceans, and scale towering mountains. Discover ancient ruins and document unique cultures. Adventure awaits at every coordinate!', 
    iconKey: 'Globe', subject: 'Geography', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'explorer map jungle',
    quests: [
      { id: 'g_q1', title: 'The Lost City of El Dorado', description: 'Follow ancient clues to find the legendary city of gold. Beware of treacherous terrain and rival explorers!', zoneId: 'geography', type: 'Individual', difficulty: 'Hard', points: 200 },
    ]
  },
  { 
    id: 'art', name: 'Art Studio: The Dream Weaver\'s Workshop', 
    description: 'Your imagination is the only limit! Sculpt mythical beasts from digital clay, paint vibrant murals on virtual walls, or animate epic tales. Let your creativity flow and inspire the world!', 
    iconKey: 'Palette', subject: 'Art', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'fantasy art tools',
    quests: [
      { id: 'a_q1', title: 'Mural of Myths', description: 'Collaborate to create a massive digital mural depicting legendary creatures and epic battles.', zoneId: 'art', type: 'Collaborative', difficulty: 'Medium', points: 160 },
    ]
  },
  { 
    id: 'music', name: 'Music Hall: The Maestro\'s Grand Stage', 
    description: 'Compose chart-topping hits, conduct virtual orchestras, or master exotic instruments. From classical symphonies to futuristic synth-scapes, the stage is yours!', 
    iconKey: 'Music', subject: 'Music', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'futuristic music stage',
    quests: [
       { id: 'mu_q1', title: 'Symphony of the Stars', description: 'Compose an original piece of music inspired by the cosmos. Use unique sound effects to represent planets and nebulae.', zoneId: 'music', type: 'Individual', difficulty: 'Hard', points: 180 },
    ]
  },
  { 
    id: 'languages', name: 'Language Hub: The Polyglot\'s Portal Chamber', 
    description: 'Step through portals to converse with historical figures, negotiate with alien diplomats, or decipher ancient texts. Master new tongues and unlock global secrets!', 
    iconKey: 'Languages', subject: 'Languages', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'glowing language portal',
    quests: [
       { id: 'l_q1', title: 'The Rosetta Stone Riddle', description: 'Translate a series of cryptic messages in three different ancient languages to unlock a hidden treasure.', zoneId: 'languages', type: 'Individual', difficulty: 'Hard', points: 190 },
    ]
  },
  { 
    id: 'technology', name: 'Tech Hub: Future Innovators\' Command Center', 
    description: 'Code AI assistants, design smart cities, or defend against cyber threats in this high-tech sandbox. The future is in your hands – build it, break it, and rebuild it better!', 
    iconKey: 'Rocket', subject: 'Technology', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'holographic tech interface',
    quests: [
       { id: 't_q1', title: 'AI Uprising: Code Red', description: 'A rogue AI is causing chaos! Collaborate to debug its code and restore order before it takes over the network.', zoneId: 'technology', type: 'Collaborative', difficulty: 'Hard', points: 220 },
    ]
  },
  { 
    id: 'physics', name: 'Physics Playground: Quantum Leap Lab Complex', 
    description: 'Defy gravity, bend light, and explore the bizarre world of quantum mechanics. Conduct experiments that would make Einstein jealous, but try not to create any black holes in the classroom!', 
    iconKey: 'Atom', subject: 'Physics', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'anti gravity chamber',
    quests: [
       { id: 'p_q1', title: 'The Wormhole Wobble', description: 'Stabilize a miniature wormhole by correctly applying principles of general relativity. Get it wrong, and who knows where you\'ll end up!', zoneId: 'physics', type: 'Individual', difficulty: 'Hard', points: 210 },
    ]
  },
  { 
    id: 'psychology', name: 'Mind Maze: The Empathy Engine Labyrinth', 
    description: 'Navigate intricate social scenarios, understand diverse perspectives, and master the art of emotional intelligence. Can you solve the human puzzle?', 
    iconKey: 'BrainCog', subject: 'Psychology', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'surreal brain landscape',
    quests: [
       { id: 'ps_q1', title: 'The Empathy Test', description: 'Experience a day in someone else\'s shoes through an advanced simulation. Make choices that demonstrate understanding and compassion to pass.', zoneId: 'psychology', type: 'Individual', difficulty: 'Medium', points: 140 },
    ]
  },
];

const MOCK_ZONES: Record<string, LearningZone> = MOCK_ZONES_DATA.reduce((acc, zone) => {
  acc[zone.id] = zone;
  return acc;
}, {} as Record<string, LearningZone>);

const pageTranslations = {
  en: {
    backToZones: "Back to All Zones",
    questsInZone: "Quests in this Zone",
    startQuest: "Start Quest",
    noQuests: "No quests available in this zone yet. Our quest designers are hard at work!",
    suggestQuest: "Suggest a Quest!",
    zoneMechanics: "Zone Mechanics",
    collaborationDoors: "Collaboration Doors",
    collaborationDoorsDesc: "Two or more students must solve related puzzles or perform actions simultaneously to unlock the path forward. Communication is key!",
    brokenBridges: "Broken Bridges",
    brokenBridgesDesc: "The path is blocked! Team members might need to sacrifice points, share resources, or solve a collective mini-game for the group to cross.",
    mechanicsDescription: "Many quests in {zoneName} feature unique collaborative challenges like <span class=\"font-semibold text-accent\">Collaboration Doors</span> (requiring synchronized answers or actions) and <span class=\"font-semibold text-accent\">Broken Bridges</span> (demanding teamwork, resource sharing, or even point sacrifices for the greater good). These are designed to foster empathy, communication, and collective problem-solving."
  },
  id: {
    backToZones: "Kembali ke Semua Zona",
    questsInZone: "Misi di Zona Ini",
    startQuest: "Mulai Misi",
    noQuests: "Belum ada misi yang tersedia di zona ini. Desainer misi kami sedang bekerja keras!",
    suggestQuest: "Sarankan Misi!",
    zoneMechanics: "Mekanika Zona",
    collaborationDoors: "Pintu Kolaborasi",
    collaborationDoorsDesc: "Dua siswa atau lebih harus memecahkan teka-teki terkait atau melakukan tindakan secara bersamaan untuk membuka jalan ke depan. Komunikasi adalah kunci!",
    brokenBridges: "Jembatan Rusak",
    brokenBridgesDesc: "Jalan terhalang! Anggota tim mungkin perlu mengorbankan poin, berbagi sumber daya, atau menyelesaikan mini-game kolektif agar grup dapat menyeberang.",
    mechanicsDescription: "Banyak misi di {zoneName} menampilkan tantangan kolaboratif unik seperti <span class=\"font-semibold text-accent\">Pintu Kolaborasi</span> (membutuhkan jawaban atau tindakan yang disinkronkan) dan <span class=\"font-semibold text-accent\">Jembatan Rusak</span> (menuntut kerja sama tim, berbagi sumber daya, atau bahkan pengorbanan poin untuk kebaikan yang lebih besar). Ini dirancang untuk menumbuhkan empati, komunikasi, dan pemecahan masalah kolektif."
  }
};

export default function LearningZoneDetailPage({ params }: { params: { zoneId: string } }) {
  const resolvedParams = use(params);
  const zone = MOCK_ZONES[resolvedParams.zoneId] || MOCK_ZONES['history']; // Fallback to history if not found
  const IconComponent = zone.iconKey ? iconMap[zone.iconKey] : null;
  const [lang, setLang] = useState<'en' | 'id'>('en');

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
        } catch (e) { console.error("Error reading lang for LearningZoneDetailPage", e); }
      }
      setLang(newLang);
    };

    updateLang();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') {
        updateLang();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];
  // For dynamic text in mechanicsDescription
  const mechanicsDescHtml = t.mechanicsDescription.replace('{zoneName}', zone.name);


  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/learning-zones">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToZones}
        </Link>
      </Button>

      <div className="relative mb-8 overflow-hidden rounded-lg shadow-xl">
        <Image
          src={zone.image}
          alt={zone.name}
          width={1200}
          height={400}
          className="w-full h-64 md:h-96 object-cover"
          data-ai-hint={zone.aiHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          {IconComponent && <IconComponent className="h-12 w-12 text-white mb-2" />}
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-white">{zone.name}</h1>
          <p className="text-lg text-gray-200 mt-1 max-w-3xl">{zone.description}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Puzzle className="mr-3 h-7 w-7 text-accent" />
          {t.questsInZone}
        </h2>
        {zone.quests && zone.quests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zone.quests.map((quest) => (
              <Card key={quest.id} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 rounded-lg">
                <CardHeader>
                  <CardTitle>{quest.title}</CardTitle>
                  <CardDescription className="h-12 line-clamp-2">{quest.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant={quest.type === 'Collaborative' ? 'default' : 'secondary'} className={`${quest.type === 'Collaborative' ? 'bg-accent text-accent-foreground' : ''}`}>{quest.type}</Badge>
                    <Badge variant="outline">{quest.difficulty}</Badge>
                  </div>
                  <p><Star className="inline mr-1 h-4 w-4 text-yellow-400" /> {quest.points} Points</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/learning-zones/${zone.id}/quests/${quest.id}`}>
                      {t.startQuest} <Zap className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
                 <Puzzle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.noQuests}</p>
                 <Button asChild variant="outline" className="mt-4">
                    <Link href="/quests">{t.suggestQuest}</Link>
                 </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Users className="mr-3 h-7 w-7 text-accent" />
          {t.zoneMechanics}
        </h2>
        <Card className="shadow-md rounded-lg">
          <CardContent className="pt-6">
            <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: mechanicsDescHtml }} />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 border rounded-lg bg-card shadow-sm">
                    <Users className="h-8 w-8 text-primary mr-3 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-card-foreground">{t.collaborationDoors}</h4>
                        <p className="text-sm text-muted-foreground">{t.collaborationDoorsDesc}</p>
                    </div>
                </div>
                 <div className="flex items-start p-4 border rounded-lg bg-card shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary mr-3 mt-1 shrink-0"><path d="M5 12q0-1.5 1.063-2.562T8.625 8H5V6h3.625q.938 0 1.703.531t1.109 1.391L12 10l.562-2.078c.344-.86.82-1.39 1.703-1.39H20v2h-3.625q-1.5 0-2.562 1.063T12.75 12H19v2h-6.25q0 1.5-1.062 2.563T8.625 17.625H5v-2h3.625q1.5 0 2.563-1.062T12.25 12H5zM2 8l1-2m18 2l1-2m-1 14l1 2M2 18l1 2"/></svg>
                    <div>
                        <h4 className="font-semibold text-card-foreground">{t.brokenBridges}</h4>
                        <p className="text-sm text-muted-foreground">{t.brokenBridgesDesc}</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

    