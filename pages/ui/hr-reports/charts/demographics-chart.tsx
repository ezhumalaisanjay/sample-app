"use client"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const genderData = [
  { name: "Female", value: 52 },
  { name: "Male", value: 48 },
]

const ageData = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 38 },
  { name: "35-44", value: 27 },
  { name: "45-54", value: 12 },
  { name: "55+", value: 8 },
]

const tenureData = [
  { name: "<1 year", value: 22 },
  { name: "1-2 years", value: 28 },
  { name: "3-5 years", value: 32 },
  { name: "6-10 years", value: 12 },
  { name: ">10 years", value: 6 },
]

const locationData = [
  { name: "North America", value: 58 },
  { name: "Europe", value: 22 },
  { name: "Asia Pacific", value: 14 },
  { name: "Latin America", value: 4 },
  { name: "Africa", value: 2 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function DemographicsChart() {
  return (
    <Tabs defaultValue="gender">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="gender">Gender</TabsTrigger>
          <TabsTrigger value="age">Age</TabsTrigger>
          <TabsTrigger value="tenure">Tenure</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="gender" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="age" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ageData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="tenure" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tenureData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {tenureData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="location" className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={locationData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${value}%`, ""]} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}

