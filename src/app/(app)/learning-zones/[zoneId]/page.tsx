import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LearningZone, Quest } from '@/types';
import { ArrowLeft, Users, Puzzle, Star, Zap } from 'lucide-react';
import { History, Calculator, FlaskConical } from 'lucide-react'; // Example icons

// Mock Data - In a real app, this would be fetched based on params.zoneId
const MOCK_ZONES: Record<string, LearningZone> = {
  history: { 
    id: 'history', name: 'History Zone: Echoes of Borobudur', 
    description: 'Immerse yourself in the rich history and culture surrounding the magnificent Borobudur temple. Solve chronological puzzles, decipher ancient scripts, and collaborate to unveil the secrets of past civilizations.', 
    icon: History, subject: 'History', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'borobudur temple 3d',
    quests: [
      { id: 'h_q1', title: 'The King\'s Decree', description: 'Decipher the royal decree to understand trade routes.', zoneId: 'history', type: 'Individual', difficulty: 'Medium', points: 120 },
      { id: 'h_q2', title: 'Collaboration Door: Temple Builders', description: 'Work with a partner to reconstruct a temple blueprint.', zoneId: 'history', type: 'Collaborative', difficulty: 'Medium', points: 180 },
      { id: 'h_q3', title: 'Ethical Dilemma: The Artifact', description: 'Decide the fate of a newly discovered artifact.', zoneId: 'history', type: 'Ethical Dilemma', difficulty: 'Hard', points: 100 },
    ]
  },
  math: { 
    id: 'math', name: 'Mathematics Realm: The Geometry Gauntlet', 
    description: 'Navigate a futuristic landscape filled with geometric puzzles and logical challenges. Apply theorems, calculate trajectories, and collaborate to unlock the secrets of space-time.', 
    icon: Calculator, subject: 'Mathematics', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'futuristic geometry 3d',
    quests: [
      { id: 'm_q1', title: 'Fractal Frontiers', description: 'Explore the infinite beauty of fractals.', zoneId: 'math', type: 'Individual', difficulty: 'Hard', points: 200 },
      { id: 'm_q2', title: 'Broken Bridge: Equation Rescue', description: 'Sacrifice points or work together to repair the equation bridge.', zoneId: 'math', type: 'Collaborative', difficulty: 'Medium', points: 150 },
    ]
  },
   science: { 
    id: 'science', name: 'Science Lab: Tropical Ecosystem Challenge', 
    description: 'Simulate a lush tropical rainforest, identify species, balance ecosystems, and tackle environmental challenges. Understand food webs, biodiversity, and the impact of human activity.', 
    icon: FlaskConical, subject: 'Science', 
    image: 'https://placehold.co/1200x400.png', 
    aiHint: 'rainforest ecosystem 3d',
    quests: [
      { id: 's_q1', title: 'Molecule Mixer', description: 'Drag-and-drop molecules to form compounds.', zoneId: 'science', type: 'Individual', difficulty: 'Medium', points: 130 },
      { id: 's_q2', title: 'Physics Phun: Inclined Planes', description: 'Simulate object movement on inclined planes.', zoneId: 'science', type: 'Individual', difficulty: 'Easy', points: 90 },
    ]
  },
};

export default function LearningZoneDetailPage({ params }: { params: { zoneId: string } }) {
  const zone = MOCK_ZONES[params.zoneId] || MOCK_ZONES['history']; // Fallback to history if not found

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/learning-zones">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Zones
        </Link>
      </Button>

      <div className="relative mb-8 overflow-hidden rounded-lg shadow-xl">
        <Image
          src={zone.image}
          alt={zone.name}
          width={1200}
          height={400}
          className="w-full h-64 md:h-96 object-cover"
          data-ai-hint={zone.aiHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          {zone.icon && <zone.icon className="h-12 w-12 text-white mb-2" />}
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-white">{zone.name}</h1>
          <p className="text-lg text-gray-200 mt-1 max-w-3xl">{zone.description}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Puzzle className="mr-3 h-7 w-7 text-accent" />
          Quests in this Zone
        </h2>
        {zone.quests && zone.quests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zone.quests.map((quest) => (
              <Card key={quest.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{quest.title}</CardTitle>
                  <CardDescription className="h-12 line-clamp-2">{quest.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant={quest.type === 'Collaborative' ? 'default' : 'secondary'}>{quest.type}</Badge>
                    <Badge variant="outline">{quest.difficulty}</Badge>
                  </div>
                  <p><Star className="inline mr-1 h-4 w-4 text-yellow-400" /> {quest.points} Points</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/learning-zones/${zone.id}/quests/${quest.id}`}>
                      Start Quest <Zap className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No quests available in this zone yet. Check back soon!</p>
        )}
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-6 text-foreground flex items-center">
          <Users className="mr-3 h-7 w-7 text-accent" />
          Collaborative Challenges
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Many quests in {zone.name} feature unique collaborative challenges like <span className="font-semibold text-accent">Collaboration Doors</span> (requiring synchronized answers) and <span className="font-semibold text-accent">Broken Bridges</span> (demanding teamwork and sacrifice). These are designed to foster empathy, communication, and collective problem-solving.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 border rounded-lg bg-background">
                    <Users className="h-8 w-8 text-primary mr-3 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Collaboration Doors</h4>
                        <p className="text-sm text-muted-foreground">Two students must answer different but related questions simultaneously to proceed.</p>
                    </div>
                </div>
                 <div className="flex items-start p-4 border rounded-lg bg-background">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary mr-3 mt-1 shrink-0"><path d="M2 8L2.75 10.25C3.5 12.5 4.5 13.5 6.5 13.5C8.5 13.5 9.5 12.5 10.25 10.25L11 8"/><path d="M13 8L13.75 10.25C14.5 12.5 15.5 13.5 17.5 13.5C19.5 13.5 20.5 12.5 21.25 10.25L22 8"/><path d="M8 13.5V16H16V13.5"/><path d="M8 16L6.5 22H17.5L16 16"/></svg>
                    <div>
                        <h4 className="font-semibold">Broken Bridges</h4>
                        <p className="text-sm text-muted-foreground">Team members might need to sacrifice points or resources for the group to cross.</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
