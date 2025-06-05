import { ZoneCard } from '@/components/ZoneCard';
import type { LearningZone } from '@/types';
import { History, Calculator, FlaskConical, Globe, Palette, Music, Languages } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const allLearningZones: LearningZone[] = [
  { id: 'history', name: 'History Zone', description: 'Travel through time, from ancient empires to modern revolutions.', icon: History, subject: 'History', image: 'https://placehold.co/400x250.png', aiHint: 'history ancient civilization' },
  { id: 'math', name: 'Mathematics Realm', description: 'Unravel the mysteries of numbers, patterns, and logic.', icon: Calculator, subject: 'Mathematics', image: 'https://placehold.co/400x250.png', aiHint: 'mathematics abstract geometry' },
  { id: 'science', name: 'Science Lab', description: 'Experiment with biology, chemistry, and physics in a virtual lab.', icon: FlaskConical, subject: 'Science', image: 'https://placehold.co/400x250.png', aiHint: 'science laboratory experiment' },
  { id: 'geography', name: 'World Explorer', description: 'Discover diverse cultures, landscapes, and ecosystems across the globe.', icon: Globe, subject: 'Geography', image: 'https://placehold.co/400x250.png', aiHint: 'world map globe' },
  { id: 'art', name: 'Art Studio', description: 'Unleash your creativity with painting, sculpture, and digital art.', icon: Palette, subject: 'Art', image: 'https://placehold.co/400x250.png', aiHint: 'art studio painting' },
  { id: 'music', name: 'Music Hall', description: 'Compose melodies, learn instruments, and explore music theory.', icon: Music, subject: 'Music', image: 'https://placehold.co/400x250.png', aiHint: 'music instruments concert' },
  { id: 'languages', name: 'Language Hub', description: 'Master new languages through interactive dialogues and stories.', icon: Languages, subject: 'Languages', image: 'https://placehold.co/400x250.png', aiHint: 'language learning books' },
];

// This page will be a server component, so search functionality would ideally be client-side or use server actions.
// For simplicity, we'll just display all zones. A real implementation would require state for search.

export default function LearningZonesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold mb-2 text-foreground">Explore Learning Zones</h1>
        <p className="text-lg text-muted-foreground">Dive into diverse subjects and embark on exciting educational adventures.</p>
        <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search zones (e.g., History, Math...)" 
              className="pl-10"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allLearningZones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
}
