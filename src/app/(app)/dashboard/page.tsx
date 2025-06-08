
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoneCard } from '@/components/ZoneCard';
import { ClassroomCard } from '@/components/ClassroomCard';
import type { LearningZone, Classroom, Quest } from '@/types';
import { ArrowRight, BookOpenCheck, Users, Puzzle, Award, Lightbulb, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock Data - In a real app, this data might also need i18n if names/descriptions change
const learningZones: LearningZone[] = [
  { id: 'history', name: 'History Zone: Time Travelers\' Guild', description: 'Navigate pivotal moments, from decoding ancient scrolls in Egypt to strategizing D-Day landings. Your choices shape the past!', iconKey: 'History', subject: 'History', image: 'https://placehold.co/400x250.png', aiHint: 'history travel' },
  { id: 'math', name: 'Mathematics Realm: Number Ninjas\' Citadel', description: 'Master calculation and logic in a high-tech dojo. Solve numerical puzzles, duel equation-robots, and become a Number Ninja!', iconKey: 'Calculator', subject: 'Mathematics', image: 'https://placehold.co/400x250.png', aiHint: 'math dojo' },
  { id: 'science', name: 'Science Lab: The Mad Scientist\'s Playground', description: 'Concoct potions, build contraptions, and reanimate creatures in this quirky lab. Expect the unexpected – it’s all a discovery!', iconKey: 'FlaskConical', subject: 'Science', image: 'https://placehold.co/400x250.png', aiHint: 'science lab' },
];

const classrooms: Classroom[] = [
  { id: 'c1', name: 'Grade 5 Adventure', teacher: 'Ms. Lovelace', subject: 'Interdisciplinary', studentCount: 25, difficulty: 'Medium', active: true },
  { id: 'c3', name: 'Creative Coders Club', teacher: 'Mr. Turing', subject: 'Computer Science', studentCount: 15, difficulty: 'Medium', active: true },
];

const activeQuests: Quest[] = [
  { id: 'h_q1', title: 'The Pharaoh\'s Lost Scepter', description: 'Navigate booby-trapped pyramids and decipher hieroglyphs to find the legendary scepter.', zoneId: 'history', type: 'Individual', difficulty: 'Medium', points: 120 },
  { id: 'm_q1', title: 'Fractal Fortress Defense', description: 'Configure and deploy a fractal shield to protect the Citadel from incoming data corruption.', zoneId: 'math', type: 'Individual', difficulty: 'Hard', points: 200 },
  { id: 's_q2', title: 'Eco-Challenge: Operation Biosphere Rescue', description: 'A miniature ecosystem is collapsing! Identify pollutants and restore balance.', zoneId: 'science', type: 'Collaborative', difficulty: 'Hard', points: 190 },
];

interface Achievement {
  id: string;
  titleKey: keyof typeof dashboardTranslations.en;
  descriptionKey: keyof typeof dashboardTranslations.en;
  icon: LucideIcon;
  dateKey: keyof typeof dashboardTranslations.en;
}

const recentAchievementsData: Achievement[] = [
  { id: 'ach1', titleKey: 'achievementTeamworkTitanTitle', descriptionKey: 'achievementTeamworkTitanDesc', icon: Users, dateKey: 'date2DaysAgo' },
  { id: 'ach2', titleKey: 'achievementPuzzleProTitle', descriptionKey: 'achievementPuzzleProDesc', icon: Puzzle, dateKey: 'date5DaysAgo' },
  { id: 'ach3', titleKey: 'achievementKindnessChampionTitle', descriptionKey: 'achievementKindnessChampionDesc', icon: Award, dateKey: 'date1WeekAgo' },
];

const thoughtsOfTheDayKeys: (keyof typeof dashboardTranslations.en)[] = [
  'thought1',
  'thought2',
  'thought3',
];

const dashboardTranslations = {
  en: {
    welcomeTitle: "Welcome to EduQuest!",
    welcomeDescription: "Your journey into compassionate and collaborative learning starts here. What will you explore today?",
    exploreZonesButton: "Explore Learning Zones",
    viewClassroomsButton: "View Classrooms",
    featuredZonesTitle: "Featured Learning Zones",
    yourClassroomsTitle: "Your Classrooms",
    noClassroomsMessage: "You are not currently enrolled in any classrooms.",
    joinClassroomButton: "Join a Classroom",
    activeQuestsTitle: "Active Quests",
    questZoneLabel: "Zone",
    questDifficultyLabel: "Difficulty",
    questPointsLabel: "Points",
    continueQuestButton: "Continue Quest",
    noQuestsMessage: "No active quests at the moment. Explore a zone to find new adventures!",
    findQuestsButton: "Find Quests",
    recentAchievementsTitle: "Recent Achievements",
    thoughtOfTheDayTitle: "Thought of the Day",
    exploreAllZonesButton: "Explore All Zones",
    achievementTeamworkTitanTitle: "Teamwork Titan",
    achievementTeamworkTitanDesc: "Successfully completed 5 collaborative quests.",
    achievementPuzzleProTitle: "Puzzle Pro",
    achievementPuzzleProDesc: "Mastered the 'Geometric Guardians' challenge.",
    achievementKindnessChampionTitle: "Kindness Champion",
    achievementKindnessChampionDesc: "Helped a teammate during the 'Silk Road' quest.",
    date2DaysAgo: "2 days ago",
    date5DaysAgo: "5 days ago",
    date1WeekAgo: "1 week ago",
    thought1: "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    thought2: "Collaboration allows us to know more than we are capable of knowing by ourselves. - Paul Solarz",
    thought3: "Empathy is seeing with the eyes of another, listening with the ears of another, and feeling with the heart of another. - Alfred Adler",
  },
  id: {
    welcomeTitle: "Selamat Datang di EduQuest!",
    welcomeDescription: "Perjalanan Anda menuju pembelajaran yang penuh kasih dan kolaboratif dimulai di sini. Apa yang akan Anda jelajahi hari ini?",
    exploreZonesButton: "Jelajahi Zona Belajar",
    viewClassroomsButton: "Lihat Ruang Kelas",
    featuredZonesTitle: "Zona Belajar Unggulan",
    yourClassroomsTitle: "Ruang Kelas Anda",
    noClassroomsMessage: "Anda saat ini tidak terdaftar di ruang kelas mana pun.",
    joinClassroomButton: "Gabung Ruang Kelas",
    activeQuestsTitle: "Misi Aktif",
    questZoneLabel: "Zona",
    questDifficultyLabel: "Kesulitan",
    questPointsLabel: "Poin",
    continueQuestButton: "Lanjutkan Misi",
    noQuestsMessage: "Tidak ada misi aktif saat ini. Jelajahi zona untuk menemukan petualangan baru!",
    findQuestsButton: "Cari Misi",
    recentAchievementsTitle: "Pencapaian Terbaru",
    thoughtOfTheDayTitle: "Pemikiran Hari Ini",
    exploreAllZonesButton: "Jelajahi Semua Zona",
    achievementTeamworkTitanTitle: "Raksasa Kerja Sama Tim",
    achievementTeamworkTitanDesc: "Berhasil menyelesaikan 5 misi kolaboratif.",
    achievementPuzzleProTitle: "Jago Teka-Teki",
    achievementPuzzleProDesc: "Menguasai tantangan 'Penjaga Geometris'.",
    achievementKindnessChampionTitle: "Juara Kebaikan",
    achievementKindnessChampionDesc: "Membantu rekan satu tim selama misi 'Jalur Sutra'.",
    date2DaysAgo: "2 hari yang lalu",
    date5DaysAgo: "5 hari yang lalu",
    date1WeekAgo: "1 minggu yang lalu",
    thought1: "Hal terindah tentang belajar adalah tidak ada yang bisa mengambilnya darimu. - B.B. King",
    thought2: "Kolaborasi memungkinkan kita mengetahui lebih banyak daripada yang mampu kita ketahui sendiri. - Paul Solarz",
    thought3: "Empati adalah melihat dengan mata orang lain, mendengar dengan telinga orang lain, dan merasakan dengan hati orang lain. - Alfred Adler",
  }
};

export default function DashboardPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [currentThoughtKey, setCurrentThoughtKey] = useState<keyof typeof dashboardTranslations.en>(thoughtsOfTheDayKeys[0]);

  useEffect(() => {
    const updateLangAndThought = () => {
      const savedSettings = localStorage.getItem('user-app-settings');
      let newLang: 'en' | 'id' = 'en';
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language && (parsed.language === 'en' || parsed.language === 'id')) {
            newLang = parsed.language;
          }
        } catch (e) { console.error("Error reading lang for Dashboard", e); }
      }
      setLang(newLang);
      
      const randomIndex = Math.floor(Math.random() * thoughtsOfTheDayKeys.length);
      setCurrentThoughtKey(thoughtsOfTheDayKeys[randomIndex]);
    };

    updateLangAndThought();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') {
        updateLangAndThought();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = dashboardTranslations[lang];
  const currentThought = t[currentThoughtKey] || t.thought1; 

  return (
    <div className="container mx-auto pt-0 pb-8 px-4 md:px-0">
      <Card className="mt-5 mb-8 bg-gradient-to-r from-primary/50 to-primary/20 border-primary/30 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-foreground">{t.welcomeTitle}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {t.welcomeDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/learning-zones">{t.exploreZonesButton} <BookOpenCheck className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/classrooms">{t.viewClassroomsButton} <Users className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Puzzle className="mr-3 h-7 w-7 text-accent" />
          {t.activeQuestsTitle}
        </h2>
        {activeQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuests.map(quest => (
              <Card key={quest.id} className="hover:shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                  <CardDescription className="h-12 line-clamp-2">{quest.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow text-sm text-muted-foreground space-y-1">
                  <p>{t.questZoneLabel}: {learningZones.find(z => z.id === quest.zoneId)?.name || 'N/A'}</p>
                  <p>{t.questDifficultyLabel}: {quest.difficulty}</p>
                  <p>{t.questPointsLabel}: {quest.points}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0 h-auto text-accent w-full justify-start">
                    <Link href={`/learning-zones/${quest.zoneId}/quests/${quest.id}`}>{t.continueQuestButton} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
           <Card className="text-center py-8">
            <CardContent>
              <Puzzle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{t.noQuestsMessage}</p>
              <Button asChild variant="outline">
                <Link href="/learning-zones">{t.findQuestsButton}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <section className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
              <BookOpenCheck className="mr-3 h-7 w-7 text-accent" />
              {t.featuredZonesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningZones.slice(0,2).map((zone) => ( // Show only 2 featured zones
                <ZoneCard key={zone.id} zone={zone} />
              ))}
            </div>
          </div>
           <div>
            <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
              <Users className="mr-3 h-7 w-7 text-accent" />
              {t.yourClassroomsTitle}
            </h2>
            {classrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classrooms.slice(0,2).map((classroom) => ( // Show 2 featured classrooms
                  <ClassroomCard key={classroom.id} classroom={classroom} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">{t.noClassroomsMessage}</p>
                  <Button asChild variant="outline">
                    <Link href="/classrooms/join">{t.joinClassroomButton}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <div className="lg:col-span-1 space-y-8">
            <section>
                <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
                  <Award className="mr-3 h-7 w-7 text-accent" />
                  {t.recentAchievementsTitle}
                </h2>
                <div className="space-y-4">
                  {recentAchievementsData.map((achievement) => {
                    const AchievementIcon = achievement.icon;
                    return (
                      <Card key={achievement.id} className="shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-4 flex items-start gap-3">
                          <AchievementIcon className="h-8 w-8 text-yellow-500 mt-1 shrink-0" />
                          <div>
                            <h3 className="font-semibold text-foreground">{t[achievement.titleKey]}</h3>
                            <p className="text-sm text-muted-foreground">{t[achievement.descriptionKey]}</p>
                            <p className="text-xs text-muted-foreground/80 mt-1">{t[achievement.dateKey]}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
            </section>
            <section>
                <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
                    <Lightbulb className="mr-3 h-7 w-7 text-accent" />
                    {t.thoughtOfTheDayTitle}
                </h2>
                <Card className="shadow-md bg-secondary/30">
                    <CardContent className="pt-6">
                        <p className="text-lg italic text-secondary-foreground text-center">"{currentThought}"</p>
                    </CardContent>
                </Card>
            </section>
        </div>
      </div>
    </div>
  );
}
