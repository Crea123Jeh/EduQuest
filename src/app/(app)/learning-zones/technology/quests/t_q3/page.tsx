
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Wand2, FileText, ServerCrash, CheckCircle, XCircle, RotateCcw, HardDriveDownload, PackagePlus, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const questDetails = {
  id: 't_q3',
  titleKey: 'questTitle',
  descriptionKey: 'questDescription',
  zoneId: 'technology',
  zoneNameKey: 'zoneName',
  type: 'Individual',
  difficulty: 'Hard',
  points: 180,
};

interface DataFragment {
  id: string;
  contentKey: string; 
  type: 'header' | 'data' | 'footer' | 'corrupted' | 'irrelevant';
  fileOrigin?: 'report' | 'image' | 'system'; 
}

const TARGET_FILE_ID = 'Critical_Report.docx';
const CORRECT_FRAGMENT_SEQUENCE: string[] = ['REPORT_H_01', 'REPORT_D_A', 'REPORT_D_B', 'REPORT_F_01'];
const INITIAL_INTEGRITY = 100;
const MIN_INTEGRITY_FOR_WIN = 50;

const INCORRECT_FRAGMENT_PENALTY = 25; 
const MISSING_OR_EXTRA_PENALTY = 30; 
const WRONG_ORDER_PENALTY = 20;

const ALL_FRAGMENTS: DataFragment[] = [
  { id: 'REPORT_H_01', contentKey: 'fragReportHeader', type: 'header', fileOrigin: 'report' },
  { id: 'IMG_CHUNK_X', contentKey: 'fragImgChunkX', type: 'data', fileOrigin: 'image' }, // Decoy
  { id: 'REPORT_D_A', contentKey: 'fragReportDataA', type: 'data', fileOrigin: 'report' },
  { id: 'CORRUPT_S1', contentKey: 'fragCorruptGeneric', type: 'corrupted' }, // Corrupted
  { id: 'REPORT_D_B', contentKey: 'fragReportDataB', type: 'data', fileOrigin: 'report' },
  { id: 'SYSTEM_LOG_OLD', contentKey: 'fragSysLog', type: 'irrelevant', fileOrigin: 'system' }, // Irrelevant
  { id: 'REPORT_F_01', contentKey: 'fragReportFooter', type: 'footer', fileOrigin: 'report' },
  { id: 'IMG_HEADER_Y', contentKey: 'fragImgHeaderY', type: 'header', fileOrigin: 'image' }, // Decoy
  { id: 'REPORT_D_C_EXTRA', contentKey: 'fragReportDataCExtra', type: 'data', fileOrigin: 'report' }, // Decoy for this report
  { id: 'CONFIG_FILE_BAK', contentKey: 'fragConfigFileBak', type: 'irrelevant', fileOrigin: 'system' }, // Another irrelevant
];

const pageTranslations = {
  en: {
    questTitle: "Data Recovery: Corrupted Drive",
    questDescription: "A critical data drive has been corrupted. Analyze fragments and reassemble the target file before data integrity is lost completely. Select fragments in the correct order.",
    zoneName: "Tech Hub",
    backToZone: "Back to Tech Hub",
    targetFileLabel: "Target File for Recovery:",
    recoveryIntegrityLabel: "Data Recovery Integrity:",
    availableFragmentsTitle: "Available Data Fragments (Click to Add)",
    assembledSequenceTitle: "Assembled File Sequence (Click to Remove)",
    emptyAssembly: "No fragments added yet. Click fragments from the pool to assemble the file.",
    attemptRecoveryButton: "Attempt File Recovery",
    recoveringButton: "Analyzing Sequence...",
    feedbackSuccess: (fileName: string) => `Success! ${fileName} has been recovered with sufficient integrity.`,
    feedbackFailureIntegrity: (fileName:string) => `Recovery Failed! Integrity too low. ${fileName} could not be salvaged. Critical data loss.`,
    feedbackFailureOrder: (fileName: string) => `Sequence Error! While all fragments might be correct, the order is wrong. ${fileName} is garbled. Integrity penalized.`,
    feedbackFailureIncorrectFragments: (fileName: string, wrongCount: number) => `Incorrect Fragments! ${wrongCount} selected fragment(s) do not belong to ${fileName} or are corrupted/irrelevant. Integrity severely penalized.`,
    feedbackMissingFragments: (fileName: string) => `Missing or Extra Fragments! The assembled file for ${fileName} is incomplete or contains unnecessary correct parts. Integrity penalized.`,
    outcomeWin: "File Recovered Successfully! Your digital forensic skills are top-notch!",
    outcomeLoss: "Data Loss Imminent! The file could not be recovered. The corrupted drive is unsalvageable with this attempt.",
    restartButton: "Restart Recovery Process",
    claimRewardButton: "Finalize Recovery Report",
    toastRewardTitle: "Recovery Report Filed!",
    toastRewardDescription: (points: number, outcome: string) => `You earned ${points} points. Recovery Status: ${outcome}`,
    fragReportHeader: "REPORT_HEADER_01: Critical Analysis Document",
    fragImgChunkX: "IMAGE_DATA_CHUNK_X: Pixel Map Segment",
    fragReportDataA: "REPORT_DATA_A: Section 1 - Findings",
    fragCorruptGeneric: "CORRUPTED_SECTOR_Alpha7: Unreadable Data",
    fragReportDataB: "REPORT_DATA_B: Section 2 - Conclusions",
    fragSysLog: "SYSTEM_LOG_ENTRY_Old: Kernel Boot Sequence",
    fragReportFooter: "REPORT_FOOTER_01: End of Document",
    fragImgHeaderY: "IMAGE_HEADER_Y: Vacation_Photo.jpg Meta",
    fragReportDataCExtra: "REPORT_DATA_C_OBSOLETE: Appendix - Draft Notes",
    fragConfigFileBak: "CONFIG_SYS.BAK: Old System Backup",
    fragmentTypeHeader: "Header",
    fragmentTypeData: "Data",
    fragmentTypeFooter: "Footer",
    fragmentTypeCorrupted: "Corrupted",
    fragmentTypeIrrelevant: "Irrelevant",
  },
  id: {
    questTitle: "Pemulihan Data: Drive Rusak",
    questDescription: "Drive data penting telah rusak. Analisis fragmen dan susun ulang file target sebelum integritas data hilang sepenuhnya. Pilih fragmen dalam urutan yang benar.",
    zoneName: "Pusat Teknologi",
    backToZone: "Kembali ke Pusat Teknologi",
    targetFileLabel: "File Target untuk Pemulihan:",
    recoveryIntegrityLabel: "Integritas Pemulihan Data:",
    availableFragmentsTitle: "Fragmen Data Tersedia (Klik untuk Menambah)",
    assembledSequenceTitle: "Urutan File Tersusun (Klik untuk Menghapus)",
    emptyAssembly: "Belum ada fragmen yang ditambahkan. Klik fragmen dari kumpulan untuk menyusun file.",
    attemptRecoveryButton: "Coba Pulihkan File",
    recoveringButton: "Menganalisis Urutan...",
    feedbackSuccess: (fileName: string) => `Sukses! ${fileName} telah dipulihkan dengan integritas yang cukup.`,
    feedbackFailureIntegrity: (fileName:string) => `Pemulihan Gagal! Integritas terlalu rendah. ${fileName} tidak dapat diselamatkan. Kehilangan data kritis.`,
    feedbackFailureOrder: (fileName: string) => `Kesalahan Urutan! Meskipun semua fragmen mungkin benar, urutannya salah. ${fileName} menjadi kacau. Integritas dikurangi.`,
    feedbackFailureIncorrectFragments: (fileName: string, wrongCount: number) => `Fragmen Salah! ${wrongCount} fragmen yang dipilih tidak termasuk dalam ${fileName} atau rusak/tidak relevan. Integritas sangat dikurangi.`,
    feedbackMissingFragments: (fileName: string) => `Fragmen Hilang atau Berlebih! File yang disusun untuk ${fileName} tidak lengkap atau berisi bagian benar yang tidak perlu. Integritas dikurangi.`,
    outcomeWin: "File Berhasil Dipulihkan! Keterampilan forensik digital Anda luar biasa!",
    outcomeLoss: "Kehilangan Data Segera Terjadi! File tidak dapat dipulihkan. Drive yang rusak tidak dapat diselamatkan dengan upaya ini.",
    restartButton: "Ulangi Proses Pemulihan",
    claimRewardButton: "Finalisasi Laporan Pemulihan",
    toastRewardTitle: "Laporan Pemulihan Diajukan!",
    toastRewardDescription: (points: number, outcome: string) => `Anda mendapatkan ${points} poin. Status Pemulihan: ${outcome}`,
    fragReportHeader: "REPORT_HEADER_01: Dokumen Analisis Kritis",
    fragImgChunkX: "IMAGE_DATA_CHUNK_X: Segmen Peta Piksel",
    fragReportDataA: "REPORT_DATA_A: Bagian 1 - Temuan",
    fragCorruptGeneric: "CORRUPTED_SECTOR_Alpha7: Data Tidak Terbaca",
    fragReportDataB: "REPORT_DATA_B: Bagian 2 - Kesimpulan",
    fragSysLog: "SYSTEM_LOG_ENTRY_Old: Urutan Boot Kernel",
    fragReportFooter: "REPORT_FOOTER_01: Akhir Dokumen",
    fragImgHeaderY: "IMAGE_HEADER_Y: Meta Vacation_Photo.jpg",
    fragReportDataCExtra: "REPORT_DATA_C_OBSOLETE: Lampiran - Catatan Draf",
    fragConfigFileBak: "CONFIG_SYS.BAK: Cadangan Sistem Lama",
    fragmentTypeHeader: "Header",
    fragmentTypeData: "Data",
    fragmentTypeFooter: "Kaki",
    fragmentTypeCorrupted: "Rusak",
    fragmentTypeIrrelevant: "Tidak Relevan",
  }
};

export default function DataRecoveryQuestPage() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const { toast } = useToast();

  const [availableFragments, setAvailableFragments] = useState<DataFragment[]>([]);
  const [assembledSequence, setAssembledSequence] = useState<DataFragment[]>([]);
  const [recoveryIntegrity, setRecoveryIntegrity] = useState(INITIAL_INTEGRITY);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isAttempting, setIsAttempting] = useState(false);
  
  const t = pageTranslations[lang];
  const currentQuestDetails = {
    title: t[questDetails.titleKey as keyof typeof t] || questDetails.titleKey,
    description: t[questDetails.descriptionKey as keyof typeof t] || questDetails.descriptionKey,
    zoneName: t[questDetails.zoneNameKey as keyof typeof t] || questDetails.zoneNameKey,
  };

  useEffect(() => {
    const updateLang = () => {
      let newLangKey: 'en' | 'id' = 'en';
      if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('user-app-settings');
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            if (parsed.language && (parsed.language === 'en' || parsed.language === 'id')) {
              newLangKey = parsed.language;
            }
          } catch (e) { console.error("Error reading lang for DataRecoveryPage", e); }
        }
      }
      setLang(newLangKey);
    };
    updateLang();
    if (typeof window !== 'undefined') {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'user-app-settings') updateLang();
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    setAvailableFragments([...ALL_FRAGMENTS].sort(() => Math.random() - 0.5));
    setFeedbackMessage('');
  }, [lang]);


  const handleAddFragment = (fragment: DataFragment) => {
    if (gameState !== 'playing' || assembledSequence.find(f => f.id === fragment.id)) return;
    setAssembledSequence(prev => [...prev, fragment]);
    setAvailableFragments(prev => prev.filter(f => f.id !== fragment.id));
  };

  const handleRemoveFragment = (fragment: DataFragment) => {
    if (gameState !== 'playing') return;
    setAssembledSequence(prev => prev.filter(f => f.id !== fragment.id));
    setAvailableFragments(prev => [...prev, fragment].sort(() => Math.random() - 0.5));
  };

  const handleAttemptRecovery = () => {
    if (gameState !== 'playing' || assembledSequence.length === 0) {
        setFeedbackMessage(t.emptyAssembly);
        return;
    }
    setIsAttempting(true);

    setTimeout(() => {
      let currentIntegrity = recoveryIntegrity;
      let newFeedback = '';
      let isSuccess = false;

      const assembledIds = assembledSequence.map(f => f.id);
      
      const wrongFragments = assembledSequence.filter(
        f => !CORRECT_FRAGMENT_SEQUENCE.includes(f.id) || f.type === 'corrupted' || f.type === 'irrelevant'
      );

      if (wrongFragments.length > 0) {
        currentIntegrity -= wrongFragments.length * INCORRECT_FRAGMENT_PENALTY;
        newFeedback = t.feedbackFailureIncorrectFragments(TARGET_FILE_ID, wrongFragments.length);
      } else {
        // No wrong fragments, check for completeness and order
        const isCompleteSet = CORRECT_FRAGMENT_SEQUENCE.every(id => assembledIds.includes(id)) && 
                              assembledIds.length === CORRECT_FRAGMENT_SEQUENCE.length;

        if (!isCompleteSet) {
          currentIntegrity -= MISSING_OR_EXTRA_PENALTY;
          newFeedback = t.feedbackMissingFragments(TARGET_FILE_ID);
        } else {
          // Correct set of fragments, now check order
          const isOrderCorrect = assembledIds.every((id, index) => id === CORRECT_FRAGMENT_SEQUENCE[index]);
          if (!isOrderCorrect) {
            currentIntegrity -= WRONG_ORDER_PENALTY;
            newFeedback = t.feedbackFailureOrder(TARGET_FILE_ID);
          } else {
            newFeedback = t.feedbackSuccess(TARGET_FILE_ID);
            isSuccess = true;
          }
        }
      }
      
      currentIntegrity = Math.max(0, currentIntegrity);
      setRecoveryIntegrity(currentIntegrity);
      setFeedbackMessage(newFeedback);

      if (isSuccess) {
        if (currentIntegrity >= MIN_INTEGRITY_FOR_WIN) {
            setGameState('won');
        } else {
            // This case should ideally not happen if success means perfect, but as a safeguard
            setGameState('lost');
            setFeedbackMessage(t.feedbackFailureIntegrity(TARGET_FILE_ID));
        }
      } else {
        if (currentIntegrity < MIN_INTEGRITY_FOR_WIN) {
          setGameState('lost');
          // Append the integrity failure message if not already the primary feedback
          if (!newFeedback.includes(t.feedbackFailureIntegrity(TARGET_FILE_ID).substring(0,20))) { // check substring to avoid double messages
             setFeedbackMessage(prev => `${prev} ${t.feedbackFailureIntegrity(TARGET_FILE_ID)}`);
          }
        }
      }
      setIsAttempting(false);
    }, 1500);
  };

  const restartGame = () => {
    setAvailableFragments([...ALL_FRAGMENTS].sort(() => Math.random() - 0.5));
    setAssembledSequence([]);
    setRecoveryIntegrity(INITIAL_INTEGRITY);
    setFeedbackMessage('');
    setGameState('playing');
    setIsAttempting(false);
  };

  const handleClaimReward = () => {
    let outcomeText = "Recovery attempt analyzed.";
    if (gameState === 'won') outcomeText = t.outcomeWin;
    if (gameState === 'lost') outcomeText = t.outcomeLoss;
    toast({
      title: t.toastRewardTitle,
      description: t.toastRewardDescription(questDetails.points, outcomeText),
    });
  };

  const getFragmentTypeDisplay = (type: DataFragment['type']) => {
    switch(type) {
      case 'header': return t.fragmentTypeHeader;
      case 'data': return t.fragmentTypeData;
      case 'footer': return t.fragmentTypeFooter;
      case 'corrupted': return t.fragmentTypeCorrupted;
      case 'irrelevant': return t.fragmentTypeIrrelevant;
      default: return type;
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

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t.availableFragmentsTitle}</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[400px] pr-3">
          <CardContent className="space-y-2">
            {availableFragments.map(fragment => (
              <Button
                key={fragment.id}
                variant={fragment.type === 'corrupted' ? 'destructive' : 'outline'}
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleAddFragment(fragment)}
                disabled={gameState !== 'playing' || isAttempting}
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                <div>
                    <span className="font-semibold text-sm">{t[fragment.contentKey as keyof typeof t] || fragment.id}</span><br/>
                    <Badge variant="secondary" className="text-xs">{getFragmentTypeDisplay(fragment.type)}</Badge>
                </div>
              </Button>
            ))}
          </CardContent>
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" /> {t.targetFileLabel} <Badge>{TARGET_FILE_ID}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <Label className="text-sm font-medium">{t.recoveryIntegrityLabel}</Label>
              <Progress value={recoveryIntegrity} indicatorClassName={recoveryIntegrity < MIN_INTEGRITY_FOR_WIN / 2 ? "bg-destructive" : recoveryIntegrity < MIN_INTEGRITY_FOR_WIN ? "bg-yellow-500" : "bg-green-500"} />
              <p className="text-xs text-right text-muted-foreground">{recoveryIntegrity}%</p>
            </div>

            <div>
              <Label className="text-base font-semibold">{t.assembledSequenceTitle}</Label>
              <ScrollArea className="mt-2 p-3 min-h-[150px] bg-muted/30 rounded-md border border-dashed max-h-[300px]">
                {assembledSequence.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-10">{t.emptyAssembly}</p>
                ) : (
                  <ol className="space-y-2">
                    {assembledSequence.map((fragment, index) => (
                      <li key={fragment.id + "_" + index} className="flex items-center justify-between p-2 bg-card rounded-md border shadow-sm">
                        <div className="flex items-center">
                           <span className="mr-2 text-sm font-medium text-primary">{index + 1}.</span>
                           <div>
                             <span className="text-sm">{t[fragment.contentKey as keyof typeof t] || fragment.id}</span><br/>
                             <Badge variant="outline" className="text-xs">{getFragmentTypeDisplay(fragment.type)}</Badge>
                           </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleRemoveFragment(fragment)}
                          disabled={gameState !== 'playing' || isAttempting}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
              </ScrollArea>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-md text-sm font-medium text-center flex items-center justify-center gap-2
                ${gameState === 'won' ? 'bg-green-500/10 text-green-700' : 
                gameState === 'lost' ? 'bg-destructive/10 text-destructive' : 
                feedbackMessage === t.feedbackFailureOrder(TARGET_FILE_ID) ? 'bg-yellow-500/10 text-yellow-700' :
                feedbackMessage === t.emptyAssembly ? 'bg-yellow-500/10 text-yellow-700' :
                (feedbackMessage.includes(t.feedbackFailureIncorrectFragments(TARGET_FILE_ID,0).substring(0,10)) || feedbackMessage.includes(t.feedbackMissingFragments(TARGET_FILE_ID).substring(0,10))) ? 'bg-destructive/10 text-destructive' :
                'bg-secondary/30' 
              }`}>
                {gameState === 'won' ? <CheckCircle className="h-4 w-4"/> : 
                 gameState === 'lost' ? <ServerCrash className="h-4 w-4"/> : 
                 feedbackMessage === t.feedbackFailureOrder(TARGET_FILE_ID) ? <AlertTriangle className="h-4 w-4"/> : 
                 <Info className="h-4 w-4"/>
                }
                {feedbackMessage}
              </div>
            )}
          </CardContent>
          {gameState === 'playing' && (
          <CardFooter>
            <Button 
              onClick={handleAttemptRecovery} 
              className="w-full" 
              disabled={assembledSequence.length === 0 || isAttempting}
            >
              {isAttempting ? <HardDriveDownload className="mr-2 h-4 w-4 animate-spin" /> : <HardDriveDownload className="mr-2 h-4 w-4" />}
              {isAttempting ? t.recoveringButton : t.attemptRecoveryButton}
            </Button>
          </CardFooter>
          )}
        </Card>
      </div>
      
      {(gameState === 'won' || gameState === 'lost') && (
        <Card className={`mt-8 max-w-md mx-auto shadow-lg ${gameState === 'won' ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <CardHeader className="text-center">
             {gameState === 'won' ? <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-3" /> : <ServerCrash className="mx-auto h-12 w-12 text-destructive mb-3" />}
            <CardTitle className={`font-headline text-xl ${gameState === 'won' ? 'text-green-700' : 'text-destructive'}`}>
              {gameState === 'won' ? t.outcomeWin : t.outcomeLoss}
            </CardTitle>
            <CardDescription>Final Integrity: {recoveryIntegrity}%</CardDescription>
             {feedbackMessage && (gameState === 'won' || gameState === 'lost') && (
               <p className={`text-sm mt-2 ${gameState === 'won' ? 'text-green-600' : 'text-destructive'}`}>
                 {feedbackMessage} 
               </p>
             )}
          </CardHeader>
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

