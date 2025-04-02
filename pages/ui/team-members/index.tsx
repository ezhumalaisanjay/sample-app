"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, Phone, MapPin, Calendar, MoreHorizontal, Search, Linkedin, Github, SlidersVertical } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import EditEmployeeDialog from "../employee-list/edit-employee"
import ViewProfileDialog from "./view-profile"
import axios from "axios"
import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import { format } from "date-fns"

// Team member type definition
interface TeamMember {
  id: string
  name: string
  firstName: string
  lastName: string
  employeeId: string
  jobTitle: string
  department: string
  email: string
  phone: string
  location: string
  startDate: string
  status: "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null
  manager: string
  avatar: string
  socialLinks?: {
    linkedin?: string
    github?: string
  }
  mailId: string
}

// Define the Employee type to match what EditEmployeeDialog expects
interface Employee {
  id: string
  name?: string
  firstName: string
  lastName: string
  employeeId?: string | null
  department?: string | null
  jobTitle?: string | null
  status?: "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null
  startDate?: string | null
  joiningDate?: string | null
  location?: string | null
  manager?: string | null
  mailId?: string | null
  email?: string | null
  phoneCountryCode?: string | null
  phoneNumber?: string | null
  leaveRequestPending?: boolean
  performanceReviewDue?: boolean
  trainingOverdue?: boolean
}

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

export default function TeamMembers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editEmployee, setEditEmployee] = useState<TeamMember | null>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const { data }: { data: TenantResponse } = await axios.post(
          "/api/getTenantUserPool",
          {
            email: email,
          }
        );

        setOrganizationName(data.TenantData.id);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();
  }, [])

  useEffect(() => {
    
    client.models.Onboarding.observeQuery().subscribe({
      next: (data) => {
        const filteredData = data.items.filter((item) => item.organization === organizationName);

        const transformedData = filteredData.map((item) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          firstName: item.firstName || "",
          lastName: item.lastName || "",
          employeeId: item.employeeId || "",
          jobTitle: item.jobTitle || "",
          department: item.department || "",
          email: item.email || "",
          phone: `${item.phoneCountryCode} ${item.phoneNumber}` || "",
          location: item.location || "",
          startDate: item.joiningDate || "",
          status: item.status as "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null,
          manager: item.manager || "",
          avatar: "/placeholder.svg?height=400&width=400",
          socialLinks: {
            linkedin: "",
            github: "",
          },
          mailId: item.email,
        }));
        setTeamMembers(transformedData)
      },
    })

  }, [organizationName])

  // Filter team members based on search query and filters
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(teamMembers.map((member) => member.department)))

  // Handle save from EditEmployeeDialog
  const handleSaveEmployee = (updatedEmployee: Employee) => {
    console.log("Updated employee:", updatedEmployee)
    setEditEmployee(null)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage and view all team members in your organization</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex justify-between items-center">
        <div className="relative basis-1/2 m-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or jobTitle..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"}>
              {" "}
              <SlidersVertical />{" "}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="m-3 flex flex-col gap-3">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <SelectValue placeholder="Filter by department" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Team members grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {/* Header with status badge */}
                  <div className="flex items-center justify-between p-4 bg-muted/50">
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : member.status === "Remote" ? "secondary" : "outline"
                      }
                    >
                      {member.status === "Active" ? "Active" : member.status === "Remote" ? "Remote" : "On Leave"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setSelectedMember(member)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer">Message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={!!editEmployee} onOpenChange={() => setEditEmployee(null)}>
                      <DialogContent className="p-0">
                        {/*<EditEmployeeDialog
                          employee={{
                            id: editEmployee?.id || "",
                            firstName: editEmployee?.firstName || "",
                            lastName: editEmployee?.lastName || "",
                            name: editEmployee?.name || "",
                            employeeId: editEmployee?.employeeId || "",
                            department: editEmployee?.department || "",
                            jobTitle: editEmployee?.jobTitle || "",
                            status: editEmployee?.status || "Active",
                            startDate: editEmployee?.startDate || "",
                            location: editEmployee?.location || "",
                            manager: editEmployee?.manager || "",
                            leaveRequestPending: false,
                            performanceReviewDue: false,
                            trainingOverdue: false,
                            mailId: editEmployee?.mailId || "",
                          }}
                          open={true}
                          onClose={() => setEditEmployee(null)}
                        />*/}
                      </DialogContent>
                    </Dialog>
                    {selectedMember && (
                      <ViewProfileDialog
                        member={selectedMember}
                        open={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                      />
                    )}
                  </div>

                  {/* Main content */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-xl">{member.name}</h3>
                    <p className="text-muted-foreground mb-1">{member.jobTitle}</p>
                    <Badge variant="outline" className="mb-4">
                      {member.department}
                    </Badge>

                    {/* Contact info */}
                    <div className="grid gap-2 w-full text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Joined {format(member.startDate, "PPP")}</span>
                      </div>
                    </div>

                    {/* Social links */}
                    {member.socialLinks && (
                      <div className="flex mt-4 space-x-2">
                        {member.socialLinks.linkedin && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                              <span className="sr-only">LinkedIn</span>
                            </a>
                          </Button>
                        )}
                        {member.socialLinks.github && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                              <span className="sr-only">GitHub</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No team members found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

