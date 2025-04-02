import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"

export function DocumentsTab({ employeeData }: { employeeData: any }) {
  const documents = [
    { id: 1, name: "Offer Letter.pdf", type: "PDF", uploadDate: "2021-03-01" },
    { id: 2, name: "Employment Contract.pdf", type: "PDF", uploadDate: "2021-03-15" },
    { id: 3, name: "Latest Performance Review.pdf", type: "PDF", uploadDate: "2023-06-30" },
  ]

  const handleDownload = (docId: number, fileName: string) => {
    // Create a blob with PDF content (this is a placeholder, replace with actual PDF data)
    const pdfBlob = new Blob(["PDF content here"], { type: "application/pdf" })
    const url = window.URL.createObjectURL(pdfBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.uploadDate}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id, doc.name)}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

