'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Shapes,
  Users,
  Wand2, // Changed from Puzzle for Quest Generator
  Palette,
  Brain,
  UserCircle,
  Settings,
  LogOut,
  BookOpenCheck,
  History,
  FlaskConical,
  Calculator,
  Puzzle // Kept Puzzle in case it's used elsewhere, or can be removed if not
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchSegments?: number; // How many path segments to match for active state
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, matchSegments: 1 },
  { href: '/learning-zones', label: 'Learning Zones', icon: Shapes, matchSegments: 1 },
  { href: '/classrooms', label: 'Classrooms', icon: Users, matchSegments: 1 },
  { href: '/quests', label: 'Quest Generator', icon: Wand2, matchSegments: 1 },
  { href: '/design-studio', label: 'Design Studio', icon: Palette, matchSegments: 1 },
  { href: '/reflection-chamber', label: 'Reflection Chamber', icon: Brain, matchSegments: 1 },
];

const bottomNavItems: NavItem[] = [
  { href: '/profile', label: 'Profile', icon: UserCircle, matchSegments: 1 },
  { href: '/settings', label: 'Settings', icon: Settings, matchSegments: 1 },
];


export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, matchSegments?: number) => {
    if (matchSegments) {
      const pathSegments = pathname.split('/').filter(Boolean);
      const hrefSegments = href.split('/').filter(Boolean);
      if (pathSegments.length < matchSegments || hrefSegments.length < matchSegments) {
        return pathname === href;
      }
      return hrefSegments.slice(0, matchSegments).join('/') === pathSegments.slice(0, matchSegments).join('/');
    }
    return pathname === href;
  };
  
  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 items-start">
         {/* Logo visible when sidebar is expanded, trigger button when collapsed */}
        <div className="group-data-[state=expanded]:block group-data-[state=collapsed]:hidden">
          <Logo href="/dashboard" />
        </div>
         <div className="group-data-[state=collapsed]:block group-data-[state=expanded]:hidden">
          <BookOpenCheck className="h-7 w-7 text-accent" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href, item.matchSegments)}
                  tooltip={{ children: item.label, side: 'right', className: "ml-1" }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href, item.matchSegments)}
                   tooltip={{ children: item.label, side: 'right', className: "ml-1" }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton tooltip={{ children: "Logout", side: 'right', className: "ml-1" }}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
