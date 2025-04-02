"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function NotesHistoryTab({ employeeData }: { employeeData: any }) {
  const [newNote, setNewNote] = useState("")

  const notes = [
    { id: 1, date: "2023-09-15", author: "John Doe", content: "Excellent performance in the recent project." },
    { id: 2, date: "2023-08-01", author: "Jane Smith", content: "Discussed career growth opportunities." },
    { id: 3, date: "2023-07-10", author: "John Doe", content: "Completed leadership training program." },
  ]

  const handleAddNote = () => {
    // In a real application, this would add the note to the database
    console.log("Adding note:", newNote)
    setNewNote("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter a new note..."
            className="mb-2"
          />
          <Button onClick={handleAddNote}>Add Note</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.date}</TableCell>
                  <TableCell>{note.author}</TableCell>
                  <TableCell>{note.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

