import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function PersonalInformationTab({ employeeData }: { employeeData: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullAddress">Full Address</Label>
            <Input id="fullAddress" value="123 Main St, San Francisco, CA 94122" readOnly />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" value={employeeData.phone} readOnly />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" value="Jane Doe - +1 (555) 987-6543" readOnly />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" value="1985-05-15" readOnly />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" value="Female" readOnly />
          </div>
          <div>
            <Label htmlFor="personalEmail">Personal Email</Label>
            <Input id="personalEmail" value="sarah.anderson@personal.com" readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

