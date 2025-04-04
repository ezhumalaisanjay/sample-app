import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header"
import HRReports from "@/pages/ui/hr-reports"
import AppSidebar from "@/pages/ui/sidebar"
import { ChartNoAxesColumn, Frame, Loader, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useEffect, useState } from "react"

function HRReportsPage() {
  const [ isActive, setIsActive ] = useState<number>(4);
  const [ isClient, setIsClient ] = useState<boolean>(false);
  
  useEffect(() => {
    setIsClient(true);
  }, [])

  const breadCrumbs = [
    {
      index: 0,
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
        name: "Onboarding",
        url: "/tenant/onboarding",
        icon: PackagePlus,
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
      {isClient ?  
      <ThemeProvider>
        <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
          <SidebarProvider>
            <SiteHeader isActive={0} handleClick={handleClick} breadCrumbs={breadCrumbs} />
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
      </ThemeProvider> :
      <div className="flex justify-center w-screen h-screen items-center">
        <Loader className="animate-spin" />
      </div>
      }
    </>
  )
}

export default HRReportsPage