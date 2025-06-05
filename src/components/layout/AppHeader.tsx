
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Bell, Settings, User, LogOut, Star, CheckCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface MockNotification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string; 
}

const initialMockNotifications: MockNotification[] = [
  { id: '1', title: 'New Quest Alert!', description: 'The "Ancient Robots" quest is now available in the Tech Zone.', timestamp: '5m ago', read: false },
  { id: '2', title: 'Classroom Update', description: 'Mr. Turing posted an announcement in "Creative Coders Club".', timestamp: '1h ago', read: false },
  { id: '3', title: 'Achievement Unlocked!', description: 'You earned the "Collaborator King" badge.', timestamp: '3h ago', read: true },
  { id: '4', title: 'Reminder', description: 'Your reflection for "Silk Road Masters" is due tomorrow.', timestamp: '1d ago', read: true },
];

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const userPoints = 1250; // Mock points
  const [notifications, setNotifications] = useState<MockNotification[]>(initialMockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // In a real app, you might navigate to the notification's subject here
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
              placeholder="Search quests, zones..."
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
              <span>Notifications</span>
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} New</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <DropdownMenuItem disabled className="justify-center text-muted-foreground py-4">
                  No new notifications
                </DropdownMenuItem>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start gap-1 whitespace-normal ${!notification.read ? 'bg-accent/50 hover:bg-accent/70' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="font-semibold text-sm">{notification.title}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
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
                  Mark all as read
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/notifications"> {/* Assuming a dedicated notifications page */}
                    View all notifications
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
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person avatar" />
                  <AvatarFallback>EQ</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/"> {/* Assuming logout redirects to landing page */}
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
