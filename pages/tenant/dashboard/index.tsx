import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import TenetDashboard from "@/pages/ui/dashboard/tenet-dashboard"
import { ChartNoAxesColumn, Frame, PersonStanding, Proportions, Settings } from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [isActive, setIsActive] = useState<number>(0);
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
  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/tenant/dashboard",
    }, 
  ]

  const handleClick = (id: number) => {
    setIsActive(id)
  }
  
  return (
    <ThemeProvider>
      <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
        <SidebarProvider>
          <SiteHeader isActive={isActive} handleClick={handleClick} breadCrumbs={breadCrumbs} />
          <div className="flex flex-1">
            <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                <TenetDashboard />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
