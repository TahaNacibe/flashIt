"use client";

import { useState } from "react";
import { Home, Search, Settings, LogOut, Compass } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AvatarWidget } from "./avatar_widget";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import DeleteConfirmationDialog from "@/app/dialogs/confirm_delete";
import { usePathname } from "next/navigation";

// Menu items excluding logout since we'll handle it separately
const sectionItems = [
  {
    title: "Profile",
    url: "/Profile",
    icon: Home,
  },
  {
    title: "Search",
    url: "/Search",
    icon: Search,
  },
  {
    title: "Discover",
    url: "/",
    icon: Compass,
  },
  {
    title: "Settings",
    url: "/Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  
  //* get the data for the state of the session and the side bar state
  const { data: session } = useSession();
  const { state } = useSidebar();
  const pathname = usePathname();
  //* vars to manage the state
  const [activePage, setActivePage] = useState(pathname);


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/SignIn' });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  console.log(pathname)

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Regular menu items */}
              {sectionItems.map((item) => (
                <SidebarMenuItem key={item.title} className="pb-1">
                  <SidebarMenuButton
                    asChild
                    onClick={() => setActivePage(item.url)}
                    isActive={activePage === item.url}
                  >
                    <Link href={item.url} className="">
                      <item.icon />
                      <span className="">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout item with confirmation dialog */}
              <SidebarMenuItem className="pb-1">
                <DeleteConfirmationDialog
                  title="Sign Out"
                  itemName=""
                  itemType=""
                  deleteCase={false}
                  onConfirm={handleLogout}
                  trigger={
                    <SidebarMenuButton
                      asChild
                      onClick={() => {}} // Dialog handles the click
                      isActive={activePage === "Log Out"}
                    >
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <LogOut />
                        <span>Log Out</span>
                      </div>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* profile holder section */}
      <SidebarFooter>
        <Link href="/Profile">
          <AvatarWidget
            imageUrl={session?.user?.image}
            userName={session?.user?.name}
            isHidden={state === "collapsed"}
          />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}