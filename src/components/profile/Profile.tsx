import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Save, User } from "lucide-react";

// NEW: Firebase imports
import { auth } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile, User as FirebaseUser } from "firebase/auth";

// NEW: Props for the component
interface ProfileProps {
  user: FirebaseUser;
  onBack: () => void;
}

const storage = getStorage();

export const Profile = ({ user, onBack }: ProfileProps) => {
  // NEW: Initialize state with the logged-in user's data
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user.photoURL || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: handleAvatarChange now sets a preview and saves the file for upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  // NEW: handleSave now uploads the avatar and updates the user profile
  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      let newPhotoURL = user.photoURL;

      // Step 1: Upload new avatar if one was selected
      if (avatarFile) {
        // Create a storage reference: avatars/userId
        const storageRef = ref(storage, `avatars/${user.uid}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, avatarFile);
        
        // Get the public URL of the uploaded file
        newPhotoURL = await getDownloadURL(snapshot.ref);
      }

      // Step 2: Update the user's profile in Firebase Auth
      await updateProfile(user, {
        displayName: displayName,
        photoURL: newPhotoURL,
      });

      alert("Profile updated successfully!");
      onBack(); // Go back to the dashboard
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" size="icon" className="mr-4 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
        </div>

        <Card className="glass-panel border-glass-border animate-float">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 border-4 border-glass-border glow-soft">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 glass-panel w-8 h-8 rounded-full flex items-center justify-center border border-glass-border cursor-pointer hover:glow-soft transition-all">
                <Camera className="w-4 h-4 text-primary" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
              <Input id="username" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button onClick={onBack} variant="outline" className="w-full">Cancel</Button>
              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};