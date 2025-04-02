"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { DataSource } from "./index"

// Mock data sources - in a real app, these would come from an API
const dataSources: DataSource[] = [
  {
    id: "sales",
    name: "Sales Data",
    fields: [
      { id: "date", name: "Date", type: "date" },
      { id: "product", name: "Product", type: "string" },
      { id: "revenue", name: "Revenue", type: "number" },
      { id: "quantity", name: "Quantity", type: "number" },
    ],
  },
  {
    id: "customers",
    name: "Customer Data",
    fields: [
      { id: "name", name: "Customer Name", type: "string" },
      { id: "email", name: "Email", type: "string" },
      { id: "signupDate", name: "Signup Date", type: "date" },
      { id: "isActive", name: "Is Active", type: "boolean" },
      // Add a numeric field to customer data for aggregation testing
      { id: "totalSpent", name: "Total Spent", type: "number" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Campaigns",
    fields: [
      { id: "campaign", name: "Campaign Name", type: "string" },
      { id: "startDate", name: "Start Date", type: "date" },
      { id: "endDate", name: "End Date", type: "date" },
      { id: "budget", name: "Budget", type: "number" },
      { id: "conversions", name: "Conversions", type: "number" },
    ],
  },
]

interface DataSourceSelectorProps {
  selectedDataSourceId: string | null
  onSelect: (dataSourceId: string) => void
}

export default function DataSourceSelector({ selectedDataSourceId, onSelect }: DataSourceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Data Source</CardTitle>
        <CardDescription>Choose the data source for your report</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedDataSourceId || ""} onValueChange={onSelect} className="space-y-4">
          {dataSources.map((source) => (
            <div key={source.id} className="flex items-center space-x-2">
              <RadioGroupItem value={source.id} id={source.id} />
              <Label htmlFor={source.id} className="cursor-pointer">
                <div className="font-medium">{source.name}</div>
                <div className="text-sm text-muted-foreground">{source.fields.length} available fields</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

// Export for use in other components
export const getDataSources = () => dataSources
export const getDataSourceById = (id: string | null) => (id ? dataSources.find((source) => source.id === id) : null)

