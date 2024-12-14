"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Merge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextureButton } from "@/components/ui/texture-button";
import {
  TextureCardContent,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardTitle,
  TextureSeparator,
} from "@/components/ui/texture-card";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setaccountType] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, accountType }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/auth/verify-request");
      } else {
        setError(data.error || "An error occurred during registration");
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration");
      setIsLoading(false)
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      signIn("google");
    } catch (error) {
      const errorMessage = error?.message || error?.type || error;
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: getErrorMessage(errorMessage),
      });
    }
  };

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token is invalid or has expired.";
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-full rounded-md">
        <div className="items-start justify-center gap-6 rounded-lg p-2 md:p-8 grid grid-cols-1">
          <div className="col-span-1 grid items-start gap-6 lg:col-span-1">
            <div>
            <LoadingOverlay isLoading={isLoading} />
              <TextureCardStyled>
                <TextureCardHeader className="flex flex-col gap-1 items-center justify-center p-4">
                  <div className="p-3 bg-neutral-950 rounded-full mb-3">
                    <Merge className="h-7 w-7 stroke-neutral-200" />
                  </div>
                  <TextureCardTitle>Create your account</TextureCardTitle>
                  <p className="text-center">
                    Welcome! Please fill in the details to get started.
                  </p>
                </TextureCardHeader>
                <TextureSeparator />
                <TextureCardContent>
                  <div className="flex justify-center gap-2 mb-4">
                    <TextureButton
                      variant="icon"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                    >
                      {/* Google Icon */}
                      <svg
                        width="256"
                        height="262"
                        viewBox="0 0 256 262"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid"
                        className="h-5 w-5"
                      >
                        <path
                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                          fill="#4285F4"
                        />
                        <path
                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                          fill="#34A853"
                        />
                        <path
                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                          fill="#FBBC05"
                        />
                        <path
                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                          fill="#EB4335"
                        />
                      </svg>
                      <span className="pl-2">Google</span>
                    </TextureButton>
                  </div>
                  <div className="text-center text-sm mb-4">or</div>

                  <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-2">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="select">Select Account Type</Label>
                      <Select
                        value={accountType}
                        onValueChange={(val) => setaccountType(val)}
                      >
                        <SelectTrigger
                          id="select"
                          className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                        >
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Account Type</SelectLabel>
                            <SelectItem value="individual">
                              Individual
                            </SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 placeholder-neutral-400 dark:placeholder-neutral-500"
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <TextureButton
                      variant="accent"
                      className="w-full"
                      type="submit"
                    >
                      <div className="flex gap-1 items-center justify-center">
                        Create Account
                        <ArrowRight className="h-4 w-4 text-neutral-50 mt-[1px]" />
                      </div>
                    </TextureButton>
                  </form>
                </TextureCardContent>
                <TextureSeparator />
                <TextureCardFooter className="border-b rounded-b-sm">
                  <div className="flex flex-col items-center justify-center">
                    <div className="py-2 px-2">
                      <div className="text-center text-sm">
                        Already have an account?{" "}
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() => router.push("/auth/sign-in")}
                        >
                          Sign In
                        </span>
                      </div>
                    </div>
                  </div>
                </TextureCardFooter>

                <div className="dark:bg-neutral-800 bg-stone-100 pt-px rounded-b-[20px] overflow-hidden ">
                  <div className="flex flex-col items-center justify-center ">
                    <div className="py-2 px-2">
                      <div className="text-center text-xs ">
                        Secured by Inprime AI
                      </div>
                    </div>
                  </div>
                </div>
              </TextureCardStyled>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
