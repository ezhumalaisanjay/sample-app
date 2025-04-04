import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import axios from "axios";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"
import { decodeJwt } from "@/lib/jwt-data/data";

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

interface TotalUsersData {
  name: string
  email: string
  avatar: string
  status: string
  progress?: string
}

Amplify.configure(outputs)
const client = generateClient<Schema>()

export default function EmployeeLists() {
  const [organizationName, setOrganizationName] = useState("");
  const [ totalUsers, setTotalUsers ] = useState<TotalUsersData[]>([]);

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
          
          const transformedData = organizationFilteredData.map((item) => ({
            name: `${item.firstName} ${item.lastName}` || "",
            email: item.email || "",
            avatar: "https://github.com/shadcn.png",
            status: item.status || "",
          }))

          setTotalUsers(transformedData);
        },
        error: (error) => {
          console.error("Error fetching data:", error)
        },
      })
    }
  
    useEffect(() => {
      responseData();
    }, [organizationName])

  const sampleData = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@company.com",
      avatar: "https://github.com/shadcn.png",
      initials: "OM",
      status: "Completed",
      progress: "100%",
    },
  ]

  return (
    <ScrollArea className="w-[75vw] md:w-full">
      <div className="space-y-8">
        {totalUsers.length > 0 ? totalUsers.map((user, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
              <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Badge
                variant={
                  user.status === "Completed" ? "default" : user.status === "In Progress" ? "secondary" : "outline"
                }
              >
                {user.status}
              </Badge>
              {/*<span className="text-sm font-medium">{user.progress}</span>*/}
            </div>
          </div>
        )) : 
        <div className="flex justify-center h-auto items-center">
          No Users Found..
        </div>
        }
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

