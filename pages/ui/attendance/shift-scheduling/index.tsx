"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Plus, Save, Check, BarChart3, CalendarIcon, List, Edit, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Create a non-DnD version of EmployeeItem for server-side rendering
const EmployeeItemStatic = ({ employee }: { employee: { id: string; name: string } }) => (
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

// Dynamically import DnD-dependent components with SSR disabled
const DndWrapper = dynamic(() => import("./dnd-wrapper"), {
  ssr: false,
  loading: () => <div>Loading drag and drop functionality...</div>,
})

const EmployeeItem = dynamic(() => import("./employee-item"), { ssr: false })
const CalendarView = dynamic(() => import("./calendar-view"), { ssr: false })
const GanttChart = dynamic(() => import("./gantt-chart"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
      Loading Gantt chart...
    </div>
  ),
})

export type Employee = {
  id: string
  name: string
}

export type Shift = {
  id: string
  employeeId: string
  date: Date
  startTime: string
  endTime: string
}

export type Holiday = {
  id: string
  date: Date
  name: string
  description?: string
  type?: "federal" | "state" | "religious" | "observance" | "restricted" | "gazetted"
}

const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }
  return slots
}

function ShiftSchedulingPage() {
  const { toast } = useToast()
  const [employees] = useState<Employee[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
    { id: "4", name: "Alice Williams" },
    { id: "5", name: "Charlie Brown" },
  ])

  const [shifts, setShifts] = useState<Shift[]>([])
  const [currentDate] = useState(new Date(2025, 2, 1)) // March 2025
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("calendar")
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showHolidayList, setShowHolidayList] = useState(true)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [filterEmployee, setFilterEmployee] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  // Add the government holidays array after the timeSlots state
  const [timeSlots] = useState(generateTimeSlots())

  // Government holidays for 2025
  const [holidays] = useState<Holiday[]>([
    {
      id: "1",
      date: new Date(2025, 0, 1),
      name: "New Year's Day",
      description: "New Year's Day is celebrated on January 1st in India and around the world.",
      type: "observance",
    },
    {
      id: "2",
      date: new Date(2025, 0, 14),
      name: "Pongal",
      description:
        "Pongal is a four-day harvest festival celebrated primarily in Tamil Nadu, dedicated to the Sun God.",
      type: "restricted",
    },
    {
      id: "3",
      date: new Date(2025, 0, 15),
      name: "Makar Sankranti",
      description: "Makar Sankranti is a festival dedicated to the Hindu sun god Surya, marking the end of winter.",
      type: "restricted",
    },
    {
      id: "4",
      date: new Date(2025, 0, 26),
      name: "Republic Day",
      description:
        "Republic Day honors the date on which the Constitution of India came into effect, replacing the Government of India Act as the governing document of India.",
      type: "gazetted",
    },
    {
      id: "5",
      date: new Date(2025, 2, 7),
      name: "Holi",
      description:
        "Holi is a popular ancient Hindu festival, also known as the 'Festival of Colors' or the 'Festival of Love'.",
      type: "restricted",
    },
    {
      id: "6",
      date: new Date(2025, 3, 14),
      name: "Dr. Ambedkar Jayanti",
      description:
        "Ambedkar Jayanti is observed to commemorate the birth anniversary of Dr. B.R. Ambedkar, the father of the Indian Constitution.",
      type: "gazetted",
    },
    {
      id: "7",
      date: new Date(2025, 4, 1),
      name: "Labour Day",
      description: "Labour Day in India is celebrated to honor the contribution of working men and women.",
      type: "restricted",
    },
    {
      id: "8",
      date: new Date(2025, 7, 15),
      name: "Independence Day",
      description:
        "Independence Day marks the end of British rule in 1947 and the establishment of a free and independent Indian nation.",
      type: "gazetted",
    },
    {
      id: "9",
      date: new Date(2025, 9, 2),
      name: "Gandhi Jayanti",
      description:
        "Gandhi Jayanti is celebrated to mark the birth anniversary of Mahatma Gandhi, the 'Father of the Nation'.",
      type: "gazetted",
    },
    {
      id: "10",
      date: new Date(2025, 9, 23),
      name: "Dussehra",
      description:
        "Dussehra celebrates the victory of Lord Rama over the demon king Ravana, symbolizing the triumph of good over evil.",
      type: "gazetted",
    },
    {
      id: "11",
      date: new Date(2025, 10, 12),
      name: "Diwali",
      description:
        "Diwali, the festival of lights, is one of the major festivals celebrated by Hindus, Jains, and Sikhs.",
      type: "gazetted",
    },
    {
      id: "12",
      date: new Date(2025, 11, 25),
      name: "Christmas",
      description:
        "Christmas is an annual festival commemorating the birth of Jesus Christ, observed primarily on December 25.",
      type: "gazetted",
    },
  ])

  // Add a function to check if a date is a holiday
  const isHoliday = (date: Date) => {
    if (!date) return false

    return holidays.some(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth() &&
        holiday.date.getFullYear() === date.getFullYear(),
    )
  }

  // Add a function to get holiday name
  const getHolidayName = (date: Date) => {
    if (!date) return null

    const holiday = holidays.find(
      (h) =>
        h.date.getDate() === date.getDate() &&
        h.date.getMonth() === date.getMonth() &&
        h.date.getFullYear() === date.getFullYear(),
    )

    return holiday ? holiday.name : null
  }

  // Use useEffect to ensure we only render DnD components on the client
  useEffect(() => {
    setIsClient(true)

    // Load saved shifts from localStorage if available
    const savedShifts = localStorage.getItem("savedShifts")
    if (savedShifts) {
      try {
        const parsedShifts = JSON.parse(savedShifts)
        // Convert date strings back to Date objects
        const shiftsWithDates = parsedShifts.map((shift: any) => ({
          ...shift,
          date: new Date(shift.date),
        }))
        setShifts(shiftsWithDates)
      } catch (error) {
        console.error("Error loading saved shifts:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Set hasUnsavedChanges to true whenever shifts are modified
  useEffect(() => {
    if (isClient && shifts.length > 0) {
      setHasUnsavedChanges(true)
    }
  }, [shifts, isClient])

  const handleDrop = (employeeId: string, date: Date) => {
    const timeSlots = generateTimeSlots()
    const startIndex = Math.floor(Math.random() * (timeSlots.length - 1))
    const startTime = timeSlots[startIndex]
    const endTime = timeSlots[startIndex + 1]

    const newShift: Shift = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      date: new Date(date),
      startTime,
      endTime,
    }

    setShifts((prevShifts) => [...prevShifts, newShift])
    setHasUnsavedChanges(true)
  }

  const addTestData = () => {
    const newShifts: Shift[] = [
      {
        id: "test-1",
        employeeId: "1",
        date: new Date(2025, 2, 3),
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        id: "test-2",
        employeeId: "2",
        date: new Date(2025, 2, 3),
        startTime: "10:00",
        endTime: "18:00",
      },
      {
        id: "test-3",
        employeeId: "3",
        date: new Date(2025, 2, 3),
        startTime: "11:00",
        endTime: "19:00",
      },
      {
        id: "test-4",
        employeeId: "1",
        date: new Date(2025, 2, 5),
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        id: "test-5",
        employeeId: "4",
        date: new Date(2025, 2, 5),
        startTime: "10:00",
        endTime: "18:00",
      },
      {
        id: "test-6",
        employeeId: "2",
        date: new Date(2025, 2, 10),
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        id: "test-7",
        employeeId: "5",
        date: new Date(2025, 2, 10),
        startTime: "10:00",
        endTime: "18:00",
      },
    ]

    setShifts((prevShifts) => [...prevShifts, ...newShifts])
    setHasUnsavedChanges(true)

    // Show a toast notification
    toast({
      title: "Test data added",
      description: "7 test shifts have been added to the schedule.",
    })

    // Switch to chart view to show the data
    setActiveTab("gantt")
  }

  const handleRemoveShift = (shiftId: string) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId))
    setHasUnsavedChanges(true)
  }

  const handleEditShift = (shift: Shift) => {
    setEditingShift({ ...shift })
    setIsEditDialogOpen(true)
  }

  const handleSaveEditedShift = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingShift) return

    setShifts((prevShifts) => prevShifts.map((shift) => (shift.id === editingShift.id ? editingShift : shift)))

    setIsEditDialogOpen(false)
    setEditingShift(null)
    setHasUnsavedChanges(true)

    toast({
      title: "Shift updated",
      description: "The shift has been successfully updated.",
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Save the current shifts
  const saveShifts = async () => {
    if (shifts.length === 0) {
      toast({
        title: "No shifts to save",
        description: "Create some shifts by dragging employees to the calendar.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate an API call with a timeout and save to localStorage
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage (this is just for demo purposes)
      localStorage.setItem("savedShifts", JSON.stringify(shifts))

      toast({
        title: "Schedule saved successfully",
        description: `Saved ${shifts.length} shifts to the schedule.`,
        variant: "default",
      })

      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error saving shifts:", error)
      toast({
        title: "Failed to save schedule",
        description: "There was an error saving your schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Toggle holiday list visibility
  const toggleHolidayList = () => {
    setShowHolidayList(!showHolidayList)
  }

  // Render the main content
  const renderContent = () => {
    if (!isClient) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="md:col-span-1 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Employees</CardTitle>
              <CardDescription className="dark:text-gray-400">Drag and drop to assign shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <EmployeeItemStatic key={employee.id} employee={employee} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Shift Schedule</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Drag employees to calendar days to assign shifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                Loading calendar...
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <DndWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="md:col-span-1 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Employees</CardTitle>
              <CardDescription className="dark:text-gray-400">Drag and drop to assign shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <EmployeeItem key={employee.id} employee={employee} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Instructions:</p>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Drag an employee to any day on the calendar</li>
                  <li>You can add multiple employees to the same day</li>
                  <li>Click the X to remove an employee from a day</li>
                  <li>Click Save to store your schedule</li>
                  <li>Switch to Chart view to see employee assignments</li>
                </ol>
              </div>

              {/* Holiday List Section */}
              <div className="mt-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-t-md flex items-center justify-between">
                  <span className="flex items-center font-medium">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Government Holidays
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 bg-white text-primary hover:bg-gray-100"
                    onClick={toggleHolidayList}
                  >
                    {showHolidayList ? "Hide" : "Show"}
                  </Button>
                </div>

                {showHolidayList && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-b-md overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 text-xs font-medium text-blue-800 dark:text-blue-200">
                      2025 Indian Government Holidays
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs border-b">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-1">
                        Gazetted
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-1">
                        Restricted
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Observance
                      </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {holidays
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((holiday) => (
                          <div
                            key={holiday.id}
                            className="p-2 border-b text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div className="font-medium text-gray-900 dark:text-gray-100">{holiday.name}</div>
                            <div className="text-gray-500 dark:text-gray-400 mt-1">{formatDate(holiday.date)}</div>
                            {holiday.type && (
                              <div className="mt-1">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                    ${
                      holiday.type === "gazetted"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : holiday.type === "restricted"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                                >
                                  {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">Shift Schedule</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Drag employees to calendar days to assign shifts
                </CardDescription>
              </div>
              <Button
                onClick={saveShifts}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-1"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save className="h-4 w-4" /> Save Schedule
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Saved
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar" onValueChange={setActiveTab} value={activeTab}>
                <div className="mb-4 flex items-start">
                  <TabsList className="inline-flex w-auto">
                    <TabsTrigger value="calendar" className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" /> Calendar View
                    </TabsTrigger>
                    <TabsTrigger value="gantt" className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" /> Chart View
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center gap-1">
                      <List className="h-4 w-4" /> List View
                    </TabsTrigger>
                  </TabsList>
                </div>

                {shifts.length > 0 && (
                  <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-200 flex items-center justify-center">
                    {activeTab === "calendar" ? (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span>
                          Click on Chart View or List View tab to see employee assignments in different formats
                        </span>
                      </>
                    ) : activeTab === "gantt" ? (
                      <>
                        <List className="h-4 w-4 mr-2" />
                        <span>Click on List View tab to see a detailed list of all shifts</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>Click on Calendar View tab to return to calendar</span>
                      </>
                    )}
                  </div>
                )}

                <TabsContent value="calendar" className="mt-0">
                  {/* Update the legend colors to match the new blue styling for holidays */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Calendar Schedule</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Holiday</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Assigned Shift</span>
                      </div>
                    </div>
                  </div>
                  <CalendarView
                    currentDate={currentDate}
                    shifts={shifts}
                    employees={employees}
                    holidays={holidays}
                    onDrop={handleDrop}
                    onRemoveShift={handleRemoveShift}
                    onEditShift={handleEditShift}
                  />
                </TabsContent>
                <TabsContent value="gantt" className="mt-0">
                  <GanttChart
                    key={`gantt-${shifts.length}`}
                    shifts={shifts}
                    employees={employees}
                    holidays={holidays}
                    onShiftUpdate={setShifts}
                  />
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium dark:text-white">Shift List</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Assigned Shift</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Holiday</span>
                        </div>
                      </div>
                    </div>

                    {/* Filter Controls - ALWAYS VISIBLE */}
                    <div className="bg-primary text-primary-foreground p-4 rounded-t-md border-2 border-primary mb-4">
                      <div className="text-sm font-bold mb-3 flex items-center">
                        <svg
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 4.5H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.26001 4.5V9.33"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 9.33008H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 9.33008V14.1601"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 14.1699H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16.74 14.1699V19.0099"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 19.0098H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        FILTER SHIFTS
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-3 rounded-md">
                        <div>
                          <Label
                            htmlFor="filterEmployee"
                            className="text-xs mb-1 block text-black dark:text-white font-semibold"
                          >
                            Employee
                          </Label>
                          <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                            <SelectTrigger id="filterEmployee" className="w-full bg-white dark:bg-gray-800 border-2">
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Employees</SelectItem>
                              {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id}>
                                  {employee.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="filterDate"
                            className="text-xs mb-1 block text-black dark:text-white font-semibold"
                          >
                            Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="filterDate"
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-10 bg-white dark:bg-gray-800 border-2"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filterDate ? format(filterDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={filterDate}
                                onSelect={setFilterDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {filterDate && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="mt-1 h-6 text-xs"
                              onClick={() => setFilterDate(undefined)}
                            >
                              Clear Date
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Show active filters */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {filterEmployee !== "all" && (
                          <div className="bg-white text-primary dark:bg-gray-800 text-sm px-3 py-1 rounded-full flex items-center font-medium">
                            <span className="mr-1">
                              Employee: {employees.find((e) => e.id === filterEmployee)?.name}
                            </span>
                            <button
                              onClick={() => setFilterEmployee("all")}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {filterDate && (
                          <div className="bg-white text-primary dark:bg-gray-800 text-sm px-3 py-1 rounded-full flex items-center font-medium">
                            <span className="mr-1">Date: {format(filterDate, "PP")}</span>
                            <button
                              onClick={() => setFilterDate(undefined)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {shifts.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        No shifts scheduled. Drag employees to days to create shifts.
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Employee
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {shifts
                              .filter((shift) => {
                                // Filter by employee
                                if (filterEmployee !== "all" && shift.employeeId !== filterEmployee) {
                                  return false
                                }

                                // Filter by date (if provided)
                                if (filterDate) {
                                  const shiftDate = new Date(shift.date)
                                  if (
                                    shiftDate.getDate() !== filterDate.getDate() ||
                                    shiftDate.getMonth() !== filterDate.getMonth() ||
                                    shiftDate.getFullYear() !== filterDate.getFullYear()
                                  ) {
                                    return false
                                  }
                                }

                                return true
                              })
                              .sort((a, b) => a.date.getTime() - b.date.getTime())
                              .map((shift) => {
                                const employee = employees.find((e) => e.id === shift.employeeId)
                                const isHolidayDate = isHoliday(shift.date)
                                const holidayName = getHolidayName(shift.date)

                                return (
                                  <tr key={shift.id} className={isHolidayDate ? "bg-red-50 dark:bg-red-900/20" : ""}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                          {employee?.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {employee?.name}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {shift.date.toLocaleDateString("en-US", {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </div>
                                      {isHolidayDate && holidayName && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">{holidayName}</div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {shift.startTime} - {shift.endTime}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex space-x-3">
                                        <button
                                          onClick={() => handleEditShift(shift)}
                                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center"
                                        >
                                          <Edit className="h-4 w-4 mr-1" /> Edit
                                        </button>
                                        <button
                                          onClick={() => handleRemoveShift(shift.id)}
                                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center"
                                        >
                                          <X className="h-4 w-4 mr-1" /> Remove
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        {/* Edit Shift Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Shift</DialogTitle>
              <DialogDescription>Make changes to the shift details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEditedShift}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Employee
                  </Label>
                  <Select
                    value={editingShift?.employeeId}
                    onValueChange={(value) => setEditingShift((prev) => (prev ? { ...prev, employeeId: value } : null))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {editingShift?.date ? formatDate(editingShift.date) : ""}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <Select
                    value={editingShift?.startTime}
                    onValueChange={(value) => setEditingShift((prev) => (prev ? { ...prev, startTime: value } : null))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(0, -1).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <Select
                    value={editingShift?.endTime}
                    onValueChange={(value) => setEditingShift((prev) => (prev ? { ...prev, endTime: value } : null))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(1).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DndWrapper>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Shift Scheduling</h1>
        <div className="flex space-x-2">
          <Button onClick={addTestData} variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Test Data
          </Button>
          <Button onClick={toggleDarkMode} variant="outline" size="icon">
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </div>
      {renderContent()}
    </div>
  )
}

// Add getInitialProps to prevent automatic static optimization
ShiftSchedulingPage.getInitialProps = async () => {
  return {}
}

export default ShiftSchedulingPage

