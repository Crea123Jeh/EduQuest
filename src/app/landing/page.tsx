
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

export default function LandingAnimationPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to the main home page (src/app/page.tsx)
    }, 2000); // 2 seconds total for splash screen

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-popup">
        <Logo iconSize={64} textSize="text-5xl" />
      </div>
      {/* Scoped CSS for the pop-up animation */}
      <style jsx global>{`
        @keyframes popUp {
          0% {
            transform: scale(0.5) translateY(30px);
            opacity: 0;
          }
          70% {
            transform: scale(1.1) translateY(0px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
        }

        .animate-popup {
          animation: popUp 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </div>
  );
}
