"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Employee, Shift, Holiday } from "./page"

interface CalendarViewProps {
  currentDate: Date | string
  shifts: Shift[]
  employees: Employee[]
  holidays?: Holiday[]
  onDrop: (employeeId: string, date: Date) => void
  onRemoveShift?: (shiftId: string) => void
  onEditShift?: (shift: Shift) => void
}

// Dynamically import CalendarDay to avoid SSR issues with DnD
const CalendarDay = dynamic(() => import("./calendar-day"), { ssr: false })

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate: initialRawDate,
  shifts = [],
  employees = [],
  holidays = [],
  onDrop,
  onRemoveShift,
  onEditShift,
}) => {
  // Safely convert initialDate to Date object if it's a string
  const initialDate = typeof initialRawDate === "string" ? new Date(initialRawDate) : initialRawDate

  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date())
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get today's date
  const today = new Date()

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Navigate to previous period based on view mode
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      // Month view
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  // Navigate to next period based on view mode
  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      // Month view
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Safe date formatting function that handles potential server-side rendering
  const safeFormatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return ""
    }

    try {
      return date.toLocaleDateString("en-US", options)
    } catch (error) {
      // Fallback for server-side rendering
      return ""
    }
  }

  // Format the header based on view mode
  const formatHeader = () => {
    if (!currentDate || !(currentDate instanceof Date)) {
      return ""
    }

    if (viewMode === "day") {
      return safeFormatDate(currentDate, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } else if (viewMode === "week") {
      try {
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        const startMonth = safeFormatDate(startOfWeek, { month: "short" })
        const endMonth = safeFormatDate(endOfWeek, { month: "short" })
        const startDay = startOfWeek.getDate()
        const endDay = endOfWeek.getDate()
        const year = endOfWeek.getFullYear()

        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
      } catch (error) {
        return ""
      }
    } else {
      // Month view
      return safeFormatDate(currentDate, { month: "long", year: "numeric" })
    }
  }

  // Get days in month for the calendar
  const getDaysInMonth = (date: Date) => {
    if (!date || !(date instanceof Date)) {
      return []
    }

    try {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days: Date[] = []

      // Add days from previous month to start on Sunday
      const startPadding = firstDay.getDay()
      for (let i = startPadding; i > 0; i--) {
        days.push(new Date(year, month, -i + 1))
      }

      // Add days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i))
      }

      // Add days from next month to complete the grid
      const endPadding = 42 - days.length // 6 rows * 7 days = 42
      for (let i = 1; i <= endPadding; i++) {
        days.push(new Date(year, month + 1, i))
      }

      return days
    } catch (error) {
      return []
    }
  }

  // Get days for week view
  const getDaysInWeek = (date: Date) => {
    if (!date || !(date instanceof Date)) {
      return []
    }

    try {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())

      const days: Date[] = []
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek)
        day.setDate(startOfWeek.getDate() + i)
        days.push(day)
      }

      return days
    } catch (error) {
      return []
    }
  }

  // Get days based on view mode
  const getDays = () => {
    if (!currentDate || !(currentDate instanceof Date)) {
      return []
    }

    if (viewMode === "day") {
      return [currentDate]
    } else if (viewMode === "week") {
      return getDaysInWeek(currentDate)
    } else {
      return getDaysInMonth(currentDate)
    }
  }

  const isCurrentMonth = (date: Date) => {
    if (!date || !currentDate || !(date instanceof Date) || !(currentDate instanceof Date)) {
      return false
    }
    return date.getMonth() === currentDate.getMonth()
  }

  const getShiftsForDate = (date: Date) => {
    if (!date || !(date instanceof Date) || !shifts || !Array.isArray(shifts)) {
      return []
    }

    return shifts.filter((shift) => {
      if (!shift.date || !(shift.date instanceof Date)) {
        return false
      }

      return (
        shift.date.getDate() === date.getDate() &&
        shift.date.getMonth() === date.getMonth() &&
        shift.date.getFullYear() === date.getFullYear()
      )
    })
  }

  // If we're on the server or client hasn't initialized, show a loading state
  if (!isClient) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
        Loading calendar...
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold dark:text-white">{formatHeader()}</h2>
        <div className="flex space-x-2">
          <Button variant={viewMode === "month" ? "secondary" : "outline"} onClick={() => setViewMode("month")}>
            Month
          </Button>
          <Button variant={viewMode === "week" ? "secondary" : "outline"} onClick={() => setViewMode("week")}>
            Week
          </Button>
          <Button variant={viewMode === "day" ? "secondary" : "outline"} onClick={() => setViewMode("day")}>
            Day
          </Button>
          <Button
            variant={viewMode === "agenda" ? "secondary" : "outline"}
            className="hidden sm:inline-flex"
            onClick={() => setViewMode("agenda")}
          >
            Agenda
          </Button>
        </div>
      </div>

      {viewMode === "agenda" ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium dark:text-white">Upcoming Shifts</h3>
          {shifts && shifts.length > 0 ? (
            <div className="space-y-2">
              {shifts
                .sort((a, b) => {
                  if (!a.date || !b.date) return 0
                  return a.date.getTime() - b.date.getTime()
                })
                .map((shift) => {
                  const employee = employees?.find((e) => e.id === shift.employeeId)

                  // Check if this day is a holiday
                  const isHoliday = holidays?.some((holiday) => {
                    const holidayDate = new Date(holiday.date)
                    return (
                      holidayDate.getDate() === shift.date.getDate() &&
                      holidayDate.getMonth() === shift.date.getMonth() &&
                      holidayDate.getFullYear() === shift.date.getFullYear()
                    )
                  })

                  // Get holiday name if applicable
                  const holidayName = isHoliday
                    ? holidays?.find((holiday) => {
                        const holidayDate = new Date(holiday.date)
                        return (
                          holidayDate.getDate() === shift.date.getDate() &&
                          holidayDate.getMonth() === shift.date.getMonth() &&
                          holidayDate.getFullYear() === shift.date.getFullYear()
                        )
                      })?.name
                    : null

                  return (
                    <div
                      key={shift.id}
                      className={`p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center ${
                        isHoliday ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium dark:text-white">{employee?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {shift.date ? safeFormatDate(shift.date, {}) : "Unknown date"} • {shift.startTime || "00:00"}{" "}
                          - {shift.endTime || "00:00"}
                        </div>
                        {isHoliday && holidayName && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">Holiday: {holidayName}</div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {onEditShift && (
                          <Button variant="outline" size="sm" onClick={() => onEditShift(shift)}>
                            Edit
                          </Button>
                        )}
                        {onRemoveShift && (
                          <Button variant="outline" size="sm" onClick={() => onRemoveShift(shift.id)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
              No shifts scheduled. Drag employees to days to create shifts.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-white dark:bg-gray-800 p-2 text-center font-medium dark:text-gray-200">
              {day}
            </div>
          ))}

          {getDays().map((date, index) => (
            <CalendarDay
              key={`${date instanceof Date ? date.toISOString() : index}-${index}`}
              date={date}
              isCurrentMonth={isCurrentMonth(date)}
              shifts={getShiftsForDate(date)}
              employees={employees || []}
              holidays={holidays}
              onDrop={onDrop}
              onRemoveShift={onRemoveShift}
              onEditShift={onEditShift}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default CalendarView

