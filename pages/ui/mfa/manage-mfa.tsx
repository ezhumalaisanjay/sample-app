"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Smartphone, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// In a real app, this would connect to your auth provider
const mockUnenrollFactor = async (factorId: string) => {
  // Simulate API call to unenroll MFA factor
  return { success: true }
}

export default function ManageMFA({
  factors = [],
  onUnenroll,
}: {
  factors: any[]
  onUnenroll: (factorId: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleUnenroll = async (factorId: string) => {
    setLoading(true)
    setError("")

    try {
      const result = await mockUnenrollFactor(factorId)
      if (result.success) {
        onUnenroll(factorId)
      } else {
        setError("Failed to remove authenticator")
      }
    } catch (err) {
      setError("An error occurred while removing the authenticator")
    } finally {
      setLoading(false)
    }
  }

  if (factors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No MFA Methods Enabled</h3>
        <p className="text-center text-muted-foreground">
          You haven&apos;t set up any multi-factor authentication methods yet.
        </p>
        <Button variant="outline" onClick={() => (window.location.hash = "#enroll")}>
          Set Up MFA
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Manage Authentication Methods</h3>
        <p className="text-sm text-muted-foreground">Review and manage your multi-factor authentication methods.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {factors.map((factor) => (
          <Card key={factor.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Authenticator App</h4>
                  <p className="text-sm text-muted-foreground">Added on {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Authenticator</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this authenticator? This will disable MFA for your account and
                      reduce your account security.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUnenroll(factor.id)}
                      disabled={loading}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {loading ? "Removing..." : "Remove"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

