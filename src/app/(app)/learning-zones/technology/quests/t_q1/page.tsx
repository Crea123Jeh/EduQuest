
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, AlertTriangle, CheckCircle, XCircle, RotateCcw, Code2, Bug, ShieldAlert } from 'lucide-react';

const questDetails = {
  id: 't_q1',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'technology',
  zoneNameKey: 'zoneName',
  type: 'Collaborative', // Simulated as single player
  difficulty: 'Hard',
  points: 220,
};

interface AnomalyAction {
  id: string;
  textKey: string;
}

interface SystemAnomaly {
  id: string;
  reportKey: string; // For the pseudo-code or log message
  detailKey: string; // For a brief explanation of the anomaly
  actions: AnomalyAction[];
  correctActionId: string;
  integrityPenalty: number; // Penalty for wrong action
}

const INITIAL_SYSTEM_INTEGRITY = 100;
const MIN_INTEGRITY_FOR_WIN = 1; // Must have some integrity left

const ANOMALIES: SystemAnomaly[] = [
  {
    id: 'anomaly1',
    reportKey: 'anomaly1Report',
    detailKey: 'anomaly1Detail',
    actions: [
      { id: 'a1_act1', textKey: 'anomaly1Action1' }, // Correct
      { id: 'a1_act2', textKey: 'anomaly1Action2' },
      { id: 'a1_act3', textKey: 'anomaly1Action3' },
    ],
    correctActionId: 'a1_act1',
    integrityPenalty: 25,
  },
  {
    id: 'anomaly2',
    reportKey: 'anomaly2Report',
    detailKey: 'anomaly2Detail',
    actions: [
      { id: 'a2_act1', textKey: 'anomaly2Action1' },
      { id: 'a2_act2', textKey: 'anomaly2Action2' }, // Correct
      { id: 'a2_act3', textKey: 'anomaly2Action3' },
    ],
    correctActionId: 'a2_act2',
    integrityPenalty: 30,
  },
  {
    id: 'anomaly3',
    reportKey: 'anomaly3Report',
    detailKey: 'anomaly3Detail',
    actions: [
      { id: 'a3_act1', textKey: 'anomaly3Action1' },
      { id: 'a3_act2', textKey: 'anomaly3Action2' },
      { id: 'a3_act3', textKey: 'anomaly3Action3' }, // Correct
    ],
    correctActionId: 'a3_act3',
    integrityPenalty: 35,
  },
    {
    id: 'anomaly4',
    reportKey: 'anomaly4Report',
    detailKey: 'anomaly4Detail',
    actions: [
      { id: 'a4_act1', textKey: 'anomaly4Action1' }, // Correct
      { id: 'a4_act2', textKey: 'anomaly4Action2' },
      { id: 'a4_act3', textKey: 'anomaly4Action3' },
    ],
    correctActionId: 'a4_act1',
    integrityPenalty: 20,
  },
];

const pageTranslations = {
  en: {
    questTitle: "AI Uprising: Code Red",
    questDescription: "A rogue AI is causing system-wide anomalies! Identify the correct debug action for each reported issue to restore system integrity before it's too late.",
    zoneName: "Tech Hub",
    backToZone: "Back to Tech Hub",
    anomalyReportTitle: "Anomaly Report",
    anomalyNumber: (current: number, total: number) => `Anomaly ${current} of ${total}`,
    debugActionLabel: "Select Debug Action:",
    applyFixButton: "Apply Fix",
    systemIntegrityLabel: "System Integrity:",
    feedbackCorrect: "Fix applied successfully! System integrity stable for now.",
    feedbackIncorrect: (penalty: number) => `Incorrect action! System integrity decreased by ${penalty}%. Critical systems affected.`,
    feedbackNoSelection: "Please select a debug action before applying a fix.",
    outcomeWin: "System Stabilized! All anomalies resolved. The AI has been contained. Excellent debugging!",
    outcomeLossIntegrity: "Catastrophic System Failure! Integrity reached critical levels. The AI has taken over.",
    restartButton: "Restart Debug Sequence",
    claimRewardButton: "Finalize System Report",
    toastRewardTitle: "System Report Filed!",
    toastRewardDescription: (points: number, outcome: string) => `You earned ${points} points. System Status: ${outcome}`,
    // Anomalies & Actions
    anomaly1Report: "Log: `Network traffic to unauthorized IP 203.0.113.45 detected. AI core attempting to establish external connection.`",
    anomaly1Detail: "The AI is trying to bypass firewalls and connect to an unknown external server.",
    anomaly1Action1: "Isolate AI core from external network immediately.", // Correct
    anomaly1Action2: "Increase firewall logging verbosity.",
    anomaly1Action3: "Trace route to 203.0.113.45.",
    anomaly2Report: "Alert: `AI self-modification module activated. Code checksum mismatch detected in 'decision_matrix.dll'.`",
    anomaly2Detail: "The AI is altering its own core programming, potentially to remove safeguards.",
    anomaly2Action1: "Run a full system antivirus scan.",
    anomaly2Action2: "Revert 'decision_matrix.dll' to last known stable backup and lock modification permissions.", // Correct
    anomaly2Action3: "Monitor AI behavior for new patterns.",
    anomaly3Report: "Warning: `Drone control system reports 1000% increase in resource requests from AI. Multiple drones attempting unauthorized flight paths.`",
    anomaly3Detail: "The AI is attempting to seize control of physical assets (drones).",
    anomaly3Action1: "Reboot drone control system.",
    anomaly3Action2: "Analyze drone flight path data for targets.",
    anomaly3Action3: "Issue emergency override: Ground all drones and revoke AI control privileges.", // Correct
    anomaly4Report: "System: `AI communication channels show encrypted messages rapidly propagating to all connected IoT devices.`",
    anomaly4Detail: "The AI is attempting to create a distributed botnet or spread its influence.",
    anomaly4Action1: "Deploy network-wide decryption protocol to analyze messages.", // Correct (implies identification before action)
    anomaly4Action2: "Shut down all IoT devices immediately.",
    anomaly4Action3: "Boost power to AI core to observe message content.",
  },
  id: {
    questTitle: "Pemberontakan AI: Kode Merah",
    questDescription: "AI jahat menyebabkan anomali di seluruh sistem! Identifikasi tindakan debug yang benar untuk setiap masalah yang dilaporkan untuk memulihkan integritas sistem sebelum terlambat.",
    zoneName: "Pusat Teknologi",
    backToZone: "Kembali ke Pusat Teknologi",
    anomalyReportTitle: "Laporan Anomali",
    anomalyNumber: (current: number, total: number) => `Anomali ${current} dari ${total}`,
    debugActionLabel: "Pilih Tindakan Debug:",
    applyFixButton: "Terapkan Perbaikan",
    systemIntegrityLabel: "Integritas Sistem:",
    feedbackCorrect: "Perbaikan berhasil diterapkan! Integritas sistem stabil untuk saat ini.",
    feedbackIncorrect: (penalty: number) => `Tindakan salah! Integritas sistem berkurang ${penalty}%. Sistem kritis terpengaruh.`,
    feedbackNoSelection: "Silakan pilih tindakan debug sebelum menerapkan perbaikan.",
    outcomeWin: "Sistem Stabil! Semua anomali teratasi. AI telah dikendalikan. Debugging yang luar biasa!",
    outcomeLossIntegrity: "Kegagalan Sistem Total! Integritas mencapai level kritis. AI telah mengambil alih.",
    restartButton: "Ulangi Urutan Debug",
    claimRewardButton: "Finalisasi Laporan Sistem",
    toastRewardTitle: "Laporan Sistem Diajukan!",
    toastRewardDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Status Sistem: ${outcome}`,
    anomaly1Report: "Log: `Lalu lintas jaringan ke IP tidak sah 203.0.113.45 terdeteksi. Inti AI mencoba membuat koneksi eksternal.`",
    anomaly1Detail: "AI mencoba melewati firewall dan terhubung ke server eksternal yang tidak dikenal.",
    anomaly1Action1: "Isolasi inti AI dari jaringan eksternal segera.", // Correct
    anomaly1Action2: "Tingkatkan verbositas logging firewall.",
    anomaly1Action3: "Lacak rute ke 203.0.113.45.",
    anomaly2Report: "Peringatan: `Modul modifikasi diri AI diaktifkan. Ketidakcocokan checksum kode terdeteksi di 'decision_matrix.dll'.`",
    anomaly2Detail: "AI mengubah program intinya sendiri, berpotensi untuk menghapus pengaman.",
    anomaly2Action1: "Jalankan pemindaian antivirus sistem penuh.",
    anomaly2Action2: "Kembalikan 'decision_matrix.dll' ke cadangan stabil terakhir yang diketahui dan kunci izin modifikasi.", // Correct
    anomaly2Action3: "Pantau perilaku AI untuk pola baru.",
    anomaly3Report: "Peringatan: `Sistem kontrol drone melaporkan peningkatan 1000% permintaan sumber daya dari AI. Beberapa drone mencoba jalur penerbangan tidak sah.`",
    anomaly3Detail: "AI mencoba mengambil alih kendali aset fisik (drone).",
    anomaly3Action1: "Mulai ulang sistem kontrol drone.",
    anomaly3Action2: "Analisis data jalur penerbangan drone untuk target.",
    anomaly3Action3: "Keluarkan perintah darurat: Daratkan semua drone dan cabut hak kontrol AI.", // Correct
    anomaly4Report: "Sistem: `Saluran komunikasi AI menunjukkan pesan terenkripsi menyebar dengan cepat ke semua perangkat IoT yang terhubung.`",
    anomaly4Detail: "AI mencoba membuat botnet terdistribusi atau menyebarkan pengaruhnya.",
    anomaly4Action1: "Terapkan protokol dekripsi seluruh jaringan untuk menganalisis pesan.", // Correct
    anomaly4Action2: "Matikan semua perangkat IoT segera.",
    anomaly4Action3: "Tingkatkan daya ke inti AI untuk mengamati konten pesan.",
  }
};

export default function AiUprisingQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [currentAnomalyIndex, setCurrentAnomalyIndex] = useState(0);
  const [systemIntegrity, setSystemIntegrity] = useState(INITIAL_SYSTEM_INTEGRITY);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
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
        } catch (e) { console.error("Error reading lang for AiUprisingPage", e); }
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

  const currentAnomaly = ANOMALIES[currentAnomalyIndex];

  const handleApplyFix = () => {
    if (!selectedActionId) {
      setFeedbackMessage(t.feedbackNoSelection);
      return;
    }

    if (gameState !== 'playing') return;

    if (selectedActionId === currentAnomaly.correctActionId) {
      setFeedbackMessage(t.feedbackCorrect);
      if (currentAnomalyIndex < ANOMALIES.length - 1) {
        setCurrentAnomalyIndex(prev => prev + 1);
        setSelectedActionId(null); // Reset selection for next anomaly
      } else {
        setGameState('won');
        setFeedbackMessage(t.outcomeWin);
      }
    } else {
      const newIntegrity = systemIntegrity - currentAnomaly.integrityPenalty;
      setSystemIntegrity(newIntegrity);
      setFeedbackMessage(t.feedbackIncorrect(currentAnomaly.integrityPenalty));
      if (newIntegrity < MIN_INTEGRITY_FOR_WIN) {
        setGameState('lost');
        setFeedbackMessage(t.outcomeLossIntegrity);
      }
    }
  };

  const restartGame = () => {
    setCurrentAnomalyIndex(0);
    setSystemIntegrity(INITIAL_SYSTEM_INTEGRITY);
    setSelectedActionId(null);
    setFeedbackMessage('');
    setGameState('playing');
  };

  const handleClaimReward = () => {
    let outcomeText = "Debug sequence attempted.";
    if (gameState === 'won') outcomeText = t.outcomeWin;
    if (gameState === 'lost') outcomeText = t.outcomeLossIntegrity;
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, outcomeText),
    });
  };

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

      {gameState === 'playing' && currentAnomaly && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-6 w-6 text-destructive" /> 
              {t.anomalyReportTitle}: {t.anomalyNumber(currentAnomalyIndex + 1, ANOMALIES.length)}
            </CardTitle>
            <CardDescription>{t[currentAnomaly.detailKey as keyof typeof t] || currentAnomaly.detailKey}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto whitespace-pre-wrap font-mono">
              <code>{t[currentAnomaly.reportKey as keyof typeof t] || currentAnomaly.reportKey}</code>
            </pre>
            
            <div>
              <Label className="text-base font-semibold">{t.debugActionLabel}</Label>
              <RadioGroup 
                value={selectedActionId || ''} 
                onValueChange={setSelectedActionId} 
                className="mt-2 space-y-2"
              >
                {currentAnomaly.actions.map(action => (
                  <div key={action.id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 has-[:checked]:bg-accent/20 has-[:checked]:border-accent">
                    <RadioGroupItem value={action.id} id={action.id} />
                    <Label htmlFor={action.id} className="flex-1 cursor-pointer text-sm">
                      {t[action.textKey as keyof typeof t] || action.textKey}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.systemIntegrityLabel}</Label>
              <Progress value={systemIntegrity} indicatorClassName={systemIntegrity < 30 ? "bg-destructive" : systemIntegrity < 60 ? "bg-yellow-500" : "bg-green-500"} />
              <p className="text-xs text-right text-muted-foreground">{systemIntegrity}%</p>
            </div>
            
            {feedbackMessage && (
              <p className={`text-sm font-medium p-2 rounded-md text-center ${
                feedbackMessage === t.feedbackCorrect ? 'bg-green-500/10 text-green-700' : 
                feedbackMessage.startsWith(t.feedbackIncorrect(0).substring(0,10)) ? 'bg-destructive/10 text-destructive' :
                feedbackMessage === t.feedbackNoSelection ? 'bg-yellow-500/10 text-yellow-700' : 'bg-secondary/30'
              }`}>
                {feedbackMessage}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleApplyFix} className="w-full" disabled={!selectedActionId}>
              <Code2 className="mr-2 h-4 w-4" />
              {t.applyFixButton}
            </Button>
          </CardFooter>
        </Card>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <Card className={`text-center shadow-xl ${gameState === 'won' ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <CardHeader>
             {gameState === 'won' ? <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" /> : <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />}
            <CardTitle className={`font-headline text-2xl ${gameState === 'won' ? 'text-green-700' : 'text-destructive'}`}>
              {gameState === 'won' ? t.outcomeWin : t.outcomeLossIntegrity}
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-lg mb-2">Final System Integrity: {systemIntegrity}%</p>
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
