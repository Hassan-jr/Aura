"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// Your UI Components
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Your Actions and Redux slices
import {
  fetchAgent,
  getChats,
  getDiscounts,
  getInvoices,
  getMeetings,
  getUsers,
} from "@/actions/fetch.actions";
import { useSession } from "next-auth/react";
import { getAllCalenders } from "@/actions/calender.action";
import { setcalenders } from "@/redux/slices/calender";
import { setagents } from "@/redux/slices/agent";
import { setusers } from "@/redux/slices/user";
import { setdiscounts } from "@/redux/slices/discount";
import { Invoice } from "../../modals/invoice.modal";
import { setinvoices } from "@/redux/slices/invoice";
import { setmeetings } from "@/redux/slices/meeting";
import { setchats } from "@/redux/slices/chat";
import { getCampaignResult } from "@/actions/campaginResult.action";
import { setcampaignResults } from "@/redux/slices/campaginResult";
import { fetchCampaigns } from "@/actions/campaign.action";
import { setcampaigns } from "@/redux/slices/campagin";

// Placeholder for a Spinner component (you'll need to create or import one)
const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%", // Takes full height of its container
      width: "100%", // Takes full width of its container
    }}
  >
    {/* You can use an SVG, CSS spinner, or a component library spinner */}
    <svg
      className="animate-spin h-8 w-8 text-blue-500" // Example styling
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Flag to prevent state updates if component unmounts during fetch
    let isMounted = true;

    const fetchInitialData = async () => {
      // Ensure loading is true at the start of fetching attempt
      if (isMounted) {
        setLoading(true);
        setError(null); // Reset error on new fetch attempt
      }

      try {
        // Fetch data concurrently
        const [
          calenderData,
          agentData,
          usersData,
          discounts,
          invoices,
          meetings,
          chats,
          campaignsResults,
          campaings
        ] = await Promise.all([
          getAllCalenders(userId),
          fetchAgent(userId),
          getUsers(),
          getDiscounts(),
          getInvoices(userId),
          getMeetings(userId),
          getChats(userId),
          getCampaignResult(userId),
          fetchCampaigns(userId)
        ]);

        // Only dispatch if the component is still mounted
        if (isMounted) {
          dispatch(setcalenders(calenderData));
          dispatch(setagents(agentData));
          dispatch(setusers(usersData));
          dispatch(setdiscounts(discounts));
          dispatch(setinvoices(invoices));
          dispatch(setmeetings(meetings));
          dispatch(setchats(chats));
          dispatch(setcampaignResults(campaignsResults))
          dispatch(setcampaigns(campaings))
        }
      } catch (err) {
        console.error("Error fetching initial layout data:", err);
        if (isMounted) {
          // Set a user-friendly error message
          setError("Failed to load essential data. Please try refreshing.");
        }
      } finally {
        // Ensure loading is set to false once done, even if errors occurred
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [dispatch, userId]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header remains the same */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {" "}
                    {/* Consider populating this based on route */}{" "}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area with Loading/Error Handling */}
        <main className="flex-1 relative p-4 md:p-6">
          {" "}
          {/* Adjust padding as needed */}
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              {/* Use absolute positioning to overlay */}
              <Spinner />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-600 bg-background/50 backdrop-blur-sm z-10">
              <p>{error}</p> {/* Display error message */}
            </div>
          ) : (
            // Render children only when not loading and no error
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
