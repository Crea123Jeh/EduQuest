
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
// Sheet components are not used here, can be removed if AppSidebar manages its own mobile state fully.
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; 
import { Menu, Search, Bell, Settings, User, LogOut, Star, CheckCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

interface MockNotification {
  id: string;
  titleKey: string; // Key for translation
  descriptionKey: string; // Key for translation
  read: boolean;
  timestamp: string; 
}

const headerTranslations = {
  en: {
    searchPlaceholder: "Search quests, zones...",
    notificationsLabel: "Notifications",
    newLabel: "New",
    noNotifications: "No new notifications",
    markAllAsRead: "Mark all as read",
    viewAllNotifications: "View all notifications",
    myAccountLabel: "My Account",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    notificationQuestAlertTitle: "New Quest Alert!",
    notificationQuestAlertDesc: "The \"Ancient Robots\" quest is now available in the Tech Zone.",
    notificationClassroomUpdateTitle: "Classroom Update",
    notificationClassroomUpdateDesc: "Mr. Turing posted an announcement in \"Creative Coders Club\".",
    notificationAchievementTitle: "Achievement Unlocked!",
    notificationAchievementDesc: "You earned the \"Collaborator King\" badge.",
    notificationReminderTitle: "Reminder",
    notificationReminderDesc: "Your reflection for \"Silk Road Masters\" is due tomorrow.",
  },
  id: {
    searchPlaceholder: "Cari quest, zona...",
    notificationsLabel: "Notifikasi",
    newLabel: "Baru",
    noNotifications: "Tidak ada notifikasi baru",
    markAllAsRead: "Tandai semua sudah dibaca",
    viewAllNotifications: "Lihat semua notifikasi",
    myAccountLabel: "Akun Saya",
    profile: "Profil",
    settings: "Pengaturan",
    logout: "Keluar",
    notificationQuestAlertTitle: "Peringatan Quest Baru!",
    notificationQuestAlertDesc: "Quest \"Robot Kuno\" sekarang tersedia di Zona Teknologi.",
    notificationClassroomUpdateTitle: "Pembaruan Kelas",
    notificationClassroomUpdateDesc: "Pak Turing mengirim pengumuman di \"Klub Pemrogram Kreatif\".",
    notificationAchievementTitle: "Pencapaian Terbuka!",
    notificationAchievementDesc: "Anda mendapatkan lencana \"Raja Kolaborator\".",
    notificationReminderTitle: "Pengingat",
    notificationReminderDesc: "Refleksi Anda untuk \"Master Jalur Sutra\" akan jatuh tempo besok.",
  }
};

const initialMockNotifications: MockNotification[] = [
  { id: '1', titleKey: 'notificationQuestAlertTitle', descriptionKey: 'notificationQuestAlertDesc', timestamp: '5m ago', read: false },
  { id: '2', titleKey: 'notificationClassroomUpdateTitle', descriptionKey: 'notificationClassroomUpdateDesc', timestamp: '1h ago', read: false },
  { id: '3', titleKey: 'notificationAchievementTitle', descriptionKey: 'notificationAchievementDesc', timestamp: '3h ago', read: true },
  { id: '4', titleKey: 'notificationReminderTitle', descriptionKey: 'notificationReminderDesc', timestamp: '1d ago', read: true },
];

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const userPoints = 1250; // Mock points
  const [notifications, setNotifications] = useState<MockNotification[]>(initialMockNotifications);
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
        } catch (e) { console.error("Error reading lang for AppHeader", e); }
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

  const t = headerTranslations[lang];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="hidden md:block">
        <Logo href="/dashboard" iconSize={24} textSize="text-xl" />
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.searchPlaceholder}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-4 justify-center p-0.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>{t.notificationsLabel}</span>
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} {t.newLabel}</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <DropdownMenuItem disabled className="justify-center text-muted-foreground py-4">
                  {t.noNotifications}
                </DropdownMenuItem>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start gap-1 whitespace-normal ${!notification.read ? 'bg-accent/50 hover:bg-accent/70' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="font-semibold text-sm">{t[notification.titleKey as keyof typeof t] || notification.titleKey}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t[notification.descriptionKey as keyof typeof t] || notification.descriptionKey}</p>
                    <p className="text-xs text-muted-foreground/70 self-end">{notification.timestamp}</p>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  {t.markAllAsRead}
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/notifications"> {/* Assuming a dedicated notifications page */}
                    {t.viewAllNotifications}
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-1 h-auto">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground pr-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{userPoints}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person avatar"/>
                  <AvatarFallback>EQ</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.myAccountLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>{t.profile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t.settings}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/"> 
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
