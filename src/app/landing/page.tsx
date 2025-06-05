
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Suspense } from 'react';

function LandingAnimationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      const redirectPath = searchParams.get('redirect');
      // Basic validation for redirectPath (starts with / and is not just /)
      // More robust validation might be needed depending on requirements.
      if (redirectPath && redirectPath.startsWith('/') && redirectPath.length > 1) {
        router.push(redirectPath);
      } else {
        router.push('/dashboard'); // Default to dashboard if no valid redirect or just going to /landing
      }
    }, 2000); // 2 seconds total for splash screen

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router, searchParams]);

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


export default function LandingAnimationPage() {
  // Wrap with Suspense because useSearchParams() needs it for static rendering
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <LandingAnimationContent />
    </Suspense>
  );
}
