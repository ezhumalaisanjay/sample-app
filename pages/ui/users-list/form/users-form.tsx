"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { useState } from "react"

// Define the form schema with validation
const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, {
    message: "Please enter a valid phone number.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  groupName: z.string({
    required_error: "Please select a group.",
  }),
})

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>

// Mock data for groups dropdown
const groups = [
  { id: "1", name: "Enterprise Customers" },
  { id: "2", name: "Small Business" },
  { id: "3", name: "Government" },
  { id: "4", name: "Education" },
  { id: "5", name: "Healthcare" },
]

// Define props interface for the component
interface AddUsersFormProps {
  data?: FormValues
  onSubmit?: (values: FormValues) => void
  close: () => void
}

export default function AddUsersForm({ data, onSubmit: handleSubmit, close }: AddUsersFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      groupName: "",
    },
  })

  // Update form values when data prop changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        password: data.password || "",
        groupName: data.groupName || "",
      })
    }
  }, [data, form])

  // Determine if we're in edit mode
  const isEditMode = !!data

  // Handle form submission
  function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Call the parent's onSubmit handler if provided
    if (handleSubmit) {
      handleSubmit(values)
    } else {
      // Default submission logic
      console.log(values)

      toast({
        title: isEditMode ? "User updated" : "User added",
        description: isEditMode
          ? "User information has been updated successfully."
          : "New user has been added successfully.",
      })
    }
    setTimeout(() => setIsLoading(false), 2000);
    close();
  }

  return (
    <div className="h-[90vh] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit" : "Add"} User</CardTitle>
          <CardDescription>{isEditMode ? "Update user information." : "Add a new user to the system."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormDescription>Format: +1234567890 or 1234567890</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters with uppercase, lowercase, and number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.name}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The user will be assigned to this group.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isEditMode ? isLoading ? <><Loader2 className="animate-spin mr-2" /> Updating... </> : "Update User" : isLoading ? <> <Loader2 className="animate-spin mr-2" /> Adding.. </> : "Add User"} 
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

