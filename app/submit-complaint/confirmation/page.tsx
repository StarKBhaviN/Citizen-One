"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Share2, Download, ArrowRight } from "lucide-react"
import { CitizenHeader } from "../../components/citizen-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const complaintId = searchParams.get("id") || "UNKNOWN"

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Complaint",
          text: `My complaint ID is ${complaintId}. Track it on CitizenOne.`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `My complaint ID is ${complaintId}. Track it on CitizenOne: ${window.location.href}`,
      )
      alert("Complaint details copied to clipboard!")
    }
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob(
      [
        `Complaint ID: ${complaintId}\nDate: ${new Date().toLocaleDateString()}\nStatus: Submitted\n\nThank you for submitting your complaint. You can track the status of your complaint using the Complaint ID.`,
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `Complaint-${complaintId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CitizenHeader />

      <main className="flex-1 py-10">
        <div className="container max-w-md">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="text-center text-2xl">Complaint Submitted</CardTitle>
              <CardDescription className="text-center">Your complaint has been successfully submitted</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mb-4 rounded-lg bg-muted p-4">
                <div className="mb-2 text-center">
                  <p className="text-sm text-muted-foreground">Your Complaint ID</p>
                  <p className="text-xl font-bold">{complaintId}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Estimated Response Time</p>
                  <p className="font-medium">24-48 hours</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Please save your Complaint ID for future reference. You can use it to track the status of your
                complaint.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
              <Button asChild className="w-full">
                <Link href={`/track-complaint?id=${complaintId}`}>
                  Track Your Complaint <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
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

