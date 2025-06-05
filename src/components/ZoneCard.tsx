import Image from 'next/image';
import Link from 'next/link';
import type { LearningZone } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ZoneCardProps {
  zone: LearningZone;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const IconComponent = zone.icon;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          {IconComponent && <IconComponent className="h-7 w-7 text-accent" />}
          <CardTitle className="font-headline text-xl">{zone.name}</CardTitle>
        </div>
        <CardDescription className="text-sm h-10 line-clamp-2">{zone.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Image
          src={zone.image}
          alt={zone.name}
          width={400}
          height={250}
          className="w-full h-40 object-cover rounded-md mb-3"
          data-ai-hint={zone.aiHint}
        />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/learning-zones/${zone.id}`}>
            Explore Zone <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
