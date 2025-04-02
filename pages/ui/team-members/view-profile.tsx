import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Linkedin, Github } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  avatar: string
  jobTitle: string
  department: string
  status: "Active" | "Remote" | "Inactive" | "On Leave" | "New Hire" | null
  email: string
  phone: string
  location: string
  startDate: string
  socialLinks?: {
    linkedin?: string
    github?: string
  }
}

interface ViewProfileDialogProps {
  member?: TeamMember
  open: boolean
  onClose: () => void
}

export default function ViewProfileDialog({ member, open, onClose }: ViewProfileDialogProps) {
  // If member is undefined, don't render the content
  if (!member) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
        </DialogHeader>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4 bg-muted/50">
                <Badge
                  variant={
                    member.status === "Active" ? "default" : member.status === "Remote" ? "secondary" : "outline"
                  }
                >
                  {member.status}
                </Badge>
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-xl">{member.name}</h3>
                <p className="text-muted-foreground mb-1">{member.jobTitle}</p>
                <Badge variant="outline" className="mb-4">
                  {member.department}
                </Badge>
                <div className="grid gap-2 w-full text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined {member.startDate}</span>
                  </div>
                </div>
                {member.socialLinks && (
                  <div className="flex mt-4 space-x-2">
                    {member.socialLinks.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </a>
                      </Button>
                    )}
                    {member.socialLinks.github && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          <span className="sr-only">GitHub</span>
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

