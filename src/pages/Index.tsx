import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Profile } from "@/components/profile/Profile";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AppState = "auth" | "dashboard" | "profile" | "chat";

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>("auth");

  const renderCurrentView = () => {
    switch (currentView) {
      case "auth":
        return <AuthCard />;
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "chat":
        return <ChatRoom />;
      default:
        return <AuthCard />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Demo Navigation - Fixed positioned for easy access */}
      <div className="fixed top-6 left-6 z-50">
        <Card className="glass-panel border-glass-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">Blimp UI Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={currentView === "auth" ? "default" : "glass"}
              size="sm"
              onClick={() => setCurrentView("auth")}
              className="w-full justify-start text-xs"
            >
              🔐 Login
            </Button>
            <Button
              variant={currentView === "dashboard" ? "default" : "glass"}
              size="sm"
              onClick={() => setCurrentView("dashboard")}
              className="w-full justify-start text-xs"
            >
              🏠 Dashboard
            </Button>
            <Button
              variant={currentView === "profile" ? "default" : "glass"}
              size="sm"
              onClick={() => setCurrentView("profile")}
              className="w-full justify-start text-xs"
            >
              👤 Profile
            </Button>
            <Button
              variant={currentView === "chat" ? "default" : "glass"}
              size="sm"
              onClick={() => setCurrentView("chat")}
              className="w-full justify-start text-xs"
            >
              💬 Chat Room
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {renderCurrentView()}
    </div>
  );
};

export default Index;
