import { Logo } from '@/components/Logo';

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with compassion. © {new Date().getFullYear()} EduQuest. All rights reserved.
          </p>
        </div>
        {/* Add social media links or other footer content here if needed */}
      </div>
    </footer>
  );
}
