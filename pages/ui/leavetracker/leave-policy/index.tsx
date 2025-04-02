"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const leaveTypes = [
  { value: "sick", label: "Sick Leave" },
  { value: "vacation", label: "Vacation" },
  { value: "personal", label: "Personal Leave" },
  { value: "others", label: "Others" },
]

const formSchema = z.object({
  leaveTypes: z.array(
    z.object({
      type: z.string(),
      accrualRate: z.number().min(0),
      maxAccrual: z.number().min(0),
      carryOver: z.number().min(0),
    }),
  ),
  holidays: z.array(
    z.object({
      date: z.date(),
      name: z.string().min(1, "Holiday name is required"),
    }),
  ),
  workWeek: z.array(z.boolean()).length(7),
  fiscalYearStart: z.date(),
  customLeaveDate: z.date().optional(),
  customLeaveName: z.string().min(1, "Leave name is required").optional(),
})

type FormValues = z.infer<typeof formSchema>

const governmentHolidays = [
  { date: new Date(2024, 0, 1), name: "New Year's Day" },
  { date: new Date(2024, 0, 15), name: "Martin Luther King Jr. Day" },
  { date: new Date(2024, 1, 19), name: "Presidents' Day" },
  { date: new Date(2024, 4, 27), name: "Memorial Day" },
  { date: new Date(2024, 6, 4), name: "Independence Day" },
  { date: new Date(2024, 8, 2), name: "Labor Day" },
  { date: new Date(2024, 9, 14), name: "Columbus Day" },
  { date: new Date(2024, 10, 11), name: "Veterans Day" },
  { date: new Date(2024, 10, 28), name: "Thanksgiving Day" },
  { date: new Date(2024, 11, 25), name: "Christmas Day" },
]

export default function LeavePolicyPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customLeaveDays, setCustomLeaveDays] = useState<Array<{ date: Date; name: string }>>([])
  const [previousLeaveTypes, setPreviousLeaveTypes] = useState<Array<any>>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveTypes: [
        { type: "sick", accrualRate: 1, maxAccrual: 10, carryOver: 5 },
        { type: "vacation", accrualRate: 1.5, maxAccrual: 15, carryOver: 5 },
        { type: "personal", accrualRate: 0.5, maxAccrual: 5, carryOver: 0 },
      ],
      holidays: [
        { date: new Date(2024, 0, 1), name: "New Year's Day" },
        { date: new Date(2024, 11, 25), name: "Christmas Day" },
      ],
      workWeek: [false, true, true, true, true, true, false], // Sunday to Saturday
      fiscalYearStart: new Date(2024, 0, 1), // January 1st
      customLeaveDate: undefined,
      customLeaveName: "",
    },
  })

  // Store the initial leave types when the component mounts
  useEffect(() => {
    setPreviousLeaveTypes(form.getValues("leaveTypes"))
  }, [form])

  const onAddCustomLeave = (data: FormValues) => {
    if (data.customLeaveDate && data.customLeaveName) {
      // Create a new Date object to ensure consistent date handling
      const newLeaveDay = {
        date: new Date(data.customLeaveDate),
        name: data.customLeaveName,
      }

      console.log("Adding custom leave day:", newLeaveDay.name, "for date:", newLeaveDay.date.toDateString())

      setCustomLeaveDays((prevDays) => [...prevDays, newLeaveDay])

      // Reset only the custom leave form fields
      form.setValue("customLeaveDate", undefined)
      form.setValue("customLeaveName", "")

      toast({
        title: "Custom Leave Day Added",
        description: `${data.customLeaveName} has been added for ${format(data.customLeaveDate, "MMMM d, yyyy")}.`,
      })
    }
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setShowSuccessMessage(false)
    try {
      // Check for empty leave types and set them to "others"
      const updatedLeaveTypes = data.leaveTypes.map((leaveType) => {
        if (!leaveType.type || leaveType.type.trim() === "") {
          return { ...leaveType, type: "others" }
        }
        return leaveType
      })

      // Update the form data with the corrected leave types
      form.setValue("leaveTypes", updatedLeaveTypes)

      // In a real application, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Show success toast message with higher duration
      toast({
        title: "Leave Policy Updated Successfully",
        description: "Your leave policy changes have been saved.",
        variant: "default",
        duration: 5000, // Show for 5 seconds
      })

      // Set success message state to true
      setShowSuccessMessage(true)

      // Log the updated leave types to verify they're stored correctly
      console.log("Updated leave types:", updatedLeaveTypes)
      console.log("Leave policy updated successfully:", { ...data, leaveTypes: updatedLeaveTypes })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the leave policy.",
        variant: "destructive",
        duration: 5000, // Show for 5 seconds
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSubmitCustomLeave(data: FormValues) {
    if (data.customLeaveDate && data.customLeaveName) {
      onAddCustomLeave(data)
    }
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Leave Policy Configuration</h1>
      <Tabs defaultValue="policy" className="space-y-4">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="policy" className="text-sm sm:text-base">
            Leave Policy
          </TabsTrigger>
          <TabsTrigger value="holidays" className="text-sm sm:text-base">
            Government Holidays
          </TabsTrigger>
          <TabsTrigger value="custom" className="text-sm sm:text-base">
            Custom Leave Days
          </TabsTrigger>
        </TabsList>
        <TabsContent value="policy">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Leave Types</CardTitle>
                  <CardDescription>Configure accrual rates and limits for each leave type</CardDescription>
                </CardHeader>

                <CardContent>
                  {form.watch("leaveTypes")?.map((leaveType, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 mb-4"
                    >
                      <FormField
                        control={form.control}
                        name={`leaveTypes.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/4">
                            <FormLabel>Leave Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select leave type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {leaveTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`leaveTypes.${index}.accrualRate`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/4">
                            <FormLabel>Accrual Rate (per month)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`leaveTypes.${index}.maxAccrual`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/4">
                            <FormLabel>Max Accrual</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`leaveTypes.${index}.carryOver`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-1/4">
                            <FormLabel>Carry Over</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const currentLeaveTypes = form.getValues("leaveTypes")
                          if (currentLeaveTypes && currentLeaveTypes.length > 1) {
                            form.setValue(
                              "leaveTypes",
                              currentLeaveTypes.filter((_, i) => i !== index),
                            )
                          }
                        }}
                        className="mt-2 sm:mt-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const currentLeaveTypes = form.getValues("leaveTypes")
                      if (currentLeaveTypes) {
                        form.setValue("leaveTypes", [
                          ...currentLeaveTypes,
                          { type: "others", accrualRate: 0, maxAccrual: 0, carryOver: 0 },
                        ])
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Leave Type
                  </Button>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      onClick={() => {
                        const currentLeaveTypes = form.getValues("leaveTypes")
                        const updatedLeaveTypes = currentLeaveTypes.map((leaveType) => {
                          if (!leaveType.type || leaveType.type.trim() === "") {
                            return { ...leaveType, type: "others" }
                          }
                          return leaveType
                        })

                        // Update the form with the corrected leave types
                        form.setValue("leaveTypes", updatedLeaveTypes)

                        // Show success message
                        setShowSuccessMessage(true)

                        // Show toast notification
                        toast({
                          title: "Leave Types Updated",
                          description: "Your leave types have been updated successfully.",
                          variant: "default",
                          duration: 5000,
                        })

                        // Log the updated leave types
                        console.log("Updated leave types:", updatedLeaveTypes)
                      }}
                      className="bg-primary hover:bg-primary/90 text-white font-medium mt-4 sm:mt-0"
                    >
                      Update Leave Types
                    </Button>
                  </div>

                  {showSuccessMessage && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                      <p className="font-medium">Leave types updated successfully!</p>
                      <p className="text-sm">Your changes have been saved.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Work Week</CardTitle>
                  <CardDescription>Configure your organization&apos;s work week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-between sm:justify-start sm:space-x-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name={`workWeek.${index}`}
                        render={({ field }) => (
                          <FormItem className="mb-2 sm:mb-0">
                            <FormControl>
                              <div className="flex flex-col items-center">
                                <Label htmlFor={`workWeek.${index}`} className="mb-1 text-xs sm:text-sm">
                                  {day}
                                </Label>
                                <Input
                                  type="checkbox"
                                  id={`workWeek.${index}`}
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Fiscal Year Start</CardTitle>
                  <CardDescription>Set the start date of your fiscal year</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="fiscalYearStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fiscal Year Start Date</FormLabel>
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
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Government Holidays</CardTitle>
              <CardDescription>List of official government holidays for the year</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {governmentHolidays.map((holiday, index) => (
                  <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-medium">{holiday.name}</span>
                    <span className="text-sm text-muted-foreground">{format(holiday.date, "MMMM d, yyyy")}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Add Custom Leave Day</CardTitle>
              <CardDescription>Add special leave days to the calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCustomLeave)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customLeaveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
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
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customLeaveName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter leave name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Add Custom Leave Day
                  </Button>
                </form>
              </Form>

              {/* Calendar View of Custom Leave Days */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <div className="border rounded-md p-4">
                  {/* Current Month and Year Display */}
                  <div className="text-center mb-4 font-medium text-lg">{format(new Date(), "MMMM yyyy")}</div>

                  {/* Calendar */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center font-medium text-sm py-2">
                        {day}
                      </div>
                    ))}

                    {/* Generate dates for current month */}
                    {Array.from({ length: 31 }, (_, i) => {
                      const date = new Date()
                      date.setDate(i + 1)
                      // Only show dates for the current month
                      if (date.getMonth() === new Date().getMonth()) {
                        // Find if this date has a custom leave day
                        const matchingDay = customLeaveDays.find((day) => {
                          const dayDate = new Date(day.date)
                          return (
                            dayDate.getFullYear() === date.getFullYear() &&
                            dayDate.getMonth() === date.getMonth() &&
                            dayDate.getDate() === date.getDate()
                          )
                        })

                        const isToday = new Date().getDate() === date.getDate()

                        return (
                          <div
                            key={i}
                            className={cn(
                              "relative h-16 border rounded-md p-1",
                              matchingDay ? "bg-primary/10" : "",
                              isToday ? "border-primary border-2" : "",
                            )}
                          >
                            <div className="text-right font-medium">{date.getDate()}</div>
                            {matchingDay && (
                              <div className="absolute bottom-0 left-0 right-0 bg-primary text-[10px] text-center font-bold text-white truncate px-1 py-0.5">
                                {matchingDay.name}
                              </div>
                            )}
                          </div>
                        )
                      }
                      return null
                    }).filter(Boolean)}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Custom Leave Days</h3>
                <ul className="space-y-2">
                  {customLeaveDays.map((day, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 p-2 border rounded-md"
                    >
                      <span className="font-medium">{day.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{format(day.date, "MMMM d, yyyy")}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedDays = customLeaveDays.filter((_, i) => i !== index)
                            setCustomLeaveDays(updatedDays)
                            toast({
                              title: "Custom Leave Day Deleted",
                              description: `${day.name} has been removed from your custom leave days.`,
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

