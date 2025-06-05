import type { Classroom } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ClassroomCardProps {
  classroom: Classroom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl">{classroom.name}</CardTitle>
          <Badge variant={classroom.active ? 'default' : 'secondary'} className={classroom.active ? 'bg-green-500 text-white' : ''}>
            {classroom.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>Taught by: {classroom.teacher}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Subject: {classroom.subject}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>Students: {classroom.studentCount}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Difficulty: {classroom.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/classrooms/${classroom.id}`}> {/* Assuming classroom detail page */}
            Enter Classroom <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
