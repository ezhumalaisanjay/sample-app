import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/ui/theme-provider"
import EmployeeListTable from "@/pages/ui/employee-list"
import SiteHeader from "@/pages/ui/header"
import AppSidebar from "@/pages/ui/sidebar"
import TeamMembers from "@/pages/ui/team-members"
import { CalendarDays, CalendarX, Frame, PackagePlus, PersonStanding, Proportions, Settings } from "lucide-react"
import { useEffect, useState } from "react"

function Users() {
  const [ isActive, setIsActive ] = useState<number>(2);

  const breadCrumbs = [
    {
      index: 0,
      name: "Dashboard",
      url: "/hr/dashboard",
    }, {
      index: 1,
      name: "Onboarding",
      url: "/hr/onboarding",
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

  useEffect(() => {
    // Example of setting searchParams from an async fetch if needed.
    // Make sure you handle async data properly.
    // setSearchParams({ search: 'newSearch', tenant: 'tenant-b', group: 'group-2', page: '1' });
  }, []);

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
                        <TabsTrigger value="0">Employees</TabsTrigger>
                        <TabsTrigger value="1">Team Members</TabsTrigger>
                      </TabsList>
                      <TabsContent value="0">
                        <EmployeeListTable />
                      </TabsContent>
                      <TabsContent value="1">
                        <TeamMembers />
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

export default Users