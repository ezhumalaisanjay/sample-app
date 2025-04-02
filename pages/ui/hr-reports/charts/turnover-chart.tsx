"use client"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const data = [
  {
    name: "Jan",
    voluntary: 1.2,
    involuntary: 0.5,
    total: 1.7,
  },
  {
    name: "Feb",
    voluntary: 0.9,
    involuntary: 0.3,
    total: 1.2,
  },
  {
    name: "Mar",
    voluntary: 0.8,
    involuntary: 0.4,
    total: 1.2,
  },
  {
    name: "Apr",
    voluntary: 1.0,
    involuntary: 0.2,
    total: 1.2,
  },
  {
    name: "May",
    voluntary: 0.7,
    involuntary: 0.3,
    total: 1.0,
  },
  {
    name: "Jun",
    voluntary: 0.6,
    involuntary: 0.4,
    total: 1.0,
  },
  {
    name: "Jul",
    voluntary: 0.8,
    involuntary: 0.3,
    total: 1.1,
  },
  {
    name: "Aug",
    voluntary: 0.9,
    involuntary: 0.5,
    total: 1.4,
  },
  {
    name: "Sep",
    voluntary: 1.0,
    involuntary: 0.4,
    total: 1.4,
  },
  {
    name: "Oct",
    voluntary: 0.8,
    involuntary: 0.3,
    total: 1.1,
  },
  {
    name: "Nov",
    voluntary: 0.7,
    involuntary: 0.4,
    total: 1.1,
  },
  {
    name: "Dec",
    voluntary: 0.9,
    involuntary: 0.3,
    total: 1.2,
  },
]

const departmentData = [
  { name: "Engineering", turnover: 12.5 },
  { name: "Sales", turnover: 18.2 },
  { name: "Marketing", turnover: 14.8 },
  { name: "Product", turnover: 10.3 },
  { name: "Support", turnover: 16.7 },
  { name: "HR", turnover: 8.9 },
  { name: "Finance", turnover: 7.5 },
  { name: "Operations", turnover: 13.2 },
]

export default function TurnoverChart() {
  return (
    <Tabs defaultValue="monthly">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="department">By Department</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="monthly" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "Turnover Rate (%)", angle: -90, position: "insideLeft" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="voluntary" stroke="#82ca9d" />
            <Line type="monotone" dataKey="involuntary" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="department" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={departmentData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "Turnover Rate (%)", angle: -90, position: "insideLeft" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
            <Bar dataKey="turnover" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}

