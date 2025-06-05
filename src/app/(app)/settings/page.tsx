
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Palette, Shield, Volume2, Languages, UserCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeProvider';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEffects: boolean;
  language: string;
  dataSharing: boolean;
  // darkMode is handled by useTheme now
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme, toggleTheme } = useTheme();
  
  // State for settings other than dark mode
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: false,
    soundEffects: true,
    language: 'en',
    dataSharing: true,
  });

  // Effect to potentially load settings from localStorage (excluding dark mode)
  useEffect(() => {
    // Placeholder for loading other settings if they were persisted
    // For example:
    // const savedSettings = localStorage.getItem('user-app-settings');
    // if (savedSettings) {
    //   setSettings(JSON.parse(savedSettings));
    // }
  }, []);


  const handleSettingChange = (key: keyof UserSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call for saving settings (excluding dark mode)
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Placeholder for saving other settings if they were persisted
    // For example:
    // localStorage.setItem('user-app-settings', JSON.stringify(settings));
    console.log("Non-theme settings saved:", settings);
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
    setIsSaving(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account preferences and application settings.</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6 text-accent" /> Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Alex Chen" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="alex.chen@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="New Password" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-6 w-6 text-accent" /> Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive updates about new quests and classroom activities.
                </span>
              </Label>
              <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(val) => handleSettingChange('emailNotifications', val)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Get real-time alerts on your device.
                </span>
              </Label>
              <Switch id="pushNotifications" checked={settings.pushNotifications} onCheckedChange={(val) => handleSettingChange('pushNotifications', val)} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-6 w-6 text-accent" /> Appearance & Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes.
                </span>
              </Label>
              <Switch id="darkMode" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
             <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="soundEffects" className="flex flex-col space-y-1">
                <span>Sound Effects</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enable or disable in-game sound effects. (Audio Description for visually impaired is a separate feature.)
                </span>
              </Label>
              <Switch id="soundEffects" checked={settings.soundEffects} onCheckedChange={(val) => handleSettingChange('soundEffects', val)} />
            </div>
             <Separator />
             <div>
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(val) => handleSettingChange('language', val as string)}>
                  <SelectTrigger id="language" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6 text-accent" /> Privacy & Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="dataSharing" className="flex flex-col space-y-1">
                <span>Data Sharing for AI Personalization</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow EduQuest to use your learning data to personalize quests and content (e.g., via Google Classroom integration).
                </span>
              </Label>
              <Switch id="dataSharing" checked={settings.dataSharing} onCheckedChange={(val) => handleSettingChange('dataSharing', val)} />
            </div>
            <Separator />
            <div>
              <Button variant="outline">Download My Data</Button>
              <Button variant="destructive" className="ml-2">Delete Account</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For more information, please review our <Link href="/privacy-policy" className="underline text-accent">Privacy Policy</Link> and <Link href="/terms-of-service" className="underline text-accent">Terms of Service</Link>.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
             <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
