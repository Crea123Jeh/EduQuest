
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Brush, UploadCloud, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // Added for file input

export default function DesignStudioPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      // Simulate upload
      toast({
        title: 'File Selected',
        description: `${file.name} would be uploaded. (This is a prototype feature)`,
      });
      // Reset file input for next selection
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setSelectedFileName(null);
    }
  };

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
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/design-studio/new">
                    <Brush className="mr-2 h-4 w-4" /> Start New Design
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleUploadClick}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Existing Work
                </Button>
                <Input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*, .pdf, .doc, .docx, .ppt, .pptx, .txt" // Example file types
                />
              </div>
              {selectedFileName && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected file for "upload": {selectedFileName}
                </p>
              )}
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
