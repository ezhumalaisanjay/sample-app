"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

const payrollSettingsSchema = z.object({
  federalTaxRate: z.coerce.number().min(0).max(100),
  stateTaxRate: z.coerce.number().min(0).max(100),
  socialSecurityRate: z.coerce.number().min(0).max(100),
  medicareRate: z.coerce.number().min(0).max(100),
  payPeriod: z.enum(["weekly", "biweekly", "semimonthly", "monthly"]),
  payDay: z.coerce.number().min(1).max(31),
  defaultHourlyRate: z.coerce.number().min(0),
  overtimeRate: z.coerce.number().min(1),
})

type PayrollSettingsValues = z.infer<typeof payrollSettingsSchema>

const defaultValues: Partial<PayrollSettingsValues> = {
  federalTaxRate: 15,
  stateTaxRate: 5,
  socialSecurityRate: 6.2,
  medicareRate: 1.45,
  payPeriod: "biweekly",
  payDay: 15,
  defaultHourlyRate: 15,
  overtimeRate: 1.5,
}

export default function PayrollSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<PayrollSettingsValues>({
    resolver: zodResolver(payrollSettingsSchema),
    defaultValues,
  })

  function onSubmit(data: PayrollSettingsValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      console.log(data)
      toast({
        title: "Settings saved",
        description: "Your payroll settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-lg font-medium">Payroll Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your company&apos;s payroll settings and tax rates.</p>
        </div>
        <Separator />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="federalTaxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Federal Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The federal income tax rate applied to employee wages.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateTaxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The state income tax rate applied to employee wages.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialSecurityRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Security Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The Social Security tax rate (usually 6.2% for employees).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicareRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicare Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The Medicare tax rate (usually 1.45% for employees).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="payPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pay period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How often employees are paid.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Day</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={31} {...field} />
                </FormControl>
                <FormDescription>The day of the month when employees are paid (1-31).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultHourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The default hourly rate for new employees.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overtimeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overtime Rate Multiplier</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>The multiplier for overtime pay (e.g., 1.5 for time-and-a-half).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

