import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import { AuthCard } from "@/components/auth/AuthCard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ChatRoom } from "@/components/chat/ChatRoom"; // NEW: Import ChatRoom

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<{ id: string; name: string } | null>(null); // NEW: State to track the active room

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectRoom = (room: { id: string; name: string }) => {
    setActiveRoom(room);
  };

  const handleBackToDashboard = () => {
    setActiveRoom(null);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Blimp...</div>;
  }

  // NEW: Updated render logic
  const renderContent = () => {
    if (user) {
      if (activeRoom) {
        return <ChatRoom user={user} room={activeRoom} onBack={handleBackToDashboard} />;
      }
      return <Dashboard user={user} onSelectRoom={handleSelectRoom} />;
    }
    return <AuthCard />;
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

export default Index;