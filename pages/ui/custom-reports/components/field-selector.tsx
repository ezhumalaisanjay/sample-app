"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getDataSourceById } from "./data-source-selector"
import type { Field } from "./index"

interface FieldSelectorProps {
  dataSourceId: string | null
  selectedFields: string[]
  onFieldsChange: (selectedFields: string[]) => void
}

export default function FieldSelector({ dataSourceId, selectedFields, onFieldsChange }: FieldSelectorProps) {
  // Add null check for selectedFields
  const safeSelectedFields = selectedFields || []

  const dataSource = getDataSourceById(dataSourceId)

  if (!dataSource) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please select a data source first</AlertDescription>
      </Alert>
    )
  }

  const handleFieldToggle = (fieldId: string) => {
    if (safeSelectedFields.includes(fieldId)) {
      onFieldsChange(safeSelectedFields.filter((id) => id !== fieldId))
    } else {
      onFieldsChange([...safeSelectedFields, fieldId])
    }
  }

  const getFieldTypeIcon = (type: Field["type"]) => {
    switch (type) {
      case "string":
        return "Aa"
      case "number":
        return "123"
      case "date":
        return "📅"
      case "boolean":
        return "✓/✗"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Fields</CardTitle>
        <CardDescription>Choose the fields to include in your report</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dataSource.fields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={safeSelectedFields.includes(field.id)}
                onCheckedChange={() => handleFieldToggle(field.id)}
              />
              <Label htmlFor={field.id} className="cursor-pointer flex items-center">
                <span className="font-medium">{field.name}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-muted rounded-full">
                  {getFieldTypeIcon(field.type)} {field.type}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

