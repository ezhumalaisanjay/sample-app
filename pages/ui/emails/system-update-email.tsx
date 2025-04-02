import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, Clock, Info } from "lucide-react"

export default function SystemUpdateEmail() {
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
              <p className="text-sm text-gray-500">IT Department</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">June 15, 2023</p>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Scheduled System Maintenance</h1>
      </div>

      {/* Email Body */}
      <div className="space-y-6">
        <p className="text-gray-700">Dear Acme Team Members,</p>

        <p className="text-gray-700">
          We will be performing scheduled maintenance on our core systems to implement important updates and security
          patches. During this time, some services will be temporarily unavailable.
        </p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-700">
              Please save your work and log out of all company systems before the maintenance window begins.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Maintenance Date</p>
              <p className="text-gray-700">Saturday, June 24, 2023</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Maintenance Window</p>
              <p className="text-gray-700">10:00 PM - 2:00 AM (EST)</p>
            </div>
          </div>

          <div className="flex items-start">
            <Info className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900">Affected Systems</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Customer Relationship Management (CRM)</li>
                <li>Enterprise Resource Planning (ERP)</li>
                <li>Email Services</li>
                <li>Internal Knowledge Base</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-gray-900">What to expect:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>All affected systems will be unavailable during the maintenance window</li>
            <li>No data loss is expected</li>
            <li>You may need to clear your browser cache after maintenance is complete</li>
            <li>The IT helpdesk will be available for urgent issues at the emergency number</li>
          </ul>
        </div>

        <div className="pt-2">
          <Button className="bg-primary hover:bg-primary/90">View Maintenance Schedule</Button>
        </div>

        <p className="text-gray-700 pt-2">
          We apologize for any inconvenience this may cause. These updates are necessary to improve system performance,
          enhance security, and provide new features. If you have any questions or concerns, please contact the IT
          Helpdesk.
        </p>

        <p className="text-gray-700">
          Thank you for your cooperation,
          <br />
          IT Department
          <br />
          Acme Corporation
        </p>
      </div>

      {/* Email Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          For IT support, contact the helpdesk at{" "}
          <a href="mailto:helpdesk@acmecorp.com" className="text-primary hover:underline">
            helpdesk@acmecorp.com
          </a>{" "}
          or call ext. 1234. Emergency after-hours support: 1-800-555-1234
        </p>
      </div>
    </div>
  )
}

