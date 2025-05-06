"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { addcalender, updateCalendar } from "@/actions/calender.action";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks";
import { selectcalenders } from "@/redux/slices/calender";

export default function CalendarComponent() {
  const [open, setOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const calenders = useAppSelector(selectcalenders);
  const { data: session } = useSession();
  
  const [credentials, setCredentials] = useState({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REFRESH_TOKEN: "",
  });
  

  useEffect(() => {
    if (calenders.length > 0) {
      setCredentials({
        GOOGLE_CLIENT_ID: calenders[0].GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: calenders[0].GOOGLE_CLIENT_SECRET,
        GOOGLE_REFRESH_TOKEN: calenders[0].GOOGLE_REFRESH_TOKEN,
      });
      setShowCard(true);
    }
  }, [calenders]);

  const handleSave = async () => {
    console.log(credentials);

    try {
      if (calenders.length > 0) {
        const calendarId = calenders[0]._id.toString();
        await updateCalendar(
          {
            GOOGLE_CLIENT_ID: credentials.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: credentials.GOOGLE_CLIENT_SECRET,
            GOOGLE_REFRESH_TOKEN: credentials.GOOGLE_REFRESH_TOKEN,
            userId: session.user.id,
          },
          calendarId
        );
      } else {
        await addcalender({
          GOOGLE_CLIENT_ID: credentials.GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET: credentials.GOOGLE_CLIENT_SECRET,
          GOOGLE_REFRESH_TOKEN: credentials.GOOGLE_REFRESH_TOKEN,
          userId: session.user.id,
        });
      }

      toast.success("Calender Successfully");
      setOpen(false);
      setShowCard(true);
    } catch (error) {
      console.log("Calender Save Error");
      toast.error("An Error Occured");
      setOpen(false);
      setShowCard(true);
    }
  };

  const maskValue = (value: string) => {
    return value ? "*".repeat(value.length) : "";
  };

  return (
    <main className="p-4">
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-400 mb-4"
        disabled={credentials.GOOGLE_CLIENT_ID ? true : false}
      >
        Configure Google Credentials
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Google Credentials</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="googleClientId">GOOGLE_CLIENT_ID</Label>
              <Input
                id="googleClientId"
                value={credentials.GOOGLE_CLIENT_ID}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    GOOGLE_CLIENT_ID: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="googleClientSecret">GOOGLE_CLIENT_SECRET</Label>
              <Input
                id="googleClientSecret"
                value={credentials.GOOGLE_CLIENT_SECRET}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    GOOGLE_CLIENT_SECRET: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="googleRefreshToken">GOOGLE_REFRESH_TOKEN</Label>
              <Input
                id="googleRefreshToken"
                value={credentials.GOOGLE_REFRESH_TOKEN}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    GOOGLE_REFRESH_TOKEN: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-400"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showCard && (
        <Card className="w-full max-w-md mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Saved Google Credentials</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between overflow-hidden">
              <span className="font-medium">GOOGLE_CLIENT_ID:</span>
              <span>{maskValue(credentials.GOOGLE_CLIENT_ID)}</span>
            </div>
            <div className="flex justify-between overflow-hidden">
              <span className="font-medium">GOOGLE_CLIENT_SECRET:</span>
              <span>{maskValue(credentials.GOOGLE_CLIENT_SECRET)}</span>
            </div>
            <div className="flex justify-between overflow-hidden">
              <span className="font-medium">GOOGLE_REFRESH_TOKEN:</span>
              <span>{maskValue(credentials.GOOGLE_REFRESH_TOKEN)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
