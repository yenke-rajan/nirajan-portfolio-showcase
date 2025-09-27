import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileManager } from '@/components/admin/ProfileManager';
import { ExperienceManager } from '@/components/admin/ExperienceManager';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { VideoManager } from '@/components/admin/VideoManager';
import { PostManager } from '@/components/admin/PostManager';
import { CVManager } from '@/components/admin/CVManager';
import SkillsManager from '@/components/admin/SkillsManager';
import { LogOut, User, Briefcase, FolderOpen, Video, FileText, FileUser, Award } from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-2">
              <FileUser className="w-4 h-4" />
              CV
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>
                  Update your personal information and about section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>

          <TabsContent value="cv">
            <Card>
              <CardHeader>
                <CardTitle>CV Management</CardTitle>
                <CardDescription>
                  Upload and manage your CV file for download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Experience Management</CardTitle>
                <CardDescription>
                  Manage your work experience and organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExperienceManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>
                  Manage your featured projects with GitHub integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Management</CardTitle>
                <CardDescription>
                  Manage YouTube videos with automatic metadata fetching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Management</CardTitle>
                <CardDescription>
                  Create and manage blog posts and articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}