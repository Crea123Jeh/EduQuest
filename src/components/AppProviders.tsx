
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Inner component to handle routing logic and suspend if necessary
function SplashHandler({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClientReady, setIsClientReady] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    setIsClientReady(true); // Signal that client-side hooks are ready
  }, []);

  useEffect(() => {
    if (!isClientReady) {
      // Don't run redirection logic until client is ready and hooks have updated.
      return;
    }

    const splashCompleted = searchParams.get('splashCompleted');

    if (pathname === '/landing') {
      setShouldRenderChildren(true); // Let landing page render itself
      return;
    }
    
    if (pathname === '/') { // Exclude marketing root page
      setShouldRenderChildren(true);
      return;
    }

    if (splashCompleted === 'true') {
      setShouldRenderChildren(true);
      return;
    }

    // If none of the above, we need to show the splash.
    setShouldRenderChildren(false); // Don't render children while redirecting
    
    const originalQuery = searchParams.toString();
    const redirectQueryString = originalQuery ? `?${originalQuery}` : '';
    const targetRedirectUrl = pathname + redirectQueryString;
    
    // Defer push to next tick to ensure state updates are processed
    // and to potentially avoid router conflicts if called too early.
    const animationFrameId = requestAnimationFrame(() => {
        router.push(`/landing?redirect=${encodeURIComponent(targetRedirectUrl)}`);
    });
    
    return () => cancelAnimationFrame(animationFrameId);

  }, [isClientReady, pathname, router, searchParams]);

  if (!isClientReady || !shouldRenderChildren) {
    // Return null (or a global loader) if client isn't ready or if we are redirecting/children shouldn't render yet.
    // This helps prevent rendering the target page content before a redirect to the splash.
    return null; 
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eduquest-theme">
      {/* Suspense boundary is crucial for useSearchParams in SplashHandler */}
      <Suspense fallback={null}> {/* Fallback can be a global loader or null */}
        <SplashHandler>{children}</SplashHandler>
      </Suspense>
    </ThemeProvider>
  );
}
