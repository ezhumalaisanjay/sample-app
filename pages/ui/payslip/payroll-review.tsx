"use client"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { Check, X, ChevronDown, ChevronUp, Download } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface Employee {
  id: string
  name: string
  position: string
  regularHours: number
  overtimeHours: number
  regularPay: number
  overtimePay: number
  totalPay: number
  taxes: number
  netPay: number
}

interface PayrollReviewProps {
  payrollPeriod?: string
  payrollDate?: string
  employees?: Employee[]
  totalGrossPay?: number
  totalTaxes?: number
  totalNetPay?: number
}

export default function PayrollReview({
  payrollPeriod = "N/A",
  payrollDate = "",
  employees = [],
  totalGrossPay = 0,
  totalTaxes = 0,
  totalNetPay = 0,
}: PayrollReviewProps) {
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const toggleEmployeeDetails = (employeeId: string) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId)
  }

  const handleApprove = () => {
    setIsApproving(true)
    // Simulate API call
    setTimeout(() => {
      setIsApproving(false)
      toast({
        title: "Payroll Approved",
        description: "The payroll has been approved successfully.",
      })
    }, 1500)
  }

  const handleReject = () => {
    setIsRejecting(true)
    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false)
      toast({
        title: "Payroll Rejected",
        description: "The payroll has been rejected. Please review and make necessary changes.",
      })
    }, 1500)
  }

  const handleDownload = () => {
    setIsDownloading(true)

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text(`Payroll Report - ${payrollPeriod}`, 14, 20)

    // Add payroll date
    doc.setFontSize(12)
    const formattedDate = formatDate(payrollDate)
    doc.text(`Pay Date: ${formattedDate}`, 14, 30)

    // Add summary
    doc.setFontSize(14)
    doc.text("Payroll Summary", 14, 40)
    autoTable(doc, {
      startY: 45,
      head: [["Total Gross Pay", "Total Taxes", "Total Net Pay"]],
      body: [[`$${totalGrossPay.toFixed(2)}`, `$${totalTaxes.toFixed(2)}`, `$${totalNetPay.toFixed(2)}`]],
    })

    // Add employee details
    doc.setFontSize(14)
    autoTable(doc, {
      head: [
        [
          "Name",
          "Position",
          "Regular Hours",
          "Overtime Hours",
          "Regular Pay",
          "Overtime Pay",
          "Total Pay",
          "Taxes",
          "Net Pay",
        ],
      ],
      body: employees.map((employee) => [
        employee.name,
        employee.position,
        employee.regularHours.toString(),
        employee.overtimeHours.toString(),
        `$${employee.regularPay.toFixed(2)}`,
        `$${employee.overtimePay.toFixed(2)}`,
        `$${employee.totalPay.toFixed(2)}`,
        `$${employee.taxes.toFixed(2)}`,
        `$${employee.netPay.toFixed(2)}`,
      ]),
    })

    // Save the PDF
    doc.save(`payroll_report_${payrollPeriod.replace(/\s+/g, "_").toLowerCase()}.pdf`)

    setIsDownloading(false)
    toast({
      title: "Report Downloaded",
      description: "The payroll report has been downloaded successfully.",
    })
  }

  // Helper function to safely format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A"
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, "MMMM d, yyyy")
      }
      return "Invalid Date"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  // Helper function to safely format currency
  const formatCurrency = (amount?: number): string => {
    return amount !== undefined ? `$${amount.toFixed(2)}` : "N/A"
  }

  if (employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Review</CardTitle>
          <CardDescription>No payroll data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Review</CardTitle>
        <CardDescription>
          Review and approve payroll for {payrollPeriod} (Pay Date: {formatDate(payrollDate)})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Total Gross Pay</h4>
              <p className="text-2xl font-bold">{formatCurrency(totalGrossPay)}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Total Taxes</h4>
              <p className="text-2xl font-bold">{formatCurrency(totalTaxes)}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Total Net Pay</h4>
              <p className="text-2xl font-bold">{formatCurrency(totalNetPay)}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Taxes</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <>
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.totalPay)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.taxes)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.netPay)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toggleEmployeeDetails(employee.id)}>
                        {expandedEmployee === employee.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedEmployee === employee.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="grid gap-4 py-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Regular Hours</p>
                            <p>{employee.regularHours}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Overtime Hours</p>
                            <p>{employee.overtimeHours}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Regular Pay</p>
                            <p>{formatCurrency(employee.regularPay)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Overtime Pay</p>
                            <p>{formatCurrency(employee.overtimePay)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Pay</p>
                            <p>{formatCurrency(employee.totalPay)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Taxes</p>
                            <p>{formatCurrency(employee.taxes)}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            "Downloading..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </>
          )}
        </Button>
        <div className="space-x-2">
          <Button variant="destructive" onClick={handleReject} disabled={isApproving || isRejecting}>
            {isRejecting ? (
              "Rejecting..."
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
          <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
            {isApproving ? (
              "Approving..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

