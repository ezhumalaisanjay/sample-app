import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function JobInformationTab({ employeeData }: { employeeData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" value={employeeData.role} readOnly />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={employeeData.department} readOnly />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="squad">Squad</Label>
            <Input id="squad" value={employeeData.squad} readOnly />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" value={employeeData.joinDate} readOnly />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Input id="employmentType" value="Full-time" readOnly />
          </div>
          <div>
            <Label htmlFor="manager">Manager</Label>
            <Input id="manager" value={employeeData.manager} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

