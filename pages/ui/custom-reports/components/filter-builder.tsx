"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { getDataSourceById } from "./data-source-selector"
import type { Filter } from "./index"

interface FilterBuilderProps {
  dataSourceId: string | null
  filters: Filter[]
  onFiltersChange: (filters: Filter[]) => void
}

export default function FilterBuilder({ dataSourceId, filters, onFiltersChange }: FilterBuilderProps) {
  // Add null check for filters
  const safeFilters = filters || []

  const dataSource = getDataSourceById(dataSourceId)

  if (!dataSource) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Please select a data source first</AlertDescription>
      </Alert>
    )
  }

  const addFilter = () => {
    const newFilter: Filter = {
      id: `filter-${Date.now()}`,
      fieldId: dataSource.fields[0].id,
      operator: "equals",
      value: "",
    }
    onFiltersChange([...safeFilters, newFilter])
  }

  // Update other functions to use safeFilters instead of filters
  const updateFilter = (id: string, updates: Partial<Filter>) => {
    onFiltersChange(safeFilters.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)))
  }

  const removeFilter = (id: string) => {
    onFiltersChange(safeFilters.filter((filter) => filter.id !== id))
  }

  const getOperatorsForFieldType = (fieldType: string) => {
    switch (fieldType) {
      case "string":
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
          { value: "startsWith", label: "Starts with" },
          { value: "endsWith", label: "Ends with" },
        ]
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "Greater than" },
          { value: "lessThan", label: "Less than" },
          { value: "between", label: "Between" },
        ]
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "before", label: "Before" },
          { value: "after", label: "After" },
          { value: "between", label: "Between" },
        ]
      case "boolean":
        return [{ value: "equals", label: "Equals" }]
      default:
        return []
    }
  }

  const getFieldById = (fieldId: string) => {
    return dataSource.fields.find((field) => field.id === fieldId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Filters</CardTitle>
        <CardDescription>Define conditions to filter your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safeFilters.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No filters added yet. Add a filter to narrow down your results.
            </div>
          ) : (
            safeFilters.map((filter) => {
              const field = getFieldById(filter.fieldId)
              const operators = field ? getOperatorsForFieldType(field.type) : []

              return (
                <div key={filter.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select
                      value={filter.fieldId}
                      onValueChange={(value) => updateFilter(filter.id, { fieldId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSource.fields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Input
                      value={filter.value.toString()}
                      onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                      placeholder="Value"
                    />
                  </div>

                  <div className="col-span-1">
                    <Button variant="ghost" size="icon" onClick={() => removeFilter(filter.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}

          <Button variant="outline" size="sm" className="mt-2" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

