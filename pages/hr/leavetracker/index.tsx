import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import { CalendarDays, CalendarX, Frame, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useState } from "react"
import EmployeeLeaveBalanceAndHistoryPage from "@/pages/ui/leavetracker/employee-leave-balance"
import LeaveManagementPage from "@/pages/ui/leavetracker/leave-management"
import LeavePolicyPage from "@/pages/ui/leavetracker/leave-policy"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import EmployeeLeavePage from "@/pages/ui/leavetracker/employee-leave-dashboard"

export default function LeaveTracker() {
  const [ isActive, setIsActive ] = useState<number>(3);

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
                  <Tabs defaultValue="leaverequest">
                    <TabsList>
                      <TabsTrigger value="leaverequest">Leave request</TabsTrigger>
                      <TabsTrigger value="leavemanagement">Leave Management</TabsTrigger>
                      <TabsTrigger value="leavepolicy">Leave Policy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="leaverequest">
                      {/* <EmployeeLeaveBalanceAndHistoryPage /> */}
                      <EmployeeLeavePage/>
                    </TabsContent>
                    <TabsContent value="leavemanagement">
                      <LeaveManagementPage />
                    </TabsContent>
                    <TabsContent value="leavepolicy">
                      <LeavePolicyPage />
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
