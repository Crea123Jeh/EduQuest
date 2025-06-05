import { Sparkles } from 'lucide-react';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  iconSize?: number;
  textSize?: string;
  href?: string;
};

export function Logo({ className, iconSize = 28, textSize = 'text-2xl', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <Sparkles className="text-primary" size={iconSize} />
      <span className={`font-headline font-bold ${textSize} text-foreground`}>EduQuest</span>
    </Link>
  );
}
