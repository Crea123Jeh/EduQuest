
'use client';

import type { Classroom } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ClassroomCardProps {
  classroom: Classroom;
}

const cardTranslations = {
  en: {
    taughtBy: "Taught by",
    subject: "Subject",
    students: "Students",
    difficulty: "Difficulty",
    enterClassroom: "Enter Classroom",
    active: "Active",
    inactive: "Inactive",
  },
  id: {
    taughtBy: "Diajar oleh",
    subject: "Mata Pelajaran",
    students: "Siswa",
    difficulty: "Tingkat Kesulitan",
    enterClassroom: "Masuk Kelas",
    active: "Aktif",
    inactive: "Tidak Aktif",
  }
};

export function ClassroomCard({ classroom }: ClassroomCardProps) {
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
        } catch (e) { console.error("Error reading lang for ClassroomCard", e); }
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
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl">{classroom.name}</CardTitle>
          <Badge variant={classroom.active ? 'default' : 'secondary'} className={classroom.active ? 'bg-green-500 text-white' : ''}>
            {classroom.active ? t.active : t.inactive}
          </Badge>
        </div>
        <CardDescription>{t.taughtBy}: {classroom.teacher}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>{t.subject}: {classroom.subject}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{t.students}: {classroom.studentCount}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>{t.difficulty}: {classroom.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/classrooms/${classroom.id}`}> 
            {t.enterClassroom} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
