
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
  language: 'en' | 'id'; // Simplified for example
  dataSharing: boolean;
}

const pageTranslations = {
  en: {
    pageTitle: 'Settings',
    pageDescription: 'Manage your account preferences and application settings.',
    accountSettingsTitle: 'Account Settings',
    fullNameLabel: 'Full Name',
    emailAddressLabel: 'Email Address',
    changePasswordLabel: 'Change Password',
    newPasswordPlaceholder: 'New Password',
    notificationSettingsTitle: 'Notification Settings',
    emailNotificationsLabel: 'Email Notifications',
    emailNotificationsDescription: 'Receive updates about new quests and classroom activities.',
    pushNotificationsLabel: 'Push Notifications',
    pushNotificationsDescription: 'Get real-time alerts on your device.',
    appearanceSettingsTitle: 'Appearance & Accessibility',
    darkModeLabel: 'Dark Mode',
    darkModeDescription: 'Toggle between light and dark themes.',
    soundEffectsLabel: 'Sound Effects',
    soundEffectsDescription: 'Enable or disable in-game sound effects. (Audio Description for visually impaired is a separate feature.)',
    languageLabel: 'Language',
    privacySettingsTitle: 'Privacy & Data',
    dataSharingLabel: 'Data Sharing for AI Personalization',
    dataSharingDescription: 'Allow EduQuest to use your learning data to personalize quests and content (e.g., via Google Classroom integration).',
    downloadDataButton: 'Download My Data',
    deleteAccountButton: 'Delete Account',
    privacyPolicyLink: 'Privacy Policy',
    termsOfServiceLink: 'Terms of Service',
    saveChangesButton: 'Save Changes',
    savingChangesButton: 'Saving Changes...',
    settingsUpdatedTitle: 'Settings Updated',
    settingsUpdatedDescription: 'Your preferences have been saved successfully.',
  },
  id: {
    pageTitle: 'Pengaturan',
    pageDescription: 'Kelola preferensi akun dan pengaturan aplikasi Anda.',
    accountSettingsTitle: 'Pengaturan Akun',
    fullNameLabel: 'Nama Lengkap',
    emailAddressLabel: 'Alamat Email',
    changePasswordLabel: 'Ubah Kata Sandi',
    newPasswordPlaceholder: 'Kata Sandi Baru',
    notificationSettingsTitle: 'Pengaturan Notifikasi',
    emailNotificationsLabel: 'Notifikasi Email',
    emailNotificationsDescription: 'Terima pembaruan tentang quest baru dan aktivitas kelas.',
    pushNotificationsLabel: 'Notifikasi Push',
    pushNotificationsDescription: 'Dapatkan lansiran waktu nyata di perangkat Anda.',
    appearanceSettingsTitle: 'Tampilan & Aksesibilitas',
    darkModeLabel: 'Mode Gelap',
    darkModeDescription: 'Beralih antara tema terang dan gelap.',
    soundEffectsLabel: 'Efek Suara',
    soundEffectsDescription: 'Aktifkan atau nonaktifkan efek suara dalam game. (Deskripsi Audio untuk tunanetra adalah fitur terpisah.)',
    languageLabel: 'Bahasa',
    privacySettingsTitle: 'Privasi & Data',
    dataSharingLabel: 'Berbagi Data untuk Personalisasi AI',
    dataSharingDescription: 'Izinkan EduQuest menggunakan data pembelajaran Anda untuk mempersonalisasi quest dan konten (misalnya, melalui integrasi Google Classroom).',
    downloadDataButton: 'Unduh Data Saya',
    deleteAccountButton: 'Hapus Akun',
    privacyPolicyLink: 'Kebijakan Privasi',
    termsOfServiceLink: 'Ketentuan Layanan',
    saveChangesButton: 'Simpan Perubahan',
    savingChangesButton: 'Menyimpan Perubahan...',
    settingsUpdatedTitle: 'Pengaturan Diperbarui',
    settingsUpdatedDescription: 'Preferensi Anda telah berhasil disimpan.',
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: false,
    soundEffects: true,
    language: 'en', // Default language
    dataSharing: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('user-app-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Ensure language is one of the allowed values, default to 'en' if not
      if (parsedSettings.language && (parsedSettings.language === 'en' || parsedSettings.language === 'id')) {
        setSettings(parsedSettings);
      } else {
        setSettings({ ...parsedSettings, language: 'en' });
      }
    }
  }, []);

  const handleSettingChange = (key: keyof Omit<UserSettings, 'language'>, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = (value: 'en' | 'id') => {
    setSettings(prev => ({ ...prev, language: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem('user-app-settings', JSON.stringify(settings));
    console.log("Non-theme settings saved:", settings);
    toast({
      title: currentTranslations.settingsUpdatedTitle,
      description: currentTranslations.settingsUpdatedDescription,
    });
    setIsSaving(false);
  };

  const currentTranslations = pageTranslations[settings.language] || pageTranslations.en;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold text-foreground">{currentTranslations.pageTitle}</h1>
          <p className="text-lg text-muted-foreground">{currentTranslations.pageDescription}</p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6 text-accent" /> {currentTranslations.accountSettingsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">{currentTranslations.fullNameLabel}</Label>
              <Input id="name" defaultValue="Alex Chen" />
            </div>
            <div>
              <Label htmlFor="email">{currentTranslations.emailAddressLabel}</Label>
              <Input id="email" type="email" defaultValue="alex.chen@example.com" />
            </div>
            <div>
              <Label htmlFor="password">{currentTranslations.changePasswordLabel}</Label>
              <Input id="password" type="password" placeholder={currentTranslations.newPasswordPlaceholder} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-6 w-6 text-accent" /> {currentTranslations.notificationSettingsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>{currentTranslations.emailNotificationsLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {currentTranslations.emailNotificationsDescription}
                </span>
              </Label>
              <Switch id="emailNotifications" checked={settings.emailNotifications} onCheckedChange={(val) => handleSettingChange('emailNotifications', val)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                <span>{currentTranslations.pushNotificationsLabel}</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  {currentTranslations.pushNotificationsDescription}
                </span>
              </Label>
              <Switch id="pushNotifications" checked={settings.pushNotifications} onCheckedChange={(val) => handleSettingChange('pushNotifications', val)} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-6 w-6 text-accent" /> {currentTranslations.appearanceSettingsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                <span>{currentTranslations.darkModeLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {currentTranslations.darkModeDescription}
                </span>
              </Label>
              <Switch id="darkMode" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
             <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="soundEffects" className="flex flex-col space-y-1">
                <span>{currentTranslations.soundEffectsLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {currentTranslations.soundEffectsDescription}
                </span>
              </Label>
              <Switch id="soundEffects" checked={settings.soundEffects} onCheckedChange={(val) => handleSettingChange('soundEffects', val)} />
            </div>
             <Separator />
             <div>
                <Label htmlFor="language">{currentTranslations.languageLabel}</Label>
                <Select value={settings.language} onValueChange={(val) => handleLanguageChange(val as 'en' | 'id')}>
                  <SelectTrigger id="language" className="mt-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    {/* <SelectItem value="es">Español</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6 text-accent" /> {currentTranslations.privacySettingsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="dataSharing" className="flex flex-col space-y-1">
                <span>{currentTranslations.dataSharingLabel}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {currentTranslations.dataSharingDescription}
                </span>
              </Label>
              <Switch id="dataSharing" checked={settings.dataSharing} onCheckedChange={(val) => handleSettingChange('dataSharing', val)} />
            </div>
            <Separator />
            <div>
              <Button variant="outline">{currentTranslations.downloadDataButton}</Button>
              <Button variant="destructive" className="ml-2">{currentTranslations.deleteAccountButton}</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For more information, please review our <Link href="/privacy-policy" className="underline text-accent">{currentTranslations.privacyPolicyLink}</Link> and <Link href="/terms-of-service" className="underline text-accent">{currentTranslations.termsOfServiceLink}</Link>.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
             <Save className="mr-2 h-4 w-4" /> {isSaving ? currentTranslations.savingChangesButton : currentTranslations.saveChangesButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

