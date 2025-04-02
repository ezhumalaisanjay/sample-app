"use client"

import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"
import { ScrollArea } from "@/components/ui/scroll-area"

Amplify.configure(outputs);
const client = generateClient<Schema>();

// Define the schema for form validation
const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  employeeId: z.string().min(1, "Employee ID is required").nullable().optional(),
  department: z.string().min(1, "Department is required").nullable().optional(),
  jobTitle: z.string().min(1, "Job title is required").nullable().optional(),
  status: z.enum(["Active", "Inactive", "On Leave", "Remote", "New Hire"]).nullable().optional(),
  startDate: z.string().min(1, "Start date is required").nullable().optional(),
  joiningDate: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  manager: z.string().nullable().optional(),
  mailId: z.string().email("Invalid email address").nullable().optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  phoneCountryCode: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  groupName: z.string().optional(),
  leaveRequestPending: z.boolean().optional(),
  performanceReviewDue: z.boolean().optional(),
  trainingOverdue: z.boolean().optional(),
})

// Employee type derived from the schema
type FormEmployee = z.infer<typeof formSchema>

// Import the Employee interface from your main component
interface Employee {
  id: string
  firstName: string
  lastName: string
  name?: string
  employeeId?: string | null
  department?: string | null
  jobTitle?: string | null
  status?: "Active" | "Inactive" | "On Leave" | "Remote" | "New Hire" | null
  startDate?: string | null
  joiningDate?: string | null
  location?: string | null
  manager?: string | null
  mailId: string
  email?: string | null
  phoneCountryCode?: string | null
  phoneNumber?: string | null
  groupName?: string | null
  leaveRequestPending?: boolean
  performanceReviewDue?: boolean
  trainingOverdue?: boolean
}

interface EditEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  onClose: () => void
}

export default function EditEmployeeDialog({ employee, open, onClose }: EditEmployeeDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormEmployee>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      employeeId: "",
      department: "",
      jobTitle: "",
      status: "Active",
      startDate: "",
      joiningDate: "",
      location: "",
      manager: "",
      mailId: "",
      email: "",
      phoneCountryCode: "",
      phoneNumber: "",
      groupName: "",
      leaveRequestPending: false,
      performanceReviewDue: false,
      trainingOverdue: false,
    },
  })

  // Update form values when employee data changes
  useEffect(() => {
    if (employee) {
      form.reset({
        id: employee.id || "",
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        employeeId: employee.employeeId || "",
        department: employee.department || "",
        jobTitle: employee.jobTitle || "",
        status: employee.status || "Active",
        startDate: employee.startDate || employee.joiningDate || "",
        joiningDate: employee.joiningDate || employee.startDate || "",
        location: employee.location || "",
        manager: employee.manager || "",
        mailId: employee.mailId || employee.email || "",
        email: employee.email || employee.mailId || "",
        phoneCountryCode: employee.phoneCountryCode || "",
        phoneNumber: employee.phoneNumber || "",
        groupName: employee.groupName || "",
        leaveRequestPending: employee.leaveRequestPending || false,
        performanceReviewDue: employee.performanceReviewDue || false,
        trainingOverdue: employee.trainingOverdue || false,
      })
    }
  }, [employee, form])

  async function onSubmit(values: FormEmployee) {
    setIsSubmitting(true)

    try {

      await client.models.Onboarding.update({
        id: employee?.id || "",
        firstName: values.firstName,
        lastName: values.lastName,
        employeeId: values.employeeId,
        department: values.department,
        jobTitle: values.jobTitle,
        status: values.status,
        joiningDate: values.startDate,
        location: values.location,
        manager: values.manager,
        email: values.mailId || "",
        groupName: values.groupName || "",
      });

      // Here you would typically update the employee data in your database
      // For now, we'll just show a success toast

      toast({
        title: "Employee Updated",
        description: `${values.firstName} ${values.lastName}'s information has been updated successfully.`,
        duration: 3000,
      })
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating the employee information.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!employee) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <ScrollArea className="w-full h-[80vh] lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Employee</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "Active"}
                          value={field.value || "Active"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="New Hire">New Hire</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="groupName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} value={field.value || ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-3">Status Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="leaveRequestPending"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Leave Request Pending</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="performanceReviewDue"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Performance Review Due</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trainingOverdue"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Training Overdue</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

