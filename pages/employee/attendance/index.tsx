import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"
import SiteHeader from "@/pages/ui/header/index"
import AppSidebar from "@/pages/ui/sidebar/index"
import { CalendarDays, CalendarX, Frame } from "lucide-react"
import { useState } from "react"
import MyShiftsPage from "@/pages/ui/attendance/my-shifts"

export default function Attendance() {
  const [ isActive, setIsActive ] = useState<number>(2);

  const handleClick = (id: number) => {
    setIsActive(id);
  }

  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/employee/dashboard",
    },{
      index: 1,
      name: "Leave Tracker",
      url: "/employee/leavetracker",
    },  {
      index: 2,
      name: "Attendance",
      url: "/employee/attendance",
    },
  ]

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
  
  return (
    <ThemeProvider>
      <div className="[--header-height:calc(theme(spacing.14))] flex w-full">
        <SidebarProvider>
          <SiteHeader isActive={isActive} handleClick={handleClick} breadCrumbs={breadCrumbs}/>
          <div className="flex flex-1">
            <AppSidebar data={data} isActive={isActive} handleClick={handleClick}/>
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                <MyShiftsPage />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  )
}
