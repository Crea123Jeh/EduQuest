
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClassroomCard } from '@/components/ClassroomCard';
import type { Classroom } from '@/types';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';

const myClassrooms: Classroom[] = [
  { id: 'c1', name: 'Grade 5 Adventure', teacher: 'Ms. Lovelace', subject: 'Interdisciplinary', studentCount: 25, difficulty: 'Medium', active: true },
  { id: 'c3', name: 'Creative Coders Club', teacher: 'Mr. Turing', subject: 'Computer Science', studentCount: 15, difficulty: 'Medium', active: true },
];

const availableClassrooms: Classroom[] = [
  { id: 'c2', name: 'History Buffs Unite', teacher: 'Mr. Herodotus', subject: 'History', studentCount: 18, difficulty: 'Hard', active: false },
  { id: 'c4', name: 'Physics Explorers', teacher: 'Dr. Curie', subject: 'Science', studentCount: 22, difficulty: 'Medium', active: true },
  { id: 'c5', name: 'Mathletes Challenge', teacher: 'Prof. Euler', subject: 'Mathematics', studentCount: 30, difficulty: 'Hard', active: true },
];

const pageTranslations = {
  en: {
    title: "Virtual Classrooms",
    description: "Manage your classes or join new ones to learn collaboratively.",
    joinClassroom: "Join Classroom",
    createClassroom: "Create Classroom",
    searchPlaceholder: "Search classrooms...",
    myClassroomsTab: "My Classrooms",
    availableClassroomsTab: "Available to Join",
    noMyClassrooms: "You haven't joined or created any classrooms yet.",
    noAvailableClassrooms: "No classrooms available to join currently. Check back later!"
  },
  id: {
    title: "Ruang Kelas Virtual",
    description: "Kelola kelas Anda atau bergabunglah dengan kelas baru untuk belajar secara kolaboratif.",
    joinClassroom: "Gabung Kelas",
    createClassroom: "Buat Kelas",
    searchPlaceholder: "Cari ruang kelas...",
    myClassroomsTab: "Ruang Kelas Saya",
    availableClassroomsTab: "Tersedia untuk Digabung",
    noMyClassrooms: "Anda belum bergabung atau membuat ruang kelas apa pun.",
    noAvailableClassrooms: "Tidak ada ruang kelas yang tersedia untuk digabung saat ini. Periksa kembali nanti!"
  }
};

export default function ClassroomsPage() {
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
        } catch (e) { console.error("Error reading lang for ClassroomsPage", e); }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-lg text-muted-foreground">{t.description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/classrooms/join">{t.joinClassroom}</Link>
          </Button>
          <Button asChild>
            <Link href="/classrooms/create"><PlusCircle className="mr-2 h-4 w-4" /> {t.createClassroom}</Link>
          </Button>
        </div>
      </div>
      
      <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder={t.searchPlaceholder} 
            className="pl-10"
          />
      </div>

      <Tabs defaultValue="my-classrooms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="my-classrooms">{t.myClassroomsTab}</TabsTrigger>
          <TabsTrigger value="available-classrooms">{t.availableClassroomsTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="my-classrooms">
          {myClassrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {myClassrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">{t.noMyClassrooms}</p>
          )}
        </TabsContent>
        <TabsContent value="available-classrooms">
           {availableClassrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {availableClassrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">{t.noAvailableClassrooms}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
