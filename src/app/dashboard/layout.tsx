// "use client";
// import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import React from "react";
// import { getProducts } from "@/actions/fetch.actions";
// import { useDispatch } from "react-redux";
// import { setProducts } from "@/redux/slices/product";
// import { getLoras } from "@/actions/lora.action";
// import { setloras } from "@/redux/slices/lora";

// export default function Page({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   // fetch data here
//   // const [products, setProducts] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);

//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const data = await getProducts();
//         const loraData = await getLoras()
//         // setProducts(data);
//         dispatch(setProducts(data));
//         dispatch(setloras(loraData))
//         setLoading(false);
//       } catch (error) {
//         console.log("Error Fetching Products in sidebar", error);
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, []);


//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage></BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         {children}
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
import { getProducts } from "@/actions/fetch.actions";
import { getLoras } from "@/actions/lora.action"; // Assuming correct path
import { setProducts } from "@/redux/slices/product"; // Assuming correct path
import { setloras } from "@/redux/slices/lora"; // Assuming correct path

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

// --- Layout Component ---

export default function AppLayout({ // Renamed from Page for clarity if this is a layout
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState<string | null>(null); // State to hold potential errors
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
        const [productsData, loraData] = await Promise.all([
          getProducts(),
          getLoras(),
          // Add other independent fetch calls here if needed
          // e.g., getSettings(), getUserProfile()
        ]);

        // Only dispatch if the component is still mounted
        if (isMounted) {
          dispatch(setProducts(productsData));
          dispatch(setloras(loraData));
          // dispatch other setters here
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
  }, [dispatch]); // Include dispatch in dependency array (it's stable but good practice)

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
                  <BreadcrumbPage> {/* Consider populating this based on route */} </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area with Loading/Error Handling */}
        <main className="flex-1 relative p-4 md:p-6"> {/* Adjust padding as needed */}
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