
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';
import { useState, useEffect } from 'react';

const pageTranslations = {
  en: {
    backButton: "Back to Design Studio",
    title: "Create New Design",
    description: "This is where your creative journey begins!",
    mainMessage1: "This section is currently under construction. Imagine a powerful design canvas here, equipped with all the tools you need to bring your project ideas to life.",
    mainMessage2: "You'd be able to select templates, draw, add text, import assets, and collaborate with teammates. Stay tuned for updates!"
  },
  id: {
    backButton: "Kembali ke Studio Desain",
    title: "Buat Desain Baru",
    description: "Di sinilah perjalanan kreatif Anda dimulai!",
    mainMessage1: "Bagian ini sedang dalam pengembangan. Bayangkan kanvas desain yang kuat di sini, dilengkapi dengan semua alat yang Anda butuhkan untuk mewujudkan ide proyek Anda.",
    mainMessage2: "Anda akan dapat memilih templat, menggambar, menambahkan teks, mengimpor aset, dan berkolaborasi dengan rekan tim. Nantikan pembaruan!"
  }
};

export default function NewDesignPage() {
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
        } catch (e) { console.error("Error reading lang for NewDesignPage", e); }
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
    <div className="container mx-auto py-8 px-4 md:px-0 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
           <Button variant="outline" size="sm" className="mb-4 w-fit mx-auto sm:mx-0" asChild>
            <Link href="/design-studio">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.backButton}
            </Link>
          </Button>
          <Construction className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="font-headline text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t.mainMessage1}
          </p>
          <p className="text-muted-foreground mt-4">
            {t.mainMessage2}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
