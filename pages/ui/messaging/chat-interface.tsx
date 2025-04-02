"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Paperclip } from "lucide-react"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
}

interface Thread {
  id: string
  name: string
  lastMessage: string
  unreadCount: number
}

const mockThreads: Thread[] = [
  { id: "1", name: "John Doe", lastMessage: "Hey, how's it going?", unreadCount: 2 },
  { id: "2", name: "Jane Smith", lastMessage: "Can you review the report?", unreadCount: 0 },
  { id: "3", name: "Team Alpha", lastMessage: "Meeting at 3 PM", unreadCount: 5 },
  { id: "4", name: "HR Department", lastMessage: "Your leave request has been approved", unreadCount: 1 },
  { id: "5", name: "Tech Support", lastMessage: "Have you tried turning it off and on again?", unreadCount: 0 },
]

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "John Doe",
    content: "Hey, how's it going?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isCurrentUser: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Hi John! I'm doing well, thanks. How about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    isCurrentUser: true,
  },
  {
    id: "3",
    sender: "John Doe",
    content: "I'm good too. Did you get a chance to look at the project proposal?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    isCurrentUser: false,
  },
  {
    id: "4",
    sender: "You",
    content: "Yes, I did. I think it looks great overall. I have a few minor suggestions.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    isCurrentUser: true,
  },
  {
    id: "5",
    sender: "John Doe",
    content: "That's great to hear! Would you mind sharing your suggestions?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    isCurrentUser: false,
  },
]

export default function ChatInterface() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads)
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedThread) {
      setMessages(mockMessages)
    }
  }, [selectedThread])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Thread List */}
      <div className="w-1/3 border-r">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[540px]">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${
                    selectedThread?.id === thread.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${thread.name}`} />
                      <AvatarFallback>
                        {thread.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{thread.name}</p>
                      <p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedThread.name}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.isCurrentUser ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}

