import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import { ChartNoAxesColumn, Frame, Loader, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import OnboardingPage from "../../ui/onboarding/index"

export default function Onboarding() {
  const [ isActive, setIsActive ] = useState<number>(1);
  const [ isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, [])

  const handleClick = (id: number) => {
    setIsActive(id);
  }

  const breadCrumbs = [
    {
      index: 0,
      name: "Onboarding",
      url: "/tenant/onboarding",
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
  
  
  return (
    <>
      { isClient ?
      <ThemeProvider>
        <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
          <SidebarProvider>
            <SiteHeader isActive={0} handleClick={handleClick} breadCrumbs={breadCrumbs}/>
            <div className="flex flex-1">
              <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                  <OnboardingPage />
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
