"use client"

import { format } from "date-fns"
import { ArrowRight, Download, FileText, Printer } from "lucide-react"
import { jsPDF } from "jspdf"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PayslipDetailsProps {
  payslip?: {
    id: string
    period: string
    date: string
    grossPay: string
    totalDeductions: string
    netPay: string
    ytdGross: string
    ytdDeductions: string
    ytdNet: string
    earnings: {
      description: string
      rate?: string
      hours?: string
      amount: string
    }[]
    deductions: {
      description: string
      type: string
      amount: string
    }[]
  }
}

export default function PayslipDetails({ payslip }: PayslipDetailsProps) {
  const payslipRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  // If payslip is undefined, render a loading state or error message
  if (!payslip) {
    return <div>Loading payslip details...</div>
  }

  // Convert currency strings to numbers for calculations
  const grossPayNum = Number.parseFloat(payslip.grossPay?.replace(/[$,]/g, "") || "0")
  const totalDeductionsNum = Number.parseFloat(payslip.totalDeductions?.replace(/[$,]/g, "") || "0")
  const netPayNum = Number.parseFloat(payslip.netPay?.replace(/[$,]/g, "") || "0")

  // Calculate percentages for visualization
  const deductionsPercentage = grossPayNum > 0 ? (totalDeductionsNum / grossPayNum) * 100 : 0
  const netPayPercentage = grossPayNum > 0 ? (netPayNum / grossPayNum) * 100 : 0

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const doc = new jsPDF()

      // Try to add company logo, but continue if it fails
      try {
        const img = await loadImage("/placeholder.png?height=80&width=80")
        doc.addImage(img, "PNG", 10, 10, 20, 20)
      } catch (imageError) {
        console.warn("Failed to load company logo:", imageError)
        // Continue without the logo
      }

      // Add payslip title
      doc.setFontSize(18)
      doc.text(`Payslip for ${payslip.period}`, 40, 20)

      // Add issue date
      doc.setFontSize(12)
      doc.text(`Issued on ${format(new Date(payslip.date), "MMMM d, yyyy")}`, 40, 30)

      // Add payment summary
      doc.setFontSize(14)
      doc.text("Payment Summary", 10, 50)
      doc.setFontSize(12)
      doc.text(`Gross Pay: ${payslip.grossPay}`, 10, 60)
      doc.text(`Total Deductions: ${payslip.totalDeductions}`, 10, 70)
      doc.text(`Net Pay: ${payslip.netPay}`, 10, 80)

      // Add earnings
      doc.setFontSize(14)
      doc.text("Earnings", 10, 100)
      doc.setFontSize(12)
      payslip.earnings.forEach((earning, index) => {
        doc.text(`${earning.description}: ${earning.amount}`, 10, 110 + index * 10)
      })

      // Add deductions
      doc.setFontSize(14)
      doc.text("Deductions", 10, 160)
      doc.setFontSize(12)
      payslip.deductions.forEach((deduction, index) => {
        doc.text(`${deduction.description}: ${deduction.amount}`, 10, 170 + index * 10)
      })

      // Add YTD summary
      doc.setFontSize(14)
      doc.text("Year-to-Date Summary", 10, 230)
      doc.setFontSize(12)
      doc.text(`YTD Gross: ${payslip.ytdGross}`, 10, 240)
      doc.text(`YTD Deductions: ${payslip.ytdDeductions}`, 10, 250)
      doc.text(`YTD Net Pay: ${payslip.ytdNet}`, 10, 260)

      // Save the PDF
      doc.save(`payslip_${payslip.period.replace(/\s+/g, "_").toLowerCase()}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      let csvContent = "data:text/csv;charset=utf-8,"
      csvContent += "Period,Date,Gross Pay,Total Deductions,Net Pay\n"
      csvContent += `${payslip.period},${payslip.date},${payslip.grossPay},${payslip.totalDeductions},${payslip.netPay}\n\n`

      csvContent += "Earnings\n"
      csvContent += "Description,Rate,Hours,Amount\n"
      payslip.earnings.forEach((earning) => {
        csvContent += `${earning.description},${earning.rate || ""},${earning.hours || ""},${earning.amount}\n`
      })

      csvContent += "\nDeductions\n"
      csvContent += "Description,Type,Amount\n"
      payslip.deductions.forEach((deduction) => {
        csvContent += `${deduction.description},${deduction.type},${deduction.amount}\n`
      })

      csvContent += "\nYear-to-Date Summary\n"
      csvContent += `YTD Gross,${payslip.ytdGross}\n`
      csvContent += `YTD Deductions,${payslip.ytdDeductions}\n`
      csvContent += `YTD Net Pay,${payslip.ytdNet}\n`

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `payslip_${payslip.period.replace(/\s+/g, "_").toLowerCase()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating CSV:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    setIsExporting(true)
    try {
      const jsonContent = JSON.stringify(payslip, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `payslip_${payslip.period.replace(/\s+/g, "_").toLowerCase()}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating JSON:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsExporting(false)
    }
  }

  // Helper function to load an image
  const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = (e) => reject(e)
      img.src = src
    })
  }

  return (
    <Card className="border-2" ref={payslipRef}>
      <CardHeader className="bg-muted/30">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Payslip for {payslip.period}</CardTitle>
              <CardDescription>Issued on {format(new Date(payslip.date), "MMMM d, yyyy")}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" disabled={isExporting}>
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>Export as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid gap-6 rounded-lg border p-4 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Gross Pay</p>
            <p className="text-2xl font-bold">{payslip.grossPay}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Deductions</p>
            <p className="text-2xl font-bold text-destructive">{payslip.totalDeductions}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Net Pay</p>
            <p className="text-2xl font-bold text-primary">{payslip.netPay}</p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Payment Breakdown</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Gross Pay</span>
              <span className="text-sm font-medium">{payslip.grossPay}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Deductions</span>
              <span className="text-sm font-medium text-destructive">{payslip.totalDeductions}</span>
            </div>
            <Progress value={deductionsPercentage} className="h-2 bg-muted [&>div]:bg-destructive" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Net Pay</span>
              <span className="text-sm font-medium text-primary">{payslip.netPay}</span>
            </div>
            <Progress value={netPayPercentage} className="h-2 bg-muted [&>div]:bg-primary" />
          </div>
        </div>

        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
          </TabsList>
          <TabsContent value="earnings" className="space-y-4 pt-4">
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 gap-4 bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-6">Description</div>
                <div className="col-span-3 text-right">Rate/Hours</div>
                <div className="col-span-3 text-right">Amount</div>
              </div>
              <div className="divide-y">
                {payslip.earnings.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-3 text-sm">
                    <div className="col-span-6">
                      <p className="font-medium">{item.description}</p>
                    </div>
                    <div className="col-span-3 text-right text-muted-foreground">
                      {item.hours ? `${item.hours} hrs @ ${item.rate}` : item.rate || "-"}
                    </div>
                    <div className="col-span-3 text-right font-medium">{item.amount}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-12 gap-4 border-t bg-muted/50 p-3">
                <div className="col-span-9 text-sm font-medium">Total Earnings</div>
                <div className="col-span-3 text-right text-base font-bold">{payslip.grossPay}</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="deductions" className="space-y-4 pt-4">
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 gap-4 bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-6">Description</div>
                <div className="col-span-3 text-right">Type</div>
                <div className="col-span-3 text-right">Amount</div>
              </div>
              <div className="divide-y">
                {payslip.deductions.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-3 text-sm">
                    <div className="col-span-6">
                      <p className="font-medium">{item.description}</p>
                    </div>
                    <div className="col-span-3 text-right text-muted-foreground">{item.type}</div>
                    <div className="col-span-3 text-right font-medium">{item.amount}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-12 gap-4 border-t bg-muted/50 p-3">
                <div className="col-span-9 text-sm font-medium">Total Deductions</div>
                <div className="col-span-3 text-right text-base font-bold">{payslip.totalDeductions}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 rounded-lg border bg-muted/30 p-4">
          <h3 className="mb-4 text-sm font-medium">Year-to-Date Summary</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <div className="text-sm">
                <p className="text-muted-foreground">YTD Gross</p>
                <p className="text-lg font-bold">{payslip.ytdGross}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <div className="text-sm">
                <p className="text-muted-foreground">YTD Deductions</p>
                <p className="text-lg font-bold">{payslip.ytdDeductions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <div className="text-sm">
                <p className="text-muted-foreground">YTD Net Pay</p>
                <p className="text-lg font-bold">{payslip.ytdNet}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <p>If you have any questions about this payslip, please contact the HR department</p>
          <Button variant="link" className="h-auto p-0 text-sm">
            Contact HR <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

