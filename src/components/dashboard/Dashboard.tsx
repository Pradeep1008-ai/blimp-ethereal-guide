import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Hash, Users, Settings, LogOut, MessageCircle } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  lastMessage?: string;
  lastActivity?: string;
}

export const Dashboard = () => {
  const [chatRooms] = useState<ChatRoom[]>([
    { id: "1", name: "General", participants: 12, lastMessage: "Hey everyone!", lastActivity: "2 min ago" },
    { id: "2", name: "Random", participants: 8, lastMessage: "Anyone up for a game?", lastActivity: "5 min ago" },
    { id: "3", name: "Tech Talk", participants: 15, lastMessage: "New AI features are amazing", lastActivity: "1 hour ago" },
  ]);

  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 mb-6 border border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-glass-border glow-soft">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Chat Rooms</h1>
                <p className="text-muted-foreground">Connect with others in beautiful spaces</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Rooms List */}
          <div className="lg:col-span-2">
            <Card className="glass-panel border-glass-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-foreground">Your Rooms</CardTitle>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-glass-border">
                      <DialogHeader>
                        <DialogTitle>Create New Room</DialogTitle>
                        <DialogDescription>
                          Start a new conversation space for your community
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Room name"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                        />
                        <Button className="w-full">Create Room</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Hash className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-panel border-glass-border">
                      <DialogHeader>
                        <DialogTitle>Join Room</DialogTitle>
                        <DialogDescription>
                          Enter a room code to join an existing conversation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter room code"
                          value={joinRoomCode}
                          onChange={(e) => setJoinRoomCode(e.target.value)}
                        />
                        <Button className="w-full">Join Room</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    className="glass-panel p-4 rounded-2xl border border-glass-border hover:glow-soft transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 glass-panel rounded-full flex items-center justify-center border border-glass-border">
                          <Hash className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {room.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{room.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {room.participants}
                        </div>
                        <p className="text-xs text-muted-foreground">{room.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Welcome Panel */}
          <div className="space-y-6">
            <Card className="glass-panel border-glass-border animate-float">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Welcome Back!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ready to continue your conversations? Join a room or create a new one to get started.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                    3 active rooms
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                    25 total messages today
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-glass-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="glass" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <Hash className="w-4 h-4 mr-2" />
                  Join with Code
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};