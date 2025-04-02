import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, HelpCircle, Users } from "lucide-react"

export default function WelcomeEmail() {
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
        <h1 className="text-xl font-bold text-gray-900">Welcome to Acme Corporation!</h1>
      </div>

      {/* Email Body */}
      <div className="space-y-6">
        <p className="text-gray-700">Dear Alex Morgan,</p>

        <p className="text-gray-700">
          Welcome to the Acme Corporation team! We re thrilled to have you join us as a{" "}
          <span className="font-medium">Senior Product Designer</span>. Your first day is scheduled for{" "}
          <span className="font-medium">Monday, July 3, 2023</span>, and we re excited to get you started.
        </p>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-green-700">
              Your onboarding portal is now active. Please complete the pre-boarding tasks before your first day.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-medium text-gray-900">Here s what you need to know:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <div>
                  <p className="font-medium text-gray-900">Your Team</p>
                  <p className="text-gray-700">You ll be joining the Product Design team led by Jamie Wilson.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <div>
                  <p className="font-medium text-gray-900">First Day Schedule</p>
                  <p className="text-gray-700">
                    9:00 AM - New hire orientation
                    <br />
                    11:00 AM - Team introduction
                    <br />
                    1:00 PM - Setup & training
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-gray-900">Pre-boarding checklist:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Complete employment forms</li>
            <li>Review company policies</li>
            <li>Set up direct deposit</li>
            <li>Select benefits options</li>
          </ul>
        </div>

        <div className="pt-2">
          <Button className="bg-primary hover:bg-primary/90">Access Onboarding Portal</Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Need help?</p>
              <p className="text-gray-700">
                If you have any questions before your first day, please contact your HR representative,
                <span className="font-medium"> Taylor Smith</span>, at{" "}
                <a href="mailto:tsmith@acmecorp.com" className="text-primary hover:underline">
                  tsmith@acmecorp.com
                </a>{" "}
                or (555) 123-4567.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-700">
          We re looking forward to your contributions and are excited to have you on board!
        </p>

        <p className="text-gray-700">
          Warm regards,
          <br />
          Jordan Rivera
          <br />
          Director of Human Resources
          <br />
          Acme Corporation
        </p>
      </div>

      {/* Email Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Acme Corporation | 123 Business Ave, Suite 500 | Metropolis, NY 10001
          <br />
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          |
          <a href="#" className="text-primary hover:underline">
            {" "}
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}

