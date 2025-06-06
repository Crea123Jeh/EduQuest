
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Brush, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const pageTranslations = {
  en: {
    title: "In-Game Design Studio",
    description: "Unleash your creativity! Design posters, models, and more for your interdisciplinary projects.",
    welcomeMessage1: "Welcome to the EduQuest Design Studio! This space is for bringing your ideas to life. Whether you're designing a campaign poster for a social studies project, creating a 3D model for science, or illustrating a story for language arts, this is your canvas.",
    welcomeMessage2: "Our studio supports various tools and integrations, allowing you to seamlessly blend art with your academic quests. For example, in the \"Mission Penyelamatan Bumi\" project, you might design a campaign poster here after calculating carbon emissions in the Math zone and analyzing economic impacts in the IPS zone.",
    startNewDesignButton: "Start New Design",
    uploadWorkButton: "Upload Existing Work",
    selectedFileMessage: (fileName: string) => `Selected file for "upload": ${fileName}`,
    imageCaption: "(Imagine a vibrant, interactive design interface here!)",
    exampleProjectsTitle: "Example Projects:",
    exampleProject1: "Design a sustainable city layout (Math, Science, Social Studies).",
    exampleProject2: "Create a historical comic strip (History, Art, Language Arts).",
    exampleProject3: "Animate a short film explaining a scientific concept (Science, Art, Technology).",
    toastFileSelectedTitle: "File Selected",
    toastFileSelectedDescription: (fileName: string) => `${fileName} would be uploaded. (This is a prototype feature)`,
  },
  id: {
    title: "Studio Desain Dalam Game",
    description: "Bebaskan kreativitas Anda! Rancang poster, model, dan lainnya untuk proyek interdisipliner Anda.",
    welcomeMessage1: "Selamat datang di Studio Desain EduQuest! Ruang ini untuk mewujudkan ide-ide Anda. Baik Anda merancang poster kampanye untuk proyek IPS, membuat model 3D untuk sains, atau mengilustrasikan cerita untuk seni bahasa, inilah kanvas Anda.",
    welcomeMessage2: "Studio kami mendukung berbagai alat dan integrasi, memungkinkan Anda memadukan seni dengan mulus dengan misi akademis Anda. Misalnya, dalam proyek \"Misi Penyelamatan Bumi\", Anda dapat merancang poster kampanye di sini setelah menghitung emisi karbon di zona Matematika dan menganalisis dampak ekonomi di zona IPS.",
    startNewDesignButton: "Mulai Desain Baru",
    uploadWorkButton: "Unggah Karya yang Ada",
    selectedFileMessage: (fileName: string) => `File terpilih untuk "diunggah": ${fileName}`,
    imageCaption: "(Bayangkan antarmuka desain yang semarak dan interaktif di sini!)",
    exampleProjectsTitle: "Contoh Proyek:",
    exampleProject1: "Rancang tata letak kota yang berkelanjutan (Matematika, Sains, IPS).",
    exampleProject2: "Buat strip komik sejarah (Sejarah, Seni, Seni Bahasa).",
    exampleProject3: "Animasikan film pendek yang menjelaskan konsep ilmiah (Sains, Seni, Teknologi).",
    toastFileSelectedTitle: "File Dipilih",
    toastFileSelectedDescription: (fileName: string) => `${fileName} akan diunggah. (Ini adalah fitur prototipe)`,
  }
};


export default function DesignStudioPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'id'>('en');

  useEffect(() => {
    const updateLang = () => {
      const savedSettings = localStorage.getItem('user-app-settings');
      let newLang: 'en' | 'id' = 'en';
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language && (parsed.language === 'en' || parsed.language === 'id')) {
            newLang = parsed.language;
          }
        } catch (e) { console.error("Error reading lang for DesignStudioPage", e); }
      }
      setLang(newLang);
    };

    updateLang();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') {
        updateLang();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      toast({
        title: t.toastFileSelectedTitle,
        description: t.toastFileSelectedDescription(file.name),
      });
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
              <CardTitle className="font-headline text-3xl">{t.title}</CardTitle>
              <CardDescription className="text-lg">
                {t.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-muted-foreground mb-4">
                {t.welcomeMessage1}
              </p>
              <p className="text-muted-foreground mb-6">
                {t.welcomeMessage2}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/design-studio/new">
                    <Brush className="mr-2 h-4 w-4" /> {t.startNewDesignButton}
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleUploadClick}>
                  <UploadCloud className="mr-2 h-4 w-4" /> {t.uploadWorkButton}
                </Button>
                <Input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*, .pdf, .doc, .docx, .ppt, .pptx, .txt"
                />
              </div>
              {selectedFileName && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {t.selectedFileMessage(selectedFileName)}
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
                {t.imageCaption}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="font-headline text-xl font-semibold mb-4">{t.exampleProjectsTitle}</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t.exampleProject1}</li>
              <li>{t.exampleProject2}</li>
              <li>{t.exampleProject3}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
