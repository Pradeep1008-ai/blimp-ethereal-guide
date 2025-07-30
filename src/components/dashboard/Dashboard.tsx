import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, where, doc, updateDoc, arrayUnion, getDocs, limit } from "firebase/firestore";
import { signOut, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Hash, Users, Settings, LogOut, MessageCircle } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
}

const db = getFirestore();

interface DashboardProps {
  user: User;
  onSelectRoom: (room: { id: string; name: string }) => void;
}

export const Dashboard = ({ user, onSelectRoom }: DashboardProps) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "rooms"), where("members", "array-contains", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const roomsData: ChatRoom[] = [];
      querySnapshot.forEach((doc) => {
        roomsData.push({ id: doc.id, name: doc.data().name });
      });
      setChatRooms(roomsData);
    });
    return () => unsubscribe();
  }, [user]);

  // NEW: Updated handleCreateRoom with name suggestion logic
  const handleCreateRoom = async (nameToCreate: string) => {
    if (nameToCreate.trim() === "" || !user) return;
    
    const normalizedName = nameToCreate.trim().toLowerCase();
    
    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("normalizedName", "==", normalizedName), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const suggestion = `${nameToCreate}${Math.floor(Math.random() * 100)}`;
      if (window.confirm(`A room named "${nameToCreate}" already exists. Would you like to create "${suggestion}" instead?`)) {
        handleCreateRoom(suggestion);
      }
      return;
    }

    try {
      await addDoc(collection(db, "rooms"), {
        name: nameToCreate.trim(),
        normalizedName: normalizedName,
        creatorId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
      });
      setNewRoomName("");
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating room: ", error);
      alert("Could not create the room.");
    }
  };

  const handleJoinRoom = async () => {
    // ... (This function remains the same as the last version)
    if (joinRoomName.trim() === "" || !user) return;
    const normalizedName = joinRoomName.trim().toLowerCase();
    try {
      const roomsRef = collection(db, "rooms");
      const q = query(roomsRef, where("normalizedName", "==", normalizedName), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("No room found with that name. Please check the name and try again.");
        return;
      }
      const roomDoc = querySnapshot.docs[0];
      const roomRef = doc(db, "rooms", roomDoc.id);
      await updateDoc(roomRef, {
        members: arrayUnion(user.uid)
      });
      setJoinRoomName("");
      setJoinDialogOpen(false);
    } catch (error) {
      console.error("Error joining room: ", error);
      alert("Failed to join room.");
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 mb-6 border border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-glass-border glow-soft"><MessageCircle className="w-6 h-6 text-primary" /></div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Welcome, {user.displayName || 'User'}!</h1>
                <p className="text-muted-foreground">Connect with others in beautiful spaces</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full"><Settings className="w-5 h-5" /></Button>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full"><LogOut className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-panel border-glass-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-foreground">Your Rooms</CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild><Button variant="default" size="sm"><Plus className="w-4 h-4 mr-2" />Create</Button></DialogTrigger>
                    <DialogContent className="glass-panel border-glass-border">
                      <DialogHeader>
                        <DialogTitle>Create New Room</DialogTitle>
                        <DialogDescription>Choose a unique name for your new room.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Room name" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
                        {/* NEW: Updated onClick handler */}
                        <Button onClick={() => handleCreateRoom(newRoomName)} className="w-full">Create Room</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isJoinDialogOpen} onOpenChange={setJoinDialogOpen}>
                     <DialogTrigger asChild><Button variant="outline" size="sm"><Hash className="w-4 h-4 mr-2" />Join</Button></DialogTrigger>
                     <DialogContent className="glass-panel border-glass-border">
                       <DialogHeader>
                         <DialogTitle>Join Room</DialogTitle>
                         <DialogDescription>Enter the exact name of the room you want to join.</DialogDescription>
                       </DialogHeader>
                       <div className="space-y-4">
                         <Input placeholder="Enter room name" value={joinRoomName} onChange={(e) => setJoinRoomName(e.target.value)} />
                         <Button onClick={handleJoinRoom} className="w-full">Join Room</Button>
                       </div>
                     </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatRooms.map((room) => (
                  <div key={room.id} onClick={() => onSelectRoom(room)} className="glass-panel p-4 rounded-2xl border border-glass-border hover:glow-soft transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 glass-panel rounded-full flex items-center justify-center border border-glass-border"><Hash className="w-5 h-5 text-primary" /></div>
                        <div><h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{room.name}</h3></div>
                      </div>
                    </div>
                  </div>
                ))}
                {chatRooms.length === 0 && (<p className="text-center text-muted-foreground py-8">No rooms found. Create or join one to start chatting.</p>)}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-panel border-glass-border animate-float">
               <CardHeader><CardTitle className="text-lg text-foreground">Quick Actions</CardTitle></CardHeader>
               <CardContent className="space-y-3">
                 <Button variant="glass" className="w-full justify-start"><Plus className="w-4 h-4 mr-2" />Create Room</Button>
                 <Button variant="glass" className="w-full justify-start"><Hash className="w-4 h-4 mr-2" />Join with Code</Button>
                 <Button variant="glass" className="w-full justify-start"><Users className="w-4 h-4 mr-2" />Invite Friends</Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};