"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import type { Employee } from "./page"

interface EmployeeItemProps {
  employee: Employee
}

// Create a static version for server-side rendering
const EmployeeItemStatic = ({ employee }: EmployeeItemProps) => (
  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex items-center">
    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-xs font-bold">
      {employee?.name?.charAt(0) || "?"}
    </div>
    <span className="dark:text-white truncate">{employee?.name || "Unknown"}</span>
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

// Dynamic import of DnD components
const DndEmployeeItem = dynamic(() => import("./dnd-employee-item"), {
  ssr: false,
  loading: () => <EmployeeItemStatic employee={{ id: "loading", name: "Loading..." }} />,
})

// Main component that decides whether to render the DnD version or static version
const EmployeeItem: React.FC<EmployeeItemProps> = ({ employee }) => {
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to check if we're on the client
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the server or client hasn't initialized, show the static version
  if (!isClient) {
    return <EmployeeItemStatic employee={employee} />
  }

  // On the client, use the DnD version
  return <DndEmployeeItem employee={employee} />
}

export default EmployeeItem

