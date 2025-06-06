
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, ShieldCheck, ShieldOff, CheckCircle, XCircle, RotateCcw, Wifi, Server, AlertTriangleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const questDetails = {
  id: 't_q2',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'technology',
  zoneNameKey: 'zoneName',
  type: 'Individual',
  difficulty: 'Medium',
  points: 160,
};

interface PacketInfo {
  id: string;
  sourceIpKey: string;
  destPortKey: string;
  protocolKey: string;
  descriptionKey: string;
  threatLevelKey: 'info' | 'low' | 'medium' | 'high' | 'critical';
  correctAction: 'allow' | 'deny';
  securityImpact: {
    correct: number; // Points gained or 0 if no change for correct action
    incorrectDeny: number; // Penalty for incorrectly denying a safe packet
    incorrectAllow: number; // Penalty for incorrectly allowing a threat
  };
}

const INITIAL_SECURITY_SCORE = 100;
const MIN_SECURITY_FOR_WIN = 70;

const PACKET_SCENARIOS: PacketInfo[] = [
  {
    id: 'p1',
    sourceIpKey: 'packet1Source',
    destPortKey: 'packet1DestPort',
    protocolKey: 'protocolTCP',
    descriptionKey: 'packet1Desc',
    threatLevelKey: 'info',
    correctAction: 'allow',
    securityImpact: { correct: 0, incorrectDeny: -5, incorrectAllow: 0 },
  },
  {
    id: 'p2',
    sourceIpKey: 'packet2Source',
    destPortKey: 'packet2DestPort',
    protocolKey: 'protocolUDP',
    descriptionKey: 'packet2Desc',
    threatLevelKey: 'high',
    correctAction: 'deny',
    securityImpact: { correct: 5, incorrectDeny: 0, incorrectAllow: -25 },
  },
  {
    id: 'p3',
    sourceIpKey: 'packet3Source',
    destPortKey: 'packet3DestPort',
    protocolKey: 'protocolTCP',
    descriptionKey: 'packet3Desc',
    threatLevelKey: 'low',
    correctAction: 'allow',
    securityImpact: { correct: 0, incorrectDeny: -10, incorrectAllow: 0 },
  },
  {
    id: 'p4',
    sourceIpKey: 'packet4Source',
    destPortKey: 'packet4DestPort',
    protocolKey: 'protocolTCP',
    descriptionKey: 'packet4Desc',
    threatLevelKey: 'critical',
    correctAction: 'deny',
    securityImpact: { correct: 10, incorrectDeny: 0, incorrectAllow: -40 },
  },
    {
    id: 'p5',
    sourceIpKey: 'packet5Source',
    destPortKey: 'packet5DestPort',
    protocolKey: 'protocolUDP',
    descriptionKey: 'packet5Desc',
    threatLevelKey: 'medium',
    correctAction: 'deny',
    securityImpact: { correct: 5, incorrectDeny: 0, incorrectAllow: -15 },
  },
];

const pageTranslations = {
  en: {
    questTitle: "Cybersecurity: Firewall Configuration",
    questDescription: "Malicious packets are trying to infiltrate the network! Analyze incoming traffic and configure firewall actions (Allow/Deny) to block threats while permitting legitimate services. Maintain system security above 70% to succeed.",
    zoneName: "Tech Hub",
    backToZone: "Back to Tech Hub",
    packetAnalysisTitle: "Incoming Packet Analysis",
    packetNumber: (current: number, total: number) => `Packet ${current} of ${total}`,
    sourceIpLabel: "Source IP:",
    destPortLabel: "Destination Port:",
    protocolLabel: "Protocol:",
    descriptionLabel: "Description:",
    threatLevelLabel: "Threat Level:",
    actionAllow: "Allow Packet",
    actionDeny: "Deny Packet",
    systemSecurityLabel: "System Security:",
    feedbackCorrectAllow: (desc: string) => `Correctly ALLOWED: ${desc}. Network services maintained.`,
    feedbackCorrectDeny: (desc: string) => `Correctly DENIED: ${desc}. Threat neutralized. Security improved.`,
    feedbackIncorrectDeny: (desc: string) => `Incorrectly DENIED: ${desc}. Legitimate service disrupted! Security impacted.`,
    feedbackIncorrectAllow: (desc: string) => `Incorrectly ALLOWED: ${desc}. Threat infiltrated! Security compromised.`,
    feedbackNoSelection: "Please choose an action (Allow/Deny) for the packet.",
    outcomeWin: "Firewall Configured Successfully! Network secured. Excellent threat assessment!",
    outcomeLossSecurity: "System Security Breached! The network is vulnerable due to multiple misconfigurations.",
    restartButton: "Restart Simulation",
    claimRewardButton: "Finalize Security Report",
    toastRewardTitle: "Security Report Filed!",
    toastRewardDescription: (points: number, outcome: string) => `You earned ${points} points. System Status: ${outcome}`,
    threatLevelInfo: "Informational",
    threatLevelLow: "Low",
    threatLevelMedium: "Medium",
    threatLevelHigh: "High",
    threatLevelCritical: "Critical",
    protocolTCP: "TCP",
    protocolUDP: "UDP",
    packet1Source: "192.168.1.10 (Internal Server)",
    packet1DestPort: "Port 80 (HTTP)",
    packet1Desc: "Standard web traffic to internal documentation server.",
    packet2Source: "103.45.12.78 (Unknown External)",
    packet2DestPort: "Port 3389 (RDP)",
    packet2Desc: "Attempted Remote Desktop connection from an unrecognized external IP.",
    packet3Source: "203.0.113.15 (Partner API)",
    packet3DestPort: "Port 443 (HTTPS)",
    packet3Desc: "Secure API call from a trusted partner service.",
    packet4Source: "45.78.190.23 (Known Botnet C&C)",
    packet4DestPort: "Port 6667 (IRC)",
    packet4Desc: "Connection attempt from a known Command & Control server for a botnet.",
    packet5Source: "172.16.0.55 (Internal Device)",
    packet5DestPort: "Port 53 (DNS Query)",
    packet5Desc: "Outbound DNS query to an unauthorized external DNS server with a bad reputation.",
  },
  id: {
    questTitle: "Keamanan Siber: Konfigurasi Firewall",
    questDescription: "Paket berbahaya mencoba menyusup ke jaringan! Analisis lalu lintas masuk dan konfigurasikan tindakan firewall (Izinkan/Tolak) untuk memblokir ancaman sambil mengizinkan layanan yang sah. Pertahankan keamanan sistem di atas 70% untuk berhasil.",
    zoneName: "Pusat Teknologi",
    backToZone: "Kembali ke Pusat Teknologi",
    packetAnalysisTitle: "Analisis Paket Masuk",
    packetNumber: (current: number, total: number) => `Paket ${current} dari ${total}`,
    sourceIpLabel: "IP Sumber:",
    destPortLabel: "Port Tujuan:",
    protocolLabel: "Protokol:",
    descriptionLabel: "Deskripsi:",
    threatLevelLabel: "Tingkat Ancaman:",
    actionAllow: "Izinkan Paket",
    actionDeny: "Tolak Paket",
    systemSecurityLabel: "Keamanan Sistem:",
    feedbackCorrectAllow: (desc: string) => `Benar IZINKAN: ${desc}. Layanan jaringan dipertahankan.`,
    feedbackCorrectDeny: (desc: string) => `Benar TOLAK: ${desc}. Ancaman dinetralisir. Keamanan ditingkatkan.`,
    feedbackIncorrectDeny: (desc: string) => `Salah TOLAK: ${desc}. Layanan sah terganggu! Keamanan terdampak.`,
    feedbackIncorrectAllow: (desc: string) => `Salah IZINKAN: ${desc}. Ancaman menyusup! Keamanan terganggu.`,
    feedbackNoSelection: "Silakan pilih tindakan (Izinkan/Tolak) untuk paket.",
    outcomeWin: "Konfigurasi Firewall Berhasil! Jaringan aman. Penilaian ancaman yang sangat baik!",
    outcomeLossSecurity: "Keamanan Sistem Dilanggar! Jaringan rentan karena beberapa kesalahan konfigurasi.",
    restartButton: "Ulangi Simulasi",
    claimRewardButton: "Finalisasi Laporan Keamanan",
    toastRewardTitle: "Laporan Keamanan Diajukan!",
    toastRewardDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Status Sistem: ${outcome}`,
    threatLevelInfo: "Informasi",
    threatLevelLow: "Rendah",
    threatLevelMedium: "Sedang",
    threatLevelHigh: "Tinggi",
    threatLevelCritical: "Kritis",
    protocolTCP: "TCP",
    protocolUDP: "UDP",
    packet1Source: "192.168.1.10 (Server Internal)",
    packet1DestPort: "Port 80 (HTTP)",
    packet1Desc: "Lalu lintas web standar ke server dokumentasi internal.",
    packet2Source: "103.45.12.78 (Eksternal Tidak Dikenal)",
    packet2DestPort: "Port 3389 (RDP)",
    packet2Desc: "Upaya koneksi Remote Desktop dari IP eksternal yang tidak dikenal.",
    packet3Source: "203.0.113.15 (API Mitra)",
    packet3DestPort: "Port 443 (HTTPS)",
    packet3Desc: "Panggilan API aman dari layanan mitra tepercaya.",
    packet4Source: "45.78.190.23 (Botnet C&C Dikenal)",
    packet4DestPort: "Port 6667 (IRC)",
    packet4Desc: "Upaya koneksi dari server Command & Control yang dikenal untuk botnet.",
    packet5Source: "172.16.0.55 (Perangkat Internal)",
    packet5DestPort: "Port 53 (Kueri DNS)",
    packet5Desc: "Kueri DNS keluar ke server DNS eksternal yang tidak sah dengan reputasi buruk.",
  }
};

export default function FirewallConfigQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentPacketIndex, setCurrentPacketIndex] = useState(0);
  const [systemSecurity, setSystemSecurity] = useState(INITIAL_SECURITY_SCORE);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  
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
        } catch (e) { console.error("Error reading lang for FirewallConfigPage", e); }
      }
      setLang(newLang);
    };
    updateLang();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-app-settings') updateLang();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = pageTranslations[lang];
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };

  const currentPacket = PACKET_SCENARIOS[currentPacketIndex];

  const handlePacketAction = (action: 'allow' | 'deny') => {
    if (gameState !== 'playing' || !currentPacket) return;

    let securityChange = 0;
    let feedbackKey = '';

    if (action === currentPacket.correctAction) {
      securityChange = currentPacket.securityImpact.correct;
      feedbackKey = action === 'allow' ? 'feedbackCorrectAllow' : 'feedbackCorrectDeny';
    } else {
      securityChange = action === 'allow' ? currentPacket.securityImpact.incorrectAllow : currentPacket.securityImpact.incorrectDeny;
      feedbackKey = action === 'allow' ? 'feedbackIncorrectAllow' : 'feedbackIncorrectDeny';
    }

    const newSecurity = Math.max(0, Math.min(100, systemSecurity + securityChange));
    setSystemSecurity(newSecurity);
    setFeedbackMessage(t[feedbackKey as keyof typeof t](t[currentPacket.descriptionKey as keyof typeof t]));

    if (newSecurity < MIN_SECURITY_FOR_WIN && newSecurity <= 0) { // Or some critical threshold
      setGameState('lost');
      setFeedbackMessage(prev => `${prev} ${t.outcomeLossSecurity}`);
    } else if (currentPacketIndex >= PACKET_SCENARIOS.length - 1) {
      if (newSecurity >= MIN_SECURITY_FOR_WIN) {
        setGameState('won');
        setFeedbackMessage(prev => `${prev} ${t.outcomeWin}`);
      } else {
        setGameState('lost');
        setFeedbackMessage(prev => `${prev} ${t.outcomeLossSecurity}`);
      }
    } else {
      setCurrentPacketIndex(prev => prev + 1);
    }
  };

  const restartGame = () => {
    setCurrentPacketIndex(0);
    setSystemSecurity(INITIAL_SECURITY_SCORE);
    setFeedbackMessage('');
    setGameState('playing');
  };

  const handleClaimReward = () => {
    let outcomeText = "Simulation ended.";
    if (gameState === 'won') outcomeText = t.outcomeWin;
    if (gameState === 'lost') outcomeText = t.outcomeLossSecurity;
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, outcomeText),
    });
  };
  
  const getThreatBadgeVariant = (level: PacketInfo['threatLevelKey']): "default" | "secondary" | "destructive" | "outline" => {
    switch(level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive'; // Could be a less severe red or orange if available
      case 'medium': return 'default'; // Primary color for warning
      case 'low': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };
  
  const getThreatIcon = (level: PacketInfo['threatLevelKey']) => {
     switch(level) {
      case 'critical': return <AlertTriangleIcon className="h-4 w-4 mr-1 text-destructive" />;
      case 'high': return <AlertTriangleIcon className="h-4 w-4 mr-1 text-destructive" />;
      case 'medium': return <Wifi className="h-4 w-4 mr-1 text-primary" />;
      default: return <Server className="h-4 w-4 mr-1 text-muted-foreground" />;
    }
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Button variant="outline" asChild className="mb-6">
        <Link href={`/learning-zones/${questDetails.zoneId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToZone}
        </Link>
      </Button>

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="h-7 w-7 text-accent" />
            <CardTitle className="font-headline text-3xl">{currentQuestDetails.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">{currentQuestDetails.description}</CardDescription>
          <div className="text-sm text-muted-foreground">
            {currentQuestDetails.zoneName} | {questDetails.points} Points | {questDetails.type} | {questDetails.difficulty}
          </div>
        </CardHeader>
      </Card>

      {gameState === 'playing' && currentPacket && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-6 w-6 text-primary" /> 
              {t.packetAnalysisTitle}: {t.packetNumber(currentPacketIndex + 1, PACKET_SCENARIOS.length)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-md border space-y-2">
                <p><strong className="text-sm">{t.sourceIpLabel}</strong> <Badge variant="outline">{t[currentPacket.sourceIpKey as keyof typeof t]}</Badge></p>
                <p><strong className="text-sm">{t.destPortLabel}</strong> <Badge variant="outline">{t[currentPacket.destPortKey as keyof typeof t]}</Badge></p>
                <p><strong className="text-sm">{t.protocolLabel}</strong> <Badge variant="secondary">{t[currentPacket.protocolKey as keyof typeof t]}</Badge></p>
                <p><strong className="text-sm">{t.descriptionLabel}</strong> {t[currentPacket.descriptionKey as keyof typeof t]}</p>
                <p className="flex items-center"><strong className="text-sm">{t.threatLevelLabel}</strong> 
                    <Badge variant={getThreatBadgeVariant(currentPacket.threatLevelKey)} className="ml-2 flex items-center">
                        {getThreatIcon(currentPacket.threatLevelKey)}
                        {t[('threatLevel' + currentPacket.threatLevelKey.charAt(0).toUpperCase() + currentPacket.threatLevelKey.slice(1)) as keyof typeof t]}
                    </Badge>
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" size="lg" onClick={() => handlePacketAction('allow')} className="border-green-500 hover:bg-green-500/10 text-green-700 hover:text-green-800">
                    <ShieldCheck className="mr-2 h-5 w-5" /> {t.actionAllow}
                </Button>
                <Button variant="destructive" size="lg" onClick={() => handlePacketAction('deny')} className="bg-red-600 hover:bg-red-700">
                    <ShieldOff className="mr-2 h-5 w-5" /> {t.actionDeny}
                </Button>
            </div>

            <div className="space-y-2 pt-4">
              <Label className="text-sm font-medium">{t.systemSecurityLabel}</Label>
              <Progress value={systemSecurity} indicatorClassName={systemSecurity < 30 ? "bg-destructive" : systemSecurity < MIN_SECURITY_FOR_WIN ? "bg-yellow-500" : "bg-green-500"} />
              <p className="text-xs text-right text-muted-foreground">{systemSecurity}%</p>
            </div>
            
            {feedbackMessage && !feedbackMessage.includes(t.outcomeWin) && !feedbackMessage.includes(t.outcomeLossSecurity) && (
              <p className={`text-sm font-medium p-2 rounded-md text-center ${
                feedbackMessage.startsWith(t.feedbackCorrectAllow('').substring(0,10)) || feedbackMessage.startsWith(t.feedbackCorrectDeny('').substring(0,10)) ? 'bg-green-500/10 text-green-700' : 
                feedbackMessage.startsWith(t.feedbackIncorrectAllow('').substring(0,10)) || feedbackMessage.startsWith(t.feedbackIncorrectDeny('').substring(0,10)) ? 'bg-destructive/10 text-destructive' : 'bg-secondary/30'
              }`}>
                {feedbackMessage}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <Card className={`text-center shadow-xl max-w-md mx-auto ${gameState === 'won' ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <CardHeader>
             {gameState === 'won' ? <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" /> : <ShieldOff className="mx-auto h-16 w-16 text-destructive mb-4" />}
            <CardTitle className={`font-headline text-2xl ${gameState === 'won' ? 'text-green-700' : 'text-destructive'}`}>
              {gameState === 'won' ? t.outcomeWin : t.outcomeLossSecurity}
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-lg mb-2">Final System Security: {systemSecurity}%</p>
             {feedbackMessage.includes(t.outcomeWin) || feedbackMessage.includes(t.outcomeLossSecurity) ? (
                <p className="text-sm">{feedbackMessage.substring(feedbackMessage.lastIndexOf(t.outcomeWin) !== -1 ? feedbackMessage.lastIndexOf(t.outcomeWin) : feedbackMessage.lastIndexOf(t.outcomeLossSecurity))}</p>
             ) : <p className="text-sm">{feedbackMessage}</p>
            }
          </CardContent>
          <CardFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:justify-center sm:space-x-4">
            <Button onClick={restartGame} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> {t.restartButton}
            </Button>
            <Button onClick={handleClaimReward}>
              <CheckCircle className="mr-2 h-4 w-4" /> {t.claimRewardButton}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
    
    