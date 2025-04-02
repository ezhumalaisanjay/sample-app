"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import type { Employee, Shift } from "./page"

interface GanttChartProps {
  shifts: Shift[]
  employees: Employee[]
  onShiftUpdate: (shifts: Shift[]) => void
  holidays?: { date: Date; name: string }[]
  onEditShift?: (shift: Shift) => void
}

const GanttChart: React.FC<GanttChartProps> = ({
  shifts = [],
  employees = [],
  onShiftUpdate,
  holidays = [],
  onEditShift,
}) => {
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Navigate to previous/next period
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) {
      return ""
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
  }

  // Format date range for header
  const formatDateRange = () => {
    const dates = getDateRange()
    if (!dates || dates.length === 0) {
      return ""
    }

    if (dates.length === 1) {
      return formatDate(dates[0])
    } else {
      return `${formatDate(dates[0])} - ${formatDate(dates[dates.length - 1])}`
    }
  }

  // Get date range for current view
  const getDateRange = useCallback(() => {
    if (!currentDate) return []

    const dates: Date[] = []
    const startDate = new Date(currentDate)
    startDate.setHours(12, 0, 0, 0)

    if (viewMode === "day") {
      dates.push(new Date(startDate))
    } else {
      // Set to start of week (Sunday)
      const day = startDate.getDay()
      startDate.setDate(startDate.getDate() - day)

      // Get 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        date.setHours(12, 0, 0, 0)
        dates.push(date)
      }
    }

    return dates
  }, [currentDate, viewMode])

  // Normalize date to string format
  const normalizeDate = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : new Date(d.getTime())
    date.setHours(12, 0, 0, 0)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Check if a date is a holiday
  const isHoliday = useCallback(
    (date: Date) => {
      if (!holidays || holidays.length === 0) return false

      const dateStr = normalizeDate(date)
      return holidays.some((holiday) => normalizeDate(holiday.date) === dateStr)
    },
    [holidays],
  )

  // Get holiday name for a date
  const getHolidayName = useCallback(
    (date: Date) => {
      if (!holidays || holidays.length === 0) return null

      const dateStr = normalizeDate(date)
      const holiday = holidays.find((h) => normalizeDate(h.date) === dateStr)
      return holiday ? holiday.name : null
    },
    [holidays],
  )

  // Check if an employee has any shifts in the current date range
  const hasShiftsInDateRange = useCallback(
    (employeeId: string) => {
      if (!employeeId || !shifts || shifts.length === 0) return false

      return getDateRange().some((date) => {
        const dateKey = normalizeDate(date)
        return shifts.some((shift) => {
          if (!shift.date) return false
          const shiftDateStr = normalizeDate(shift.date)
          return shift.employeeId === employeeId && shiftDateStr === dateKey
        })
      })
    },
    [shifts, getDateRange],
  )

  // Process shifts data for the chart
  useEffect(() => {
    if (!isClient || !employees || employees.length === 0) {
      setChartData([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const dateRange = getDateRange()
    const dateKeys = dateRange.map((date) => normalizeDate(date))

    // Create data structure for chart - include ALL employees
    const data = employees.map((employee) => {
      const result: any = {
        name: employee.name,
        id: employee.id,
        hasShifts: false,
      }

      // Add data for each date
      dateKeys.forEach((dateKey) => {
        // Find shifts for this employee on this date
        const employeeShifts = shifts.filter((shift) => {
          if (!shift || !shift.date) return false
          const shiftDateStr = normalizeDate(shift.date)
          return shift.employeeId === employee.id && shiftDateStr === dateKey
        })

        if (employeeShifts.length > 0) {
          // Employee has shifts on this date
          result[dateKey] = employeeShifts.length
          result[`${dateKey}_shifts`] = employeeShifts
          result.hasShifts = true
        } else {
          // No shifts on this date
          result[dateKey] = 0
        }
      })

      return result
    })

    setChartData(data)
    setIsLoading(false)
  }, [shifts, employees, currentDate, viewMode, isClient, getDateRange])

  // Custom Bar component
  const CustomBar = (props: any) => {
    if (!props || !props.payload || !props.dataKey) {
      return <Rectangle {...props} fill="transparent" />
    }

    const { x, y, width, height, fill, dataKey, payload } = props
    const shiftsKey = `${dataKey}_shifts`

    if (!payload[shiftsKey] || payload[shiftsKey].length === 0) {
      return <Rectangle {...props} fill="transparent" />
    }

    const shifts = payload[shiftsKey]

    return (
      <g>
        <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={4} />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {shifts.length}
        </text>
      </g>
    )
  }

  // If we're on the server or client hasn't initialized, show a loading state
  if (!isClient) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
        Loading chart data...
      </div>
    )
  }

  // Simplified chart rendering
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDateRange()}</span>
          </div>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
            Day
          </Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
            Week
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-[500px] flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">Loading chart data...</p>
          </div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="w-full h-[500px]">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Employee Schedule Chart</div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center mr-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                <span>Has shifts</span>
              </span>
              <span className="inline-flex items-center">
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></span>
                <span>No shifts</span>
              </span>
            </div>
          </div>

          <ChartContainer
            key={`chart-${shifts.length}-${currentDate.toISOString()}`}
            config={{
              ...employees.reduce(
                (acc, emp, index) => {
                  const hasShifts = hasShiftsInDateRange(emp.id)
                  acc[emp.id] = {
                    label: emp.name,
                    color: hasShifts ? `hsl(var(--chart-${(index % 5) + 1}))` : "hsl(var(--muted-foreground))",
                  }
                  return acc
                },
                {} as Record<string, { label: string; color: string }>,
              ),
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, "dataMax"]} tickCount={5} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  scale="band"
                  width={100}
                  tick={(props) => {
                    const { x, y, payload } = props
                    const employeeData = chartData.find((item) => item.name === payload.value)
                    const hasShifts = employeeData?.hasShifts || false

                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={-8}
                          y={0}
                          dy={4}
                          textAnchor="end"
                          fill={hasShifts ? "#3b82f6" : "currentColor"}
                          fontWeight={hasShifts ? "bold" : "normal"}
                        >
                          {payload.value}
                        </text>
                        {hasShifts ? (
                          <circle cx={-95} cy={4} r={4} fill="#3b82f6" />
                        ) : (
                          <circle cx={-95} cy={4} r={4} fill="#d1d5db" />
                        )}
                      </g>
                    )
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null

                    const data = payload[0].payload
                    const dateKey = payload[0].dataKey
                    const shiftsKey = `${dateKey}_shifts`
                    const employeeName = data.name

                    if (!data[shiftsKey] || data[shiftsKey].length === 0) {
                      const date = dateKey && typeof dateKey === "string" ? new Date(dateKey) : new Date()
                      const holidayName = getHolidayName(date)
                      const isHolidayDate = isHoliday(date)

                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md max-w-xs">
                          <div className="font-medium mb-2 text-gray-600 dark:text-gray-400 border-b pb-1">
                            {employeeName} - {formatDate(date)}
                            {isHolidayDate && holidayName && (
                              <div className="text-xs text-red-500 font-normal mt-1">Holiday: {holidayName}</div>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>No shifts scheduled</span>
                          </div>
                        </div>
                      )
                    }

                    const shifts = data[shiftsKey]
                    const date = dateKey && typeof dateKey === "string" ? new Date(dateKey) : new Date()
                    const holidayName = getHolidayName(date)
                    const isHolidayDate = isHoliday(date)

                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md max-w-xs">
                        <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 border-b pb-1">
                          {employeeName} - {formatDate(date)}
                          {isHolidayDate && holidayName && (
                            <div className="text-xs text-red-500 font-normal mt-1">Holiday: {holidayName}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Shifts:</div>
                          {shifts.map((shift: Shift) => (
                            <div key={shift.id} className="text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                              <div className="text-gray-700 dark:text-gray-300 flex justify-between">
                                <span>Time:</span>
                                <span className="font-medium">
                                  {shift.startTime} - {shift.endTime}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                />
                <Legend
                  content={() => {
                    const dateInfos = getDateRange().map((date) => ({
                      date,
                      key: normalizeDate(date),
                      label: formatDate(date),
                      isHoliday: isHoliday(date),
                      holidayName: getHolidayName(date),
                    }))

                    return (
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {dateInfos.map((dateInfo, index) => {
                          const workingEmployees = employees.filter((emp) =>
                            shifts.some((shift) => {
                              if (!shift.date) return false
                              const shiftDateStr = normalizeDate(shift.date)
                              return shift.employeeId === emp.id && shiftDateStr === dateInfo.key
                            }),
                          )

                          return (
                            <div
                              key={dateInfo.key}
                              className={`flex items-center px-2 py-1 rounded text-xs ${
                                dateInfo.isHoliday
                                  ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                  : "bg-gray-100 dark:bg-gray-700"
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full mr-1"
                                style={{
                                  backgroundColor: dateInfo.isHoliday
                                    ? "#ef4444"
                                    : `hsl(var(--chart-${(index % 5) + 1}))`,
                                }}
                              ></span>
                              <span>{dateInfo.label}</span>
                              {dateInfo.isHoliday && (
                                <span className="ml-1 font-medium text-red-600 dark:text-red-400">
                                  ({dateInfo.holidayName})
                                </span>
                              )}
                              <span
                                className={`ml-1 font-medium ${
                                  dateInfo.isHoliday
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                ({workingEmployees.length} {workingEmployees.length === 1 ? "employee" : "employees"})
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }}
                />
                {getDateRange().map((date, index) => {
                  const dateKey = normalizeDate(date)
                  const holiday = isHoliday(date)

                  return (
                    <Bar
                      key={dateKey}
                      dataKey={dateKey}
                      name={formatDate(date)}
                      stackId="a"
                      fill={holiday ? "#ef4444" : `hsl(var(--chart-${(index % 5) + 1}))`}
                      shape={<CustomBar />}
                    />
                  )
                })}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">No shifts scheduled</p>
            <p className="text-sm">Drag employees to the calendar to schedule shifts</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Add getInitialProps to prevent automatic static optimization
// @ts-ignore
GanttChart.getInitialProps = async () => {
  return {}
}

export default GanttChart

