"use client"

import * as React from "react"
import NavProjects from "./nav-projects"
import NavUser from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import smallLogo from "../../images/smallLogo.png"
import { LucideIcon } from "lucide-react"

interface Project {
  name: string;
  url: string;
  icon: LucideIcon; // React component for the icon
}

interface Data {
  projects: Project[];
}

interface AppSidebarProps {
  data: Data; // The type of data prop
  isActive: number;
  handleClick: (id: number) => void;
}

export default function AppSidebar({data, isActive, handleClick} : AppSidebarProps) {
  
  if (!data || !data.projects) {
    // Handle the error or return a fallback
    return <p>No projects available.</p>;
  }

  return (
    <Sidebar
      collapsible="icon"
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
    >
      <SidebarHeader className="m-0 p-0 flex justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="bg-white p-1">
              <div className="flex gap-2 items-center">
                <div>
                  <Image src={smallLogo} alt="logo" objectFit="cover" width={50} height={50} className="ml-1 rounded-full" />
                </div>
                <div className="grid text-left flex-1 text-lg font-sans">
                  <span className="truncate text-slate-800 font-bold">SQUAD HR</span>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} isActive={isActive} handleClick={handleClick}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
