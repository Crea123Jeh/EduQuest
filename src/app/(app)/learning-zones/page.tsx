
import { ZoneCard } from '@/components/ZoneCard';
import type { LearningZone } from '@/types';
import { History, Calculator, FlaskConical, Globe, Palette, Music, Languages, Rocket, Atom, BrainCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const allLearningZones: LearningZone[] = [
  { 
    id: 'history', 
    name: 'History Zone: Time Travelers\' Guild', 
    description: 'Unravel mysteries of the past, from ancient pharaohs to space-age pioneers! Decode hieroglyphs, lead revolutions, and rewrite history (or try to!).', 
    icon: History, 
    subject: 'History', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'time machine portal' 
  },
  { 
    id: 'math', 
    name: 'Mathematics Realm: Number Ninjas\' Dojo', 
    description: 'Sharpen your skills in logic, patterns, and puzzles. Become a math master by cracking codes and solving mind-bending geometric challenges!', 
    icon: Calculator, 
    subject: 'Mathematics', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'ninja math symbols' 
  },
  { 
    id: 'science', 
    name: 'Science Lab: Mad Scientist\'s Workshop', 
    description: 'Mix, build, and experiment! Discover the secrets of the universe, from bubbling potions to miniature black holes (safely, of course!).', 
    icon: FlaskConical, 
    subject: 'Science', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'mad scientist lab' 
  },
  { 
    id: 'geography', 
    name: 'World Explorer: The Cartographer\'s Compass', 
    description: 'Embark on global expeditions, discover hidden wonders, and map uncharted territories. Navigate treacherous terrains and meet diverse cultures!', 
    icon: Globe, 
    subject: 'Geography', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'vintage world map' 
  },
  { 
    id: 'art', 
    name: 'Art Studio: The Dream Weaver\'s Canvas', 
    description: 'Paint, sculpt, and animate your wildest imaginations into reality. Bring mythical creatures to life or design futuristic cities!', 
    icon: Palette, 
    subject: 'Art', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'fantasy art studio' 
  },
  { 
    id: 'music', 
    name: 'Music Hall: The Maestro\'s Symphony', 
    description: 'Compose epic scores, jam with virtual instruments, and conduct your own orchestra. Create chart-topping hits or serene soundscapes.', 
    icon: Music, 
    subject: 'Music', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'grand concert hall' 
  },
  { 
    id: 'languages', 
    name: 'Language Hub: The Polyglot\'s Portal', 
    description: 'Converse with characters from around the world, translate ancient texts, and unlock the power of words in exciting narrative adventures.', 
    icon: Languages, 
    subject: 'Languages', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'ancient library scrolls' 
  },
  { 
    id: 'technology', 
    name: 'Tech Hub: Future Innovators\' Garage', 
    description: 'Code robots, design virtual worlds, and explore the cutting edge of technology. Build the next big app or secure a digital fortress!', 
    icon: Rocket, 
    subject: 'Technology', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'futuristic tech garage' 
  },
   { 
    id: 'physics', 
    name: 'Physics Playground: Quantum Leap Lab', 
    description: 'Bend the laws of physics! Experiment with gravity, light, and energy in mind-bending simulations and challenges.', 
    icon: Atom, 
    subject: 'Physics', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'quantum physics simulation' 
  },
   { 
    id: 'psychology', 
    name: 'Mind Maze: The Empathy Engine', 
    description: 'Navigate complex social scenarios, understand human behavior, and build your emotional intelligence through interactive stories.', 
    icon: BrainCog, 
    subject: 'Psychology', 
    image: 'https://placehold.co/400x250.png', 
    aiHint: 'abstract mind maze' 
  },
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
