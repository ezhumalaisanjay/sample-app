import { Button } from "@/components/ui/button"
import { Calendar, ClipboardList, Star } from "lucide-react"

export default function PerformanceReviewEmail() {
  return (
    <div className="bg-white p-6 md:p-8">
      {/* Email Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
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
        <h1 className="text-xl font-bold text-gray-900">Upcoming Performance Review</h1>
      </div>

      {/* Email Body */}
      <div className="space-y-6">
        <p className="text-gray-700">Dear Sarah Johnson,</p>

        <p className="text-gray-700">
          This is a reminder that your semi-annual performance review is scheduled for next week. Please find the
          details below:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Date & Time</p>
              <p className="text-gray-700">June 22, 2023 at 10:00 AM - 11:30 AM</p>
            </div>
          </div>

          <div className="flex items-start">
            <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p className="text-gray-700">Conference Room 3B or via Zoom (link in calendar invite)</p>
            </div>
          </div>

          <div className="flex items-start">
            <Star className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Reviewer</p>
              <p className="text-gray-700">Michael Chen, Department Manager</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-gray-900">To prepare for your review:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Complete your self-assessment form by June 20</li>
            <li>Prepare a summary of your key achievements since your last review</li>
            <li>Consider your professional development goals for the next 6 months</li>
            <li>Think about areas where you would like additional support or resources</li>
          </ul>
        </div>

        <div className="pt-2">
          <Button className="bg-primary hover:bg-primary/90">Complete Self-Assessment</Button>
        </div>

        <p className="text-gray-700 pt-2">
          Performance reviews are an important opportunity for us to recognize your contributions, provide feedback, and
          support your professional growth. If you need to reschedule or have any questions, please contact your manager
          or HR representative.
        </p>

        <p className="text-gray-700">
          Best regards,
          <br />
          HR Department
          <br />
          Acme Corporation
        </p>
      </div>

      {/* Email Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          This email contains confidential information intended only for the named recipient. If you have questions,
          contact{" "}
          <a href="mailto:hr@acmecorp.com" className="text-primary hover:underline">
            hr@acmecorp.com
          </a>
        </p>
      </div>
    </div>
  )
}

