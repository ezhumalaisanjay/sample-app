import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header"
import HRReports from "@/pages/ui/hr-reports"
import AppSidebar from "@/pages/ui/sidebar"
import { CalendarDays, CalendarX, ChartNoAxesColumn, Frame, PackagePlus, PersonStanding, PieChart, Proportions, Settings } from "lucide-react"
import { useState } from "react"

function HRReportsPage() {
  const [ isActive, setIsActive ] = useState<number>(3);
  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/tenant/dashboard",
    }, {
      index: 1,
      name: "Analytics",
      url: "/tenant/analytics",
    }, {
      index: 2,
      name: "Users",
      url: "/tenant/users",
    },  {
      index: 3,
      name: "Reports",
      url: "/tenant/reports",
    },
  ]

  const data = {
    projects: [
      {
        name: "Dashboard",
        url: "/tenant/dashboard",
        icon: Frame,
      },
      {
        name: "Analytics",
        url: "/tenant/analytics",
        icon: ChartNoAxesColumn,
      },
      {
        name: "Users",
        url: "/tenant/users",
        icon: PersonStanding,
      },
      {
        name: "Reports",
        url: "/tenant/reports",
        icon: Proportions,
      },
      {
        name: "Settings",
        url: "/tenant/settings",
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