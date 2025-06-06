
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

export default function NewDesignPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
           <Button variant="outline" size="sm" className="mb-4 w-fit mx-auto sm:mx-0" asChild>
            <Link href="/design-studio">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design Studio
            </Link>
          </Button>
          <Construction className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="font-headline text-2xl">Create New Design</CardTitle>
          <CardDescription>This is where your creative journey begins!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is currently under construction. Imagine a powerful design canvas here,
            equipped with all the tools you need to bring your project ideas to life.
          </p>
          <p className="text-muted-foreground mt-4">
            You'd be able to select templates, draw, add text, import assets, and collaborate with teammates.
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
