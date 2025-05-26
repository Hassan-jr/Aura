"use client";
import { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { MainNav } from "./components/main-nav";
import { Overview } from "./components/overview";
import { RecentSales } from "./components/recent-sales";
import { Search } from "./components/search";
import { UserNav } from "./components/user-nav";
import PieChartComponent from "@/components/sentiment/chart/pie";
import { BarChartComponent } from "@/components/sentiment/chart/bar";
import { useAppSelector } from "@/redux/hooks";
import { selectfeedbacks } from "@/redux/slices/feeback";
import { classifySentiment } from "@/actions/emotion.action";
import { selectdiscounts } from "@/redux/slices/discount";
import { selectinvoices } from "@/redux/slices/invoice";
import { selectProducts } from "@/redux/slices/product";
import { selectProductId } from "@/redux/slices/productId";
import { selectusers } from "@/redux/slices/user";
import { selectcampaigns } from "@/redux/slices/campagin";
import { selectposts } from "@/redux/slices/post";

export default function DashboardPage() {
  const feedbacks = useAppSelector(selectfeedbacks);
  const invoices = useAppSelector(selectinvoices);
  const products = useAppSelector(selectProducts);
  const discounts = useAppSelector(selectdiscounts);
  const users = useAppSelector(selectusers);
  const campaigns = useAppSelector(selectcampaigns);
  const posts = useAppSelector(selectposts)

  const calculateTotalInvoices = (invoices: any[], products: any[]) => {
    return invoices.reduce((total, invoice) => {
      const product = products.find((p) => p._id === invoice.productId);
      if (product) {
        return total + product.price * invoice.qty;
      }
      return total;
    }, 0);
  };

  const totalInvoicesValue = calculateTotalInvoices(invoices, products);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              {/* <UserNav /> */}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
            </div>
          </div>
          {/* second section */}
          <div className="space-y-4">
            {/* cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalInvoicesValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KSH",
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Product Models
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products?.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {products?.length} total product model trained since last year
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts Generated</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{posts?.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +69% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Campagins
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{campaigns?.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 since yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* main chart card */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              {/* sales card */}
              <Card className="col-span-3  h-[450px] overflow-x-scroll">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales isInvoice={true} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
              <div className="col-span-4">
                <PieChartComponent data={feedbacks} />
              </div>
              <Card className="col-span-4 h-96 overflow-x-scroll">
                <CardHeader>
                  <CardTitle>Recent Discounts</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales isInvoice={false} />
                </CardContent>
              </Card>
            </div>
          </div>
          {/* sentiment */}
          <div>
            <BarChartComponent data={feedbacks} />
          </div>
        </div>
      </div>
    </>
  );
}
