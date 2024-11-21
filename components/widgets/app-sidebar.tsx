"use client";

import { useState } from "react";
import { Home, Search, Settings, LogOut, Compass, Send, LifeBuoy } from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { AvatarWidget } from "./avatar_widget";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Menu items.
const sectionItems = [
  {
    title: "Home",
    url: "/Home",
    icon: Home,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Discover",
    url: "#",
    icon: Compass,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Log Out",
    url: "#",
    icon: LogOut,
  },
];


export function AppSidebar() {
  const [activePage, setActivePage] = useState("Home")

  //* get the data for the state
  const { data: session } = useSession();
  const { state } = useSidebar()

  return (
    <Sidebar
      collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sectionItems.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-1" >
                  <SidebarMenuButton asChild onClick={() => setActivePage(item.title)} isActive={activePage === item.title}>
                    <a href={item.url} className="">
                      <item.icon />
                      <span className="">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Link href={"/Profile"}>
        <AvatarWidget
          imageUrl={session?.user.image}
          userName={session?.user.name}
          isHidden={state === "collapsed"} // Pass collapsible state
        />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
