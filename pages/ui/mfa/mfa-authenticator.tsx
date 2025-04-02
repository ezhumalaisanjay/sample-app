"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EnrollMFA from "./enroll-mfa"
import VerifyMFA from "./verify-mfa"
import ManageMFA from "./manage-mfa"

export default function MFAAuthenticator() {
  const [activeTab, setActiveTab] = useState("enroll")
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([])

  const handleEnrollSuccess = (factor: any) => {
    setEnrolledFactors([...enrolledFactors, factor])
    setActiveTab("manage")
  }

  const handleUnenroll = (factorId: string) => {
    setEnrolledFactors(enrolledFactors.filter((factor) => factor.id !== factorId))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Multi-Factor Authentication</CardTitle>
          <CardDescription>Secure your account with an additional layer of protection</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="enroll">Enroll</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>
            <TabsContent value="enroll">
              <EnrollMFA onEnrolled={handleEnrollSuccess} />
            </TabsContent>
            <TabsContent value="verify">
              <VerifyMFA />
            </TabsContent>
            <TabsContent value="manage">
              <ManageMFA factors={enrolledFactors} onUnenroll={handleUnenroll} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Using an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy is recommended.
        </CardFooter>
      </Card>
    </div>
  )
}

