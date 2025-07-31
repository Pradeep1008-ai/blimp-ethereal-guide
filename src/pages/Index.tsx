import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { Profile } from "@/components/profile/Profile"; // NEW

type View = "dashboard" | "chat" | "profile"; // NEW

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<{ id: string; name: string } | null>(null);
  const [currentView, setCurrentView] = useState<View>("dashboard"); // NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Blimp...</div>;
  }

  const renderContent = () => {
    if (user) {
      if (currentView === "chat" && activeRoom) {
        return <ChatRoom user={user} room={activeRoom} onBack={() => setCurrentView("dashboard")} />;
      }
      if (currentView === "profile") {
        return <Profile user={user} onBack={() => setCurrentView("dashboard")} />;
      }
      // Default to dashboard
      return <Dashboard 
        user={user} 
        onSelectRoom={(room) => {
          setActiveRoom(room);
          setCurrentView("chat");
        }}
        onGoToProfile={() => setCurrentView("profile")} // NEW
      />;
    }
    return <AuthCard />;
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

export default Index;