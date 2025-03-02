"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from '@/components/auth/sign-in-form';
import SignUpForm from '@/components/auth/sign-up-form';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { MessageSquare } from 'lucide-react';

export default function AuthPage() {
  const [activeView, setActiveView] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">AppName</h1>
          <p className="text-muted-foreground mt-2">Sign in to continue to your account</p>
        </div>

        <motion.div 
          className="bg-card border rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeView === 'signin' || activeView === 'signup' ? (
              <motion.div
                key="auth-tabs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Tabs defaultValue={activeView} className="w-full" onValueChange={(value) => setActiveView(value as any)}>
                  <TabsList className="grid grid-cols-2 w-full rounded-none">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin" className="p-6">
                    <SignInForm 
                      onSuccess={handleAuthSuccess} 
                      onForgotPassword={() => setActiveView('forgot-password')}
                    />
                  </TabsContent>
                  <TabsContent value="signup" className="p-6">
                    <SignUpForm onSuccess={handleAuthSuccess} />
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <ForgotPasswordForm onBack={() => setActiveView('signin')} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our</p>
          <div className="mt-1">
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}&bull;{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}