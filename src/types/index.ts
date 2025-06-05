export interface LearningZone {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType; // Lucide icon component
  subject: string;
  image: string;
  aiHint: string;
  quests?: Quest[];
}

export interface Classroom {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  studentCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  active: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  zoneId: string;
  type: 'Collaborative' | 'Individual' | 'Ethical Dilemma';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  isCompleted?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher';
  avatarUrl?: string;
  points?: number;
  completedQuests?: string[];
  // Add more profile related fields as needed
}
