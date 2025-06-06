
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClassroomCard } from '@/components/ClassroomCard';
import type { Classroom } from '@/types';
import { PlusCircle, Search, CheckCircle, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialMyClassrooms: Classroom[] = [
  { id: 'c1', name: 'Grade 5 Adventure (EduQuest)', teacher: 'Ms. Lovelace', subject: 'Interdisciplinary', studentCount: 25, difficulty: 'Medium', active: true },
  { id: 'c3', name: 'Creative Coders Club (EduQuest)', teacher: 'Mr. Turing', subject: 'Computer Science', studentCount: 15, difficulty: 'Medium', active: true },
];

const availableClassrooms: Classroom[] = [
  { id: 'c2', name: 'History Buffs Unite', teacher: 'Mr. Herodotus', subject: 'History', studentCount: 18, difficulty: 'Hard', active: false },
  { id: 'c4', name: 'Physics Explorers', teacher: 'Dr. Curie', subject: 'Science', studentCount: 22, difficulty: 'Medium', active: true },
  { id: 'c5', name: 'Mathletes Challenge', teacher: 'Prof. Euler', subject: 'Mathematics', studentCount: 30, difficulty: 'Hard', active: true },
];

const mockGoogleClassrooms: Classroom[] = [
  { id: 'gc1', name: 'Grade 10 Biology (Google Classroom)', teacher: 'Ms. Darwin', subject: 'Science', studentCount: 28, difficulty: 'Medium', active: true },
  { id: 'gc2', name: 'AP World History (Google Classroom)', teacher: 'Mr. Khan', subject: 'History', studentCount: 22, difficulty: 'Hard', active: true },
  { id: 'gc3', name: 'Introduction to Python (Google Classroom)', teacher: 'Ms. Ada', subject: 'Computer Science', studentCount: 35, difficulty: 'Easy', active: false },
];

const pageTranslations = {
  en: {
    title: "Virtual Classrooms",
    description: "Manage your classes, join new ones, or sync with Google Classroom.",
    joinClassroom: "Join Classroom",
    createClassroom: "Create Classroom",
    searchPlaceholder: "Search classrooms...",
    myClassroomsTab: "My Classrooms",
    availableClassroomsTab: "Available to Join",
    noMyClassrooms: "You haven't joined or created any classrooms yet. Try connecting to Google Classroom!",
    noAvailableClassrooms: "No classrooms available to join currently. Check back later!",
    connectGoogleClassroom: "Connect to Google Classroom",
    disconnectGoogleClassroom: "Disconnect Google Classroom",
    googleClassroomConnected: "Google Classroom Connected!",
    googleClassroomDisconnected: "Google Classroom Disconnected.",
    toastGClassroomConnectedTitle: "Google Classroom Connected",
    toastGClassroomConnectedDescription: "Your Google Classroom classes are now shown.",
    toastGClassroomDisconnectedTitle: "Google Classroom Disconnected",
    toastGClassroomDisconnectedDescription: "Showing EduQuest classrooms.",
  },
  id: {
    title: "Ruang Kelas Virtual",
    description: "Kelola kelas Anda, bergabunglah dengan kelas baru, atau sinkronkan dengan Google Classroom.",
    joinClassroom: "Gabung Kelas",
    createClassroom: "Buat Kelas",
    searchPlaceholder: "Cari ruang kelas...",
    myClassroomsTab: "Ruang Kelas Saya",
    availableClassroomsTab: "Tersedia untuk Digabung",
    noMyClassrooms: "Anda belum bergabung atau membuat ruang kelas apa pun. Coba hubungkan ke Google Classroom!",
    noAvailableClassrooms: "Tidak ada ruang kelas yang tersedia untuk digabung saat ini. Periksa kembali nanti!",
    connectGoogleClassroom: "Hubungkan ke Google Classroom",
    disconnectGoogleClassroom: "Putuskan Google Classroom",
    googleClassroomConnected: "Google Classroom Terhubung!",
    googleClassroomDisconnected: "Google Classroom Terputus.",
    toastGClassroomConnectedTitle: "Google Classroom Terhubung",
    toastGClassroomConnectedDescription: "Kelas Google Classroom Anda sekarang ditampilkan.",
    toastGClassroomDisconnectedTitle: "Google Classroom Terputus",
    toastGClassroomDisconnectedDescription: "Menampilkan ruang kelas EduQuest.",
  }
};

export default function ClassroomsPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();
  const [isConnectedToGoogleClassroom, setIsConnectedToGoogleClassroom] = useState(false);
  const [displayedMyClassrooms, setDisplayedMyClassrooms] = useState<Classroom[]>(initialMyClassrooms);

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

  const handleToggleGoogleClassroomConnection = () => {
    if (isConnectedToGoogleClassroom) {
      // Simulate disconnecting
      setDisplayedMyClassrooms(initialMyClassrooms);
      setIsConnectedToGoogleClassroom(false);
      toast({
        title: t.toastGClassroomDisconnectedTitle,
        description: t.toastGClassroomDisconnectedDescription,
      });
    } else {
      // Simulate connecting and fetching data
      // In a real app, this would involve OAuth and API calls
      console.log("Simulating connection to Google Classroom...");
      setDisplayedMyClassrooms(mockGoogleClassrooms);
      setIsConnectedToGoogleClassroom(true);
      toast({
        title: t.toastGClassroomConnectedTitle,
        description: t.toastGClassroomConnectedDescription,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-lg text-muted-foreground">{t.description}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleToggleGoogleClassroomConnection} variant="outline">
            {isConnectedToGoogleClassroom ? 
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : 
              <Link2 className="mr-2 h-4 w-4" />
            }
            {isConnectedToGoogleClassroom ? t.disconnectGoogleClassroom : t.connectGoogleClassroom}
          </Button>
          <Button asChild variant="outline">
            <Link href="/classrooms/join">{t.joinClassroom}</Link>
          </Button>
          <Button asChild>
            <Link href="/classrooms/create"><PlusCircle className="mr-2 h-4 w-4" /> {t.createClassroom}</Link>
          </Button>
        </div>
      </div>
      
      {isConnectedToGoogleClassroom && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm text-green-700 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          {t.googleClassroomConnected}
        </div>
      )}
      
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
          {displayedMyClassrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {displayedMyClassrooms.map((classroom) => (
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
