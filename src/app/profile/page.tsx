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
import ProfileForm from "../dashboard/account/components/profile-form";
import PasswordForm from "../dashboard/account/components/password-form";
import { useAppSelector } from "@/redux/hooks";
import { selectusers } from "@/redux/slices/user";
import { useSession } from "next-auth/react";
import Navheader from "@/customui/navheader";

export default function ProfilePage() {
  const users = useAppSelector(selectusers);
  const { data: session } = useSession();
  const user_id = session?.user.id;

  const [user, setUser] = useState(users.find((user) => user._id == user_id));

  useEffect(() => {
    setUser(users.find((user) => user._id == user_id));
  }, [users, user_id]);

  return (
    <Navheader>
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
                {user && <ProfileForm user={user} onUserUpdate={setUser} />}
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
                {user && <PasswordForm userId={user?._id} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Navheader>
  );
}
