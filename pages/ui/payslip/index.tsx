import PayslipDetails from "./payslip-details"
import PayrollSettings from "./payroll-settings"
import PayrollReview from "./payroll-review"
import { payslips } from "@/data/payslips"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyLogo from "@/pages/images/squadLogo.png"
import Image from "next/image"

// Sample data for PayrollReview component
const samplePayrollData = {
  payrollPeriod: "June 1-15, 2023",
  payrollDate: "2023-06-20",
  employees: [
    {
      id: "1",
      name: "John Doe",
      position: "Software Engineer",
      regularHours: 80,
      overtimeHours: 5,
      regularPay: 4000,
      overtimePay: 375,
      totalPay: 4375,
      taxes: 875,
      netPay: 3500,
    },
    {
      id: "2",
      name: "Jane Smith",
      position: "Project Manager",
      regularHours: 80,
      overtimeHours: 0,
      regularPay: 4800,
      overtimePay: 0,
      totalPay: 4800,
      taxes: 960,
      netPay: 3840,
    },
    {
      id: "3",
      name: "Bob Johnson",
      position: "Designer",
      regularHours: 80,
      overtimeHours: 2,
      regularPay: 3600,
      overtimePay: 135,
      totalPay: 3735,
      taxes: 747,
      netPay: 2988,
    },
  ],
  totalGrossPay: 12910,
  totalTaxes: 2582,
  totalNetPay: 10328,
}

export default function PayslipPage() {
  // Use the first payslip as an example
  const payslip = payslips[0]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex flex-col h-16 gap-3 px-4">
          <div className="flex items-center gap-2">
            <Image src={CompanyLogo} alt="Company logo" width={100} height={100} />
          </div>
          <h1 className="text-xl font-semibold">Payroll Management</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="payslip" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="payslip" className="flex-1">
                Payslip Viewer
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                Payroll Settings
              </TabsTrigger>
              <TabsTrigger value="review" className="flex-1">
                Payroll Review
              </TabsTrigger>
            </TabsList>
            <TabsContent value="payslip" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Payslip Details</h2>
                <p className="text-muted-foreground">View your detailed payslip information below</p>
              </div>
              <PayslipDetails payslip={payslip} />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Payroll Settings</h2>
                <p className="text-muted-foreground">Configure your company&apos;s payroll settings and tax rates</p>
              </div>
              <PayrollSettings />
            </TabsContent>
            <TabsContent value="review" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Payroll Review</h2>
                <p className="text-muted-foreground">Review and approve payroll for the current period</p>
              </div>
              <PayrollReview {...samplePayrollData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

