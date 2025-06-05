
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
      let finalRedirectPath = searchParams.get('redirect');
      
      // Basic validation and default for redirectPath
      if (!finalRedirectPath || !finalRedirectPath.startsWith('/') || finalRedirectPath.length <= 1) {
        finalRedirectPath = '/dashboard'; // Default to dashboard
      }

      // Ensure finalRedirectPath doesn't already include splashCompleted from a malformed redirect
      // Use a try-catch for URL parsing as finalRedirectPath might be invalid
      let urlToPush: string;
      try {
        const url = new URL(finalRedirectPath, window.location.origin);
        url.searchParams.delete('splashCompleted'); // Remove if exists, to prevent duplication
        url.searchParams.append('splashCompleted', 'true');
        urlToPush = url.pathname + url.search;
      } catch (e) {
        // If finalRedirectPath is not a valid relative URL, fall back to a safe default
        console.warn("Invalid redirect path, defaulting to /dashboard with splashCompleted:", finalRedirectPath);
        urlToPush = '/dashboard?splashCompleted=true';
      }
      
      router.push(urlToPush);
    }, 1000); // Changed from 2000 to 1000 for 1 second delay

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
  // or when used in a component that might be part of a statically rendered tree.
  return (
    <Suspense fallback={null}> 
      <LandingAnimationContent />
    </Suspense>
  );
}

