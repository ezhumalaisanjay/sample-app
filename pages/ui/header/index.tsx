"use client"

import { Moon, Palette, SidebarIcon, Sun } from "lucide-react"
import SearchForm from "./search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useTheme } from "@/components/ui/theme-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import ThemeCustomizer from "@/components/ui/theme-customizer"
import Link from "next/link"
import { NotificationCenter } from "@/components/ui/notification-center"

interface List {
  index: number,
  name: string,
  url: string,
}

interface AppSidebarProps {
  breadCrumbs: List[]; // The type of data prop
  isActive: number;
  handleClick: (id: number) => void;
}

export default function SiteHeader({breadCrumbs = [], isActive, handleClick} : AppSidebarProps) {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex fixed top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
          {breadCrumbs && breadCrumbs.length > 0 ? (
              breadCrumbs.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <BreadcrumbItem
                    className={isActive === i ? "font-bold" : ""}
                    onClick={() => handleClick(i)}
                  >
                    <Link href={item.url}>{item.name}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>
              ))
            ) : (
              <div>No breadcrumbs available</div> // You can show a fallback message or leave it empty
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <NotificationCenter />
          {theme.mode === "dark" ? 
          <Button 
          variant={"ghost"}
          className="size-6 p-2"
          onClick={() => setTheme({ ...theme, mode: "light" })}>
            <Sun />
          </Button>
          : 
          <Button 
          variant={"ghost"}
          className="size-6 p-2"
          onClick={() => setTheme({ ...theme, mode: "dark" })}>
            <Moon />
          </Button>
          }
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className="size-6 p-2">
                <Palette />
            </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ThemeCustomizer />
            </PopoverContent>
          </Popover>
      </div>
    </header>
  )
}
