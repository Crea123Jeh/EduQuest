import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Brush, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function DesignStudioPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-10 w-10 text-accent" />
            <div>
              <CardTitle className="font-headline text-3xl">In-Game Design Studio</CardTitle>
              <CardDescription className="text-lg">
                Unleash your creativity! Design posters, models, and more for your interdisciplinary projects.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-muted-foreground mb-4">
                Welcome to the EduQuest Design Studio! This space is for bringing your ideas to life. Whether you&apos;re designing a campaign poster for a social studies project, creating a 3D model for science, or illustrating a story for language arts, this is your canvas.
              </p>
              <p className="text-muted-foreground mb-6">
                Our studio supports various tools and integrations, allowing you to seamlessly blend art with your academic quests. For example, in the &quot;Mission Penyelamatan Bumi&quot; project, you might design a campaign poster here after calculating carbon emissions in the Math zone and analyzing economic impacts in the IPS zone.
              </p>
              <div className="flex gap-4">
                <Button>
                  <Brush className="mr-2 h-4 w-4" /> Start New Design
                </Button>
                <Button variant="outline">
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Existing Work
                </Button>
              </div>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Design Studio Interface Mockup" 
                width={600} 
                height={400}
                className="rounded-lg shadow-md border"
                data-ai-hint="digital art tablet"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                (Imagine a vibrant, interactive design interface here!)
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-headline text-xl font-semibold mb-4">Example Projects:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Design a sustainable city layout (Math, Science, Social Studies).</li>
              <li>Create a historical comic strip (History, Art, Language Arts).</li>
              <li>Animate a short film explaining a scientific concept (Science, Art, Technology).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
