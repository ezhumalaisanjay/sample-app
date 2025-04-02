"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Pencil, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const shiftFormSchema = z
  .object({
    id: z.string().optional(),
    date: z.date({
      required_error: "Shift date is required",
    }),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    requiredStaff: z
      .number()
      .int()
      .min(1, "At least 1 staff member is required")
      .max(20, "Maximum 20 staff members allowed"),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Convert time strings to comparable values
      const [startHour, startMinute] = data.startTime.split(":").map(Number)
      const [endHour, endMinute] = data.endTime.split(":").map(Number)

      const startValue = startHour * 60 + startMinute
      const endValue = endHour * 60 + endMinute

      // Allow shifts that span midnight (end time appears earlier than start time)
      if (endValue < startValue) {
        return true // This is valid for overnight shifts
      }

      // For same-day shifts, end must be after start
      return endValue > startValue
    },
    {
      message: "End time must be after start time for same-day shifts",
      path: ["endTime"],
    },
  )

type ShiftFormValues = z.infer<typeof shiftFormSchema>

type Shift = ShiftFormValues & { id: string }

export default function ShiftsAssigningPage() {
  const { toast } = useToast()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterDate, setFilterDate] = useState<Date | undefined>(new Date())

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      requiredStaff: 1,
      notes: "",
    },
  })

  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setShifts([
          {
            id: "1",
            date: new Date(2023, 5, 1),
            startTime: "09:00",
            endTime: "17:00",
            requiredStaff: 3,
            notes: "Morning shift",
          },
          {
            id: "2",
            date: new Date(2023, 5, 1),
            startTime: "17:00",
            endTime: "01:00",
            requiredStaff: 2,
            notes: "Night shift",
          },
          {
            id: "3",
            date: new Date(),
            startTime: "09:00",
            endTime: "17:00",
            requiredStaff: 4,
            notes: "Today's morning shift",
          },
          {
            id: "4",
            date: new Date(),
            startTime: "17:00",
            endTime: "01:00",
            requiredStaff: 3,
            notes: "Today's evening shift",
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

  const onSubmit = async (data: ShiftFormValues) => {
    try {
      // Validate that the shift makes logical sense
      const [startHour, startMinute] = data.startTime.split(":").map(Number)
      const [endHour, endMinute] = data.endTime.split(":").map(Number)

      const startValue = startHour * 60 + startMinute
      const endValue = endHour * 60 + endMinute

      // Calculate shift duration in hours
      let durationInMinutes = endValue - startValue
      if (durationInMinutes < 0) {
        // Overnight shift
        durationInMinutes += 24 * 60
      }

      const durationInHours = durationInMinutes / 60

      // Warn about long shifts (over 12 hours)
      if (durationInHours > 12) {
        const confirmLongShift = window.confirm(
          `This shift is ${durationInHours.toFixed(1)} hours long. Are you sure this is correct?`,
        )

        if (!confirmLongShift) {
          return
        }
      }

      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingShift) {
        setShifts((prevShifts) =>
          prevShifts.map((shift) => (shift.id === editingShift.id ? { ...data, id: shift.id } : shift)),
        )
        toast({
          title: "Shift Updated",
          description: "The shift has been successfully updated.",
        })
      } else {
        const newShift = { ...data, id: Date.now().toString() }
        setShifts((prevShifts) => [...prevShifts, newShift])
        toast({
          title: "Shift Created",
          description: "A new shift has been successfully created.",
        })
      }

      // Update filter date to match the new/edited shift date
      // This ensures the newly created/edited shift is visible in the table
      setFilterDate(data.date)

      setEditingShift(null)
      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Failed to save shift:", error)
      toast({
        title: "Error",
        description: "Failed to save shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift)
    form.reset(shift)
    setIsDialogOpen(true)
  }

  const handleDeleteShift = async (shiftId: string) => {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== shiftId))
      toast({
        title: "Shift Deleted",
        description: "The shift has been successfully deleted.",
      })
    } catch (error) {
      console.error("Failed to delete shift:", error)
      toast({
        title: "Error",
        description: "Failed to delete shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter shifts by selected date
  const filteredShifts = filterDate
    ? shifts.filter(
        (shift) =>
          shift.date.getDate() === filterDate.getDate() &&
          shift.date.getMonth() === filterDate.getMonth() &&
          shift.date.getFullYear() === filterDate.getFullYear(),
      )
    : shifts

  // Calculate shift duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startValue = startHour * 60 + startMinute
    let endValue = endHour * 60 + endMinute

    if (endValue < startValue) {
      endValue += 24 * 60 // Add 24 hours for overnight shifts
    }

    const durationMinutes = endValue - startValue
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
  }

  return (
    <div className="container mx-auto py-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Shift Management</h1>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Shifts</CardTitle>
              <CardDescription>Create and manage shifts for your team</CardDescription>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  {filterDate ? format(filterDate, "PPP") : "All dates"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingShift(null)
                    form.reset({
                      date: new Date(),
                      startTime: "09:00",
                      endTime: "17:00",
                      requiredStaff: 1,
                      notes: "",
                    })
                  }}
                  className="w-full sm:w-auto"
                >
                  Create New Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingShift ? "Edit Shift" : "Create New Shift"}</DialogTitle>
                  <DialogDescription>
                    {editingShift ? "Edit the details of the existing shift." : "Enter the details for the new shift."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Shift Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full sm:w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="requiredStaff"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Staff</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Shift"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredShifts.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No shifts found for the selected date.</p>
              <Button variant="link" onClick={() => setFilterDate(undefined)} className="mt-2">
                View all shifts
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <ScrollArea className="w-[75vw] lg:w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Time</TableHead>
                      <TableHead className="whitespace-nowrap">Duration</TableHead>
                      <TableHead className="whitespace-nowrap">Required Staff</TableHead>
                      <TableHead className="whitespace-nowrap">Notes</TableHead>
                      <TableHead className="whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShifts.map((shift) => {
                      const isToday =
                        shift.date.getDate() === new Date().getDate() &&
                        shift.date.getMonth() === new Date().getMonth() &&
                        shift.date.getFullYear() === new Date().getFullYear()

                      const isOvernight = () => {
                        const [startHour, startMinute] = shift.startTime.split(":").map(Number)
                        const [endHour, endMinute] = shift.endTime.split(":").map(Number)
                        const startValue = startHour * 60 + startMinute
                        const endValue = endHour * 60 + endMinute
                        return endValue < startValue
                      }

                      return (
                        <TableRow key={shift.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(shift.date, "PP")}
                            {isToday && <Badge className="ml-2 bg-primary">Today</Badge>}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {shift.startTime} - {shift.endTime}
                            {isOvernight() && (
                              <Badge variant="outline" className="ml-2">
                                Overnight
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {calculateDuration(shift.startTime, shift.endTime)}
                          </TableCell>
                          <TableCell>{shift.requiredStaff}</TableCell>
                          <TableCell className="max-w-xs truncate">{shift.notes}</TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                              <Button size="sm" onClick={() => handleEditShift(shift)} className="w-full sm:w-auto">
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteShift(shift.id)}
                                className="w-full sm:w-auto"
                              >
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

