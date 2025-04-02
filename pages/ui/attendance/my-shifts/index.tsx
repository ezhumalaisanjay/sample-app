"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { format, addDays } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, MapPin, Clock, X } from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Button } from "@/components/ui/button"

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

type Shift = {
  id: string
  title: string
  start: Date
  end: Date
  location: string
}

// Custom component to render shift details in calendar
const ShiftEvent = ({ event }: any) => {
  return (
    <div className="h-full w-full bg-blue-600 p-1 rounded-md overflow-hidden text-white">
      <div className="font-semibold text-xs">{event.title}</div>
      <div className="flex items-center text-xs mt-1">
        <MapPin className="h-3 w-3 mr-1" />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center text-xs mt-1">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {format(event.start, "p")} - {format(event.end, "p")}
        </span>
      </div>
    </div>
  )
}

export default function MyShiftsPage() {
  const { toast } = useToast()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [showInlineDetails, setShowInlineDetails] = useState(false)

  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch this data from your API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        // Create shifts with dates relative to today
        const today = new Date()
        setShifts([
          {
            id: "1",
            title: "Morning Shift",
            start: new Date(new Date().setHours(9, 0, 0, 0)),
            end: new Date(new Date().setHours(17, 0, 0, 0)),
            location: "Main Office",
          },
          {
            id: "2",
            title: "Evening Shift",
            start: new Date(addDays(new Date(), 1).setHours(17, 0, 0, 0)),
            end: new Date(addDays(new Date(), 1).setHours(23, 0, 0, 0)),
            location: "Branch Office",
          },
          {
            id: "3",
            title: "Night Shift",
            start: new Date(addDays(new Date(), 2).setHours(23, 0, 0, 0)),
            end: new Date(addDays(new Date(), 3).setHours(7, 0, 0, 0)),
            location: "Remote",
          },
          // Add more shifts to demonstrate multiple occurrences
          {
            id: "4",
            title: "Morning Shift",
            start: new Date(addDays(new Date(), 3).setHours(9, 0, 0, 0)),
            end: new Date(addDays(new Date(), 3).setHours(17, 0, 0, 0)),
            location: "Main Office",
          },
          {
            id: "5",
            title: "Morning Shift",
            start: new Date(addDays(new Date(), 5).setHours(9, 0, 0, 0)),
            end: new Date(addDays(new Date(), 5).setHours(17, 0, 0, 0)),
            location: "Branch Office",
          },
          {
            id: "6",
            title: "Evening Shift",
            start: new Date(addDays(new Date(), 4).setHours(17, 0, 0, 0)),
            end: new Date(addDays(new Date(), 4).setHours(23, 0, 0, 0)),
            location: "Remote",
          },
        ])
      } catch (error) {
        console.error("Failed to fetch shifts:", error)
        toast({
          title: "Error",
          description: "Failed to load shifts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShifts()
  }, [toast])

  const filteredShifts = shifts.filter(
    (shift) =>
      shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleShiftClick = (shiftTitle: string) => {
    setSelectedShiftType(shiftTitle)
    setShowInlineDetails(true)
  }

  // Get unique shift types for the buttons
  const uniqueShiftTypes = Array.from(new Set(shifts.map((shift) => shift.title)))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 relative">

      {/* Overlay Shift Details with high z-index */}
      {showInlineDetails && selectedShiftType && (
        <>
          {/* Semi-transparent backdrop */}
          <div className="fixed inset-0 bg-black/30 z-10" onClick={() => setShowInlineDetails(false)} />

          {/* Floating details panel */}
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-white rounded-lg shadow-xl z-50 border border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg">All {selectedShiftType} Days</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowInlineDetails(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto max-h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap sticky top-0 bg-white">Date</TableHead>
                      <TableHead className="whitespace-nowrap sticky top-0 bg-white">Start Time</TableHead>
                      <TableHead className="whitespace-nowrap sticky top-0 bg-white">End Time</TableHead>
                      <TableHead className="whitespace-nowrap sticky top-0 bg-white">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts
                      .filter((shift) => shift.title === selectedShiftType)
                      .map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{format(shift.start, "PP")}</TableCell>
                          <TableCell>{format(shift.start, "p")}</TableCell>
                          <TableCell>{format(shift.end, "p")}</TableCell>
                          <TableCell>{shift.location}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Assigned Shifts</CardTitle>
          <CardDescription>View your upcoming shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search" className="mb-2 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by shift title or location"
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Shift Type Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">View All Days By Shift Type:</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueShiftTypes.map((shiftType) => (
                <Button
                  key={shiftType}
                  variant="outline"
                  size="sm"
                  onClick={() => handleShiftClick(shiftType)}
                  className={selectedShiftType === shiftType && showInlineDetails ? "bg-blue-100" : ""}
                >
                  {shiftType}
                </Button>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Shift</TableHead>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Start Time</TableHead>
                      <TableHead className="whitespace-nowrap">End Time</TableHead>
                      <TableHead className="whitespace-nowrap">Location</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">{shift.title}</TableCell>
                        <TableCell>{format(shift.start, "PP")}</TableCell>
                        <TableCell>{format(shift.start, "p")}</TableCell>
                        <TableCell>{format(shift.end, "p")}</TableCell>
                        <TableCell>{shift.location}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleShiftClick(shift.title)}>
                            View All
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="calendar">
              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={filteredShifts}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="week"
                  views={["month", "week", "day"]}
                  className="text-sm sm:text-base"
                  components={{
                    event: ShiftEvent,
                  }}
                  onSelectEvent={(event) => handleShiftClick(event.title)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
