import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import UsageChart from "./usage-chart"
import EmployeeLists from "./employee-list"
import { useEffect, useState } from "react"
import { Boxes, Globe, TicketsPlane, Users } from "lucide-react"
import axios from "axios"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"
import { decodeJwt } from "@/lib/jwt-data/data"

interface TenantResponse {
  ClientId: string
  TenantData: {
    UserID: string
    admin_email: string
    admin_name: string
    client_id: string
    createdAt: string
    group_name: string
    id: string
    identity_pool_id: string
    phone_number: string 
    tenant_name: string
    updatedAt: string
    user_pool_id: string
  }
}

Amplify.configure(outputs)
const client = generateClient<Schema>()

export default function TenetDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [organizationName, setOrganizationName] = useState("");

  const [data, setData] = useState([
    {
      name: "Total Organizations",
      count: "50",
      icon: <Globe className="size-4 text-green-500" />,
    }, {
      name: "Total Groups",
      count: "152",
      icon: <Boxes className="size-4 text-blue-500" />,
    }, {
      name: "Total Users",
      count: usersCount,
      icon: <Users className="size-4 text-violet-500" />,
    }, {
      name: "New Users",
      count: newUsersCount,
      icon: <TicketsPlane className="size-4 text-amber-500" />,
    },
  ]);
  
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
  
    if (idToken) {
      const decodedData = decodeJwt({ idToken });
      console.log("This is IdToken", decodedData);  // This will log the decoded JWT payload (user data)
      console.log("Organization Name", decodedData["custom:organization"]);
      setOrganizationName(decodedData["custom:organization"]);
    } else {
      console.log("No idToken found in localStorage.");
    }

  }, [])

  function responseData() {
    client.models.Onboarding.observeQuery().subscribe({
      next: (data) => {
        const organizationFilteredData = data.items.filter((item) => item.organization === organizationName)

        const tempEmployeesCount = organizationFilteredData.length;
        setUsersCount(tempEmployeesCount);

        const tempNewHiresCount = organizationFilteredData.filter((item) => item.status === "New Hire").length;
        setNewUsersCount(tempNewHiresCount);
      },
    })
  }

  useEffect(() => {
    responseData();

    setData([
      {
        name: "Total Organizations",
        count: "50",
        icon: <Globe className="size-4 text-green-500" />,
      }, {
        name: "Total Groups",
        count: "152",
        icon: <Boxes className="size-4 text-blue-500" />,
      }, {
        name: "Total Users",
        count: usersCount,
        icon: <Users className="size-4 text-violet-500" />,
      }, {
        name: "New Users",
        count: newUsersCount,
        icon: <TicketsPlane className="size-4 text-amber-500" />,
      },
    ]);

  }, [organizationName, newUsersCount, usersCount])

  return (
    <>
      <div className="flex-col md:flex">
        
        <div className="flex-1 space-y-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.map((details, index) => 
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {details.name}
                    </CardTitle>
                    <div
                      className="h-4 w-4 text-muted-foreground"
                    >
                      {details.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{details.count}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                )}
              </div>
              <div className="flex flex-wrap md:grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 w-full">
                  <CardContent>
                    <UsageChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3 w-full">
                  <CardHeader>
                    <CardTitle>Employees List</CardTitle>
                    <CardDescription>
                      Total Current Users List
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmployeeLists />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/*
        <div className="px-4 m-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent >
              <div className="flex flex-col gap-4 w-full overflow-x-auto">
                <div className="flex gap-4 justify-evenly bg-slate-100 p-2">
                  <div className="text-nowrap basis-1/3 font-semibold">Employee Name</div>
                  <div className="text-nowrap basis-1/3">Employee ID/Number</div>
                  <div className="text-nowrap basis-1/3">Department</div>
                  <div className="text-nowrap basis-1/3">Job Title</div>
                  <div className="text-nowrap basis-1/3">Status</div>
                  <div className="text-nowrap basis-1/3">Start Date</div>
                  <div className="text-nowrap basis-1/3">Location</div>
                </div>
                <div className="p-2 flex flex-col gap-2">
                  {employeesData.map((employee, index) => 
                  <div className="flex gap-4" key={index}>
                    <div className="text-nowrap basis-1/3">{employee.name}</div>
                    <div className="text-nowrap basis-1/3">{employee.id}</div>
                    <div className="text-nowrap basis-1/3">{employee.department}</div>
                    <div className="text-nowrap basis-1/3">{employee.job}</div>
                    <div className="text-nowrap basis-1/3">{employee.status}</div>
                    <div className="text-nowrap basis-1/3">{employee.startDate}</div>
                    <div className="text-nowrap basis-1/3">{employee.location}</div>
                  </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </>
  )
}