import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PerformanceReviewsTab({ employeeData }: { employeeData: any }) {
  const performanceReviews = [
    { id: 1, date: "2023-06-30", rating: "Exceeds Expectations", reviewer: "John Doe" },
    { id: 2, date: "2022-12-31", rating: "Meets Expectations", reviewer: "Jane Smith" },
    { id: 3, date: "2022-06-30", rating: "Exceeds Expectations", reviewer: "John Doe" },
  ]

  const performanceGoals = [
    { id: 1, description: "Complete Advanced React Course", status: "Completed", dueDate: "2023-09-30" },
    { id: 2, description: "Lead a major project initiative", status: "In Progress", dueDate: "2023-12-31" },
    { id: 3, description: "Mentor two junior developers", status: "Not Started", dueDate: "2024-06-30" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance Review History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceGoals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell>{goal.description}</TableCell>
                  <TableCell>{goal.status}</TableCell>
                  <TableCell>{goal.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

