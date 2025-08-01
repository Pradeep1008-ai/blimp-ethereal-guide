import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut, sendEmailVerification } from "firebase/auth"; // NEW imports
import { AuthCard } from "@/components/auth/AuthCard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { Profile } from "@/components/profile/Profile";
import { Button } from "@/components/ui/button"; // NEW import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // NEW import

type View = "dashboard" | "chat" | "profile";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<{ id: string; name: string } | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // NEW: Functions to handle logout and resending email
  const handleLogout = () => signOut(auth);
  const handleResendVerification = async () => {
    if (user) {
      await sendEmailVerification(user);
      alert("A new verification email has been sent.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Blimp...</div>;
  }
  
  const renderContent = () => {
    if (user) {
      // NEW: Check for email verification
      if (!user.emailVerified) {
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="glass-panel w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Verify Your Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A verification link has been sent to <strong>{user.email}</strong>.
                  Please check your inbox (and spam folder) to continue.
                </p>
                <Button onClick={handleResendVerification} className="w-full">Resend Email</Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
              </CardContent>
            </Card>
          </div>
        );
      }
      
      // If verified, show the rest of the app
      if (currentView === "chat" && activeRoom) {
        return <ChatRoom user={user} room={activeRoom} onBack={() => setCurrentView("dashboard")} />;
      }
      if (currentView === "profile") {
        return <Profile user={user} onBack={() => setCurrentView("dashboard")} />;
      }
      return <Dashboard 
        user={user} 
        onSelectRoom={(room) => { setActiveRoom(room); setCurrentView("chat"); }}
        onGoToProfile={() => setCurrentView("profile")}
      />;
    }
    return <AuthCard />;
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

export default Index;