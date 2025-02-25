"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareChartGantt,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProfileBadge } from "@/customui/profilebudget";
import { getProducts } from "@/actions/fetch.actions";
import { useSelector } from "react-redux";
import { selectProducts } from "@/redux/slices/product";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://r2.nomapos.com/model/hassanjr001%20(1).jpg",
  },
  teams: [
    {
      name: "Watt 4 Marketting",
      logo: GalleryVerticalEnd,
      plan: "",
    },
    {
      name: "Acme Corp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Platform",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          url: "/dashboard/products",
          icon: SquareChartGantt,
        },
        {
          title: "Posts",
          url: "/dashboard/posts",
          icon: SquareTerminal,
        },
      ],
    },
    {
      title: "Customer & Socials",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Customers Engagement",
          url: "/dashboard/chat",
          icon: SquareTerminal,
        },
        {
          title: "E-mail Marketting",
          url: "/dashboard/mail",
          icon: SquareTerminal,
        },
        {
          title: "Connect Socials",
          url: "/dashboard/social",
          icon: SquareTerminal,
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Sentiment Analysis",
          url: "/dashboard/sentiment",
        },
        {
          title: "S.E.O & SM Analysis Agent",
          url: "/dashboard/agent",
        },
        {
          title: "Vision Model",
          url: "/dashboard/vision",
        },
        {
          title: "Campaign Automation",
          url: "/dashboard/campaign",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General Setting",
          url: "#",
        },
        {
          title: "Webhook Integration",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [productTeam, setproductTeam] = React.useState([
    {
      name: "",
      logo: GalleryVerticalEnd,
      plan: "",
      id: "",
    },
  ]);

  const products = useAppSelector(selectProducts);

  React.useEffect(() => {
    const team = products?.map((pro) => ({
      name: pro?.title,
      logo: GalleryVerticalEnd,
      plan: pro?.description,
      id: pro?._id
    }));

    setproductTeam(team);
  }, [products]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={productTeam} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive}>
                      {item.icon && <item.icon />}
                      <Link href={item.url} prefetch={true}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <ProfileBadge isDashboard={true} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
