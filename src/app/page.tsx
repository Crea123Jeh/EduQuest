import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingHeader } from '@/components/LandingHeader';
import { LandingFooter } from '@/components/LandingFooter';
import { CheckCircle, Users, Brain, Palette, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Users className="h-8 w-8 text-accent" />,
    title: '3D Learning Zones',
    description: 'Immersive environments for History, Math, Science, optimized for all devices.',
    image: 'https://placehold.co/600x400.png',
    aiHint: '3d classroom',
  },
  {
    icon: <Brain className="h-8 w-8 text-accent" />,
    title: 'AI Dynamic Quests',
    description: 'Personalized questions adapting to student learning, integrated with Google Classroom.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'ai education',
  },
  {
    icon: <Palette className="h-8 w-8 text-accent" />,
    title: 'In-Game Design Studio',
    description: 'Foster creativity with interdisciplinary projects combining various subjects.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'digital art studio',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-accent" />,
    title: 'Reflection Chamber',
    description: 'Guided reflections on teamwork, ethics, and emotional intelligence.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'meditation space',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-grow">
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              EduQuest: Learn with <span className="text-accent">Heart</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground sm:text-xl">
              An innovative collaborative gamified platform fostering compassion through interactive learning. Transform screen time into a journey of knowledge and empathy.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">Empowering Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover how EduQuest makes learning engaging, collaborative, and compassionate.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-md mb-4"
                      data-ai-hint={feature.aiHint}
                    />
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">About EduQuest</h2>
                <p className="mt-6 text-lg text-muted-foreground">
                  EduQuest is more than just a game; it's a movement to harness technology for character-based education. We blend AI, captivating visuals, and compassionate gamification to turn smartphones from distractions into delightful windows of knowledge.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our mission is to cultivate not only tech-savvy individuals but empathetic, collaborative, and resilient learners ready to face future challenges. Join us in reshaping education, one quest at a time.
                </p>
              </div>
              <div>
                <Image 
                  src="https://placehold.co/600x450.png" 
                  alt="Collaborative learning" 
                  width={600} 
                  height={450} 
                  className="rounded-lg shadow-xl"
                  data-ai-hint="team students" 
                />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
             <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">Ready to Begin Your Quest?</h2>
             <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
               Join the EduQuest community and revolutionize the learning experience for your students or yourself.
             </p>
             <div className="mt-8">
               <Button size="lg" asChild>
                 <Link href="/signup">Sign Up Now and Explore</Link>
               </Button>
             </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
