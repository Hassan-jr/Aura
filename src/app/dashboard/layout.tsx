"use client";
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
import React from "react";
import { getProducts } from "@/actions/fetch.actions";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/slices/product";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch data here
  // const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        // setProducts(data);
        dispatch(setProducts(data));
        setLoading(false);
      } catch (error) {
        console.log("Error Fetching Products in sidebar", error);
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  // console.log("products 2:", products);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
