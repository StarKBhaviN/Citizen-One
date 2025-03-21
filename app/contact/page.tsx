import Link from "next/link"
import { CitizenHeader } from "../components/citizen-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Clock, Facebook, Instagram, Mail, MapPin, MessageSquare, Phone, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CitizenHeader />

      <div className="bg-muted/30 py-4 border-b">
        <div className="container">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/contact">Contact Us</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions or need assistance? Our support team is here to help. Reach out to us through any of the
                channels below.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Fill out the form and we'll get back to you as soon as possible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Smith" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="john.smith@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help you?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please describe your issue or question in detail..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complaint-id">Complaint ID (if applicable)</Label>
                        <Input id="complaint-id" placeholder="e.g., ABC12345" />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Reach out to us directly through these channels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-muted-foreground">
                          Call us at{" "}
                          <a href="tel:+1-800-123-4567" className="text-primary hover:underline">
                            +1-800-123-4567
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          Send us an email at{" "}
                          <a href="mailto:support@citizenone.gov" className="text-primary hover:underline">
                            support@citizenone.gov
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
                        <Button variant="outline" size="sm" className="mt-1">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Visit Us</CardTitle>
                    <CardDescription>Our office locations and hours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Main Office</h3>
                        <p className="text-sm text-muted-foreground">CitizenOne Headquarters</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-sm text-muted-foreground">
                          123 Government Plaza, Sector 1<br />
                          City Center, State 12345
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Office Hours</h3>
                        <p className="text-sm text-muted-foreground">
                          Monday - Friday: 9:00 AM - 5:00 PM
                          <br />
                          Saturday: 10:00 AM - 2:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 h-40 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      [Interactive Map]
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Connect With Us</CardTitle>
                    <CardDescription>Follow us on social media</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-5 w-5" />
                          <span className="sr-only">Facebook</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-5 w-5" />
                          <span className="sr-only">Twitter</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-5 w-5" />
                          <span className="sr-only">Instagram</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="font-medium mb-1">What is the typical response time?</h3>
                    <p className="text-sm text-muted-foreground">
                      We aim to respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">How do I track my complaint?</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the "Track Complaint" feature on our homepage with your Complaint ID.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Can I update my complaint after submission?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can add comments or additional information to your complaint.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">How do I reset my password?</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the "Forgot Password" link on the login page to reset your password.
                    </p>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" asChild>
                    <Link href="/faq">View All FAQs</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
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

