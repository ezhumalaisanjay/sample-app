"use client"

import React, { useRef } from "react"
import { useDrag } from "react-dnd"
import type { Employee } from "./page"

interface DndEmployeeItemProps {
  employee: Employee
}

const DndEmployeeItem: React.FC<DndEmployeeItemProps> = ({ employee }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  // Safely access employee properties
  const employeeId = employee?.id || "unknown"
  const employeeName = employee?.name || "Unknown"
  const employeeInitial = employeeName.charAt(0) || "?"

  // Use the useDrag hook (only on client)
  const [{ isDragging }, connectDrag] = useDrag({
    type: "EMPLOYEE",
    item: { id: employeeId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Connect the drag to our ref
  React.useEffect(() => {
    if (elementRef.current) {
      connectDrag(elementRef)
    }
  }, [connectDrag])

  return (
    <div
      ref={elementRef}
      className={`p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-move hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      } mb-2 flex items-center`}
    >
      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-xs font-bold">
        {employeeInitial}
      </div>
      <span className="dark:text-white truncate">{employeeName}</span>
      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <span className="mr-1">Drag</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5H6V7H8V5Z" fill="currentColor" />
          <path d="M6 9H8V11H6V9Z" fill="currentColor" />
          <path d="M6 13H8V15H6V13Z" fill="currentColor" />
          <path d="M6 17H8V19H6V17Z" fill="currentColor" />
          <path d="M13 5H11V7H13V5Z" fill="currentColor" />
          <path d="M11 9H13V11H11V9Z" fill="currentColor" />
          <path d="M11 13H13V15H11V13Z" fill="currentColor" />
          <path d="M11 17H13V19H11V17Z" fill="currentColor" />
          <path d="M18 5H16V7H18V5Z" fill="currentColor" />
          <path d="M16 9H18V11H16V9Z" fill="currentColor" />
          <path d="M16 13H18V15H16V13Z" fill="currentColor" />
          <path d="M16 17H18V19H16V17Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}

// Add a getInitialProps to prevent automatic static optimization
// @ts-ignore
DndEmployeeItem.getInitialProps = async () => {
  return {}
}

export default DndEmployeeItem

