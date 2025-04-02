import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function NewHires() {
  const newHires = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@company.com",
      avatar: "/avatars/01.png",
      initials: "OM",
      status: "Completed",
      progress: "100%",
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@company.com",
      avatar: "/avatars/02.png",
      initials: "JL",
      status: "In Progress",
      progress: "60%",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@company.com",
      avatar: "/avatars/03.png",
      initials: "IN",
      status: "Pending",
      progress: "0%",
    },
    {
      name: "William Kim",
      email: "william.kim@company.com",
      avatar: "/avatars/04.png",
      initials: "WK",
      status: "In Progress",
      progress: "40%",
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@company.com",
      avatar: "/avatars/05.png",
      initials: "SD",
      status: "In Progress",
      progress: "80%",
    },
  ]

  return (
    <div className="space-y-8">
      {newHires.map((hire, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={hire.avatar} alt={`${hire.name}'s avatar`} />
            <AvatarFallback>{hire.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{hire.name}</p>
            <p className="text-sm text-muted-foreground">{hire.email}</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Badge
              variant={
                hire.status === "Completed" ? "default" : hire.status === "In Progress" ? "secondary" : "outline"
              }
            >
              {hire.status}
            </Badge>
            <span className="text-sm font-medium">{hire.progress}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

