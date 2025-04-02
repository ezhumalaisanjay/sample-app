"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { X, Edit, Info } from "lucide-react"
import type { Employee, Shift, Holiday } from "./page"

interface CalendarDayProps {
  date: Date | string
  isCurrentMonth: boolean
  shifts: Shift[]
  employees: Employee[]
  holidays?: Holiday[]
  onDrop: (employeeId: string, date: Date) => void
  onRemoveShift?: (shiftId: string) => void
  onEditShift?: (shift: Shift) => void
}

// Static version for server-side rendering
const CalendarDayStatic: React.FC<CalendarDayProps> = ({
  date: rawDate,
  isCurrentMonth,
  shifts = [],
  employees = [],
  holidays = [],
  onRemoveShift,
  onEditShift,
}) => {
  // Safely convert date to Date object if it's a string
  const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate

  const formatDate = (date: Date) => {
    try {
      return date.getDate().toString().padStart(2, "0")
    } catch (error) {
      return "00"
    }
  }

  // Check if this day is a holiday
  const isHoliday = holidays?.some((holiday) => {
    const holidayDate = new Date(holiday.date)
    return (
      holidayDate.getDate() === date.getDate() &&
      holidayDate.getMonth() === date.getMonth() &&
      holidayDate.getFullYear() === date.getFullYear()
    )
  })

  // Get holiday name if applicable
  const holidayName = isHoliday
    ? holidays?.find((holiday) => {
        const holidayDate = new Date(holiday.date)
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        )
      })?.name
    : null

  // Safely get unique employees assigned to this day
  const assignedEmployeeIds = shifts ? [...new Set(shifts.map((shift) => shift.employeeId))] : []
  const assignedEmployees = employees ? employees.filter((emp) => assignedEmployeeIds.includes(emp.id)) : []

  // Safely group shifts by employee
  const shiftsByEmployee = shifts
    ? shifts.reduce(
        (acc, shift) => {
          if (!acc[shift.employeeId]) {
            acc[shift.employeeId] = []
          }
          acc[shift.employeeId].push(shift)
          return acc
        },
        {} as Record<string, Shift[]>,
      )
    : {}

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 p-2 min-h-[120px] border border-gray-200 dark:border-gray-700 relative overflow-hidden
        ${!isCurrentMonth ? "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500" : ""}
        ${isHoliday ? "bg-red-50 dark:bg-red-900/20" : ""}
      `}
    >
      <div className="font-medium mb-2 dark:text-gray-200 flex justify-between items-center">
        <span className={isHoliday ? "text-red-600 dark:text-red-400" : ""}>{formatDate(date)}</span>

        {assignedEmployees.length > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
            {assignedEmployees.length}
          </span>
        )}
      </div>

      {/* Holiday indicator */}
      {isHoliday && holidayName && (
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 bg-blue-100 dark:bg-blue-900/30 p-1 rounded flex items-center">
          <span className="truncate">{holidayName}</span>
          <Info className="h-3 w-3 ml-1 flex-shrink-0" />
        </div>
      )}

      {/* Employee avatars with shift info */}
      <div className="space-y-1 max-h-[180px] overflow-y-auto">
        {assignedEmployees.map((employee) => {
          const employeeShifts = shiftsByEmployee[employee.id] || []
          return (
            <div
              key={employee.id}
              className="flex items-center justify-between bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded p-1 text-xs"
            >
              <div className="flex items-center">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-1 text-[10px] font-bold">
                  {employee.name.charAt(0)}
                </span>
                <span className="truncate max-w-[80px]">{employee.name}</span>
              </div>
              <div className="flex items-center">
                {onEditShift && (
                  <button
                    onClick={() => employeeShifts.forEach((shift) => onEditShift?.(shift))}
                    className="ml-1 text-blue-700 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                )}
                {onRemoveShift && (
                  <button
                    onClick={() => {
                      // Remove all shifts for this employee on this day
                      employeeShifts.forEach((shift) => onRemoveShift?.(shift.id))
                    }}
                    className="ml-1 text-blue-700 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Visual indicator for drag and drop */}
      {assignedEmployees.length === 0 && !isHoliday && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 pointer-events-none">
          <div className="text-xs text-center">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded p-1 mb-1">
              Drag employees here
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dynamic import of DnD components
const DndCalendarDay = dynamic(() => import("./dnd-calendar-day"), {
  ssr: false,
  loading: () => <div>Loading calendar day...</div>,
})

// Main component that decides whether to render the DnD version or static version
const CalendarDay: React.FC<CalendarDayProps> = (props) => {
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to check if we're on the client
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the server or client hasn't initialized, show the static version
  if (!isClient) {
    return <CalendarDayStatic {...props} />
  }

  // On the client, use the DnD version
  return <DndCalendarDay {...props} />
}

export default CalendarDay

