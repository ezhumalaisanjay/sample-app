"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Image from "next/image"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/api"
import type { Schema } from "@/amplify/data/resource"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios"

Amplify.configure(outputs)
const client = generateClient<Schema>()

// Define the form schema with Zod
const formSchema = z.object({
  // Candidate Details
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  phone: z.object({
    countryCode: z.string(),
    number: z.string().min(5, { message: "Please enter a valid phone number" }),
  }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  uanNumber: z.string().optional(),
  officialEmail: z.string().email({ message: "Please enter a valid email address" }).optional(),
  aadharNumber: z.string().optional(),
  panNumber: z.string().optional(),
  photo: z.any().optional(),

  //Professional Details
  sourceofhire: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  skillset: z.string().optional(),
  currentSalary: z.string().optional(),
  qualifications: z.string().optional(),
  department: z.string().min(1, { message: "Dept is required" }),
  joiningDate: z.date({ required_error: "Joining date is required" }),
  offerLetter: z.any().optional(),

  // Contact Details
  presentAddress: z.object({
    line1: z.string().min(1, { message: "Address line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().optional(),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
  }),

  permanentAddress: z.object({
    sameAsPresent: z.boolean().default(false),
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }),

  // Education
  education: z
    .array(
      z.object({
        schoolName: z.string().min(1, { message: "School name is required" }),
        degree: z.string().min(1, { message: "Degree is required" }),
        fieldOfStudy: z.string().optional(),
        completionDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1),

  // Experience
  experience: z
    .array(
      z.object({
        occupation: z.string().min(1, { message: "Occupation is required" }),
        company: z.string().min(1, { message: "Company is required" }),
        summary: z.string().optional(),
        duration: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1),
})

type FormValues = z.infer<typeof formSchema>

interface Data {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  uanNumber: string
  panNumber: string
  aadharNumber: string
  officialEmail: string
  location?: string
  sourceofhire?: string
  jobTitle?: string
  skillset?: string
  currentSalary?: string
  qualifications?: string
  department?: string
  joiningDate?: Date
  presentAddressLine1: string
  presentAddressLine2?: string
  presentAddressCity: string
  presentAddressState?: string
  presentAddressCountry: string
  presentAddressPostalCode: string
  permanentAddressSameAsPresent: boolean
  permanentAddressLine1?: string
  permanentAddressLine2?: string
  permanentAddressCity?: string
  permanentAddressState?: string
  permanentAddressCountry?: string
  permanentAddressPostalCode?: string
  createdAt: string
  updatedAt: string
  education: Array<{
    schoolName: string
    degree: string
    fieldOfStudy: string
    completionDate: Date
    notes: string
  }>
  experience: Array<{
    occupation: string
    company: string
    summary: string
    duration: string
    notes: string
  }>
  photo?: any
  offerLetter?: any
}

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

// Define the props interface for the component
interface AddCandidateFormProps {
  data?: Data
  onSubmit?: (data: FormValues) => void
  close: () => void
}

function AddCandidateForm({ data, close }: AddCandidateFormProps) {
  const [sameAsPresent, setSameAsPresent] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [organizationName, setOrganizationName] = useState<string>("")

  const { toast } = useToast()
  const today = new Date();

  // Default values for the form
  const defaultValues: FormValues = {
    email: "",
    firstName: "",
    phone: {
      countryCode: "+91",
      number: "",
    },
    lastName: "",
    uanNumber: "",
    officialEmail: "",
    aadharNumber: "",
    panNumber: "",
    sourceofhire: "",
    jobTitle: "",
    skillset: "",
    location: "",
    currentSalary: "",
    qualifications: "",
    department: "",
    joiningDate: today,
    presentAddress: {
      line1: "",
      line2: "",
      city: "",
      country: "",
      state: "",
      postalCode: "",
    },
    permanentAddress: {
      sameAsPresent: false,
      line1: "",
      line2: "",
      city: "",
      country: "",
      state: "",
      postalCode: "",
    },
    education: [
      {
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        completionDate: undefined,
        notes: "",
      },
    ],
    experience: [
      {
        occupation: "",
        company: "",
        summary: "",
        duration: "",
        notes: "",
      },
    ],
  }

  // Initialize the form with default values or data prop if provided
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: data || defaultValues,
  })

  // Update form values when data prop changes
  useEffect(() => {

    console.log("Onboarding Data", data)
    if (data) {
      // Map the flattened data structure to the nested form structure
      const formData = {
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: {
          countryCode: data.phoneCountryCode || "+91",
          number: data.phoneNumber || "",
        },
        uanNumber: data.uanNumber || "",
        officialEmail: data.officialEmail || "",
        aadharNumber: data.aadharNumber || "",
        panNumber: data.panNumber || "",
        photo: data.photo || undefined,

        // Professional details
        sourceofhire: data.sourceofhire || "",
        location: data.location || "",
        jobTitle: data.jobTitle || "",
        skillset: data.skillset || "",
        currentSalary: data.currentSalary || "",
        qualifications: data.qualifications || "",
        department: data.department || "",
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,

        // Map present address
        presentAddress: {
          line1: data.presentAddressLine1 || "",
          line2: data.presentAddressLine2 || "",
          city: data.presentAddressCity || "",
          state: data.presentAddressState || "",
          country: data.presentAddressCountry || "",
          postalCode: data.presentAddressPostalCode || "",
        },

        // Map permanent address
        permanentAddress: {
          sameAsPresent: data.permanentAddressSameAsPresent || false,
          line1: data.permanentAddressLine1 || "",
          line2: data.permanentAddressLine2 || "",
          city: data.permanentAddressCity || "",
          state: data.permanentAddressState || "",
          country: data.permanentAddressCountry || "",
          postalCode: data.permanentAddressPostalCode || "",
        },

        // Include education and experience if they exist in the data
        education:
          data.education && data.education.length > 0
            ? data.education.map((edu) => ({
                schoolName: edu.schoolName || "",
                degree: edu.degree || "",
                fieldOfStudy: edu.fieldOfStudy || "",
                completionDate: edu.completionDate ? new Date(edu.completionDate) : undefined,
                notes: edu.notes || "",
              }))
            : [
                {
                  schoolName: "",
                  degree: "",
                  fieldOfStudy: "",
                  completionDate: undefined,
                  notes: "",
                },
              ],
        experience:
          data.experience && data.experience.length > 0
            ? data.experience.map((exp) => ({
                occupation: exp.occupation || "",
                company: exp.company || "",
                summary: exp.summary || "",
                duration: exp.duration || "",
                notes: exp.notes || "",
              }))
            : [
                {
                  occupation: "",
                  company: "",
                  summary: "",
                  duration: "",
                  notes: "",
                },
              ],
      }

      // Reset the form with the mapped data
      form.reset(formData)

      // Set the sameAsPresent state based on the data
      setSameAsPresent(data.permanentAddressSameAsPresent || false)
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
  }, [])


  // Handle form submission
  async function handleSubmit(formData: FormValues) {
    setIsLoading(true)

    try {
      if (data) {
        // Update existing onboarding record
        const updatedOnboarding = await client.models.Onboarding.update({
          id: data.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneCountryCode: formData.phone.countryCode,
          phoneNumber: formData.phone.number,
          uanNumber: formData.uanNumber,
          officialEmail: formData.officialEmail,
          aadharNumber: formData.aadharNumber,
          panNumber: formData.panNumber,

          // Professional details
          sourceofhire: formData.sourceofhire,
          location: formData.location,
          jobTitle: formData.jobTitle,
          skillset: formData.skillset,
          currentSalary: formData.currentSalary,
          qualifications: formData.qualifications,
          department: formData.department,
          joiningDate: formData.joiningDate ? formData.joiningDate.toISOString() : undefined,

          // Present Address
          presentAddressLine1: formData.presentAddress.line1,
          presentAddressLine2: formData.presentAddress.line2,
          presentAddressCity: formData.presentAddress.city,
          presentAddressCountry: formData.presentAddress.country,
          presentAddressState: formData.presentAddress.state,
          presentAddressPostalCode: formData.presentAddress.postalCode,

          // Permanent Address
          permanentAddressSameAsPresent: formData.permanentAddress.sameAsPresent,
          permanentAddressLine1: formData.permanentAddress.line1,
          permanentAddressLine2: formData.permanentAddress.line2,
          permanentAddressCity: formData.permanentAddress.city,
          permanentAddressCountry: formData.permanentAddress.country,
          permanentAddressState: formData.permanentAddress.state,
          permanentAddressPostalCode: formData.permanentAddress.postalCode,
          status: "New Hire",
        })

        // First, delete existing education and experience records
        // Get existing education records
        const existingEducation = await client.models.Education.list({
          filter: { onboardingID: { eq: data.id } },
        })

        // Delete each existing education record
        for (const edu of existingEducation.data) {
          if (edu.id) {
            await client.models.Education.delete({ id: edu.id })
          }
        }

        // Get existing experience records
        const existingExperience = await client.models.Experience.list({
          filter: { onboardingID: { eq: data.id } },
        })

        // Delete each existing experience record
        for (const exp of existingExperience.data) {
          if (exp.id) {
            await client.models.Experience.delete({ id: exp.id })
          }
        }

        // Create new education records
        for (const edu of formData.education) {
          await client.models.Education.create({
            schoolName: edu.schoolName,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            completionDate: edu.completionDate ? edu.completionDate.toISOString() : undefined,
            notes: edu.notes,
            onboardingID: data.id,
          })
        }

        // Create new experience records
        for (const exp of formData.experience) {
          await client.models.Experience.create({
            occupation: exp.occupation,
            company: exp.company,
            summary: exp.summary,
            duration: exp.duration,
            notes: exp.notes,
            onboardingID: data.id,
          })
        }

        toast({
          title: "Success",
          description: "Updated Candidate Data Successfully.",
        })

        form.reset()
      } else {
        // Create new onboarding record
        const newOnboardingResponse = await client.models.Onboarding.create({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneCountryCode: formData.phone.countryCode,
          phoneNumber: formData.phone.number,
          uanNumber: formData.uanNumber,
          officialEmail: formData.officialEmail,
          aadharNumber: formData.aadharNumber,
          panNumber: formData.panNumber,

          // Professional details
          sourceofhire: formData.sourceofhire,
          location: formData.location,
          jobTitle: formData.jobTitle,
          skillset: formData.skillset,
          currentSalary: formData.currentSalary,
          qualifications: formData.qualifications,
          department: formData.department,
          joiningDate: formData.joiningDate ? formData.joiningDate.toISOString() : undefined,

          // Present Address
          presentAddressLine1: formData.presentAddress.line1,
          presentAddressLine2: formData.presentAddress.line2,
          presentAddressCity: formData.presentAddress.city,
          presentAddressCountry: formData.presentAddress.country,
          presentAddressState: formData.presentAddress.state,
          presentAddressPostalCode: formData.presentAddress.postalCode,

          // Permanent Address
          permanentAddressSameAsPresent: formData.permanentAddress.sameAsPresent,
          permanentAddressLine1: formData.permanentAddress.line1,
          permanentAddressLine2: formData.permanentAddress.line2,
          permanentAddressCity: formData.permanentAddress.city,
          permanentAddressCountry: formData.permanentAddress.country,
          permanentAddressState: formData.permanentAddress.state,
          permanentAddressPostalCode: formData.permanentAddress.postalCode,
          status: "New Hire",
          organization: organizationName,
        })

        // Check if data exists before accessing it
        if (!newOnboardingResponse.data) {
          throw new Error("Failed to create onboarding record: No data returned")
        }

        // Extract the ID from the response
        const newOnboardingId = newOnboardingResponse.data.id

        // Create education records
        for (const edu of formData.education) {
          await client.models.Education.create({
            schoolName: edu.schoolName,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            completionDate: edu.completionDate ? edu.completionDate.toISOString() : undefined,
            notes: edu.notes,
            onboardingID: newOnboardingId,
          })
        }

        // Create experience records
        for (const exp of formData.experience) {
          await client.models.Experience.create({
            occupation: exp.occupation,
            company: exp.company,
            summary: exp.summary,
            duration: exp.duration,
            notes: exp.notes,
            onboardingID: newOnboardingId,
          })
        }

        toast({
          title: "Success",
          description: "New Candidate Data Submitted Successfully.",
        })

        form.reset()
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast({
        title: "Error",
        description: "Failed to save candidate data.",
        variant: "destructive",
      })
    }

    close()
    setIsLoading(false)
  }

  // Handle adding new education row
  const addEducationRow = () => {
    const currentEducation = form.getValues("education")
    form.setValue("education", [
      ...currentEducation,
      { schoolName: "", degree: "", fieldOfStudy: "", completionDate: undefined, notes: "" },
    ])
  }

  // Handle adding new experience row
  const addExperienceRow = () => {
    const currentExperience = form.getValues("experience")
    form.setValue("experience", [
      ...currentExperience,
      { occupation: "", company: "", summary: "", duration: "", notes: "" },
    ])
  }

  // Handle same as present address checkbox
  const handleSameAddressChange = (checked: boolean) => {
    setSameAsPresent(checked)
    form.setValue("permanentAddress.sameAsPresent", checked)

    if (checked) {
      const presentAddress = form.getValues("presentAddress")
      form.setValue("permanentAddress.line1", presentAddress.line1)
      form.setValue("permanentAddress.line2", presentAddress.line2)
      form.setValue("permanentAddress.city", presentAddress.city)
      form.setValue("permanentAddress.country", presentAddress.country)
      form.setValue("permanentAddress.state", presentAddress.state)
      form.setValue("permanentAddress.postalCode", presentAddress.postalCode)
    }
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Candidate Details Section */}
          <div className="border-opacity-30 border border-gray-500 m-2 p-5 rounded-lg">
            <p className="text-lg font-semibold mb-2">Candidate Details</p>
            <div className="grid lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-wrap w-full items-center gap-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex flex-wrap w-full items-center gap-4">
                    <FormLabel>FirstName</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full flex-wrap items-center gap-4">
                <Label>Phone</Label>
                <div className="flex gap-2 w-full">
                  <FormField
                    control={form.control}
                    name="phone.countryCode"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="+91" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Country Code</SelectLabel>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+001">+001</SelectItem>
                              <SelectItem value="+90">+90</SelectItem>
                              <SelectItem value="+02">+02</SelectItem>
                              <SelectItem value="+05">+05</SelectItem>
                              <SelectItem value="+83">+83</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone.number"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="tel" placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center flex-wrap gap-4">
                    <FormLabel>LastName</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uanNumber"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center flex-wrap gap-4">
                    <FormLabel>UAN Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="UAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialEmail"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center flex-wrap gap-4">
                    <FormLabel>Official Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Official Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center flex-wrap gap-4">
                    <FormLabel>Aadhar card Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Aadhar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center flex-wrap gap-4">
                    <FormLabel>PAN Card Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="PAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="flex w-full max-w-sm flex-wrap items-center gap-1.5">
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          onChange(file)
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    {value && typeof value === "string" && (
                      <div className="mt-2">
                        <Image
                          src={value || "/placeholder.svg"}
                          alt="Current photo"
                          width={20}
                          height={20}
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="border-opacity-30 border border-gray-500 m-2 p-5 rounded-lg">
            <p className="text-lg font-semibold mb-2">Contact Details</p>
            <div className="grid gap-4">
              {/* Present Address */}
              <div className="flex flex-wrap w-full items-start gap-4">
                <Label className="mt-2">Present Address</Label>
                <div className="flex w-full flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="presentAddress.line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Address line 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentAddress.line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Address line 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="presentAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex w-full gap-2">
                    <FormField
                      control={form.control}
                      name="presentAddress.country"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select Country</SelectLabel>
                                <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                                <SelectItem value="Albania">Albania</SelectItem>
                                <SelectItem value="Algeria">Algeria</SelectItem>
                                <SelectItem value="American Samoa">American Samoa</SelectItem>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="presentAddress.state"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select State</SelectLabel>
                                <SelectItem value="No Matches">No Matches found</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="presentAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Postal Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="flex flex-wrap w-full items-start gap-4">
                <Label className="mt-2">Permanent Address</Label>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAddress"
                      checked={sameAsPresent}
                      onCheckedChange={handleSameAddressChange}
                      className="border-gray-500"
                    />
                    <label
                      htmlFor="sameAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Same as Present Address
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="permanentAddress.line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Address line 1" {...field} disabled={sameAsPresent} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.line2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Address line 2" {...field} disabled={sameAsPresent} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="City" {...field} disabled={sameAsPresent} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex w-full gap-2">
                    <FormField
                      control={form.control}
                      name="permanentAddress.country"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value || ""} disabled={sameAsPresent}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select Country</SelectLabel>
                                <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                                <SelectItem value="Albania">Albania</SelectItem>
                                <SelectItem value="Algeria">Algeria</SelectItem>
                                <SelectItem value="American Samoa">American Samoa</SelectItem>
                                <SelectItem value="Argentina">Argentina</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="permanentAddress.state"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value || ""} disabled={sameAsPresent}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select State</SelectLabel>
                                <SelectItem value="No Matches">No Matches found</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="permanentAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Postal Code" {...field} disabled={sameAsPresent} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professtion Details Section */}
          <div className="border-opacity-30 border border-gray-500 m-2 p-5 rounded-lg">
            <p className="text-lg font-semibold mb-2">Professional Details</p>
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="sourceofhire"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Source of Hire</Label>
                      <FormControl>
                        <Input placeholder="Source" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Location</Label>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Title</Label>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Department</Label>
                      <FormControl>
                        <Input placeholder="Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="currentSalary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Current Salary</Label>
                      <FormControl>
                        <Input placeholder="Source" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Highest Qualifications</Label>
                      <FormControl>
                        <Input placeholder="qualifications" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joiningDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-center gap-3 w-full">
                      <FormLabel>Joining Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full flex pl-3 text-left font-normal" + !field.value && "text-muted-foreground"
                              }
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select Joining date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="offerLetter"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="mt-2">Offer Letter</Label>
                      <FormControl>
                        <Input type="file" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="border-opacity-30 border border-gray-500 m-2 p-5 rounded-lg">
            <div className="flex justify-between">
              <p className="text-lg font-semibold mb-2">Education</p>
              <Button type="button" variant="link" onClick={addEducationRow}>
                Add Row
              </Button>
            </div>

            {form.watch("education")?.map((_, index) => (
              <div key={index} className="flex flex-wrap md:flex-nowrap justify-evenly gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.schoolName`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="School Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Degree/Diploma</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Degree Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.fieldOfStudy`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Field(s) of Study</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Field" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.completionDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 w-full">
                      <FormLabel>Date of Completion</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full flex pl-3 text-left font-normal" + !field.value && "text-muted-foreground"
                              }
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`education.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )) || (
              <div className="text-center py-4">
                <p>No education records. Click &quot;Add Row&quot; to add education details.</p>
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div className="border-opacity-30 border border-gray-500 m-2 p-5 rounded-lg">
            <div className="flex justify-between">
              <p className="text-lg font-semibold mb-2">Experience</p>
              <Button type="button" variant="link" onClick={addExperienceRow}>
                Add Row
              </Button>
            </div>

            {form.watch("experience")?.map((_, index) => (
              <div key={index} className="flex flex-wrap md:flex-nowrap justify-evenly gap-4 mt-4">
                <FormField
                  control={form.control}
                  name={`experience.${index}.occupation`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.summary`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Summary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.duration`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.notes`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )) || (
              <div className="text-center py-4">
                <p>No experience records. Click &quot;Add Row&quot; to add experience details.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end m-2">
            <Button type="submit">
              {data ? (
                isLoading ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin mr-2" /> Updating..
                  </>
                ) : (
                  "Update"
                )
              ) : isLoading ? (
                <>
                  {" "}
                  <Loader2 className="animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddCandidateForm

