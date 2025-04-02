import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function CompensationBenefitsTab({ employeeData }: { employeeData: any }) {
  const salaryHistory = [
    { id: 1, effectiveDate: "2023-01-01", amount: "$120,000", reason: "Annual Increase" },
    { id: 2, effectiveDate: "2022-01-01", amount: "$110,000", reason: "Annual Increase" },
    { id: 3, effectiveDate: "2021-03-15", amount: "$100,000", reason: "Initial Salary" },
  ]

  const benefits = [
    { id: 1, name: "Health Insurance", provider: "BlueCross BlueShield", status: "Enrolled" },
    { id: 2, name: "Dental Insurance", provider: "Delta Dental", status: "Enrolled" },
    { id: 3, name: "401(k)", provider: "Fidelity", status: "Enrolled" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Effective Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryHistory.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.effectiveDate}</TableCell>
                  <TableCell>{salary.amount}</TableCell>
                  <TableCell>{salary.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Benefit</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.map((benefit) => (
                <TableRow key={benefit.id}>
                  <TableCell>{benefit.name}</TableCell>
                  <TableCell>{benefit.provider}</TableCell>
                  <TableCell>{benefit.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline">View Latest Pay Stub</Button>
    </div>
  )
}

