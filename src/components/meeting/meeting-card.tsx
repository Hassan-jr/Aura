"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock, ExternalLink, User, Package } from "lucide-react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";

// Define types
interface Meeting {
  _id: { $oid: string };
  googleEventId: string;
  meetLink: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  attendees: { email: string }[];
  creator: { email: string; self: boolean };
  organizer: { email: string; self: boolean };
  htmlLink: string;
  userId: string;
  bid: string;
  productId: string;
  createdAt: { $date: { $numberLong: string } };
  updatedAt: { $date: { $numberLong: string } };
  __v: { $numberInt: string };
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  username: string;
  profileUrl?: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  // Add other product fields as needed
}

interface MeetingCardProps {
  meetings: any[];
  users: any[];
  products: any[];
}

export default function MeetingCard({
  meetings,
  users,
  products,
}: MeetingCardProps) {
  const productId = useAppSelector(selectProductId);
  const [meetingProducts, setmeetingProducts] = useState(
    meetings.filter((m) => m.productId == productId)
  );

  useEffect(() => {
    if (productId && meetings?.length > 0) {
      setmeetingProducts(meetings.filter((m) => m.productId == productId));
    }
  }, [productId, meetings]);
  return (
    <div className="space-y-6">
      {meetingProducts?.map((meeting) => (
        <SingleMeetingCard
          key={meeting._id.$oid}
          meeting={meeting}
          users={users}
          products={products}
        />
      ))}
    </div>
  );
}

function SingleMeetingCard({
  meeting,
  users,
  products,
}: {
  meeting: Meeting;
  users: UserType[];
  products: Product[];
}) {
  const [status, setStatus] = useState<"Upcoming" | "In Progress" | "Expired">(
    "Upcoming"
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Find user and product
  const user = users.find((u) => u._id === meeting.userId);
  const product = products.find((p) => p._id === meeting.productId);

  // Update current time and status every minute
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      setCurrentTime(now);

      const startTime = parseISO(meeting.startTime);
      const endTime = parseISO(meeting.endTime);

      if (isBefore(now, startTime)) {
        setStatus("Upcoming");
      } else if (isAfter(now, endTime)) {
        setStatus("Expired");
      } else {
        setStatus("In Progress");
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [meeting.startTime, meeting.endTime]);

  // Format dates
  const startDate = parseISO(meeting.startTime);
  const endDate = parseISO(meeting.endTime);

  const formattedDate = format(startDate, "EEEE, MMMM d, yyyy");
  const formattedStartTime = format(startDate, "h:mm a");
  const formattedEndTime = format(endDate, "h:mm a");

  // Status badge color
  const statusColor = {
    Upcoming: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    "In Progress": "bg-green-100 text-green-800 hover:bg-green-100",
    Expired: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }[status];

  return (
    <Card
      className="w-full overflow-hidden border-l-4 shadow-md transition-all hover:shadow-lg"
      style={{
        borderLeftColor:
          status === "Upcoming"
            ? "#f59e0b"
            : status === "In Progress"
            ? "#10b981"
            : "#6b7280",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold">
              {meeting.summary}
            </CardTitle>
            <p className="text-sm">{meeting.description}</p>
          </div>

          <Badge className={statusColor}>{status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" /> {formattedDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* time and attendees */}
        <div className="flex flex-row gap-1">
          {/* Time and Meeting Link */}
          <div className="flex-1 flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                {formattedStartTime} - {formattedEndTime} ({meeting.timeZone})
              </span>
            </div>
            <a
              href={meeting.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Join Meeting <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {/* Attendees */}
          <div className="flex-1 rounded-lg border p-3 bg-gray-50">
            <h3 className="mb-2 text-sm font-medium text-gray-500">
              Attendees
            </h3>
            <div className="flex flex-wrap gap-2">
              {meeting.attendees.map((attendee, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-default text-blue-600"
                      >
                        {attendee.email}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{attendee.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>

        {/*user and prduct  */}
        <div className="flex flex-row gap-1">
          {/* User Card */}
          <div className="flex-1 rounded-lg border border-blue-600 p-3">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-500">
              <User className="h-4 w-4" /> Scheduled by
            </h3>
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={user.profileUrl || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-gray-500">
                User information not available
              </p>
            )}
          </div>
          {/* Product Card */}
          <div className="flex-1 rounded-lg border p-3 border-blue-600">
            <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-500">
              <Package className="h-4 w-4" /> Product Discussion
            </h3>
            {product ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="product-details">
                  <AccordionTrigger className="font-medium">
                    {product.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-h-40 overflow-y-auto rounded bg-gray-50 p-3 dark:bg-gray-800">
                      <ReactMarkdown>{product.description}</ReactMarkdown>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <p className="text-sm italic text-gray-500">
                Product information not available
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 dark:bg-gray-800">
        <p className="text-xs text-gray-500">
          Meeting ID: {meeting.googleEventId.substring(0, 8)}...
        </p>
        <a
          href={meeting.htmlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View in Google Calendar
        </a>
      </CardFooter>
    </Card>
  );
}
