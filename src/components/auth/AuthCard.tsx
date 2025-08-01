import { useState } from "react";
import { loginUser, registerUser } from "@/lib/api";
import { auth } from "@/lib/firebase"; // NEW
import { sendEmailVerification } from "firebase/auth"; // NEW

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, LogIn, Mail, Lock, User } from "lucide-react";

export const AuthCard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginUser({ email, password });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  try {
    const userCredential = await registerUser({ displayName: name, email, password });

    // NEW: Define settings with your live URL
    const actionCodeSettings = {
      url: 'https://blimp-chat.web.app',
    };

    if (userCredential.user) {
      // Pass the settings to the function
      await sendEmailVerification(userCredential.user, actionCodeSettings);
    }

  } catch (err: any) {
    setError(err.message);
    setIsLoading(false);
  }
};
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="glass-panel animate-float w-full max-w-md border-glass-border shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 glass-panel rounded-full flex items-center justify-center glow-soft"><div className="text-3xl">💬</div></div>
          <CardTitle className="text-2xl font-semibold text-foreground">Welcome to Blimp</CardTitle>
          <CardDescription className="text-muted-foreground">Your ethereal chat experience awaits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="glass-panel grid w-full grid-cols-2 border border-glass-border">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl"><LogIn className="w-4 h-4 mr-2" />Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl"><UserPlus className="w-4 h-4 mr-2" />Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2"><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="email" placeholder="Enter your email" className="pl-10" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} /></div></div>
                <div className="space-y-2"><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="password" placeholder="Enter your password" className="pl-10" required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} /></div></div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2"><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="text" placeholder="Choose a username" className="pl-10" required value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} /></div></div>
                <div className="space-y-2"><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="email" placeholder="Enter your email" className="pl-10" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} /></div></div>
                <div className="space-y-2"><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input type="password" placeholder="Create a password" className="pl-10" required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} /></div></div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
          {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};