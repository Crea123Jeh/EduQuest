
export interface LearningZone {
  id: string;
  name: string;
  description: string;
  iconKey?: string; // Changed from React.ElementType to string
  subject: string;
  image: string;
  aiHint: string;
  quests?: Quest[];
}

export interface ClassroomStudent {
  id: string;
  name: string;
  avatarUrl?: string; // Optional avatar for students
}

export interface ClassroomAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string; // e.g., "YYYY-MM-DD" or "Month Day, Year"
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Upcoming';
  type: 'Quest' | 'Assignment' | 'Discussion';
  description?: string;
  relatedQuestId?: string; // Optional: if it's directly linked to a learning zone quest
}

export interface Classroom {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  studentCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  active: boolean;
  description?: string;
  bannerImage?: string; // URL for a banner image
  aiBannerHint?: string; // AI hint for banner image
  students?: ClassroomStudent[];
  announcements?: ClassroomAnnouncement[];
  assignments?: ClassroomAssignment[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  zoneId: string;
  type: 'Collaborative' | 'Individual' | 'Ethical Dilemma';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  isCompleted?: boolean; // Optional: track completion status
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

