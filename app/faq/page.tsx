import Link from "next/link"
import { CitizenHeader } from "../components/citizen-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function FAQPage() {
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
                <BreadcrumbLink href="/faq">FAQ</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
              <p className="text-muted-foreground">
                Find answers to common questions about our complaint management system
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for answers..." className="pl-10" />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Submitting Complaints</CardTitle>
                  <CardDescription>Learn how to submit and track your complaints</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href="#submitting">View Questions</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>Information about your account and profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href="#account">View Questions</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Resolution Process</CardTitle>
                  <CardDescription>Understanding how complaints are resolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href="#resolution">View Questions</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Technical Support</CardTitle>
                  <CardDescription>Help with technical issues and platform usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0" asChild>
                    <Link href="#technical">View Questions</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <section id="submitting">
                <h2 className="text-2xl font-bold mb-4">Submitting Complaints</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I submit a new complaint?</AccordionTrigger>
                    <AccordionContent>
                      To submit a new complaint, click on the "Register Complaint" button on the homepage or navigate to
                      the "Submit Complaint" page from the main menu. Fill out the required information in the
                      multi-step form, including your personal details, complaint description, location, and any
                      supporting documents or images. After reviewing your information, submit the form to receive a
                      unique Complaint ID.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What information do I need to provide when submitting a complaint?
                    </AccordionTrigger>
                    <AccordionContent>
                      When submitting a complaint, you'll need to provide your personal information (name, contact
                      details), the category of your complaint (e.g., water, electricity, roads), a detailed description
                      of the issue, the specific location of the problem, and any relevant photos or documents that can
                      help illustrate the issue. The more detailed and specific your information, the easier it will be
                      for the relevant department to address your complaint.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I submit a complaint anonymously?</AccordionTrigger>
                    <AccordionContent>
                      While we understand privacy concerns, we require basic contact information to effectively address
                      your complaint. This allows us to follow up with you regarding the status of your complaint and
                      request additional information if needed. However, your personal information is kept confidential
                      and is only shared with the relevant department handling your complaint. If you have specific
                      privacy concerns, please contact our support team.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How can I track the status of my complaint?</AccordionTrigger>
                    <AccordionContent>
                      You can track the status of your complaint by using the "Track Complaint" feature on the homepage
                      or in the main menu. Enter your unique Complaint ID to view the current status, timeline of
                      actions taken, and any updates from the department handling your complaint. You can also log in to
                      your account to view all your complaints and their statuses in your dashboard.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>What should I do if I forgot my Complaint ID?</AccordionTrigger>
                    <AccordionContent>
                      If you've forgotten your Complaint ID, you can log in to your account and view all your submitted
                      complaints in your dashboard. If you submitted the complaint without creating an account or cannot
                      access your account, please contact our support team with your name, contact information, and
                      approximate date of submission, and we'll help you retrieve your Complaint ID.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section id="account">
                <h2 className="text-2xl font-bold mb-4">Account Management</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Do I need to create an account to submit a complaint?</AccordionTrigger>
                    <AccordionContent>
                      While you can submit a complaint without creating an account, we recommend creating one for a
                      better experience. Having an account allows you to easily track all your complaints, receive
                      notifications about status updates, and access your complaint history. It also simplifies the
                      process of submitting future complaints as your basic information will be pre-filled.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I create an account?</AccordionTrigger>
                    <AccordionContent>
                      To create an account, click on the "Log in" button in the top-right corner of the page and then
                      select "Register" on the login page. Fill out the registration form with your name, email address,
                      phone number, and password. After submitting the form, you'll receive a verification email. Click
                      the link in the email to verify your account, and you'll be ready to log in and use all the
                      features of the platform.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How can I update my personal information?</AccordionTrigger>
                    <AccordionContent>
                      To update your personal information, log in to your account and navigate to the "Settings" tab in
                      your dashboard. Here, you can edit your name, contact information, address, and other details.
                      After making your changes, click the "Update Information" button to save them. Keeping your
                      information up-to-date ensures that departments can contact you regarding your complaints if
                      necessary.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I change my password?</AccordionTrigger>
                    <AccordionContent>
                      To change your password, log in to your account and go to the "Settings" tab in your dashboard.
                      Scroll down to the "Security" section, where you'll find fields to enter your current password and
                      a new password. Enter your current password for verification, then enter and confirm your new
                      password. Click the "Change Password" button to update your password. For security reasons, choose
                      a strong password that you don't use on other websites.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>What should I do if I forgot my password?</AccordionTrigger>
                    <AccordionContent>
                      If you've forgotten your password, click on the "Log in" button and then select "Forgot password?"
                      on the login page. Enter the email address associated with your account, and we'll send you a
                      password reset link. Click the link in the email and follow the instructions to create a new
                      password. If you don't receive the email, check your spam folder or contact our support team for
                      assistance.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section id="resolution">
                <h2 className="text-2xl font-bold mb-4">Resolution Process</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How long does it take to resolve a complaint?</AccordionTrigger>
                    <AccordionContent>
                      The resolution time varies depending on the nature and complexity of your complaint. Simple issues
                      may be resolved within 24-48 hours, while more complex problems might take several days or weeks.
                      When you submit a complaint, you'll receive an estimated resolution time. You can always check the
                      current status and updated timeline through the tracking feature. If your complaint exceeds the
                      estimated resolution time, it will be automatically escalated to supervisors.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>What are the different status stages of a complaint?</AccordionTrigger>
                    <AccordionContent>
                      A complaint typically goes through the following status stages:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>
                          <strong>Submitted:</strong> Your complaint has been successfully received in our system.
                        </li>
                        <li>
                          <strong>Under Review:</strong> Your complaint is being reviewed and assigned to the
                          appropriate department.
                        </li>
                        <li>
                          <strong>In Progress:</strong> The assigned department is actively working on resolving your
                          complaint.
                        </li>
                        <li>
                          <strong>Resolved:</strong> Your complaint has been addressed and marked as resolved.
                        </li>
                      </ul>
                      Additional statuses may include "On Hold" (requiring more information) or "Escalated" (requiring
                      higher-level attention).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How are complaints assigned to departments?</AccordionTrigger>
                    <AccordionContent>
                      Complaints are assigned to departments based on the category you select when submitting your
                      complaint. For example, water-related issues are assigned to the Water Department, while road
                      issues go to the Roads Department. In some cases, complaints may involve multiple departments, in
                      which case a primary department will be assigned to coordinate the resolution. The assignment
                      process typically occurs during the "Under Review" stage and is handled by our complaint
                      management team.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>What happens if I'm not satisfied with the resolution?</AccordionTrigger>
                    <AccordionContent>
                      If you're not satisfied with the resolution of your complaint, you can reopen it within 7 days of
                      it being marked as resolved. To do this, go to your complaint details page and click the "Reopen
                      Complaint" button. Provide a reason for reopening the complaint, and it will be escalated to a
                      supervisor for review. Alternatively, you can submit feedback explaining why you're dissatisfied,
                      and our team will follow up with you to address your concerns.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I provide feedback on the resolution process?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we encourage feedback on the resolution process. Once your complaint is marked as resolved,
                      you'll receive a notification asking for your feedback. You can rate your experience and provide
                      comments through the "Feedback" tab in your dashboard. Your feedback helps us improve our services
                      and identify departments that are performing well or may need additional support. We review all
                      feedback regularly to enhance the complaint resolution process.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section id="technical">
                <h2 className="text-2xl font-bold mb-4">Technical Support</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What browsers are supported by the platform?</AccordionTrigger>
                    <AccordionContent>
                      Our platform supports all modern browsers, including Google Chrome, Mozilla Firefox, Safari,
                      Microsoft Edge, and Opera. For the best experience, we recommend using the latest version of these
                      browsers. If you're experiencing issues with a particular browser, try updating it to the latest
                      version or switching to a different supported browser.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I use the platform on my mobile device?</AccordionTrigger>
                    <AccordionContent>
                      Yes, our platform is fully responsive and works on smartphones and tablets. You can access all
                      features through your mobile browser without any functionality limitations. For an even better
                      experience, you can add the website to your home screen, which will allow you to use it like a
                      native app. We're also developing dedicated mobile apps for iOS and Android, which will be
                      available soon.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>What file types can I upload as attachments?</AccordionTrigger>
                    <AccordionContent>
                      You can upload the following file types as attachments to your complaints:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Images: JPG, JPEG, PNG, GIF (max 5MB each)</li>
                        <li>Documents: PDF, DOC, DOCX (max 10MB each)</li>
                        <li>Videos: MP4 (max 20MB each)</li>
                      </ul>
                      You can upload up to 5 files per complaint. If you need to share larger files or different file
                      types, please contact our support team for assistance.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I enable notifications?</AccordionTrigger>
                    <AccordionContent>
                      To enable notifications, log in to your account and go to the "Settings" tab in your dashboard.
                      Under "Notification Preferences," you can choose to receive notifications via email, SMS, or both.
                      You can also specify which types of notifications you want to receive, such as status updates,
                      comments, or feedback reminders. Make sure to save your preferences after making changes. If
                      you're using our platform as a Progressive Web App, you may also need to allow browser
                      notifications.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>What should I do if I encounter a technical issue?</AccordionTrigger>
                    <AccordionContent>
                      If you encounter a technical issue, first try refreshing the page or clearing your browser cache.
                      If the problem persists, you can:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Check our FAQ section for common issues and solutions</li>
                        <li>Contact our support team through the "Contact Us" page</li>
                        <li>Use the chat feature for immediate assistance</li>
                        <li>Email us at support@citizenone.gov with details of the issue</li>
                      </ul>
                      When reporting an issue, please include your browser type and version, device information, and a
                      description of the problem, including any error messages you received.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
              <p className="text-muted-foreground mb-4">Contact our support team for further assistance</p>
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
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

