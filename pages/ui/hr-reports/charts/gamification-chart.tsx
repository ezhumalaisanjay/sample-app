"use client"
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const departmentData = [
  { name: "Engineering", points: 1250, badges: 342, completion: 78 },
  { name: "Sales", points: 1580, badges: 256, completion: 85 },
  { name: "Marketing", points: 1120, badges: 124, completion: 72 },
  { name: "Product", points: 980, badges: 98, completion: 68 },
  { name: "Customer Support", points: 1350, badges: 186, completion: 82 },
]

const badgeCategoryData = [
  { name: "Learning", value: 28 },
  { name: "Collaboration", value: 22 },
  { name: "Innovation", value: 15 },
  { name: "Wellness", value: 12 },
  { name: "Customer Service", value: 10 },
  { name: "Leadership", value: 8 },
  { name: "Performance", value: 5 },
]

const monthlyEngagementData = [
  { name: "Jan", engagement: 65 },
  { name: "Feb", engagement: 68 },
  { name: "Mar", engagement: 72 },
  { name: "Apr", engagement: 75 },
  { name: "May", engagement: 78 },
  { name: "Jun", engagement: 82 },
  { name: "Jul", engagement: 85 },
  { name: "Aug", engagement: 82 },
  { name: "Sep", engagement: 80 },
  { name: "Oct", engagement: 83 },
  { name: "Nov", engagement: 85 },
  { name: "Dec", engagement: 88 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

export default function GamificationChart() {
  return (
    <Tabs defaultValue="department">
      <div className="flex justify-between items-center">
        <ScrollArea className="md:w-full w-[80vw]">
          <TabsList>
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="badges">Badge Categories</TabsTrigger>
            <TabsTrigger value="engagement">Engagement Trend</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="points" fill="#8884d8" name="Avg. Points (÷10)" />
            <Bar dataKey="badges" fill="#82ca9d" name="Total Badges" />
            <Bar dataKey="completion" fill="#ffc658" name="Completion Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="badges" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={badgeCategoryData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {badgeCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="engagement" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyEngagementData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#8884d8"
              strokeWidth={2}
              name="Engagement Score"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}

