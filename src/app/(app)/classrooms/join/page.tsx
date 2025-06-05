
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn } from 'lucide-react';

// Mock data for available classrooms that can be joined with a code
const joinableClassrooms = [
  { id: 'c2', name: 'History Buffs Unite', code: 'HISTORY101' },
  { id: 'c4', name: 'Physics Explorers', code: 'PHYSICS202' },
  { id: 'c5', name: 'Mathletes Challenge', code: 'MATH303' },
];

export default function JoinClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [classroomCode, setClassroomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundClassroom = joinableClassrooms.find(c => c.code.toLowerCase() === classroomCode.trim().toLowerCase());

    if (foundClassroom) {
      toast({
        title: 'Successfully Joined!',
        description: `You have joined "${foundClassroom.name}".`,
      });
      // In a real app, you'd update user's classroom list here.
      // For prototype, redirecting to classrooms page.
      router.push('/classrooms');
    } else {
      toast({
        title: 'Error Joining Classroom',
        description: 'Invalid classroom code or classroom not found. Please try again.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <Button variant="outline" size="sm" className="mb-4 w-fit" asChild>
            <Link href="/classrooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classrooms
            </Link>
          </Button>
          <CardTitle className="font-headline text-2xl">Join a Classroom</CardTitle>
          <CardDescription>Enter the unique code provided by your teacher to join their classroom.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="classroomCode">Classroom Code</Label>
              <Input
                id="classroomCode"
                type="text"
                placeholder="Enter code (e.g., HISTORY101)"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LogIn className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Join Classroom
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
