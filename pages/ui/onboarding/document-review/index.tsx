"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Eye, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  name: string
  type: string
  uploadDate: string
  status: "Pending" | "Approved" | "Rejected"
}

interface Employee {
  id: string
  name: string
  position: string
  department: string
  avatar: string
  documents: Document[]
}

export default function EmployeeDocumentReview() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP001",
      name: "Alice Johnson",
      position: "Software Developer",
      department: "Engineering",
      avatar: "/avatars/01.png",
      documents: [
        { id: "DOC001", name: "Resume.pdf", type: "Resume", uploadDate: "2025-02-28", status: "Pending" },
        {
          id: "DOC002",
          name: "Degree_Certificate.pdf",
          type: "Education",
          uploadDate: "2025-02-27",
          status: "Approved",
        },
        { id: "DOC003", name: "ID_Card.jpg", type: "Identification", uploadDate: "2025-02-26", status: "Pending" },
      ],
    },
    {
      id: "EMP002",
      name: "Bob Smith",
      position: "Marketing Specialist",
      department: "Marketing",
      avatar: "/avatars/02.png",
      documents: [
        { id: "DOC004", name: "Portfolio.pdf", type: "Work Sample", uploadDate: "2025-02-25", status: "Pending" },
        {
          id: "DOC005",
          name: "Reference_Letter.docx",
          type: "Reference",
          uploadDate: "2025-02-24",
          status: "Rejected",
        },
      ],
    },
    {
      id: "EMP003",
      name: "Carol Davis",
      position: "HR Coordinator",
      department: "Human Resources",
      avatar: "/avatars/03.png",
      documents: [
        { id: "DOC006", name: "Certification.pdf", type: "Certification", uploadDate: "2025-02-23", status: "Pending" },
        { id: "DOC007", name: "Background_Check.pdf", type: "Legal", uploadDate: "2025-02-22", status: "Approved" },
      ],
    },
    // Adding more employees for pagination demonstration
    {
      id: "EMP004",
      name: "David Wilson",
      position: "Data Analyst",
      department: "Analytics",
      avatar: "/avatars/04.png",
      documents: [
        { id: "DOC008", name: "Project_Report.pdf", type: "Work Sample", uploadDate: "2025-02-21", status: "Pending" },
      ],
    },
    {
      id: "EMP005",
      name: "Eva Brown",
      position: "UX Designer",
      department: "Design",
      avatar: "/avatars/05.png",
      documents: [
        { id: "DOC009", name: "Portfolio.pdf", type: "Work Sample", uploadDate: "2025-02-20", status: "Approved" },
        {
          id: "DOC010",
          name: "Design_Certification.pdf",
          type: "Certification",
          uploadDate: "2025-02-19",
          status: "Pending",
        },
      ],
    },
  ])

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [comment, setComment] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const handleApprove = (employeeId: string, docId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              documents: emp.documents.map((doc) => (doc.id === docId ? { ...doc, status: "Approved" } : doc)),
            }
          : emp,
      ),
    )
  }

  const handleReject = (employeeId: string, docId: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              documents: emp.documents.map((doc) => (doc.id === docId ? { ...doc, status: "Rejected" } : doc)),
            }
          : emp,
      ),
    )
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Employee Document Review</h1>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.documents.length}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        <Eye className="w-4 h-4 mr-1" /> Review Documents
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEmployees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <CardDescription>{employee.position}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">Employee ID: {employee.id}</p>
                  <p className="text-sm text-gray-500 mb-4">Department: {employee.department}</p>
                  <p className="text-sm text-gray-500 mb-4">Documents: {employee.documents.length}</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                    <Eye className="w-4 h-4 mr-1" /> Review Documents
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            Rows Per Page
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Review Documents: {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              Employee ID: {selectedEmployee?.id} | Department: {selectedEmployee?.department}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEmployee?.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doc.status === "Approved" ? "outline" : doc.status === "Rejected" ? "destructive" : "default"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                          <FileText className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleApprove(selectedEmployee.id, doc.id)}>
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(selectedEmployee.id, doc.id)}>
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details: {selectedDocument?.name}</DialogTitle>
            <DialogDescription>Review and take action on the uploaded document.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docName" className="text-right">
                Name
              </Label>
              <Input id="docName" value={selectedDocument?.name} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docType" className="text-right">
                Type
              </Label>
              <Input id="docType" value={selectedDocument?.type} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docUploadDate" className="text-right">
                Upload Date
              </Label>
              <Input id="docUploadDate" value={selectedDocument?.uploadDate} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docStatus" className="text-right">
                Status
              </Label>
              <Input id="docStatus" value={selectedDocument?.status} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docComment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="docComment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedEmployee && selectedDocument) {
                  handleReject(selectedEmployee.id, selectedDocument.id)
                  setSelectedDocument(null)
                }
              }}
            >
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
            <Button
              onClick={() => {
                if (selectedEmployee && selectedDocument) {
                  handleApprove(selectedEmployee.id, selectedDocument.id)
                  setSelectedDocument(null)
                }
              }}
            >
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

