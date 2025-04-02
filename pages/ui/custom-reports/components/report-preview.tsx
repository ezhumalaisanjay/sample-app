"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
// Add imports for aggregation support
import { getDataSourceById } from "./data-source-selector"
import type { ReportConfig, Aggregation } from "./index"

// Mock data for the preview
const mockData = [
  {
    date: "Jan",
    product: "Product A",
    revenue: 4000,
    quantity: 240,
    name: "John",
    email: "john@example.com",
    campaign: "Summer Sale",
    isActive: true,
    totalSpent: 4500,
  },
  {
    date: "Feb",
    product: "Product B",
    revenue: 3000,
    quantity: 198,
    name: "Jane",
    email: "jane@example.com",
    campaign: "Winter Promo",
    isActive: false,
    totalSpent: 2800,
  },
  {
    date: "Mar",
    product: "Product C",
    revenue: 2000,
    quantity: 120,
    name: "Bob",
    email: "bob@example.com",
    campaign: "Spring Event",
    isActive: true,
    totalSpent: 1950,
  },
  {
    date: "Apr",
    product: "Product D",
    revenue: 2780,
    quantity: 158,
    name: "Alice",
    email: "alice@example.com",
    campaign: "Fall Collection",
    isActive: true,
    totalSpent: 3200,
  },
  {
    date: "May",
    product: "Product E",
    revenue: 1890,
    quantity: 142,
    name: "Charlie",
    email: "charlie@example.com",
    campaign: "Holiday Special",
    isActive: false,
    totalSpent: 1200,
  },
]

interface ReportPreviewProps {
  reportConfig: ReportConfig
}

// Update the ReportPreview component to handle aggregations
export default function ReportPreview({ reportConfig }: ReportPreviewProps) {
  // Add this check to prevent server-side rendering errors
  if (!reportConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Loading report configuration...</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">No configuration available</div>
        </CardContent>
      </Card>
    )
  }

  const dataSource = getDataSourceById(reportConfig.dataSourceId)

  if (!dataSource) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Select a data source to preview your report</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">No data source selected</div>
        </CardContent>
      </Card>
    )
  }

  if (reportConfig.selectedFields.length === 0 && reportConfig.aggregations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Select fields or aggregations to preview your report</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">No fields or aggregations selected</div>
        </CardContent>
      </Card>
    )
  }

  // Get field names for display
  const fieldNames = reportConfig.selectedFields.map((fieldId) => {
    const field = dataSource.fields.find((f) => f.id === fieldId)
    return field ? field.name : fieldId
  })

  // Get aggregation names for display
  const aggregationNames = reportConfig.aggregations.map((agg) => agg.alias)

  // Function to apply filters to the data
  const applyFilters = (data: typeof mockData) => {
    if (!reportConfig.filters || reportConfig.filters.length === 0) {
      return data
    }

    return data.filter((row) => {
      // Check if the row passes all filters
      return reportConfig.filters.every((filter) => {
        const fieldValue = row[filter.fieldId as keyof typeof row]
        const filterValue = filter.value

        // Get the field type to determine how to compare values
        const field = dataSource?.fields.find((f) => f.id === filter.fieldId)
        const fieldType = field?.type || "string"

        // Apply the filter based on the operator and field type
        switch (filter.operator) {
          case "equals":
            if (fieldType === "number") {
              return Number(fieldValue) === Number(filterValue)
            } else if (fieldType === "boolean") {
              return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase()
            } else {
              return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase()
            }

          case "contains":
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase())

          case "startsWith":
            return String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase())

          case "endsWith":
            return String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase())

          case "greaterThan":
            return Number(fieldValue) > Number(filterValue)

          case "lessThan":
            return Number(fieldValue) < Number(filterValue)

          case "between":
            // For 'between', we expect filterValue to be a range like "10-20"
            if (typeof filterValue === "string" && filterValue.includes("-")) {
              const [min, max] = filterValue.split("-").map(Number)
              return Number(fieldValue) >= min && Number(fieldValue) <= max
            }
            return true

          case "before":
            // Simple date comparison for the example
            return String(fieldValue) < String(filterValue)

          case "after":
            // Simple date comparison for the example
            return String(fieldValue) > String(filterValue)

          default:
            return true
        }
      })
    })
  }

  // Apply filters to the mock data
  const filteredData = applyFilters(mockData)

  // Apply aggregations to the filtered data
  // Fix the type error by using Record<string, any> for the result object
  const processedData = filteredData.map((row) => {
    // Use Record<string, any> to allow for dynamic property assignment
    const result: Record<string, any> = { ...row }

    // Add calculated aggregation fields
    reportConfig.aggregations.forEach((agg) => {
      const fieldValue = Number(row[agg.fieldId as keyof typeof row] || 0)

      // Now TypeScript knows we can assign to any string key
      result[agg.alias] = fieldValue
    })

    return result
  })

  // Calculate actual aggregations for table view based on filtered data
  const calculateAggregations = () => {
    const result: Record<string, any> = {}

    reportConfig.aggregations.forEach((agg) => {
      const values = filteredData.map((row) => Number(row[agg.fieldId as keyof typeof row] || 0))

      switch (agg.function) {
        case "sum":
          result[agg.alias] = values.reduce((sum, val) => sum + val, 0)
          break
        case "avg":
          result[agg.alias] = values.reduce((sum, val) => sum + val, 0) / values.length
          break
        case "count":
          result[agg.alias] = values.filter((val) => val !== 0).length
          break
        case "min":
          result[agg.alias] = Math.min(...values)
          break
        case "max":
          result[agg.alias] = Math.max(...values)
          break
      }
    })

    return result
  }

  // Render the appropriate visualization
  const renderVisualization = () => {
    switch (reportConfig.visualizationType) {
      case "table":
        return (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  {fieldNames.map((name, index) => (
                    <TableHead key={`field-${index}`}>{name}</TableHead>
                  ))}
                  {aggregationNames.map((name, index) => (
                    <TableHead key={`agg-${index}`} className="font-bold">
                      {name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={fieldNames.length + aggregationNames.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No data matches your filter criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {reportConfig.selectedFields.map((fieldId, colIndex) => (
                        <TableCell key={`field-${colIndex}`}>
                          {row[fieldId as keyof typeof row] !== undefined
                            ? String(row[fieldId as keyof typeof row])
                            : "-"}
                        </TableCell>
                      ))}
                      {reportConfig.aggregations.map((agg, aggIndex) => (
                        <TableCell key={`agg-${aggIndex}`} className="font-medium">
                          {calculateAggregationValue(row, agg)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}

                {/* Add a summary row for aggregations if we have any */}
                {reportConfig.aggregations.length > 0 && filteredData.length > 0 && (
                  <TableRow className="bg-muted/50 font-bold">
                    {reportConfig.selectedFields.map((_, index) =>
                      index === 0 ? (
                        <TableCell key={`summary-${index}`}>Summary</TableCell>
                      ) : (
                        <TableCell key={`summary-${index}`}></TableCell>
                      ),
                    )}
                    {Object.entries(calculateAggregations()).map(([name, value], index) => (
                      <TableCell key={`summary-agg-${index}`}>
                        {typeof value === "number" ? value.toFixed(2) : value}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )

      case "bar":
        return (
          <div className="h-96">
            <ChartContainer
              config={{
                data: {
                  label: "Data",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart data={processedData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey={reportConfig.selectedFields[0]} tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                {reportConfig.aggregations.length > 0 ? (
                  // If we have aggregations, use those for the bar chart
                  reportConfig.aggregations.map((agg, index) => (
                    <Bar key={agg.id} dataKey={agg.alias} radius={4} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))
                ) : (
                  // Otherwise use the second selected field
                  <Bar dataKey={reportConfig.selectedFields[1] || "revenue"} radius={4} fill="var(--color-data)" />
                )}
              </BarChart>
            </ChartContainer>
          </div>
        )

      case "line":
        return (
          <div className="h-96">
            <ChartContainer
              config={{
                data: {
                  label: "Data",
                  color: "hsl(var(--chart-2))",
                },
                data2: {
                  label: "Data 2",
                  color: "hsl(var(--chart-3))",
                },
                data3: {
                  label: "Data 3",
                  color: "hsl(var(--chart-4))",
                },
              }}
            >
              <LineChart data={processedData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey={reportConfig.selectedFields[0]} tickLine={false} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                {reportConfig.aggregations.length > 0 ? (
                  // If we have aggregations, use those for the line chart
                  reportConfig.aggregations.map((agg, index) => (
                    <Line
                      key={agg.id}
                      type="monotone"
                      dataKey={agg.alias}
                      stroke={`var(--color-data${index > 0 ? index + 1 : ""})`}
                      strokeWidth={2}
                    />
                  ))
                ) : (
                  // Otherwise use the second selected field
                  <Line
                    type="monotone"
                    dataKey={reportConfig.selectedFields[1] || "revenue"}
                    stroke="var(--color-data)"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ChartContainer>
          </div>
        )

      case "pie":
        return (
          <div className="h-96">
            <ChartContainer
              config={{
                data1: { label: "Slice 1", color: "hsl(var(--chart-1))" },
                data2: { label: "Slice 2", color: "hsl(var(--chart-2))" },
                data3: { label: "Slice 3", color: "hsl(var(--chart-3))" },
                data4: { label: "Slice 4", color: "hsl(var(--chart-4))" },
                data5: { label: "Slice 5", color: "hsl(var(--chart-5))" },
              }}
            >
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={processedData}
                  dataKey={
                    reportConfig.aggregations.length > 0
                      ? reportConfig.aggregations[0].alias
                      : reportConfig.selectedFields[1] || "revenue"
                  }
                  nameKey={reportConfig.selectedFields[0]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        )
    }
  }

  // Helper function to calculate individual aggregation values
  function calculateAggregationValue(row: any, agg: Aggregation) {
    const value = Number(row[agg.fieldId as keyof typeof row] || 0)

    // For individual rows, we can only show the raw value or count
    switch (agg.function) {
      case "count":
        return value ? 1 : 0
      default:
        return value
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{reportConfig.name}</CardTitle>
        <CardDescription>
          {dataSource.name} • {[...fieldNames, ...aggregationNames].join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reportConfig.filters.length > 0 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {reportConfig.filters.length} filter{reportConfig.filters.length > 1 ? "s" : ""} applied
              {filteredData.length < mockData.length && (
                <span className="ml-1">
                  ({filteredData.length} of {mockData.length} records shown)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {renderVisualization()}
      </CardContent>
    </Card>
  )
}

