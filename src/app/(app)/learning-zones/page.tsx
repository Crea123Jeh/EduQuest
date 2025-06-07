
'use client';

import { ZoneCard } from '@/components/ZoneCard';
import type { LearningZone } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const allLearningZones: LearningZone[] = [
  {
    id: 'history',
    name: 'History Zone: Time Travelers\' Guild',
    description: 'Navigate pivotal moments, from decoding ancient scrolls in Egypt to strategizing D-Day landings. Your choices shape the past!',
    iconKey: 'History',
    subject: 'History',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'history travel'
  },
  {
    id: 'math',
    name: 'Mathematics Realm: Number Ninjas\' Citadel',
    description: 'Master calculation and logic in a high-tech dojo. Solve numerical puzzles, duel equation-robots, and become a Number Ninja!',
    iconKey: 'Calculator',
    subject: 'Mathematics',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'math dojo'
  },
  {
    id: 'science',
    name: 'Science Lab: The Mad Scientist\'s Playground',
    description: 'Concoct potions, build contraptions, and reanimate creatures in this quirky lab. Expect the unexpected – it’s all a discovery!',
    iconKey: 'FlaskConical',
    subject: 'Science',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'science lab'
  },
  {
    id: 'geography',
    name: 'World Explorer: The Cartographer\'s Compass',
    description: 'Explore jungles, oceans, and mountains. Discover ancient ruins and document unique cultures. Adventure awaits!',
    iconKey: 'Globe',
    subject: 'Geography',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'map adventure'
  },
  {
    id: 'art',
    name: 'Art Studio: The Dream Weaver\'s Workshop',
    description: 'Sculpt digital mythical beasts, paint virtual murals, or animate epic tales. Your imagination is the only limit!',
    iconKey: 'Palette',
    subject: 'Art',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'art studio'
  },
  {
    id: 'music',
    name: 'Music Hall: The Maestro\'s Grand Stage',
    description: 'Compose hits, conduct virtual orchestras, or master exotic instruments. From symphonies to synth-scapes, the stage is yours!',
    iconKey: 'Music',
    subject: 'Music',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'music stage'
  },
  {
    id: 'languages',
    name: 'Language Hub: The Polyglot\'s Portal',
    description: 'Converse with historical figures, negotiate with alien diplomats, or decipher ancient texts. Master new tongues and unlock global secrets!',
    iconKey: 'Languages',
    subject: 'Languages',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'language portal'
  },
  {
    id: 'technology',
    name: 'Tech Hub: Future Innovators\' Command Center',
    description: 'Code AI assistants, design smart cities, or defend against cyber threats. The future is in your hands – build it, break it, and rebuild it better!',
    iconKey: 'Rocket',
    subject: 'Technology',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'tech code'
  },
   {
    id: 'physics',
    name: 'Physics Playground: Quantum Leap Lab',
    description: 'Defy gravity, bend light, and explore quantum mechanics. Conduct experiments that would make Einstein jealous (no black holes!).',
    iconKey: 'Atom',
    subject: 'Physics',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'physics quantum'
  },
   {
    id: 'psychology',
    name: 'Mind Maze: The Empathy Engine',
    description: 'Navigate social scenarios, understand diverse perspectives, and master emotional intelligence. Can you solve the human puzzle?',
    iconKey: 'BrainCog',
    subject: 'Psychology',
    image: 'https://placehold.co/400x250.png',
    aiHint: 'mind empathy'
  },
];

const pageTranslations = {
  en: {
    title: "Explore Learning Zones",
    description: "Dive into diverse subjects and embark on exciting educational adventures.",
    searchPlaceholder: "Search zones (e.g., History, Math...)"
  },
  id: {
    title: "Jelajahi Zona Belajar",
    description: "Selami berbagai mata pelajaran dan mulailah petualangan edukatif yang seru.",
    searchPlaceholder: "Cari zona (misalnya, Sejarah, Matematika...)"
  }
};

export default function LearningZonesPage() {
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
        } catch (e) { console.error("Error reading lang for LearningZonesPage", e); }
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

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold mb-2 text-foreground">{t.title}</h1>
        <p className="text-lg text-muted-foreground">{t.description}</p>
        <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder={t.searchPlaceholder} 
              className="pl-10"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allLearningZones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}

