import Link from "next/link"
import { FileText, Search, History, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CitizenHeader } from "./components/citizen-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <CitizenHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 sm:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your Voice Matters. We're Listening.
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Submit and track your complaints with ease. Our platform connects you directly with government
                  departments for faster resolution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button size="lg" asChild>
                    <Link href="/submit-complaint">
                      Register Complaint <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="text" placeholder="Enter Complaint ID" />
                    <Button type="submit" variant="outline">
                      <Search className="h-4 w-4 mr-2" /> Track
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  alt="Citizen Complaint System"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=400&width=600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Quick Access</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Access key features of our platform with just one click
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Submit Complaint</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Register a new complaint with the relevant department
                </p>
                <Button variant="outline" asChild>
                  <Link href="/submit-complaint">Submit Now</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track Complaint</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Check the status of your existing complaint
                </p>
                <Button variant="outline" asChild>
                  <Link href="/track-complaint">Track Now</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Complaint History</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  View all your past and current complaints
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">View History</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-3xl font-bold">98%</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Resolution Rate</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-3xl font-bold">24h</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Average Response Time</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-3xl font-bold">10k+</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Complaints Resolved</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-3xl font-bold">50+</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Government Departments</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container flex flex-col gap-2 py-10 md:flex-row md:gap-4 md:py-8">
          <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-left">
            © 2025 CitizenOne. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 md:justify-end">
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Accessibility
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

