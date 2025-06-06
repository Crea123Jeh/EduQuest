
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn } from 'lucide-react';

const joinableClassrooms = [
  { id: 'c2', name: 'History Buffs Unite', code: 'HISTORY101' },
  { id: 'c4', name: 'Physics Explorers', code: 'PHYSICS202' },
  { id: 'c5', name: 'Mathletes Challenge', code: 'MATH303' },
];

const pageTranslations = {
  en: {
    backButton: "Back to Classrooms",
    title: "Join a Classroom",
    description: "Enter the unique code provided by your teacher to join their classroom.",
    classroomCodeLabel: "Classroom Code",
    classroomCodePlaceholder: "Enter code (e.g., HISTORY101)",
    joinButton: "Join Classroom",
    joiningButton: "Joining...",
    toastSuccessTitle: "Successfully Joined!",
    toastSuccessDescription: (name: string) => `You have joined "${name}".`,
    toastErrorTitle: "Error Joining Classroom",
    toastErrorDescription: "Invalid classroom code or classroom not found. Please try again."
  },
  id: {
    backButton: "Kembali ke Ruang Kelas",
    title: "Gabung Ruang Kelas",
    description: "Masukkan kode unik yang diberikan oleh guru Anda untuk bergabung dengan ruang kelas mereka.",
    classroomCodeLabel: "Kode Ruang Kelas",
    classroomCodePlaceholder: "Masukkan kode (misalnya, HISTORY101)",
    joinButton: "Gabung Ruang Kelas",
    joiningButton: "Bergabung...",
    toastSuccessTitle: "Berhasil Bergabung!",
    toastSuccessDescription: (name: string) => `Anda telah bergabung dengan "${name}".`,
    toastErrorTitle: "Gagal Bergabung dengan Ruang Kelas",
    toastErrorDescription: "Kode ruang kelas tidak valid atau ruang kelas tidak ditemukan. Silakan coba lagi."
  }
};

export default function JoinClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [classroomCode, setClassroomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        } catch (e) { console.error("Error reading lang for JoinClassroomPage", e); }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundClassroom = joinableClassrooms.find(c => c.code.toLowerCase() === classroomCode.trim().toLowerCase());

    if (foundClassroom) {
      toast({
        title: t.toastSuccessTitle,
        description: t.toastSuccessDescription(foundClassroom.name),
      });
      router.push('/classrooms');
    } else {
      toast({
        title: t.toastErrorTitle,
        description: t.toastErrorDescription,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <Button variant="outline" size="sm" className="mb-4 w-fit" asChild>
            <Link href="/classrooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.backButton}
            </Link>
          </Button>
          <CardTitle className="font-headline text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="classroomCode">{t.classroomCodeLabel}</Label>
              <Input
                id="classroomCode"
                type="text"
                placeholder={t.classroomCodePlaceholder}
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LogIn className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isLoading ? t.joiningButton : t.joinButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
