import { Button } from "@/components/ui/button"
import { AlertCircle, Lock } from "lucide-react"

export default function PasswordResetEmail() {
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
              <p className="text-sm text-gray-500">Security Team</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">June 15, 2023</p>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Password Reset Request</h1>
      </div>

      {/* Email Body */}
      <div className="space-y-6">
        <p className="text-gray-700">Hello,</p>

        <p className="text-gray-700">
          We received a request to reset the password for your Acme Corporation account. If you didn t make this
          request, you can safely ignore this email.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-700 mb-4">
            To reset your password, click the button below. This link will expire in 24 hours.
          </p>
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Reset Your Password</Button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-blue-700">
              If the button above doesn t work, you can copy and paste the following URL into your browser:
              <br />
              <a href="#" className="text-primary hover:underline break-all">
                https://acmecorp.com/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-gray-900">Security tips:</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Create a strong password that is at least 12 characters long</li>
            <li>Use a mix of letters, numbers, and special characters</li>
            <li>Don t reuse passwords across different websites</li>
            <li>Consider using a password manager to generate and store secure passwords</li>
          </ul>
        </div>

        <p className="text-gray-700">
          If you didn t request a password reset or need assistance, please contact our support team at{" "}
          <a href="mailto:support@acmecorp.com" className="text-primary hover:underline">
            support@acmecorp.com
          </a>
          .
        </p>

        <p className="text-gray-700">
          Regards,
          <br />
          Security Team
          <br />
          Acme Corporation
        </p>
      </div>

      {/* Email Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          This email was sent to you because a password reset was requested for your account. If you did not request
          this change, please contact{" "}
          <a href="mailto:security@acmecorp.com" className="text-primary hover:underline">
            security@acmecorp.com
          </a>{" "}
          immediately.
        </p>
      </div>
    </div>
  )
}

