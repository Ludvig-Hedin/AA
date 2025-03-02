"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Settings, LogOut, Bell, Search, User, Home, BarChart, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();

  // In a real app, you would check for authentication here
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
    }
  }, [router]);

  const handleSignOut = () => {
    // In a real app, you would call your sign out API here
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-card">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="ml-2 font-semibold">AppName</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="ml-2 font-bold text-xl">AppName</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
          </nav>
          
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6 mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 text-sm rounded-md border border-input bg-background"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">User Name</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,543</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 new this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">573</div>
                    <p className="text-xs text-muted-foreground">+18.7% from last week</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your team's activity in the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">User {i} completed a task</p>
                            <p className="text-xs text-muted-foreground truncate">Project name • Task description</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {i}h ago
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t bg-card">
        <div className="grid grid-cols-4 h-16">
          <Button variant="ghost" className="flex flex-col items-center justify-center rounded-none h-full">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center justify-center rounded-none h-full">
            <BarChart className="h-5 w-5" />
            <span className="text-xs mt-1">Analytics</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center justify-center rounded-none h-full">
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Docs</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center justify-center rounded-none h-full">
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}