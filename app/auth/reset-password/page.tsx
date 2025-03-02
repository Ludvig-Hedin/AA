"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-provider';
import { MessageSquare, ArrowLeft, Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function ResetPassword() {
  const { resetPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await resetPassword(values.email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-md mx-auto flex-1 flex flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-sm border">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check your email</h3>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to your email address.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Return to sign in</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center text-sm">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}