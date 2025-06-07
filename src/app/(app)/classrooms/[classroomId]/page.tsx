
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Classroom, ClassroomStudent, ClassroomAnnouncement, ClassroomAssignment } from '@/types';
import { ArrowLeft, Users, BookOpenText, Megaphone, ScrollText, UserCheck, CalendarDays, Sparkles, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock data for a single classroom - in a real app, this would be fetched
const MOCK_CLASSROOM_DETAILS: Record<string, Classroom> = {
  'c1': {
    id: 'c1',
    name: 'Grade 5 Adventure (EduQuest)',
    teacher: 'Ms. Lovelace',
    subject: 'Interdisciplinary',
    studentCount: 25,
    difficulty: 'Medium',
    active: true,
    description: 'Embark on an epic interdisciplinary journey with Ms. Lovelace! Explore connections between history, science, and art through engaging quests and collaborative projects. This class focuses on developing critical thinking and teamwork skills.',
    bannerImage: 'https://placehold.co/1200x300.png',
    aiBannerHint: 'fantasy classroom adventure',
    students: [
      { id: 's1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40.png?text=AW' },
      { id: 's2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40.png?text=BB' },
      { id: 's3', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/40x40.png?text=CB' },
      { id: 's4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/40x40.png?text=DP' },
      { id: 's5', name: 'Edward Scissorhands', avatarUrl: 'https://placehold.co/40x40.png?text=ES' },
    ],
    announcements: [
      { id: 'an1', title: 'Welcome to Term 2!', content: 'Excited to start our new adventures this term. First up: The Silk Road collaborative quest!', date: 'April 5, 2024' },
      { id: 'an2', title: 'Project Submissions Reminder', content: 'Don\'t forget, your "Ancient Civilizations" design studio projects are due next Friday.', date: 'April 2, 2024' },
    ],
    assignments: [
      { id: 'as1', title: 'Silk Road Collaborative Quest', dueDate: 'April 15, 2024', status: 'Pending', type: 'Quest', description: 'Team up to navigate the treacherous Silk Road.', relatedQuestId: 'h_q2' },
      { id: 'as2', title: 'Reflection: What is Empathy?', dueDate: 'April 10, 2024', status: 'Upcoming', type: 'Discussion', description: 'Share your thoughts in the Reflection Chamber.' },
      { id: 'as3', title: 'Design: Ancient Artifact Poster', dueDate: 'April 20, 2024', status: 'Pending', type: 'Assignment', description: 'Use the Design Studio to create an informative poster.' },
    ],
  },
  'c3': {
    id: 'c3',
    name: 'Creative Coders Club (EduQuest)',
    teacher: 'Mr. Turing',
    subject: 'Computer Science',
    studentCount: 15,
    difficulty: 'Medium',
    active: true,
    description: 'Join Mr. Turing in the Creative Coders Club to explore the fundamentals of programming, game design, and AI. Learn Python, build exciting projects, and collaborate on coding challenges.',
    bannerImage: 'https://placehold.co/1200x300.png',
    aiBannerHint: 'coding computer science club',
    students: [
      { id: 's6', name: 'Grace Hopper', avatarUrl: 'https://placehold.co/40x40.png?text=GH' },
      { id: 's7', name: 'Linus Torvalds', avatarUrl: 'https://placehold.co/40x40.png?text=LT' },
      { id: 's8', name: 'Ada Byron', avatarUrl: 'https://placehold.co/40x40.png?text=AB' },
    ],
    announcements: [
      { id: 'an3', title: 'New Challenge: AI Quest Generator', content: 'This week, we\'ll be exploring how to use the AI Quest Generator to create our own learning games. Get ready to be creative!', date: 'April 4, 2024' },
    ],
    assignments: [
      { id: 'as4', title: 'Code Your First Python Game', dueDate: 'April 25, 2024', status: 'Pending', type: 'Assignment', description: 'Use the concepts learned in class to build a simple text adventure or arcade game.'},
      { id: 'as5', title: 'Debug the AI Anomaly (Tech Zone)', dueDate: 'April 18, 2024', status: 'Upcoming', type: 'Quest', description: 'Apply your problem-solving skills in the Tech Hub\'s AI Uprising quest.', relatedQuestId: 't_q1' },
    ],
  },
  // Add more mock classrooms as needed
};

const pageTranslations = {
  en: {
    backToClassrooms: "Back to All Classrooms",
    taughtBy: "Taught by",
    studentsTab: "Students",
    announcementsTab: "Announcements",
    assignmentsTab: "Assignments & Quests",
    viewQuest: "View Quest",
    noStudents: "No students enrolled yet.",
    noAnnouncements: "No announcements posted yet.",
    noAssignments: "No assignments or quests scheduled yet.",
    difficulty: "Difficulty",
    subject: "Subject",
    status: "Status",
    dueDate: "Due Date",
    description: "Description",
    assignmentType: "Type",
  },
  id: {
    backToClassrooms: "Kembali ke Semua Ruang Kelas",
    taughtBy: "Diajar oleh",
    studentsTab: "Siswa",
    announcementsTab: "Pengumuman",
    assignmentsTab: "Tugas & Misi",
    viewQuest: "Lihat Misi",
    noStudents: "Belum ada siswa yang terdaftar.",
    noAnnouncements: "Belum ada pengumuman yang diposting.",
    noAssignments: "Belum ada tugas atau misi yang dijadwalkan.",
    difficulty: "Tingkat Kesulitan",
    subject: "Mata Pelajaran",
    status: "Status",
    dueDate: "Batas Tanggal",
    description: "Deskripsi",
    assignmentType: "Jenis",
  }
};

export default function ClassroomDetailPage({ params }: { params: { classroomId: string } }) {
  const classroom = MOCK_CLASSROOM_DETAILS[params.classroomId] || null;
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
        } catch (e) { console.error("Error reading lang for ClassroomDetailPage", e); }
      }
      setLang(newLang);
    };
    updateLang();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') updateLang();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];

  if (!classroom) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-0 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Classroom Not Found</h1>
        <p className="text-muted-foreground mb-4">The classroom you are looking for does not exist or could not be loaded.</p>
        <Button variant="outline" asChild>
          <Link href="/classrooms">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToClassrooms}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/classrooms">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToClassrooms}
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        {classroom.bannerImage && (
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={classroom.bannerImage}
              alt={`${classroom.name} banner`}
              layout="fill"
              objectFit="cover"
              data-ai-hint={classroom.aiBannerHint || 'classroom banner'}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
        <CardHeader className={classroom.bannerImage ? "pt-4" : ""}>
          <CardTitle className="font-headline text-3xl md:text-4xl">{classroom.name}</CardTitle>
          <CardDescription className="text-lg">
            {t.taughtBy}: {classroom.teacher}
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{t.subject}: {classroom.subject}</Badge>
            <Badge variant="secondary">{t.difficulty}: {classroom.difficulty}</Badge>
            <Badge variant={classroom.active ? "default" : "destructive"} className={classroom.active ? "bg-green-500 text-white" : ""}>
              {classroom.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {classroom.description && <p className="text-muted-foreground mb-6">{classroom.description}</p>}

          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="assignments"><ScrollText className="mr-2 h-4 w-4 sm:hidden md:inline-block" />{t.assignmentsTab}</TabsTrigger>
              <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4 sm:hidden md:inline-block" />{t.announcementsTab}</TabsTrigger>
              <TabsTrigger value="students"><Users className="mr-2 h-4 w-4 sm:hidden md:inline-block" />{t.studentsTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments">
              <div className="space-y-4">
                {(classroom.assignments && classroom.assignments.length > 0) ? classroom.assignments.map(assignment => (
                  <Card key={assignment.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                       <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{t.assignmentType}: <Badge variant="outline">{assignment.type}</Badge></span>
                        <span>{t.status}: <Badge variant={assignment.status === 'Pending' ? 'default' : assignment.status === 'Upcoming' ? 'secondary' : 'outline'}>{assignment.status}</Badge></span>
                        <span>{t.dueDate}: {assignment.dueDate}</span>
                      </div>
                    </CardHeader>
                    {assignment.description && <CardContent><p className="text-sm text-muted-foreground">{assignment.description}</p></CardContent>}
                    {assignment.relatedQuestId && (
                       <CardFooter>
                        <Button size="sm" asChild variant="link" className="p-0 h-auto text-accent">
                          <Link href={`/learning-zones/${classroom.id.startsWith('gc') ? 'history' : MOCK_CLASSROOM_DETAILS[classroom.id]?.subject?.toLowerCase() === 'computer science' ? 'technology' : 'history' }/quests/${assignment.relatedQuestId}`}>
                            {t.viewQuest} <Sparkles className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )) : <p className="text-muted-foreground">{t.noAssignments}</p>}
              </div>
            </TabsContent>

            <TabsContent value="announcements">
              <div className="space-y-4">
                {(classroom.announcements && classroom.announcements.length > 0) ? classroom.announcements.map(announcement => (
                  <Card key={announcement.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription>{announcement.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </CardContent>
                  </Card>
                )) : <p className="text-muted-foreground">{t.noAnnouncements}</p>}
              </div>
            </TabsContent>

            <TabsContent value="students">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(classroom.students && classroom.students.length > 0) ? classroom.students.map(student => (
                  <Card key={student.id} className="p-4 flex flex-col items-center text-center shadow-sm">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm">{student.name}</p>
                  </Card>
                )) : <p className="col-span-full text-muted-foreground">{t.noStudents}</p>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

