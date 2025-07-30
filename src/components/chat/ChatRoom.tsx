import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Trash2, Users } from "lucide-react";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface Message {
  id: string;
  text: string;
  createdAt: any;
  uid: string;
  displayName: string;
  avatarURL?: string;
}

interface ChatRoomProps {
  user: User;
  room: { id: string; name: string };
  onBack: () => void;
}

interface RoomData {
  creatorId: string;
  name: string;
  members: string[];
}

const db = getFirestore();

export const ChatRoom = ({ user, room, onBack }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roomRef = doc(db, "rooms", room.id);
    getDoc(roomRef).then((docSnap) => {
      if (docSnap.exists()) {
        setRoomData(docSnap.data() as RoomData);
      }
    });
  }, [room.id]);
  
  useEffect(() => {
    const messagesRef = collection(db, "rooms", room.id, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [room.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messagesRef = collection(db, "rooms", room.id, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      avatarURL: user.photoURL || "",
    });

    setNewMessage("");
  };

  const handleDeleteRoom = async () => {
    if (window.confirm(`Are you sure you want to delete the room "${room.name}"? This cannot be undone.`)) {
      try {
        const roomRef = doc(db, "rooms", room.id);
        await deleteDoc(roomRef);
        onBack();
      } catch (error) {
        console.error("Error deleting room: ", error);
        alert("Failed to delete room.");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-panel border-b border-glass-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">#{room.name}</h1>
              {roomData && <div className="flex items-center text-sm text-muted-foreground"><Users className="w-4 h-4 mr-1" />{roomData.members.length} participants</div>}
            </div>
          </div>
          
          {roomData && user.uid === roomData.creatorId && (
            <Button onClick={handleDeleteRoom} variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10">
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full">
          <Card className="glass-panel border-glass-border h-[calc(100vh-200px)] flex flex-col">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.map((message) => {
                const isOwn = message.uid === user.uid;
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start space-x-3 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <Avatar className="w-8 h-8 border border-glass-border">
                        <AvatarImage src={message.avatarURL} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {message.displayName?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`glass-panel p-3 rounded-2xl border border-glass-border ${isOwn ? "bg-primary/20" : ""}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{!isOwn ? message.displayName : 'You'}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                          </span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{message.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-glass-border">
              <div className="glass-panel rounded-2xl border border-glass-border p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 p-0 text-base resize-none" />
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="rounded-full glow-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};