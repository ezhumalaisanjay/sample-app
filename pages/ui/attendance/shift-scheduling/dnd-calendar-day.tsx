"use client"

import React, { useRef, useState } from "react"
import { useDrop } from "react-dnd"
import { X, Edit, Info } from "lucide-react"
import type { Employee, Shift, Holiday } from "./page"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DndCalendarDayProps {
  date: Date | string
  isCurrentMonth: boolean
  shifts: Shift[]
  employees: Employee[]
  holidays?: Holiday[]
  onDrop: (employeeId: string, date: Date) => void
  onRemoveShift?: (shiftId: string) => void
  onEditShift?: (shift: Shift) => void
}

// Add a check to ensure we're in a browser environment
const DndCalendarDay: React.FC<DndCalendarDayProps> = ({
  date: rawDate,
  isCurrentMonth,
  shifts = [],
  employees = [],
  holidays = [],
  onDrop,
  onRemoveShift,
  onEditShift,
}) => {
  // Safely convert date to Date object if it's a string
  const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate
  const [showTooltip, setShowTooltip] = useState(false)

  const elementRef = useRef<HTMLDivElement>(null)

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

  // Get holiday type if applicable
  const holidayType = isHoliday
    ? (holidays?.find((holiday) => {
        const holidayDate = new Date(holiday.date)
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        )
      })?.type as string | undefined)
    : null

  // Get holiday description if applicable
  const holidayDescription = isHoliday
    ? (holidays?.find((holiday) => {
        const holidayDate = new Date(holiday.date)
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        )
      })?.description as string | undefined)
    : null

  const [{ isOver }, connectDrop] = useDrop({
    accept: "EMPLOYEE",
    drop: (item: { id: string }) => {
      console.log(`Dropping employee ${item.id} on date ${date.toDateString()}`)
      onDrop(item.id, date)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // Connect the drop to our ref
  React.useEffect(() => {
    if (elementRef.current) {
      connectDrop(elementRef)
    }
  }, [connectDrop])

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
      ref={elementRef}
      className={`
        bg-white dark:bg-gray-800 p-2 min-h-[120px] border border-gray-200 dark:border-gray-700 relative overflow-hidden
        ${!isCurrentMonth ? "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500" : ""}
        ${isHoliday ? "bg-red-50 dark:bg-red-900/20" : ""}
        ${isOver ? "bg-blue-50 dark:bg-blue-900 border-2 border-dashed border-blue-500" : ""}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 bg-blue-100 dark:bg-blue-900/30 p-1 rounded cursor-pointer flex items-center">
                <span className="truncate">{holidayName}</span>
                <Info className="h-3 w-3 ml-1 flex-shrink-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs">
              <div className="font-medium mb-1">{holidayName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {holidayType && (
                <div className="mt-1 text-xs">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                    ${
                      holidayType === "gazetted"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : holidayType === "restricted"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {holidayType.charAt(0).toUpperCase() + holidayType.slice(1)}
                  </span>
                </div>
              )}
              <div className="mt-2 text-xs">
                {holidayDescription ||
                  "Government holiday. Employees are not expected to work unless specifically scheduled."}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

// Add a getInitialProps to prevent automatic static optimization
// @ts-ignore
DndCalendarDay.getInitialProps = async () => {
  return {}
}

export default DndCalendarDay

