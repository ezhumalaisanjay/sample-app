import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import IndividualEmployeeLeavePage from "@/pages/ui/leavetracker/individual_employee_dashboard"
import LeaveManagementPage from "@/pages/ui/leavetracker/leave-management"
import LeavePolicyPage from "@/pages/ui/leavetracker/leave-policy"
import LeaveRequestPage from "@/pages/ui/leavetracker/leave-request"
import AppSidebar from "@/pages/ui/sidebar/index"
import { CalendarDays, CalendarX, Frame } from "lucide-react"
import { useState } from "react"

export default function LeaveTrackerPage() {
  const [isActive, setIsActive] = useState<number>(1);
  const data = {
    projects: [
      {
        name: "Dashboard",
        url: "/employee/dashboard",
        icon: Frame,
      },
      {
        name: "Leave Tracker",
        url: "/employee/leavetracker",
        icon: CalendarX,
      },
      {
        name: "Attendance",
        url: "/employee/attendance",
        icon: CalendarDays,
      },
    ],
  }
  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/employee/dashboard",
    }, {
      index: 1,
      name: "Leave Tracker",
      url: "/employee/leavetracker",
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
                <IndividualEmployeeLeavePage />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
