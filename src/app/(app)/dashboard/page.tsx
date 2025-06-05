import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoneCard } from '@/components/ZoneCard';
import { ClassroomCard } from '@/components/ClassroomCard';
import type { LearningZone, Classroom, Quest } from '@/types';
import { History, Calculator, FlaskConical, ArrowRight, BookOpenCheck, Users, Puzzle } from 'lucide-react';
import Image from 'next/image';

// Mock Data
const learningZones: LearningZone[] = [
  { id: 'history', name: 'History Zone', description: 'Explore ancient civilizations and pivotal historical events.', icon: History, subject: 'History', image: 'https://placehold.co/400x250.png', aiHint: 'history ancient' },
  { id: 'math', name: 'Mathematics Realm', description: 'Solve intriguing puzzles and master mathematical concepts.', icon: Calculator, subject: 'Mathematics', image: 'https://placehold.co/400x250.png', aiHint: 'math abstract' },
  { id: 'science', name: 'Science Lab', description: 'Conduct experiments and discover the wonders of science.', icon: FlaskConical, subject: 'Science', image: 'https://placehold.co/400x250.png', aiHint: 'science laboratory' },
];

const classrooms: Classroom[] = [
  { id: 'c1', name: 'Grade 5 Adventure', teacher: 'Ms. Lovelace', subject: 'Interdisciplinary', studentCount: 25, difficulty: 'Medium', active: true },
  { id: 'c2', name: 'History Buffs Unite', teacher: 'Mr. Herodotus', subject: 'History', studentCount: 18, difficulty: 'Hard', active: false },
];

const activeQuests: Quest[] = [
  { id: 'q1', title: 'The Borobudur Chronicle', description: 'Uncover the secrets of the Borobudur temple.', zoneId: 'history', type: 'Collaborative', difficulty: 'Medium', points: 150 },
  { id: 'q2', title: 'Geometric Guardians', description: 'Protect the realm using geometric principles.', zoneId: 'math', type: 'Individual', difficulty: 'Hard', points: 200 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 bg-gradient-to-r from-primary/50 to-primary/20 border-primary/30 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-foreground">Welcome to EduQuest!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your journey into compassionate and collaborative learning starts here. What will you explore today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/learning-zones">Explore Learning Zones <BookOpenCheck className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/classrooms">View Classrooms <Users className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <BookOpenCheck className="mr-3 h-7 w-7 text-accent" />
          Featured Learning Zones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningZones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Users className="mr-3 h-7 w-7 text-accent" />
          Your Classrooms
        </h2>
        {classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classrooms.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You are not currently enrolled in any classrooms.</p>
              <Button asChild variant="outline">
                <Link href="/classrooms/join">Join a Classroom</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
      
      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Puzzle className="mr-3 h-7 w-7 text-accent" />
          Active Quests
        </h2>
        {activeQuests.length > 0 ? (
          <div className="space-y-4">
            {activeQuests.map(quest => (
              <Card key={quest.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                  <CardDescription>{quest.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Zone: {learningZones.find(z => z.id === quest.zoneId)?.name || 'N/A'}</p>
                  <p>Difficulty: {quest.difficulty} | Points: {quest.points}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="p-0 h-auto text-accent">
                    <Link href={`/learning-zones/${quest.zoneId}/quests/${quest.id}`}>Continue Quest <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
           <Card className="text-center py-8">
            <CardContent>
              <Puzzle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No active quests at the moment. Explore a zone to find new adventures!</p>
              <Button asChild variant="outline">
                <Link href="/learning-zones">Find Quests</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
