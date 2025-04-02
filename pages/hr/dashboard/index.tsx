import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import HRDashboard from "@/pages/ui/dashboard/hr-dashboard/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import { CalendarDays, CalendarX, Frame, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [ isActive, setIsActive ] = useState<number>(0);

  const handleClick = (id: number) => {
    setIsActive(id);
  }

  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/hr/dashboard",
    }, 
  ]

  const data = {
    projects: [
      {
        name: "Dashboard",
        url: "/hr/dashboard",
        icon: Frame,
      },
      {
        name: "Onboarding",
        url: "/hr/onboarding",
        icon: PackagePlus,
      },
      {
        name: "Users",
        url: "/hr/users",
        icon: PersonStanding,
      },
      {
        name: "Leave Tracker",
        url: "/hr/leavetracker",
        icon: CalendarX,
      },
      {
        name: "Attendance",
        url: "/hr/attendance",
        icon: CalendarDays,
      },
      {
        name: "Reports",
        url: "/hr/reports",
        icon: Proportions,
      },
      {
        name: "Settings",
        url: "/hr/settings",
        icon: Settings,
      },
    ],
  }
  
  return (
    <ThemeProvider>
      <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
        <SidebarProvider>
          <SiteHeader isActive={isActive} handleClick={handleClick} breadCrumbs={breadCrumbs}/>
          <div className="flex flex-1">
            <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                <HRDashboard />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
