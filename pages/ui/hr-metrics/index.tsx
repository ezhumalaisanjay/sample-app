"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  BriefcaseBusiness,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  FileText,
  LineChart,
  MoreHorizontal,
  PieChart,
  SlidersVertical,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"

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

export default function HRMetricsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [filterOpen, setFilterOpen] = useState(false)
  const [organizationName, setOrganizationName] = useState("");
  const [employeesCount, setEmployeesCount] = useState(0);
  const [tempEmployeesCount, setTempEmployeesCount] = useState(0);
  const [tempNewUsersCount, setTempNewUsersCount] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [turnoverRate, setTurnOverRate] = useState(0);
  const [tempTurnoverRate, setTempTurnoverRate] = useState(0);
  const [filters, setFilters] = useState<{
    department: string[]
    location: string[]
    dateRange: string
    employmentType: string[]
    status: string
  }>({
    department: [],
    location: [],
    dateRange: "thisMonth",
    employmentType: [],
    status: "all",
  })
  
  const turnoverRateCalculation = ({
    totalEmployees,
    onLeaveEmployees,
  }: { totalEmployees: number; onLeaveEmployees: number }) => {
    // Check if totalEmployees is 0 or if either value is not a valid number
    if (totalEmployees === 0 || isNaN(totalEmployees) || isNaN(onLeaveEmployees)) {
      return 0
    }

    const result = (onLeaveEmployees / totalEmployees) * 100
    const roundedResult = result.toFixed(1)
    return Number(roundedResult)
  }

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

        //console.log("User Login Data", data);
        setOrganizationName(data.TenantData.id);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();
  }, [])

  function responseData() {
    client.models.Onboarding.observeQuery().subscribe({
      next: (data) => {
        const organizationFilteredData = data.items.filter((item) => item.organization === organizationName)

        const tempEmployeeCount = organizationFilteredData.length;
        setTempEmployeesCount(tempEmployeeCount);

        const tempNewHiresCount = organizationFilteredData.filter((item) => item.status === "New Hire").length;
        setTempNewUsersCount(tempNewHiresCount);

        const tempOnLeaveUsersCount = organizationFilteredData.filter((item) => item.status === "On Leave").length;
        const tempTurnover = turnoverRateCalculation({ totalEmployees: tempEmployeesCount, onLeaveEmployees: tempOnLeaveUsersCount });
        setTempTurnoverRate(tempTurnover)
      },
    })
  }

  useEffect(() => {

    setEmployeesCount(tempEmployeesCount);
    setNewUsersCount(tempNewUsersCount);
    setTurnOverRate(tempTurnoverRate);

    responseData();
  }, [organizationName, tempNewUsersCount, tempEmployeesCount, tempTurnoverRate])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 gap-4 p-4 lg:gap-8 lg:p-8">
        <main className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">HR Analytics</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setFilterOpen(true)}>
                <SlidersVertical className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea className="w-[75vw] lg:w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="compensation">Compensation</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{employeesCount}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Hires</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{newUsersCount}</div>
                    <p className="text-xs text-muted-foreground">+4% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{turnoverRate}%</div>
                    <p className="text-xs text-muted-foreground">-0.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$78,350</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last year</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Employee Distribution</CardTitle>
                    <CardDescription>Breakdown by department and location</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                      <div className="flex h-full items-center justify-center">
                        <div className="grid grid-cols-2 gap-8 w-full">
                          <div>
                            <h4 className="mb-4 text-sm font-medium">By Department</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>Engineering</div>
                                  <div className="font-medium">38%</div>
                                </div>
                                <Progress value={38} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>Sales</div>
                                  <div className="font-medium">24%</div>
                                </div>
                                <Progress value={24} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>Marketing</div>
                                  <div className="font-medium">18%</div>
                                </div>
                                <Progress value={18} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>Operations</div>
                                  <div className="font-medium">12%</div>
                                </div>
                                <Progress value={12} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>HR & Admin</div>
                                  <div className="font-medium">8%</div>
                                </div>
                                <Progress value={8} />
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-4 text-sm font-medium">By Location</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>San Francisco</div>
                                  <div className="font-medium">42%</div>
                                </div>
                                <Progress value={42} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>New York</div>
                                  <div className="font-medium">28%</div>
                                </div>
                                <Progress value={28} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>London</div>
                                  <div className="font-medium">15%</div>
                                </div>
                                <Progress value={15} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div>Remote</div>
                                  <div className="font-medium">15%</div>
                                </div>
                                <Progress value={15} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Headcount Trend</CardTitle>
                    <CardDescription>Monthly employee count over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Headcount has grown by 18% over the past year, with the most significant increases in Q2 and
                            Q3.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Diversity Metrics</CardTitle>
                    <CardDescription>Gender and age distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <div className="text-center">
                          <div className="flex justify-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                              <span className="text-sm">Male (54%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                              <span className="text-sm">Female (42%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-green-400"></div>
                              <span className="text-sm">Other (4%)</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Gender diversity has improved by 5% compared to last year.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Key HR Metrics</CardTitle>
                    <CardDescription>Performance indicators and benchmarks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Time to Hire</div>
                            <div className="font-medium">32 days</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>-4 days vs. last quarter</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Cost per Hire</div>
                            <div className="font-medium">$4,250</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>-$320 vs. last quarter</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Training Hours/Employee</div>
                            <div className="font-medium">24 hrs</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>+6 hrs vs. last quarter</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Employee Satisfaction</div>
                            <div className="font-medium">4.2/5</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>+0.3 vs. last quarter</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Promotion Rate</div>
                            <div className="font-medium">8.5%</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>+1.2% vs. last year</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>Absenteeism Rate</div>
                            <div className="font-medium">2.8%</div>
                          </div>
                          <div className="flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                              <ChevronDown className="h-3 w-3 rotate-180" />
                              <span>-0.4% vs. last quarter</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Latest HR activities and updates</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "New Employee Onboarding",
                          description: "5 new employees completed onboarding process",
                          time: "2 hours ago",
                          icon: Users,
                        },
                        {
                          title: "Performance Review Cycle",
                          description: "Q2 performance review cycle started",
                          time: "Yesterday",
                          icon: BarChart3,
                        },
                        {
                          title: "Benefits Enrollment",
                          description: "Annual benefits enrollment period opened",
                          time: "2 days ago",
                          icon: FileText,
                        },
                        {
                          title: "Training Program",
                          description: "Leadership development program launched",
                          time: "3 days ago",
                          icon: BriefcaseBusiness,
                        },
                        {
                          title: "Payroll Processed",
                          description: "Monthly payroll successfully processed",
                          time: "5 days ago",
                          icon: DollarSign,
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-full bg-muted p-2">
                            <activity.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-3 w-3" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recruitment" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                    <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+8 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">856</div>
                    <p className="text-xs text-muted-foreground">+124 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <p className="text-xs text-muted-foreground">+18 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time to Fill</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32 days</div>
                    <p className="text-xs text-muted-foreground">-4 days from last quarter</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Recruitment Pipeline</CardTitle>
                    <CardDescription>Current status of all open positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <ScrollArea className="lg:w-full w-[75vw]">
                        {[
                          {
                            position: "Senior Software Engineer",
                            department: "Engineering",
                            applications: 68,
                            interviews: 12,
                            offers: 2,
                            status: "In Progress",
                          },
                          {
                            position: "Product Manager",
                            department: "Product",
                            applications: 45,
                            interviews: 8,
                            offers: 1,
                            status: "In Progress",
                          },
                          {
                            position: "UX Designer",
                            department: "Design",
                            applications: 52,
                            interviews: 10,
                            offers: 0,
                            status: "Interviewing",
                          },
                          {
                            position: "Sales Representative",
                            department: "Sales",
                            applications: 34,
                            interviews: 6,
                            offers: 2,
                            status: "Offer Stage",
                          },
                          {
                            position: "Marketing Specialist",
                            department: "Marketing",
                            applications: 28,
                            interviews: 5,
                            offers: 1,
                            status: "In Progress",
                          },
                        ].map((job, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{job.position}</h4>
                                <p className="text-sm text-muted-foreground">{job.department}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <p className="text-sm font-medium">{job.applications}</p>
                                  <p className="text-xs text-muted-foreground">Applications</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium">{job.interviews}</p>
                                  <p className="text-xs text-muted-foreground">Interviews</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium">{job.offers}</p>
                                  <p className="text-xs text-muted-foreground">Offers</p>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm">
                                    {job.status}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <Progress
                              value={
                                job.status === "In Progress"
                                  ? 50
                                  : job.status === "Interviewing"
                                    ? 75
                                    : job.status === "Offer Stage"
                                      ? 90
                                      : 25
                              }
                            />
                          </div>
                        ))}
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Performance Score</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.8/5</div>
                    <p className="text-xs text-muted-foreground">+0.2 from last review cycle</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15%</div>
                    <p className="text-xs text-muted-foreground">+2% from last review cycle</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Performance Improvement</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.5%</div>
                    <p className="text-xs text-muted-foreground">+1.5% from last review cycle</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">+4% from last quarter</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                    <CardDescription>Employee performance ratings distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <BarChart3 className="h-16 w-16 text-muted-foreground" />
                        <div className="text-center">
                          <div className="flex justify-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <span className="text-sm">Exceeds (18%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                              <span className="text-sm">Meets (65%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                              <span className="text-sm">Needs Improvement (17%)</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Performance has improved across all departments compared to last review cycle.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Skills Gap Analysis</CardTitle>
                    <CardDescription>Top skills needed for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Leadership</div>
                          <div className="font-medium">32%</div>
                        </div>
                        <Progress value={32} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Technical Skills</div>
                          <div className="font-medium">28%</div>
                        </div>
                        <Progress value={28} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Communication</div>
                          <div className="font-medium">24%</div>
                        </div>
                        <Progress value={24} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Problem Solving</div>
                          <div className="font-medium">16%</div>
                        </div>
                        <Progress value={16} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="compensation" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$78,350</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last year</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Salary Range</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45K-$180K</div>
                    <p className="text-xs text-muted-foreground">Based on all positions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Benefits Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,450</div>
                    <p className="text-xs text-muted-foreground">Per employee annually</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compensation Ratio</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.92</div>
                    <p className="text-xs text-muted-foreground">Compared to market median</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Salary by Department</CardTitle>
                    <CardDescription>Average compensation across departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { department: "Engineering", salary: "$92,450", change: "+3.2%" },
                        { department: "Sales", salary: "$85,320", change: "+2.8%" },
                        { department: "Marketing", salary: "$78,150", change: "+2.5%" },
                        { department: "Product", salary: "$88,750", change: "+3.0%" },
                        { department: "Operations", salary: "$72,600", change: "+2.2%" },
                        { department: "HR & Admin", salary: "$68,400", change: "+2.0%" },
                      ].map((dept, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{dept.department}</p>
                            <p className="text-sm text-muted-foreground">Average Salary</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{dept.salary}</p>
                            <p className="text-sm text-green-500">{dept.change} YoY</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="attendance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">97.2%</div>
                    <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.8%</div>
                    <p className="text-xs text-muted-foreground">-0.3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vacation Used</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42%</div>
                    <p className="text-xs text-muted-foreground">Of annual allocation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remote Work</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28%</div>
                    <p className="text-xs text-muted-foreground">Of total work days</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                    <CardDescription>Monthly attendance patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <LineChart className="h-16 w-16 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Attendance has been consistently above 95% for the past 6 months, with a slight increase in
                            remote work days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
            <SheetDescription>Apply filters to customize your HR Analytics view.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Department</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Engineering", "Sales", "Marketing", "Operations", "HR & Admin", "Product", "Finance"].map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${dept}`}
                      checked={filters.department.includes(dept)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            department: [...filters.department, dept],
                          })
                        } else {
                          setFilters({
                            ...filters,
                            department: filters.department.filter((d) => d !== dept),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`dept-${dept}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Location</h3>
              <div className="grid grid-cols-2 gap-2">
                {["San Francisco", "New York", "London", "Remote"].map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`loc-${location}`}
                      checked={filters.location.includes(location)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            location: [...filters.location, location],
                          })
                        } else {
                          setFilters({
                            ...filters,
                            location: filters.location.filter((l) => l !== location),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`loc-${location}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Date Range</h3>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Employment Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Full-time", "Part-time", "Contract", "Intern"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.employmentType.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            employmentType: [...filters.employmentType, type],
                          })
                        } else {
                          setFilters({
                            ...filters,
                            employmentType: filters.employmentType.filter((t) => t !== type),
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroup
                    value={filters.status}
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="status-all" />
                      <Label htmlFor="status-all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="status-active" />
                      <Label htmlFor="status-active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="onLeave" id="status-onLeave" />
                      <Label htmlFor="status-onLeave">On Leave</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="terminated" id="status-terminated" />
                      <Label htmlFor="status-terminated">Terminated</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  department: [],
                  location: [],
                  dateRange: "thisMonth",
                  employmentType: [],
                  status: "all",
                })
              }}
            >
              Reset
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

