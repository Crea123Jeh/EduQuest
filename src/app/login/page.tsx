
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation'
import { useState, useEffect } from 'react';

const pageTranslations = {
  en: {
    welcomeBack: 'Welcome Back!',
    loginToContinue: 'Log in to continue your learning adventure.',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    loginButton: 'Log In',
    forgotPasswordLink: 'Forgot your password?',
    noAccountPrompt: "Don't have an account?",
    signUpLink: 'Sign up',
  },
  id: {
    welcomeBack: 'Selamat Datang Kembali!',
    loginToContinue: 'Masuk untuk melanjutkan petualangan belajarmu.',
    emailLabel: 'Email',
    emailPlaceholder: 'anda@contoh.com',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: '••••••••',
    loginButton: 'Masuk',
    forgotPasswordLink: 'Lupa kata sandi Anda?',
    noAccountPrompt: 'Belum punya akun?',
    signUpLink: 'Daftar',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'id'>('en');

  useEffect(() => {
    const savedSettings = localStorage.getItem('user-app-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      if (parsedSettings.language && (parsedSettings.language === 'en' || parsedSettings.language === 'id')) {
        setCurrentLanguage(parsedSettings.language);
      }
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login form submitted');
    // On successful login, redirect to dashboard
    router.push('/dashboard'); 
  };

  const t = pageTranslations[currentLanguage] || pageTranslations.en;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/30 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-4" iconSize={32} textSize="text-3xl" href="/" />
          <CardTitle className="font-headline text-2xl">{t.welcomeBack}</CardTitle>
          <CardDescription>{t.loginToContinue}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input id="email" type="email" placeholder={t.emailPlaceholder} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" placeholder={t.passwordPlaceholder} required />
            </div>
            <Button type="submit" className="w-full">
              {t.loginButton}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="#" className="text-sm text-accent hover:underline">
            {t.forgotPasswordLink}
          </Link>
          <p className="text-sm text-muted-foreground">
            {t.noAccountPrompt}{' '}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              {t.signUpLink}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
