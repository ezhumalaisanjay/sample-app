import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

export default function LeaveRequestEmail() {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      {/* Email Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="font-bold">AC</span>
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-gray-900">Acme Corporation</h2>
              <p className="text-sm text-gray-500">HR Department</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">June 15, 2023</p>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Leave Request Notification</h1>
      </div>

      {/* Email Body */}
      <div className="space-y-4 sm:space-y-6">
        <p className="text-gray-700">Dear Manager,</p>

        <p className="text-gray-700">
          A leave request has been submitted by <span className="font-medium">John Doe</span> and requires your
          approval.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Employee</p>
              <p className="text-gray-700">John Doe (Engineering Department)</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Leave Period</p>
              <p className="text-gray-700">July 10, 2023 - July 14, 2023 (5 working days)</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Leave Type</p>
              <p className="text-gray-700">Annual Leave</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="font-medium text-gray-900">Reason</p>
            <p className="text-gray-700">Family vacation</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Approve Request</Button>
          <Button variant="outline" className="border-gray-300 w-full sm:w-auto">
            Deny Request
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto">
            Request More Information
          </Button>
        </div>

        <p className="text-gray-700 pt-2">
          Please review this request at your earliest convenience. If you have any questions, please contact the HR
          department.
        </p>

        <p className="text-gray-700">
          Thank you,
          <br />
          HR Department
          <br />
          Acme Corporation
        </p>
      </div>

      {/* Email Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          This is an automated message from the Acme HR System. Please do not reply directly to this email. For
          assistance, contact{" "}
          <a href="mailto:hr@acmecorp.com" className="text-primary hover:underline">
            hr@acmecorp.com
          </a>
        </p>
      </div>
    </div>
  )
}

