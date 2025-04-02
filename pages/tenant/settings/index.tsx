import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header"
import AppSidebar from "@/pages/ui/sidebar"
import { ChartNoAxesColumn, Frame, PersonStanding, PieChart, Proportions, Settings } from "lucide-react"
import { useState } from "react"
import SystemSettingsPage from "@/pages/ui/system-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GroupSettingsPage from "@/pages/ui/group-settings/page"

function SettingsPage() {
  const [ isActive, setIsActive ] = useState<number>(4);
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
    }, {
      index: 3,
      name: "Settings",
      url: "/tenant/settings",
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
                  <div className="m-3">
                    <Tabs defaultValue="0">
                      <TabsList>
                        <TabsTrigger value="0">Group Settings</TabsTrigger>
                        <TabsTrigger value="1">System Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="0">
                        <GroupSettingsPage />
                      </TabsContent>
                      <TabsContent value="1">
                        <SystemSettingsPage />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </>
  )
}

export default SettingsPage