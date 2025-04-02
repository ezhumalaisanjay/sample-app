"use client"

import { useState } from "react"
import { ChartBarBig, ChartLine, ChartPie, TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { day: "Monday", api_calls: 186, data_storage: 80, active_users: 15 },
  { day: "Tuesday", api_calls: 305, data_storage: 200, active_users: 35 },
  { day: "Wednesday", api_calls: 237, data_storage: 120, active_users: 111 },
  { day: "Thursday", api_calls: 73, data_storage: 190, active_users: 80 },
  { day: "Friday", api_calls: 209, data_storage: 130, active_users: 121 },
  { day: "Saturday", api_calls: 214, data_storage: 140, active_users: 90 },
]

const chartConfig = {
  api_calls: {
    label: "API Calls",
    color: "hsl(var(--chart-1))",
  },
  data_storage: {
    label: "Data Storage",
    color: "hsl(var(--chart-2))",
  },
  active_users: {
    label: "Active Users",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function UsageChart() {
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("line")

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="api_calls" fill="var(--color-api_calls)" />
              <Bar dataKey="data_storage" fill="var(--color-data_storage)" />
              <Bar dataKey="active_users" fill="var(--color-active_users)" />
            </BarChart>
        )
      case "pie":
        return (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="api_calls"
                nameKey="day"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
        )
      case "line":
        return (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Line
                type="monotone"
                dataKey="api_calls"
                stroke="var(--color-api_calls)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="data_storage"
                stroke="var(--color-data_storage)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="active_users"
                stroke="var(--color-active_users)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-2 m-3 mt-5 pb-5">
        <div>
          <div className="text-md font-semibold">Usage Statistics</div>
        </div>
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
      <ChartContainer config={chartConfig} className="2xl:h-[600px] 2xl:w-full">
        {renderChart()}
      </ChartContainer>
    </div>
  )
}

