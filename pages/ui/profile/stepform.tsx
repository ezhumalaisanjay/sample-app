"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Divider } from "@aws-amplify/ui-react"

interface UserDetails {
  name: string
  role: string
  location: string
  department: string
  email: string
  mobileNo: string
  about: string
  employeeID: string
  nickName: string
  firstName: string
  lastName: string
  division: string
  designation: string
  employmentType: string
  employeeStatus: string
  source: string
  doj: string
  experience: string
  dob: string
  maritalStatus: string
  gender: string
  expertise: string
  address: string
}

export default function ProfileSettingsStepForm({ userDetails }: { userDetails: UserDetails[] | null }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const sections = ["Basic Information", "Work Information", "Personal Details"]
  const employmentTypes = ["Permanent", "Probation", "Contract"]
  const maritalOptions = ["Single", "Married", "Divorced"]
  const genderOptions = ["Male", "Female", "Transgender"]
  const employeeActive = ["Active", "Resigned"]
  const hiringPlatforms = ["Linkedin", "Naukri", "Indeed", "Wellfound"]

  const formSchema = z.object({
    employeeID: z.string(),
    nickName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    division: z.string(),
    department: z.string(),
    location: z.string(),
    designation: z.string(),
    role: z.string(),
    employmentType: z.string(),
    employeeStatus: z.string(),
    source: z.string(),
    doj: z.date().optional(),
    experience: z.string(),
    dob: z.date().optional(),
    maritalStatus: z.string(),
    about: z.string(),
    gender: z.string(),
    expertise: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeID: userDetails?.[0]?.employeeID || "",
      nickName: userDetails?.[0]?.nickName || "",
      firstName: userDetails?.[0]?.firstName || "",
      lastName: userDetails?.[0]?.lastName || "",
      email: userDetails?.[0]?.email || "",
      division: userDetails?.[0]?.division || "",
      department: userDetails?.[0]?.department || "",
      location: userDetails?.[0]?.location || "",
      designation: userDetails?.[0]?.designation || "",
      role: userDetails?.[0]?.role || "",
      doj: userDetails?.[0]?.doj ? new Date(userDetails[0].doj) : undefined,
      employmentType: userDetails?.[0]?.employmentType || "",
      dob: userDetails?.[0]?.dob ? new Date(userDetails[0].dob) : undefined,
      employeeStatus: userDetails?.[0]?.employeeStatus || "",
      source: userDetails?.[0]?.source || "",
      experience: userDetails?.[0]?.experience || "",
      maritalStatus: userDetails?.[0]?.maritalStatus || "",
      about: userDetails?.[0]?.about || "",
      gender: userDetails?.[0]?.gender || "",
      expertise: userDetails?.[0]?.expertise || "",
    },
  })

  const nextSection = () => setCurrentIndex((prev) => Math.min(prev + 1, sections.length - 1))
  const prevSection = () => setCurrentIndex((prev) => Math.max(prev - 1, 0))

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitLoading(true)
    console.log("Form Data: ", values)

    form.reset(values)

    setTimeout(() => setIsSubmitLoading(false), 2000)
  }

  return (
    <div className="flex md:flex-row flex-col gap-2 w-full min-h-screen p-6">
      {/* Sidebar Navigation */}
      <aside className="md:basis-2/6 lg:sticky lg:top-20 2xl:basis-2/12 basis-1/3 h-max md:h-full bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <p className="text-sm text-gray-500 mb-4">Make Changes in your profile here.</p>
        <nav className="space-y-2">
          {sections.map((section, index) => (
            <Button
              key={section}
              variant={currentIndex === index ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setCurrentIndex(index)}
            >
              {section}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Profile Form */}
      <main className="flex-1 p-8 shadow-md rounded-lg gap-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {currentIndex === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="employeeID"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Employee ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nickName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Nick name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">First name</FormLabel>
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
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Last name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Email address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentIndex === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="division"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Division</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Department</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Designation</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Role</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Employment type</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {employmentTypes.map((type, index) => (
                                      <SelectItem value={type} key={index}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeStatus"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Employee Status</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {employeeActive.map((type, index) => (
                                      <SelectItem value={type} key={index}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Source of Hire</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {hiringPlatforms.map((type, index) => (
                                      <SelectItem value={type} key={index}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="doj"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Date of Joining</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant={"outline"}>
                                    {field.value ? format(field.value, "PPP") : <span>Select a Date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Total Experience</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentIndex === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap mb-3">
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">DOB</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant={"outline"}>
                                    {field.value ? format(field.value, "PPP") : <span>Select a Date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Marital Status</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {maritalOptions.map((type, index) => (
                                      <SelectItem value={type} key={index}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">About</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Gender</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    {genderOptions.map((type, index) => (
                                      <SelectItem value={type} key={index}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="sm:basis-1/3">Expertise</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="flex justify-between mt-6">
              {currentIndex > 0 && (
                <Button type="button" onClick={prevSection}>
                  Previous
                </Button>
              )}
              {currentIndex < sections.length - 1 && (
                <Button type="button" onClick={nextSection}>
                  Next
                </Button>
              )}
              {currentIndex === sections.length - 1 && (
                <Button type="submit">
                  {isSubmitLoading ? (
                    <>
                      <Loader className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}

