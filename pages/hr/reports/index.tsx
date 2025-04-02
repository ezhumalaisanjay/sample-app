import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header"
import HRReports from "@/pages/ui/hr-reports"
import AppSidebar from "@/pages/ui/sidebar"
import { CalendarDays, CalendarX, Frame, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useState } from "react"


function HRReportsPage() {
  const [ isActive, setIsActive ] = useState<number>(5);
  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/hr/dashboard",
    }, {
      index: 1,
      name: "Onboarding",
      url: "/hr/onboarding",
    }, {
      index: 2,
      name: "Users",
      url: "/hr/users",
    }, {
      index: 3,
      name: "Leave Tracker",
      url: "/hr/leavetracker",
    }, {
      index: 4,
      name: "Attendance",
      url: "/hr/attendance",
    }, {
      index: 5,
      name: "Reports",
      url: "/hr/reports",
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

  const handleClick = (id: number) => {
    setIsActive(id);
  }

  return(
    <>  
      <ThemeProvider>
        <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
          <SidebarProvider>
            <SiteHeader isActive={isActive} handleClick={handleClick} breadCrumbs={breadCrumbs} />
            <div className="flex flex-1">
              <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                  <HRReports />
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </>
  )
}

export default HRReportsPage