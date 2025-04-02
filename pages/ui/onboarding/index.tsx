"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnboardingListTable from "./table";
import EmployeeDocumentReview from "./document-review";

function OnboardingPage() {
    
  return (
    <>
    <div className="h-full">
      <Tabs defaultValue="0" className="m-4">
        <TabsList>
          <TabsTrigger value="0">Onboarding</TabsTrigger>
          <TabsTrigger value="1">Review</TabsTrigger>
        </TabsList>
        <TabsContent value="0">
          <OnboardingListTable />
        </TabsContent>
        <TabsContent value="1">
          <EmployeeDocumentReview />
        </TabsContent>
      </Tabs>
    </div>
    </>
)}

export default OnboardingPage