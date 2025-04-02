"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const departmentLeaveData = [
  { name: "Engineering", available: 12.4, used: 6.8, scheduled: 1.2 },
  { name: "Sales", available: 10.2, used: 7.5, scheduled: 0.8 },
  { name: "Marketing", available: 11.8, used: 5.2, scheduled: 1.5 },
  { name: "Product", available: 13.5, used: 4.8, scheduled: 2.0 },
  { name: "Support", available: 9.6, used: 8.2, scheduled: 0.5 },
  { name: "HR", available: 14.2, used: 6.5, scheduled: 1.8 },
  { name: "Finance", available: 12.8, used: 5.5, scheduled: 1.0 },
  { name: "Operations", available: 10.5, used: 7.2, scheduled: 0.9 },
]

const leaveTypeData = [
  { name: "Vacation", value: 65 },
  { name: "Sick Leave", value: 18 },
  { name: "Personal", value: 10 },
  { name: "Parental", value: 5 },
  { name: "Bereavement", value: 2 },
]

const monthlyTrendData = [
  { name: "Jan", days: 210 },
  { name: "Feb", days: 180 },
  { name: "Mar", days: 195 },
  { name: "Apr", days: 240 },
  { name: "May", days: 280 },
  { name: "Jun", days: 320 },
  { name: "Jul", days: 350 },
  { name: "Aug", days: 310 },
  { name: "Sep", days: 220 },
  { name: "Oct", days: 190 },
  { name: "Nov", days: 170 },
  { name: "Dec", days: 230 },
]

const topEmployeesData = [
  { id: 1, name: "Alice Johnson", department: "Engineering", balance: 24, scheduled: 5 },
  { id: 2, name: "Bob Smith", department: "Sales", balance: 22, scheduled: 0 },
  { id: 3, name: "Carol Williams", department: "Marketing", balance: 20, scheduled: 10 },
  { id: 4, name: "Dave Brown", department: "Product", balance: 19, scheduled: 0 },
  { id: 5, name: "Eve Davis", department: "HR", balance: 18, scheduled: 3 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function LeaveBalancesChart() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredEmployees = topEmployeesData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Tabs defaultValue="department">
      <ScrollArea className="w-[75vw] lg:w-full">
        <TabsList>
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="type">By Leave Type</TabsTrigger>
          <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
          <TabsTrigger value="employees">Top Balances</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="department" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={departmentLeaveData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="available" name="Available PTO" fill="#0088FE" />
            <Bar dataKey="used" name="Used PTO" fill="#00C49F" />
            <Bar dataKey="scheduled" name="Scheduled PTO" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="type" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={leaveTypeData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {leaveTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="trend" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyTrendData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "PTO Days Used", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="days"
              name="PTO Days Used"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="employees" className="h-[350px]">
        <div className="flex items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => alert("Exporting employee leave balances to Excel...")}
          >
            Export List
          </Button>
        </div>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">PTO Balance</TableHead>
                <TableHead className="text-right">Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">{employee.balance} days</TableCell>
                    <TableCell className="text-right">{employee.scheduled} days</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Viewing leave details for ${employee.name}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

