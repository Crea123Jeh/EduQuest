
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';
import { useState, useEffect } from 'react';

const pageTranslations = {
  en: {
    backButton: "Back to Classrooms",
    title: "Create Classroom",
    description: "This feature is currently under construction.",
    mainMessage: "We're working hard to bring you the ability to create and manage your own virtual classrooms. Stay tuned for updates!"
  },
  id: {
    backButton: "Kembali ke Ruang Kelas",
    title: "Buat Ruang Kelas",
    description: "Fitur ini sedang dalam pengembangan.",
    mainMessage: "Kami sedang bekerja keras untuk menghadirkan kemampuan bagi Anda untuk membuat dan mengelola ruang kelas virtual Anda sendiri. Nantikan pembaruan!"
  }
};

export default function CreateClassroomPage() {
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
        } catch (e) { console.error("Error reading lang for CreateClassroomPage", e); }
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
            <Link href="/classrooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.backButton}
            </Link>
          </Button>
          <Construction className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="font-headline text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t.mainMessage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
