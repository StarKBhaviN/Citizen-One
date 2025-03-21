"use client"

import type React from "react"

import { useState } from "react"
import { AdminHeader } from "../components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Send, User, Users } from "lucide-react"

// Mock data for messages
const conversations = [
  {
    id: 1,
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    complaintId: "ABC12345",
    lastMessage: "Is there any update on my water supply complaint?",
    timestamp: "2025-03-12T10:30:00Z",
    unread: true,
    department: "Water Department",
  },
  {
    id: 2,
    user: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    complaintId: "DEF67890",
    lastMessage: "Thank you for the quick response to my electricity issue.",
    timestamp: "2025-03-11T15:45:00Z",
    unread: false,
    department: "Electricity Department",
  },
  {
    id: 3,
    user: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RJ",
    },
    complaintId: "GHI12345",
    lastMessage: "When will the road repair team arrive?",
    timestamp: "2025-03-12T09:15:00Z",
    unread: true,
    department: "Roads Department",
  },
  {
    id: 4,
    user: {
      name: "Emily Williams",
      email: "emily.williams@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
    },
    complaintId: "JKL67890",
    lastMessage: "I'm satisfied with the resolution of my sanitation complaint.",
    timestamp: "2025-03-10T14:20:00Z",
    unread: false,
    department: "Sanitation Department",
  },
]

// Mock data for messages in a conversation
const messages = [
  {
    id: 1,
    sender: "user",
    content:
      "Hello, I submitted a complaint about water supply disruption in my area (Complaint ID: ABC12345). It's been 2 days and I haven't received any updates. Can you please check the status?",
    timestamp: "2025-03-10T10:30:00Z",
  },
  {
    id: 2,
    sender: "admin",
    content:
      "Hello John, thank you for reaching out. I can see that your complaint has been assigned to the Water Department. Let me check the current status for you.",
    timestamp: "2025-03-10T11:15:00Z",
  },
  {
    id: 3,
    sender: "admin",
    content:
      "I've checked with the Water Department, and they've informed me that a team has been dispatched to your location today. They should arrive within the next 2-3 hours to assess the situation.",
    timestamp: "2025-03-10T11:20:00Z",
  },
  {
    id: 4,
    sender: "user",
    content: "Thank you for the update. I'll be at home waiting for the team.",
    timestamp: "2025-03-10T11:25:00Z",
  },
  {
    id: 5,
    sender: "user",
    content:
      "The team visited and identified the issue, but they said they need additional equipment to fix it. When will they return to complete the repair?",
    timestamp: "2025-03-11T09:45:00Z",
  },
  {
    id: 6,
    sender: "admin",
    content:
      "I apologize for the delay. Let me follow up with the Water Department regarding the timeline for the repair completion.",
    timestamp: "2025-03-11T10:30:00Z",
  },
  {
    id: 7,
    sender: "admin",
    content:
      "I've spoken with the Water Department supervisor, and they've scheduled the repair team to return tomorrow morning with the necessary equipment. They should arrive between 9:00 AM and 11:00 AM.",
    timestamp: "2025-03-11T14:15:00Z",
  },
  {
    id: 8,
    sender: "user",
    content: "Is there any update on my water supply complaint?",
    timestamp: "2025-03-12T10:30:00Z",
  },
]

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    // In a real application, you would send the message to your backend here
    console.log("Sending message:", newMessage)

    // Clear the input field
    setNewMessage("")
  }

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      searchTerm === "" ||
      conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && conversation.unread) ||
      (activeTab === "water" && conversation.department === "Water Department") ||
      (activeTab === "electricity" && conversation.department === "Electricity Department") ||
      (activeTab === "roads" && conversation.department === "Roads Department") ||
      (activeTab === "sanitation" && conversation.department === "Sanitation Department")

    return matchesSearch && matchesTab
  })

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Messages" />

      <main className="flex-1 p-6">
        <div className="grid h-[calc(100vh-8rem)] gap-6 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
          {/* Conversations List */}
          <div className="flex flex-col border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <div className="px-4 pt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                  </TabsTrigger>
                  <TabsTrigger value="water" className="flex-1">
                    Water
                  </TabsTrigger>
                  <TabsTrigger value="electricity" className="flex-1">
                    Electricity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="flex-1 overflow-auto p-0 m-0">
                <div className="divide-y">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation.id === conversation.id ? "bg-muted" : ""
                        } ${conversation.unread ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{conversation.user.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(conversation.timestamp)}</div>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {conversation.complaintId}
                            </Badge>
                            {conversation.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread" className="flex-1 overflow-auto p-0 m-0">
                <div className="divide-y">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No unread conversations</div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation.id === conversation.id ? "bg-muted" : ""
                        } ${conversation.unread ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{conversation.user.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(conversation.timestamp)}</div>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {conversation.complaintId}
                            </Badge>
                            {conversation.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="water" className="flex-1 overflow-auto p-0 m-0">
                <div className="divide-y">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No water department conversations</div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation.id === conversation.id ? "bg-muted" : ""
                        } ${conversation.unread ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{conversation.user.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(conversation.timestamp)}</div>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {conversation.complaintId}
                            </Badge>
                            {conversation.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="electricity" className="flex-1 overflow-auto p-0 m-0">
                <div className="divide-y">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No electricity department conversations</div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                          selectedConversation.id === conversation.id ? "bg-muted" : ""
                        } ${conversation.unread ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{conversation.user.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(conversation.timestamp)}</div>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {conversation.complaintId}
                            </Badge>
                            {conversation.unread && <Badge className="h-2 w-2 p-0 rounded-full" />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Conversation */}
          <Card className="flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                    <AvatarFallback>{selectedConversation.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{selectedConversation.user.name}</CardTitle>
                    <CardDescription>
                      {selectedConversation.user.email} • Complaint ID: {selectedConversation.complaintId}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" /> View Profile
                  </Button>
                </CardHeader>

                <div className="flex-1 overflow-auto p-4 border-y">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {formatMessageDate(messages[0].timestamp)}
                      </span>
                    </div>

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <CardContent className="p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[2.5rem] flex-1 resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Select a conversation from the list to view messages
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

