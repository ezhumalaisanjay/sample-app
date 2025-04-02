"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"

// In a real app, this would be connected to your auth provider like Supabase
const mockEnrollMFA = async () => {
  // Simulate API call to enroll MFA
  return {
    id: "factor-" + Math.random().toString(36).substring(2, 9),
    secret: "JBSWY3DPEHPK3PXP", // Example secret
    qrCode:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAyMyI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTAgMGgyM3YyM0gweiIvPjxwYXRoIGQ9Ik0xIDFoMjF2MjFIMXoiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNOCA4aDFWOUg4ek05IDhoMVY5SDl6TTEwIDhoMVY5SDEwek0xMSA4aDFWOUgxMXpNMTIgOGgxVjlIMTJ6TTEzIDhoMVY5SDEzek0xNCA4aDFWOUgxNHpNOCA5aDFWMTBIOHpNMTQgOWgxVjEwSDE0ek04IDEwaDFWMTFIOHpNMTAgMTBoMVYxMUgxMHpNMTEgMTBoMVYxMUgxMXpNMTIgMTBoMVYxMUgxMnpNMTQgMTBoMVYxMUgxNHpNOCAxMWgxVjEySDh6TTEwIDExaDFWMTJIMTB6TTExIDExaDFWMTJIMTF6TTEyIDExaDFWMTJIMTJ6TTE0IDExaDFWMTJIMTR6TTggMTJoMVYxM0g4ek0xMCAxMmgxVjEzSDEwek0xMSAxMmgxVjEzSDExek0xMiAxMmgxVjEzSDEyek0xNCAxMmgxVjEzSDE0ek04IDEzaDFWMTRIOHpNMTQgMTNoMVYxNEgxNHpNOCAxNGgxVjE1SDh6TTkgMTRoMVYxNUg5ek0xMCAxNGgxVjE1SDEwek0xMSAxNGgxVjE1SDExek0xMiAxNGgxVjE1SDEyek0xMyAxNGgxVjE1SDEzek0xNCAxNGgxVjE1SDE0eiIvPjwvc3ZnPg==",
  }
}

const mockVerifyMFA = async (factorId: string, code: string) => {
  // Simulate API call to verify MFA
  return { success: code === "123456" }
}

export default function EnrollMFA({ onEnrolled }: { onEnrolled: (factor: any) => void }) {
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [factorData, setFactorData] = useState<any>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const enrollFactor = async () => {
      try {
        const data = await mockEnrollMFA()
        setFactorData(data)
      } catch (err) {
        setError("Failed to initialize MFA enrollment")
      } finally {
        setLoading(false)
      }
    }

    enrollFactor()
  }, [])

  const copySecretToClipboard = () => {
    if (factorData?.secret) {
      navigator.clipboard.writeText(factorData.secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setVerifying(true)
    setError("")

    try {
      const result = await mockVerifyMFA(factorData.id, verificationCode)
      if (result.success) {
        onEnrolled(factorData)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Failed to verify code")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Set up authenticator app</h3>
        <p className="text-sm text-muted-foreground">
          Scan the QR code with your authenticator app or manually enter the secret key.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="border border-border p-2 rounded-md bg-white">
          <Image
            src={factorData?.qrCode || "/placeholder.svg"}
            alt="QR Code for authenticator app"
            width={200} height={200}
          />
        </div>

        <div className="w-full space-y-2">
          <Label htmlFor="secret">Secret Key</Label>
          <div className="flex">
            <Input id="secret" value={factorData?.secret || ""} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" className="ml-2" onClick={copySecretToClipboard}>
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <Input
          id="code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
        />
      </div>

      <Button className="w-full" onClick={handleVerify} disabled={verifying || verificationCode.length !== 6}>
        {verifying ? "Verifying..." : "Verify & Enable"}
      </Button>
    </div>
  )
}

