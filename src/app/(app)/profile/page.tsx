import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Award, ShieldCheck, Edit3, Star, TrendingUp, CheckSquare } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const userProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  role: 'Student',
  avatarUrl: 'https://placehold.co/128x128.png',
  joinDate: 'March 15, 2023',
  totalPoints: 1250,
  level: 8,
  levelProgress: 60, // percentage
  completedQuests: 23,
  collaborativeQuests: 15,
  empathyPoints: 350,
  badges: [
    { name: 'Team Player', icon: Users, color: 'bg-blue-500' },
    { name: 'Problem Solver', icon: ShieldCheck, color: 'bg-green-500' },
    { name: 'Kindness Champion', icon: Award, color: 'bg-yellow-500' },
    { name: 'History Whiz', icon: Star, color: 'bg-purple-500' },
  ],
  recentActivity: [
    { title: 'Completed "The Pharaoh\'s Secret" Quest', date: '2 days ago', points: 150 },
    { title: 'Collaborated in "Ecosystem Balance" Challenge', date: '3 days ago', points: 80 },
    { title: 'Reached Level 8!', date: '5 days ago', points: 0 },
  ]
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-md">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="student portrait" />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="font-headline text-3xl">{userProfile.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{userProfile.role}</CardDescription>
              <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{userProfile.email}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Joined: {userProfile.joinDate}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="absolute top-4 right-4">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        
        <CardContent className="mt-6">
          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="text-2xl font-bold text-accent">{userProfile.totalPoints.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="text-2xl font-bold text-accent">{userProfile.completedQuests}</h3>
              <p className="text-sm text-muted-foreground">Quests Completed</p>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="text-2xl font-bold text-accent">{userProfile.empathyPoints}</h3>
              <p className="text-sm text-muted-foreground">Empathy Points</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-foreground">Level {userProfile.level}</h4>
              <span className="text-sm text-muted-foreground">{userProfile.levelProgress}% to Level {userProfile.level + 1}</span>
            </div>
            <Progress value={userProfile.levelProgress} className="w-full h-3" />
          </div>

          <div className="mb-8">
            <h4 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center">
              <Award className="mr-2 h-5 w-5 text-accent" /> Badges Earned
            </h4>
            <div className="flex flex-wrap gap-3">
              {userProfile.badges.map(badge => (
                <Badge key={badge.name} variant="default" className={`${badge.color} text-white text-sm px-3 py-1.5`}>
                  <badge.icon className="mr-1.5 h-4 w-4" /> {badge.name}
                </Badge>
              ))}
              {userProfile.badges.length === 0 && <p className="text-muted-foreground">No badges earned yet. Keep questing!</p>}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-xl font-semibold mb-3 text-foreground flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-accent" /> Recent Activity
            </h4>
            <ul className="space-y-3">
              {userProfile.recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start p-3 bg-secondary/50 rounded-md">
                  <CheckSquare className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date} {activity.points > 0 && `(+${activity.points} points)`}</p>
                  </div>
                </li>
              ))}
              {userProfile.recentActivity.length === 0 && <p className="text-muted-foreground">No recent activity to display.</p>}
            </ul>
             <div className="mt-4 text-right">
                <Button variant="link" asChild className="text-accent">
                    <Link href="/profile/activity-log">View All Activity</Link>
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
