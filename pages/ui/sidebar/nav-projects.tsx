"use client";

import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import Link from "next/link";

interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavProjectsProps {
  projects?: Project[];
  isActive: number;
  handleClick: (id: number) => void;
}

export default function NavProjects({
  projects = [],
  isActive,
  handleClick,
}: NavProjectsProps ) {
  const { isMobile } = useSidebar();

  if (!Array.isArray(projects)) {
    return <p>No pages available.</p>;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]">
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {projects.length > 0 ? (
          projects.map((item, index) => (
            <SidebarMenuItem key={item.name} className={index === isActive ? "font-bold" : ""} 
            onClick={() => handleClick(index)}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        ) : (
          <p className="text-muted-foreground p-2">No projects available.</p>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
