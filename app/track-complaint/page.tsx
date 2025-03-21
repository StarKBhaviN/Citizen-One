"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MessageCircle } from "lucide-react"
import { CitizenHeader } from "../components/citizen-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data for the complaint
const mockComplaint = {
  id: "ABC12345",
  category: "Water Supply",
  description: "Water supply has been disrupted in my area for the past 3 days.",
  location: "123 Main Street, Sector 7",
  status: "In Progress",
  createdAt: "2025-03-10T10:30:00Z",
  timeline: [
    {
      id: 1,
      status: "Submitted",
      description: "Complaint submitted successfully",
      timestamp: "2025-03-10T10:30:00Z",
      department: "Citizen Portal",
    },
    {
      id: 2,
      status: "Under Review",
      description: "Complaint assigned to Water Department",
      timestamp: "2025-03-10T14:45:00Z",
      department: "Complaint Cell",
    },
    {
      id: 3,
      status: "In Progress",
      description: "Water Department team dispatched to the location",
      timestamp: "2025-03-11T09:15:00Z",
      department: "Water Department",
    },
  ],
  assignedTo: "Water Department",
  priority: "Medium",
  estimatedResolutionDate: "2025-03-13T18:00:00Z",
}

export default function TrackComplaintPage() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""

  const [complaintId, setComplaintId] = useState(initialId)
  const [complaint, setComplaint] = useState(initialId ? mockComplaint : null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showChat, setShowChat] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!complaintId) {
      setError("Please enter a Complaint ID")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (complaintId.toUpperCase() === mockComplaint.id) {
        setComplaint(mockComplaint)
        setError("")
      } else {
        setComplaint(null)
        setError("No complaint found with this ID. Please check and try again.")
      }
      setLoading(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-500"
      case "Under Review":
        return "bg-yellow-500"
      case "In Progress":
        return "bg-orange-500"
      case "Resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CitizenHeader />

      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Track Your Complaint</h1>
            <p className="text-gray-500 mt-2">Enter your Complaint ID to check the current status and progress.</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Complaint</CardTitle>
              <CardDescription>Enter the Complaint ID you received after submitting your complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="Enter Complaint ID (e.g., ABC12345)"
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" /> Track
                    </>
                  )}
                </Button>
              </form>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {complaint && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Details</CardTitle>
                  <CardDescription>Complaint ID: {complaint.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                      <p>{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(complaint.status)}`} />
                        <span>{complaint.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</p>
                      <p>{formatDate(complaint.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</p>
                      <p>{complaint.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</p>
                      <p>{complaint.priority}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Resolution</p>
                      <p>{formatDate(complaint.estimatedResolutionDate)}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p>{complaint.location}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                      <p className="whitespace-pre-line">{complaint.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complaint Timeline</CardTitle>
                  <CardDescription>Track the progress of your complaint</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="relative border-l border-gray-200 dark:border-gray-700">
                    {complaint.timeline.map((event, index) => (
                      <li key={event.id} className="mb-10 ml-6 last:mb-0">
                        <span
                          className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${getStatusColor(event.status)} ring-8 ring-white dark:ring-gray-900`}
                        >
                          <span className="text-white text-xs">{index + 1}</span>
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.status}</h3>
                          <time className="mb-1 text-sm font-normal text-gray-400 sm:mb-0">
                            {formatDate(event.timestamp)}
                          </time>
                        </div>
                        <p className="text-base font-normal text-gray-500 dark:text-gray-400">{event.description}</p>
                        <p className="mt-1 text-sm text-gray-400">Department: {event.department}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="faq-1">
                      <AccordionTrigger>How long will it take to resolve my complaint?</AccordionTrigger>
                      <AccordionContent>
                        The resolution time depends on the nature and complexity of your complaint. For water supply
                        issues, the typical resolution time is 2-3 days. You can see the estimated resolution date in
                        the complaint details.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-2">
                      <AccordionTrigger>Can I update my complaint?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can provide additional information or updates to your complaint by contacting our
                        support team with your Complaint ID.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-3">
                      <AccordionTrigger>What if my issue is not resolved by the estimated date?</AccordionTrigger>
                      <AccordionContent>
                        If your issue is not resolved by the estimated date, it will be automatically escalated to the
                        department supervisor. You can also contact our support team for assistance.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => setShowChat(!showChat)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {showChat ? "Hide Chat" : "Chat with Support"}
                    </Button>
                  </div>

                  {showChat && (
                    <div className="mt-4 rounded-lg border p-4">
                      <div className="mb-4 space-y-4">
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                            AI
                          </div>
                          <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2">
                            <p className="text-sm">
                              Hello! I'm your virtual assistant. How can I help you with your complaint today?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Type your message..." />
                        <Button size="sm">Send</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container flex flex-col gap-2 py-10 md:flex-row md:gap-4 md:py-8">
          <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-left">
            © 2025 CitizenOne. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

