"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Schema } from "@/amplify/data/resource"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import axios from "axios"

// Define the form schema with validation
const formSchema = z.object({
  groupName: z
    .string()
    .min(2, {
      message: "Group name must be at least 2 characters.",
    })
    .max(50, {
      message: "Group name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
})

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>

interface TenantResponse {
  ClientId: string
  TenantData: {
    UserID: string
    admin_email: string
    admin_name: string
    client_id: string
    createdAt: string
    group_name: string
    id: string
    identity_pool_id: string
    phone_number: string
    tenant_name: string
    updatedAt: string
    user_pool_id: string
  }
}

interface Data {
  id: string
  groupName: string
  organization: string
  groupDescription: string
}

// Define props interface for the component
interface TenantGroupFormProps {
  data?: Data
  onSubmit?: (values: FormValues) => void
  close: () => void
}

Amplify.configure(outputs)
const client = generateClient<Schema>()

export default function TenantGroupForm({ data, close }: TenantGroupFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [datas, setDatas] = useState<Array<Schema["Groups"]["type"]>>([]);
  const [organizationName, setOrganizationName] = useState<string>("");

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      description: "",
    },
  })

  // Update form values when data prop changes
  useEffect(() => {
    if (data) {
      form.reset({
        groupName: data.groupName || "",
        description: data.groupDescription || "",
      })
    }
  }, [data, form])

  useEffect(() => {
    const fetchingData = async () => {
      const email = localStorage.getItem("email") || "default@example.com"
      try {
        const { data }: { data: TenantResponse } = await axios.post(
          "/api/getTenantUserPool",
          {
            email: email,
          }
        );

        setOrganizationName(data.TenantData.id);

      } catch (err: any) {
        console.error("❌ error:", err.message);
      }
    }

    fetchingData();

    client.models.Groups.observeQuery().subscribe({
      next: (data) => setDatas([...data.items]),
    });
  }, [])

  // Determine if we're in edit mode
  const isEditMode = !!data

  // Handle form submission
  function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Call the parent's onSubmit handler if provided      
    console.log("GroupForm Data : ", values)

    if(data) {
      client.models.Groups.update(
        {
          id: data.id,
          groupName: values.groupName,
          groupDescription: values.description,
        }
      )
    }
    else {
      client.models.Groups.create({
        groupName: values.groupName,
        groupDescription: values.description,
        organization: organizationName,
      })
    }

    toast({
      title: isEditMode ? "Group updated" : "Group created",
      description: isEditMode
        ? "Your group has been updated successfully."
        : "Your group has been created successfully.",
    })
    
    setTimeout(() => setIsLoading(false), 2000);
    close();
  }

  return (
    <Card className="w-full m-2">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit" : "Create"} Group</CardTitle>
        <CardDescription>
          {isEditMode ? "Update your group details." : "Create a new group with the details below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormDescription>The name of your group.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description (optional)"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of the tenant group.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
            {isEditMode ? isLoading ? <><Loader2 className="animate-spin mr-2" /> Updating... </> : "Update Group" : isLoading ? <> <Loader2 className="animate-spin mr-2" /> Adding.. </> : "Add Group"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

