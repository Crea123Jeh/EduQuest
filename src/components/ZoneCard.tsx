
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LearningZone } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, History, Calculator, FlaskConical, Globe, Palette, Music, Languages, Rocket, Atom, BrainCog, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ZoneCardProps {
  zone: LearningZone;
}

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

const cardTranslations = {
  en: {
    exploreZone: "Explore Zone",
  },
  id: {
    exploreZone: "Jelajahi Zona",
  }
};

export function ZoneCard({ zone }: ZoneCardProps) {
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
        } catch (e) { console.error("Error reading lang for ZoneCard", e); }
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

  const t = cardTranslations[lang];

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 overflow-hidden rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          {IconComponent && <IconComponent className="h-7 w-7 text-accent" />}
          <CardTitle className="font-headline text-xl">{zone.name}</CardTitle>
        </div>
        <CardDescription className="text-sm h-10 line-clamp-2">{zone.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Image
          src={zone.image}
          alt={zone.name}
          width={400}
          height={250}
          className="w-full h-40 object-cover rounded-md mb-3"
          data-ai-hint={zone.aiHint}
        />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/learning-zones/${zone.id}`}>
            {t.exploreZone} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
