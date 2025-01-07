"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerCard({ id, users, feedback }) {
  const [user, setUser] = React.useState(users.find((user) => user._id === id));

  React.useEffect(() => {
    setUser(users.find((user) => user._id === id));
  }, [users]);

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-row">
        <div>
          <Avatar>
            <AvatarImage src={`${user?.profileUrl}`} alt="CSC416" />
            <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <CardTitle>{user?.name}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
          <CardDescription>@{user?.username}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {feedback}
      </CardContent>
    </Card>
  );
}
