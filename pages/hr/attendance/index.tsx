import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import { CalendarDays, CalendarX, Frame, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useState } from "react"
import MyShiftsPage from "@/pages/ui/attendance/my-shifts"
import ShiftSchedulingPage from "@/pages/ui/attendance/shift-scheduling/page"
import ShiftsAssigningPage from "@/pages/ui/attendance/hr-shifts-assign"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Onboarding() {
  const [ isActive, setIsActive ] = useState<number>(4);

  const handleClick = (id: number) => {
    setIsActive(id);
  }

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
                <div className="m-3">
                  <Tabs defaultValue="0">
                    <TabsList>
                      <TabsTrigger value="0">My Shift</TabsTrigger>
                      <TabsTrigger value="1">Shift Assign</TabsTrigger>
                      <TabsTrigger value="2">Shift Schedule</TabsTrigger>
                    </TabsList>
                    <TabsContent value="0">
                      <MyShiftsPage />
                    </TabsContent>
                    <TabsContent value="1">
                      <ShiftsAssigningPage />
                    </TabsContent>
                    <TabsContent value="2">
                      <ShiftSchedulingPage />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
