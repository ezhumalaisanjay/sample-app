import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function LeaveAttendanceTab({ employeeData }: { employeeData: any }) {
  const leaveBalances = [
    { type: "Annual Leave", balance: 15 },
    { type: "Sick Leave", balance: 10 },
    { type: "Personal Leave", balance: 3 },
  ]

  const leaveHistory = [
    { id: 1, type: "Annual Leave", startDate: "2023-07-01", endDate: "2023-07-05", status: "Approved" },
    { id: 2, type: "Sick Leave", startDate: "2023-08-15", endDate: "2023-08-16", status: "Approved" },
    { id: 3, type: "Personal Leave", startDate: "2023-09-10", endDate: "2023-09-10", status: "Pending" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Leave Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Balance (Days)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveBalances.map((leave) => (
                <TableRow key={leave.type}>
                  <TableCell className="font-medium">{leave.type}</TableCell>
                  <TableCell>{leave.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave Request History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveHistory.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.type}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={leave.status === "Approved" ? "default" : "secondary"}>{leave.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

