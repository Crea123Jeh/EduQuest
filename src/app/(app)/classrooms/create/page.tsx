
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

export default function CreateClassroomPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
           <Button variant="outline" size="sm" className="mb-4 w-fit mx-auto sm:mx-0" asChild>
            <Link href="/classrooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classrooms
            </Link>
          </Button>
          <Construction className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="font-headline text-2xl">Create Classroom</CardTitle>
          <CardDescription>This feature is currently under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working hard to bring you the ability to create and manage your own virtual classrooms. 
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
