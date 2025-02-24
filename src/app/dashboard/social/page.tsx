import { getEmails } from "@/actions/fetch.actions";
import { EmailConnect } from "./component/email-connect";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmailCard = ({ email, pass }: { email: string; pass: string }) => (
  <Card className="w-full max-w-md mb-4">
    <CardHeader className="flex flex-row items-center justify-start gap-1 space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Email Connected</CardTitle>
      <Check className="h-6 w-6 text-white bg-green-500 rounded-full" />
    </CardHeader>
    <CardContent>
      <div className="text-sm">{email}</div>
      <div className="text-sm text-gray-500">
        Password: {"*".repeat(pass.length)}
      </div>
    </CardContent>
  </Card>
);

export default async function YourPage() {
  const emails = await getEmails();
  return (
    <div className="p-2">
      <h1>Your Page</h1>
      <EmailConnect />
      <div className="mt-2">
        {emails.map((item, index) => (
          <EmailCard
            key={index}
            email={item.EMAIL_SERVER_USER}
            pass={item.EMAIL_SERVER_PASSWORD}
          />
        ))}
      </div>
    </div>
  );
}
