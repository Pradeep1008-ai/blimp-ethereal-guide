import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Save, User } from "lucide-react";

export const Profile = () => {
  const [username, setUsername] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [bio, setBio] = useState("Love chatting about tech and design!");
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSave = () => {
    console.log("Profile saved");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4 rounded-full">
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <CardTitle className="text-xl text-foreground mt-4">Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground font-medium">
                Bio
              </Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card className="glass-panel border-glass-border mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-glass-border">
              <div>
                <h3 className="font-medium text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive message notifications</p>
              </div>
              <Button variant="glass" size="sm">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-glass-border">
              <div>
                <h3 className="font-medium text-foreground">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">Play sounds for messages</p>
              </div>
              <Button variant="glass" size="sm">
                On
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-glass-border">
              <div>
                <h3 className="font-medium text-foreground">Online Status</h3>
                <p className="text-sm text-muted-foreground">Show when you're active</p>
              </div>
              <Button variant="glass" size="sm">
                Visible
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};