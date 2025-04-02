"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ShieldCheck } from "lucide-react"

// In a real app, this would connect to your auth provider
const mockVerifyLogin = async (code: string) => {
  // Simulate API call to verify MFA during login
  return { success: code === "123456" }
}

export default function VerifyMFA() {
  const [verificationCode, setVerificationCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setVerifying(true)
    setError("")

    try {
      const result = await mockVerifyLogin(verificationCode)
      if (result.success) {
        setVerified(true)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Failed to verify code")
    } finally {
      setVerifying(false)
    }
  }

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium">Successfully Verified</h3>
        <p className="text-center text-muted-foreground">
          Your identity has been verified and you are now securely logged in.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Verify your identity</h3>
        <p className="text-sm text-muted-foreground">
          Enter the verification code from your authenticator app to continue.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <Input
          id="verification-code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
        <p className="text-xs text-muted-foreground">Open your authenticator app to view your verification code</p>
      </div>

      <Button className="w-full" onClick={handleVerify} disabled={verifying || verificationCode.length !== 6}>
        {verifying ? "Verifying..." : "Verify"}
      </Button>
    </div>
  )
}

