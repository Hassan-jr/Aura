"use client";

import { useState } from "react";
import { useActionState } from "react";
import { saveEmailCredentials } from "@/actions/email.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface EmailConnectFormProps {
  onSuccess: () => void;
}

export function EmailConnectForm({ onSuccess }: EmailConnectFormProps) {
  const [isPending, setIsPending] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (formData: FormData) => {
    const EMAIL_SERVER_USER = formData.get("EMAIL_SERVER_USER") as string;
    const EMAIL_SERVER_PASSWORD = formData.get(
      "EMAIL_SERVER_PASSWORD"
    ) as string;
    console.log("Email: ", EMAIL_SERVER_USER);
    console.log("Pass Word:", EMAIL_SERVER_PASSWORD);
    console.log("User:", session?.user.id);

    setIsPending(true);
    const result = await saveEmailCredentials(
      EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD,
      session?.user.id
    );
    setIsPending(false);
    if (result?.success) {
      toast({
        title: "Success",
        description: "Email credentials saved successfully",
      });
      onSuccess();
    } else {
      toast({
        title: "Error",
        description: "Failed to save email credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="EMAIL_SERVER_USER">Email Server User</Label>
        <Input
          id="EMAIL_SERVER_USER"
          name="EMAIL_SERVER_USER"
          type="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="EMAIL_SERVER_PASSWORD">Email Server Password</Label>
        <Input
          id="EMAIL_SERVER_PASSWORD"
          name="EMAIL_SERVER_PASSWORD"
          type="password"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="bg-black text-white hover:bg-blue-950 w-full"
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
