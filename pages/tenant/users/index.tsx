import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/ui/theme-provider"
import EmployeeListTable from "@/pages/ui/employee-list"
import GroupListTable from "@/pages/ui/group-list/table"
import SiteHeader from "@/pages/ui/header"
import AppSidebar from "@/pages/ui/sidebar"
import UsersListTable from "@/pages/ui/users-list/table/index"
import { ChartNoAxesColumn, Frame, PersonStanding, PieChart, Proportions, Settings } from "lucide-react"
import { useEffect, useState } from "react"

function Users() {
  const [ isActive, setIsActive ] = useState<number>(2);

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
              <SidebarInset className="w-full max-w-full overflow-hidden">
                <div className="flex flex-1 flex-col gap-4 mt-10 p-4">
                  <div className="m-3 w-full max-w-full">
                    <Tabs defaultValue="0" className="w-full">
                      <TabsList>
                        <TabsTrigger value="0">Employees</TabsTrigger>
                        <TabsTrigger value="1">Groups</TabsTrigger>
                      </TabsList>
                      <TabsContent value="0" className="w-full max-w-full overflow-hidden">
                        <EmployeeListTable />
                      </TabsContent>
                      <TabsContent value="1" className="w-full max-w-full overflow-hidden">
                        <GroupListTable />
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