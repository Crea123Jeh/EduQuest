
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
  Wand2,
  Palette,
  Brain,
  UserCircle,
  Settings,
  LogOut,
  BookOpenCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  labelKey: string; // Key for translation
  icon: LucideIcon;
  matchSegments?: number;
}

const sidebarTranslations = {
  en: {
    dashboard: 'Dashboard',
    learningZones: 'Learning Zones',
    classrooms: 'Classrooms',
    questGenerator: 'Quest Generator',
    designStudio: 'Design Studio',
    reflectionChamber: 'Reflection Chamber',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
  },
  id: {
    dashboard: 'Dasbor',
    learningZones: 'Zona Belajar',
    classrooms: 'Ruang Kelas',
    questGenerator: 'Generator Misi',
    designStudio: 'Studio Desain',
    reflectionChamber: 'Ruang Refleksi',
    profile: 'Profil',
    settings: 'Pengaturan',
    logout: 'Keluar',
  }
};

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard, matchSegments: 1 },
  { href: '/learning-zones', labelKey: 'learningZones', icon: Shapes, matchSegments: 1 },
  { href: '/classrooms', labelKey: 'classrooms', icon: Users, matchSegments: 1 },
  { href: '/quests', labelKey: 'questGenerator', icon: Wand2, matchSegments: 1 },
  { href: '/design-studio', labelKey: 'designStudio', icon: Palette, matchSegments: 1 },
  { href: '/reflection-chamber', labelKey: 'reflectionChamber', icon: Brain, matchSegments: 1 },
];

const bottomNavItems: NavItem[] = [
  { href: '/profile', labelKey: 'profile', icon: UserCircle, matchSegments: 1 },
  { href: '/settings', labelKey: 'settings', icon: Settings, matchSegments: 1 },
];

export function AppSidebar() {
  const pathname = usePathname();
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
        } catch (e) { console.error("Error reading lang for AppSidebar", e); }
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

  const t = sidebarTranslations[lang];

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
            <SidebarMenuItem key={item.labelKey}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href, item.matchSegments)}
                  tooltip={{ children: t[item.labelKey as keyof typeof t] || item.labelKey, side: 'right', className: "ml-1" }}
                >
                  <item.icon />
                  <span>{t[item.labelKey as keyof typeof t] || item.labelKey}</span>
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
            <SidebarMenuItem key={item.labelKey}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href, item.matchSegments)}
                   tooltip={{ children: t[item.labelKey as keyof typeof t] || item.labelKey, side: 'right', className: "ml-1" }}
                >
                  <item.icon />
                  <span>{t[item.labelKey as keyof typeof t] || item.labelKey}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton tooltip={{ children: t.logout, side: 'right', className: "ml-1" }}>
                <LogOut />
                <span>{t.logout}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
