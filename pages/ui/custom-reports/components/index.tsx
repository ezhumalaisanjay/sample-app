"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataSourceSelector from "./data-source-selector"
import FieldSelector from "./field-selector"
import FilterBuilder from "./filter-builder"
import VisualizationSelector from "./visualization-selector"
import ReportPreview from "./report-preview"
import { Download, Save, Plus, Trash2, AlertCircle, PlusCircle } from "lucide-react"
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
  SelectSeparator,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, FileSpreadsheet, FileDown, ChevronDown } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export type DataSource = {
  id: string
  name: string
  fields: Field[]
}

export type Field = {
  id: string
  name: string
  type: "string" | "number" | "date" | "boolean"
}

export type Filter = {
  id: string
  fieldId: string
  operator: string
  value: string | number | boolean | Date
}

export type VisualizationType = "table" | "bar" | "line" | "pie"

// Update the ReportConfig type to include aggregations
export type Aggregation = {
  id: string
  fieldId: string
  function: "sum" | "avg" | "count" | "min" | "max"
  alias: string
}

export type ReportConfig = {
  id: string // Add an ID field for easier template management
  name: string
  dataSourceId: string | null
  selectedFields: string[]
  filters: Filter[]
  aggregations: Aggregation[]
  visualizationType: VisualizationType
}

// Update the defaultReportConfig to include empty aggregations array and an ID
const defaultReportConfig: ReportConfig = {
  id: `template-${Date.now()}`,
  name: "New Report",
  dataSourceId: null,
  selectedFields: [],
  filters: [],
  aggregations: [],
  visualizationType: "table",
}

// Add a templates state to store saved report templates
export default function ReportBuilder() {
  // Initialize with the default config
  const [reportConfig, setReportConfig] = useState<ReportConfig>(defaultReportConfig)
  const [templates, setTemplates] = useState<ReportConfig[]>([])
  const [templateName, setTemplateName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const { toast } = useToast() // Use the toast hook
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("new")
  const [isExporting, setIsExporting] = useState(false)

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("reportTemplates")
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates))
      } catch (e) {
        console.error("Failed to parse saved templates", e)
        toast({
          title: "Error",
          description: "Failed to load saved templates",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  const updateReportConfig = (updates: Partial<ReportConfig>) => {
    setReportConfig((prev) => ({ ...prev, ...updates }))
  }

  const handleSaveReport = () => {
    setTemplateName(reportConfig.name)
    setShowSaveDialog(true)
  }

  const handleSaveTemplate = () => {
    if (!templateName) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      })
      return
    }

    const newTemplate = {
      ...reportConfig,
      id: reportConfig.id,
      name: templateName,
    }

    // Check if we're updating an existing template or creating a new one
    const existingTemplateIndex = templates.findIndex((t) => t.id === reportConfig.id)
    let updatedTemplates: ReportConfig[]

    if (existingTemplateIndex >= 0) {
      // Update existing template
      updatedTemplates = [...templates]
      updatedTemplates[existingTemplateIndex] = newTemplate
      toast({
        title: "Success",
        description: "Template updated successfully",
      })
    } else {
      // Create new template
      updatedTemplates = [...templates, newTemplate]
      toast({
        title: "Success",
        description: "New template saved successfully",
      })
    }

    setTemplates(updatedTemplates)
    localStorage.setItem("reportTemplates", JSON.stringify(updatedTemplates))
    setShowSaveDialog(false)
    setTemplateName("")
    setSelectedTemplateId(newTemplate.id)
  }

  const handleLoadTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)

    if (templateId === "new") {
      // Create a new template
      setReportConfig({
        ...defaultReportConfig,
        id: `template-${Date.now()}`,
      })
      toast({
        title: "New Template",
        description: "Started a new report template",
      })
      return
    }

    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setReportConfig(template)
      toast({
        title: "Template Loaded",
        description: `Loaded template: ${template.name}`,
      })
    }
  }

  // Fix the handleDeleteTemplate function to properly delete only the selected template
  const handleDeleteTemplate = (e: React.MouseEvent, templateId: string) => {
    // Stop event propagation to prevent the template from being selected
    e.preventDefault()
    e.stopPropagation()

    console.log("Deleting template with ID:", templateId)

    // Create a new array without the deleted template
    const updatedTemplates = templates.filter((t) => t.id !== templateId)

    console.log("Templates before:", templates.length)
    console.log("Templates after:", updatedTemplates.length)

    // Update state and localStorage
    setTemplates(updatedTemplates)
    localStorage.setItem("reportTemplates", JSON.stringify(updatedTemplates))

    // If the current template was deleted, reset to a new template
    if (reportConfig.id === templateId) {
      const newTemplateId = `template-${Date.now()}`
      setReportConfig({
        ...defaultReportConfig,
        id: newTemplateId,
      })
      setSelectedTemplateId("new")
    }

    toast({
      title: "Template Deleted",
      description: "The template has been deleted",
    })
  }

  // Update the handleExportPDF function to use the local exportToPDF function
  const handleExportPDF = async () => {
    if (!reportConfig.dataSourceId || reportConfig.selectedFields.length === 0) {
      toast({
        title: "Export Failed",
        description: "Please select a data source and at least one field",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      const success = await exportToPDF()
      if (success) {
        toast({
          title: "PDF Export",
          description: "Your report has been exported as PDF",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("PDF export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report to PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Update the handleExportExcel function to use the local exportToExcel function
  const handleExportExcel = async () => {
    if (!reportConfig.dataSourceId || reportConfig.selectedFields.length === 0) {
      toast({
        title: "Export Failed",
        description: "Please select a data source and at least one field",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      const success = await exportToExcel()
      if (success) {
        toast({
          title: "Excel Export",
          description: "Your report has been exported as Excel spreadsheet",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("Excel export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report to Excel",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Update the handleExportCSV function to use the local exportToCSV function
  const handleExportCSV = async () => {
    if (!reportConfig.dataSourceId || reportConfig.selectedFields.length === 0) {
      toast({
        title: "Export Failed",
        description: "Please select a data source and at least one field",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      const success = exportToCSV()
      if (success) {
        toast({
          title: "CSV Export",
          description: "Your report has been exported as CSV file",
        })
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("CSV export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your report to CSV",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Add the AggregationsBuilder component inside the ReportBuilder component
  function AggregationsBuilder() {
    // Use the imported getDataSourceById instead of the local one
    const dataSource = reportConfig.dataSourceId
      ? // Mock data sources for the example
        {
          id: reportConfig.dataSourceId,
          name: reportConfig.dataSourceId === "sales" ? "Sales Data" : "Customer Data",
          fields: [
            { id: "date", name: "Date", type: "date" },
            { id: "product", name: "Product", type: "string" },
            { id: "revenue", name: "Revenue", type: "number" },
            { id: "quantity", name: "Quantity", type: "number" },
          ],
        }
      : null

    if (!dataSource) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please select a data source first</AlertDescription>
        </Alert>
      )
    }

    const numericFields = dataSource.fields.filter((field) => field.type === "number")

    if (numericFields.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No numeric fields available for aggregation</AlertDescription>
        </Alert>
      )
    }

    const addAggregation = () => {
      const newAggregation: Aggregation = {
        id: `agg-${Date.now()}`,
        fieldId: numericFields[0].id,
        function: "sum",
        alias: `Sum of ${numericFields[0].name}`,
      }
      updateReportConfig({
        aggregations: [...reportConfig.aggregations, newAggregation],
      })
    }

    const updateAggregation = (id: string, updates: Partial<Aggregation>) => {
      updateReportConfig({
        aggregations: reportConfig.aggregations.map((agg) => (agg.id === id ? { ...agg, ...updates } : agg)),
      })
    }

    const removeAggregation = (id: string) => {
      updateReportConfig({
        aggregations: reportConfig.aggregations.filter((agg) => agg.id !== id),
      })
    }

    const getFieldById = (fieldId: string) => {
      return dataSource.fields.find((field) => field.id === fieldId)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Aggregations</CardTitle>
          <CardDescription>Create calculations based on your numeric fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportConfig.aggregations.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No aggregations added yet. Add an aggregation to calculate values.
              </div>
            ) : (
              reportConfig.aggregations.map((agg) => {
                const field = getFieldById(agg.fieldId)

                return (
                  <div key={agg.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Select
                        value={agg.function}
                        onValueChange={(value) =>
                          updateAggregation(agg.id, {
                            function: value as "sum" | "avg" | "count" | "min" | "max",
                            alias: `${value.charAt(0).toUpperCase() + value.slice(1)} of ${field?.name || ""}`,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="avg">Average</SelectItem>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="min">Minimum</SelectItem>
                          <SelectItem value="max">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-3">
                      <Select
                        value={agg.fieldId}
                        onValueChange={(value) => {
                          const selectedField = getFieldById(value)
                          updateAggregation(agg.id, {
                            fieldId: value,
                            alias: `${agg.function.charAt(0).toUpperCase() + agg.function.slice(1)} of ${selectedField?.name || ""}`,
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Field" />
                        </SelectTrigger>
                        <SelectContent>
                          {numericFields.map((field) => (
                            <SelectItem key={field.id} value={field.id}>
                              {field.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-5">
                      <Input
                        value={agg.alias}
                        onChange={(e) => updateAggregation(agg.id, { alias: e.target.value })}
                        placeholder="Display name"
                      />
                    </div>

                    <div className="col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => removeAggregation(agg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}

            <Button variant="outline" size="sm" className="mt-2" onClick={addAggregation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Aggregation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Custom template item component with delete button
  const TemplateItem = ({ template }: { template: ReportConfig }) => {
    return (
      <div
        className="flex items-center justify-between w-full px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => handleLoadTemplate(template.id)}
      >
        <span className="truncate">{template.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => handleDeleteTemplate(e, template.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  /**
   * Helper function to get data source by ID
   */
  const getDataSourceById = (dataSourceId: string | null) => {
    // Mock data sources for the example
    const mockDataSources = [
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
          { id: "name", name: "Name", type: "string" },
          { id: "email", name: "Email", type: "string" },
          { id: "campaign", name: "Campaign", type: "string" },
          { id: "isActive", name: "Is Active", type: "boolean" },
          { id: "totalSpent", name: "Total Spent", type: "number" },
        ],
      },
    ]

    return mockDataSources.find((ds) => ds.id === dataSourceId) || null
  }

  /**
   * Helper function to get the formatted data for export
   */
  const getFormattedData = () => {
    // Get data source and fields
    const dataSource = getDataSourceById(reportConfig.dataSourceId)
    if (!dataSource) return { headers: [], rows: [] }

    // Get field names for headers
    const headers = reportConfig.selectedFields.map((fieldId) => {
      const field = dataSource.fields.find((f) => f.id === fieldId)
      return field ? field.name : fieldId
    })

    // Add aggregation headers if any
    const aggregationHeaders = reportConfig.aggregations.map((agg) => agg.alias)
    const allHeaders = [...headers, ...aggregationHeaders]

    // Mock data for the example - in a real app, this would come from your data source
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

    // Apply filters (simplified version)
    const filteredData =
      reportConfig.filters.length > 0
        ? mockData.filter((row) => {
            return reportConfig.filters.every((filter) => {
              const fieldValue = row[filter.fieldId as keyof typeof row]
              const filterValue = filter.value

              // Simple equality check for the example
              return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase())
            })
          })
        : mockData

    // Format rows for export
    const rows = filteredData.map((row) => {
      const rowData: Record<string, any> = {}

      // Add selected fields
      reportConfig.selectedFields.forEach((fieldId) => {
        const field = dataSource.fields.find((f) => f.id === fieldId)
        const fieldName = field ? field.name : fieldId
        rowData[fieldName] = row[fieldId as keyof typeof row]
      })

      // Add aggregations
      reportConfig.aggregations.forEach((agg) => {
        const value = Number(row[agg.fieldId as keyof typeof row] || 0)
        rowData[agg.alias] = value
      })

      return rowData
    })

    return { headers: allHeaders, rows }
  }

  /**
   * Exports report data as CSV
   */
  const exportToCSV = () => {
    try {
      const { headers, rows } = getFormattedData()
      if (headers.length === 0 || rows.length === 0) {
        throw new Error("No data to export")
      }

      // Create CSV header row
      let csvContent = headers.join(",") + "\n"

      // Add data rows
      rows.forEach((row) => {
        const rowValues = headers.map((header) => {
          const value = row[header]
          // Handle special characters and commas in CSV
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value !== undefined ? value : ""
        })
        csvContent += rowValues.join(",") + "\n"
      })

      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${reportConfig.name || "report"}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return true
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      return false
    }
  }

  /**
   * Exports report data as Excel
   * Uses the SheetJS library (xlsx)
   */
  const exportToExcel = async () => {
    try {
      // Dynamically import the xlsx library
      const XLSX = await import("xlsx")

      const { headers, rows } = getFormattedData()
      if (headers.length === 0 || rows.length === 0) {
        throw new Error("No data to export")
      }

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create a blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${reportConfig.name || "report"}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return true
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      return false
    }
  }

  /**
   * Exports report data as PDF
   * Uses the jsPDF library with jsPDF-AutoTable plugin
   */
  const exportToPDF = async () => {
    try {
      // Dynamically import the jsPDF and jspdf-autotable libraries
      const jsPDF = (await import("jspdf")).default
      const autoTable = (await import("jspdf-autotable")).default

      const { headers, rows } = getFormattedData()
      if (headers.length === 0 || rows.length === 0) {
        throw new Error("No data to export")
      }

      // Create PDF document
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(16)
      doc.text(reportConfig.name || "Report", 14, 15)

      // Add timestamp
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22)

      // Format data for autotable
      const tableRows = rows.map((row) => headers.map((header) => row[header]))

      // Add table
      autoTable(doc, {
        head: [headers],
        body: tableRows,
        startY: 30,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [66, 66, 66], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      })

      // Save PDF
      doc.save(`${reportConfig.name || "report"}.pdf`)

      return true
    } catch (error) {
      console.error("Error exporting to PDF:", error)
      return false
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="lg:col-span-2">
        {/* Enhanced template selector with New Template option and delete functionality */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedTemplateId} onValueChange={handleLoadTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select or create template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="new" className="font-medium text-primary">
                    <div className="flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Template
                    </div>
                  </SelectItem>

                  {templates.length > 0 && <SelectSeparator />}

                  {templates.length > 0 && <SelectLabel>Saved Templates</SelectLabel>}

                  {templates.map((template) => (
                    <div key={template.id} className="relative group">
                      <SelectItem value={template.id} className="pr-8">
                        {template.name}
                        <div
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteTemplate(e, template.id)
                          }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </SelectItem>
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Input
            value={reportConfig.name}
            onChange={(e) => updateReportConfig({ name: e.target.value })}
            placeholder="Report name"
            className="flex-1"
          />
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="data-source" className="w-full">
              <ScrollArea className="md:w-full w-[72vw]">
                <TabsList className="lg:grid lg:grid-cols-5 flex justify-evenly lg:justify-normal lg:mb-6">
                  <TabsTrigger value="data-source">Data Source</TabsTrigger>
                  <TabsTrigger value="fields">Fields</TabsTrigger>
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                  <TabsTrigger value="aggregations">Aggregations</TabsTrigger>
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <TabsContent value="data-source">
                <DataSourceSelector
                  selectedDataSourceId={reportConfig.dataSourceId}
                  onSelect={(dataSourceId) => updateReportConfig({ dataSourceId })}
                />
              </TabsContent>

              <TabsContent value="fields">
                <FieldSelector
                  dataSourceId={reportConfig.dataSourceId}
                  selectedFields={reportConfig.selectedFields}
                  onFieldsChange={(selectedFields) => updateReportConfig({ selectedFields })}
                />
              </TabsContent>

              <TabsContent value="filters">
                <FilterBuilder
                  dataSourceId={reportConfig.dataSourceId}
                  filters={reportConfig.filters}
                  onFiltersChange={(filters) => updateReportConfig({ filters })}
                />
              </TabsContent>

              <TabsContent value="aggregations">
                <AggregationsBuilder />
              </TabsContent>

              <TabsContent value="visualization">
                <VisualizationSelector
                  visualizationType={reportConfig.visualizationType}
                  onVisualizationChange={(visualizationType) => updateReportConfig({ visualizationType })}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1" disabled={isExporting}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                <FileDown className="h-4 w-4 mr-2" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleSaveReport}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>

        {/* Add save template dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Save Report Template</CardTitle>
                <CardDescription>Save this report configuration as a reusable template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="My Custom Report"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 p-6 pt-0">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <ReportPreview reportConfig={reportConfig} />
      </div>
    </div>
  )
}

