"use client"

import { useState } from "react"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, Line, LineChart, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react"

const data = [
  { name: "Dept1", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept2", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept3", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept4", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept5", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept6", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept7", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept8", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept9", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dept10", total: Math.floor(Math.random() * 5000) + 1000 },
]

const chartConfig = {
  name: {
    label: "Department",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "Employees",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export default function HeadCount() {
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar")

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )
      case "pie":
        return (
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="total">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
        )
      case "line":
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-2 m-3 mt-5 mb-5">
        <div className="text-md font-semibold text-wrap">Department Headcount Summary</div>
        <div className="flex justify-end space-x-2">
          <Button onClick={() => setChartType("bar")} variant={chartType === "bar" ? "default" : "outline"}>
            <ChartBarBig />
          </Button>
          <Button onClick={() => setChartType("pie")} variant={chartType === "pie" ? "default" : "outline"}>
            <ChartPie />
          </Button>
          <Button onClick={() => setChartType("line")} variant={chartType === "line" ? "default" : "outline"}>
            <ChartLine />
          </Button>
        </div>  
      </div>
      <ChartContainer config={chartConfig} className="w-full 2xl:h-[600px] 2xl:w-full">
        {renderChart()}
      </ChartContainer>
    </div>
  )
}

