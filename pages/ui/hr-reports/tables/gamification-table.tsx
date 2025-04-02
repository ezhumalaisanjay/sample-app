"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Target, Award, ListCollapse } from "lucide-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// Gamification data
type GamificationDataType = {
  department: string
  avgPoints: number
  totalBadges: number
  completionRate: number
  engagement: number
}

const gamificationData: GamificationDataType[] = [
  { department: "Engineering", avgPoints: 1250, totalBadges: 342, completionRate: 78, engagement: 82 },
  { department: "Sales", avgPoints: 1580, totalBadges: 256, completionRate: 85, engagement: 88 },
  { department: "Marketing", avgPoints: 1120, totalBadges: 124, completionRate: 72, engagement: 76 },
  { department: "Product", avgPoints: 980, totalBadges: 98, completionRate: 68, engagement: 74 },
  { department: "Customer Support", avgPoints: 1350, totalBadges: 186, completionRate: 82, engagement: 80 },
]

type EmployeeGamificationDataType = {
  id: number
  name: string
  department: string
  points: number
  badges: number
  level: number
  completedChallenges: number
  totalChallenges: number
}

const employeeGamificationData: EmployeeGamificationDataType[] = [
  {
    id: 1,
    name: "John Smith",
    department: "Engineering",
    points: 1850,
    badges: 12,
    level: 5,
    completedChallenges: 24,
    totalChallenges: 30,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    department: "Sales",
    points: 2100,
    badges: 15,
    level: 6,
    completedChallenges: 28,
    totalChallenges: 30,
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Marketing",
    points: 1650,
    badges: 10,
    level: 4,
    completedChallenges: 22,
    totalChallenges: 30,
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Product",
    points: 1450,
    badges: 8,
    level: 3,
    completedChallenges: 18,
    totalChallenges: 30,
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Customer Support",
    points: 1950,
    badges: 14,
    level: 5,
    completedChallenges: 26,
    totalChallenges: 30,
  },
  {
    id: 6,
    name: "Jessica Martinez",
    department: "Engineering",
    points: 1750,
    badges: 11,
    level: 4,
    completedChallenges: 23,
    totalChallenges: 30,
  },
  {
    id: 7,
    name: "Robert Taylor",
    department: "Sales",
    points: 2200,
    badges: 16,
    level: 7,
    completedChallenges: 29,
    totalChallenges: 30,
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    department: "Marketing",
    points: 1550,
    badges: 9,
    level: 4,
    completedChallenges: 21,
    totalChallenges: 30,
  },
]

type BadgeDataType = {
  id: number
  name: string
  description: string
  category: string
  earnedCount: number
  totalEmployees: number
}

const badgeData: BadgeDataType[] = [
  {
    id: 1,
    name: "Training Champion",
    description: "Completed all required training modules",
    category: "Learning",
    earnedCount: 856,
    totalEmployees: 1248,
  },
  {
    id: 2,
    name: "Team Player",
    description: "Collaborated on 10+ cross-department projects",
    category: "Collaboration",
    earnedCount: 642,
    totalEmployees: 1248,
  },
  {
    id: 3,
    name: "Innovation Star",
    description: "Submitted 5+ ideas to the innovation portal",
    category: "Innovation",
    earnedCount: 423,
    totalEmployees: 1248,
  },
  {
    id: 4,
    name: "Wellness Warrior",
    description: "Participated in all wellness program activities",
    category: "Wellness",
    earnedCount: 512,
    totalEmployees: 1248,
  },
  {
    id: 5,
    name: "Customer Hero",
    description: "Received 10+ positive customer feedback",
    category: "Customer Service",
    earnedCount: 378,
    totalEmployees: 1248,
  },
  {
    id: 6,
    name: "Mentor Master",
    description: "Mentored 3+ new employees",
    category: "Leadership",
    earnedCount: 245,
    totalEmployees: 1248,
  },
  {
    id: 7,
    name: "Productivity Pro",
    description: "Exceeded quarterly targets for 4 consecutive quarters",
    category: "Performance",
    earnedCount: 389,
    totalEmployees: 1248,
  },
  {
    id: 8,
    name: "Learning Legend",
    description: "Completed 10+ optional learning courses",
    category: "Learning",
    earnedCount: 467,
    totalEmployees: 1248,
  },
]

type ChallengeDataType = {
  id: number
  name: string
  description: string
  category: string
  participationRate: number
  completionRate: number
  avgDaysToComplete: number
}

const challengeData: ChallengeDataType[] = [
  {
    id: 1,
    name: "Onboarding Excellence",
    description: "Complete all onboarding tasks within first 30 days",
    category: "Onboarding",
    participationRate: 95,
    completionRate: 88,
    avgDaysToComplete: 22,
  },
  {
    id: 2,
    name: "Skill Builder",
    description: "Complete 5 skill-building courses in your domain",
    category: "Learning",
    participationRate: 78,
    completionRate: 65,
    avgDaysToComplete: 45,
  },
  {
    id: 3,
    name: "Wellness Challenge",
    description: "Log 30 days of wellness activities",
    category: "Wellness",
    participationRate: 72,
    completionRate: 58,
    avgDaysToComplete: 38,
  },
  {
    id: 4,
    name: "Innovation Sprint",
    description: "Submit and develop an innovative idea",
    category: "Innovation",
    participationRate: 65,
    completionRate: 42,
    avgDaysToComplete: 60,
  },
  {
    id: 5,
    name: "Customer Feedback",
    description: "Collect and respond to 20 customer feedback items",
    category: "Customer Service",
    participationRate: 82,
    completionRate: 74,
    avgDaysToComplete: 52,
  },
  {
    id: 6,
    name: "Mentorship Program",
    description: "Mentor a new employee for 90 days",
    category: "Leadership",
    participationRate: 45,
    completionRate: 38,
    avgDaysToComplete: 90,
  },
  {
    id: 7,
    name: "Cross-Department Collaboration",
    description: "Collaborate on a project with another department",
    category: "Collaboration",
    participationRate: 68,
    completionRate: 62,
    avgDaysToComplete: 75,
  },
  {
    id: 8,
    name: "Productivity Challenge",
    description: "Improve personal productivity metrics by 15%",
    category: "Performance",
    participationRate: 88,
    completionRate: 72,
    avgDaysToComplete: 65,
  },
]

// Gamification columns
const gamificationColumns: ColumnDef<GamificationDataType>[] = [
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("department")}</div>,
  },
  {
    accessorKey: "avgPoints",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avg. Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("avgPoints")}</div>,
  },
  {
    accessorKey: "totalBadges",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Badges
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("totalBadges")}</div>,
  },
  {
    accessorKey: "completionRate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Completion Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress value={row.getValue("completionRate")} className="h-2 w-20" />
          <span>{row.getValue("completionRate")}%</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "engagement",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Engagement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress value={row.getValue("engagement")} className="h-2 w-20" />
          <span>{row.getValue("engagement")}%</span>
        </div>
      </div>
    ),
  },
]

const employeeGamificationColumns: ColumnDef<EmployeeGamificationDataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("department")}</div>,
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("points")}</div>,
  },
  {
    accessorKey: "badges",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Badges
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("badges")}</div>,
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="bg-primary/10">
          Level {row.getValue("level")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "completedChallenges",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Challenges
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress
            value={
              (Number(row.getValue("completedChallenges")) /
                (row.original as EmployeeGamificationDataType).totalChallenges) *
              100
            }
            className="h-2 w-20"
          />
          <span>
            {row.getValue("completedChallenges")}/{(row.original as EmployeeGamificationDataType).totalChallenges}
          </span>
        </div>
      </div>
    ),
  },
]

const badgeColumns: ColumnDef<BadgeDataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Badge
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "earnedCount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Earned
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress
            value={(Number(row.getValue("earnedCount")) / (row.original as BadgeDataType).totalEmployees) * 100}
            className="h-2 w-20"
          />
          <span>
            {row.getValue("earnedCount")}/{(row.original as BadgeDataType).totalEmployees}
          </span>
        </div>
      </div>
    ),
  },
]

const challengeColumns: ColumnDef<ChallengeDataType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Challenge
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "participationRate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Participation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress value={row.getValue("participationRate")} className="h-2 w-20" />
          <span>{row.getValue("participationRate")}%</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "completionRate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Completion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <div className="flex items-center gap-2">
          <Progress value={row.getValue("completionRate")} className="h-2 w-20" />
          <span>{row.getValue("completionRate")}%</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "avgDaysToComplete",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avg. Days
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("avgDaysToComplete")} days</div>,
  },
]

export default function GamificationTable() {
  // Gamification states
  const [gamificationSorting, setGamificationSorting] = useState<SortingState>([])
  const [gamificationFilters, setGamificationFilters] = useState<ColumnFiltersState>([])

  const [employeeGamificationSorting, setEmployeeGamificationSorting] = useState<SortingState>([])
  const [employeeGamificationFilters, setEmployeeGamificationFilters] = useState<ColumnFiltersState>([])

  const [badgeSorting, setBadgeSorting] = useState<SortingState>([])
  const [badgeFilters, setBadgeFilters] = useState<ColumnFiltersState>([])

  const [challengeSorting, setChallengeSorting] = useState<SortingState>([])
  const [challengeFilters, setChallengeFilters] = useState<ColumnFiltersState>([])

  // Gamification tables
  const gamificationTable = useReactTable({
    data: gamificationData,
    columns: gamificationColumns,
    onSortingChange: setGamificationSorting,
    onColumnFiltersChange: setGamificationFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: gamificationSorting,
      columnFilters: gamificationFilters,
    },
  })

  const employeeGamificationTable = useReactTable({
    data: employeeGamificationData,
    columns: employeeGamificationColumns,
    onSortingChange: setEmployeeGamificationSorting,
    onColumnFiltersChange: setEmployeeGamificationFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: employeeGamificationSorting,
      columnFilters: employeeGamificationFilters,
    },
  })

  const badgeTable = useReactTable({
    data: badgeData,
    columns: badgeColumns,
    onSortingChange: setBadgeSorting,
    onColumnFiltersChange: setBadgeFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: badgeSorting,
      columnFilters: badgeFilters,
    },
  })

  const challengeTable = useReactTable({
    data: challengeData,
    columns: challengeColumns,
    onSortingChange: setChallengeSorting,
    onColumnFiltersChange: setChallengeFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: challengeSorting,
      columnFilters: challengeFilters,
    },
  })

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter departments..."
          value={(gamificationTable.getColumn("department")?.getFilterValue() as string) ?? ""}
          onChange={(event) => gamificationTable.getColumn("department")?.setFilterValue(event.target.value)}
          className="max-w-sm mr-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ListCollapse className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ScrollArea className="w-[200px] h-max">
            {gamificationTable
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="w-[80vw] lg:w-full">
          <Table>
            <TableHeader>
              {gamificationTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {gamificationTable.getRowModel().rows?.length ? (
                gamificationTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={gamificationColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <h3 className="text-lg font-semibold my-6">Top Performers</h3>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search employees..."
          value={(employeeGamificationTable.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => employeeGamificationTable.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm mr-4"
        />
        <Select
          onValueChange={(value) => {
            if (value !== "all") {
              employeeGamificationTable.getColumn("department")?.setFilterValue(value)
            } else {
              employeeGamificationTable.getColumn("department")?.setFilterValue("")
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Customer Support">Customer Support</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="w-[80vw] lg:w-full">
          <Table>
            <TableHeader>
              {employeeGamificationTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {employeeGamificationTable.getRowModel().rows?.length ? (
                employeeGamificationTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={employeeGamificationColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>  
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => employeeGamificationTable.previousPage()}
          disabled={!employeeGamificationTable.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => employeeGamificationTable.nextPage()}
          disabled={!employeeGamificationTable.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Tabs defaultValue="badges" className="mt-6">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        <TabsContent value="badges" className="space-y-4 pt-4">
          <div className="flex items-center py-4">
            <Input
              placeholder="Search badges..."
              value={(badgeTable.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => badgeTable.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm mr-4"
            />
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  badgeTable.getColumn("category")?.setFilterValue(value)
                } else {
                  badgeTable.getColumn("category")?.setFilterValue("")
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Collaboration">Collaboration</SelectItem>
                <SelectItem value="Innovation">Innovation</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <ScrollArea className="w-[80vw] lg:w-full">
              <Table>
                <TableHeader>
                  {badgeTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {badgeTable.getRowModel().rows?.length ? (
                    badgeTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={badgeColumns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="challenges" className="space-y-4 pt-4">
          <div className="flex items-center py-4">
            <Input
              placeholder="Search challenges..."
              value={(challengeTable.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => challengeTable.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm mr-4"
            />
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  challengeTable.getColumn("category")?.setFilterValue(value)
                } else {
                  challengeTable.getColumn("category")?.setFilterValue("")
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
                <SelectItem value="Innovation">Innovation</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Collaboration">Collaboration</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <ScrollArea className="w-[80vw] lg:w-full">
              <Table>
                <TableHeader>
                  {challengeTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {challengeTable.getRowModel().rows?.length ? (
                    challengeTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={challengeColumns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea> 
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

