"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "./components/profile-form";
import PasswordForm from "./components/password-form";
import type { User } from "@/lib/user";
import { useAppSelector } from "@/redux/hooks";
import { selectusers } from "@/redux/slices/user";
import { useSession } from "next-auth/react";

// Sample user data
const sampleUser: User = {
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john.doe@example.com",
  username: "johndoe123",
  accountType: "premium",
  profileUrl:
    "https://r2.nomapos.com/416TrainingImages/507f1f77bcf86cd799439011/profile/1703123456789-0.jpg",
  emailVerified: true,
  image:
    "https://r2.nomapos.com/416TrainingImages/507f1f77bcf86cd799439011/profile/1703123456789-0.jpg",
  isGmail: false,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-20T14:45:00.000Z",
};

export default function ProfilePage() {
  const users = useAppSelector(selectusers);
  const { data: session } = useSession();
  const user_id = session.user.id;

  const [user, setUser] = useState(users.find((user) => user._id == user_id));
  
  useEffect(() => {
    setUser(users.find((user) => user._id == user_id));
  }, [users, user_id]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} onUserUpdate={setUser} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm userId={user._id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
