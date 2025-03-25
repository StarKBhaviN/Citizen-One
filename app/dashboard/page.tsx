"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CitizenHeader } from "../components/citizen-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  ChevronRight,
  Clock,
  Edit,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useComplaints } from "@/context/ComplaintsContext";

// Mock data for complaints
const complaints = [
  {
    id: "ABC12345",
    category: "Water Supply",
    description:
      "Water supply has been disrupted in my area for the past 3 days.",
    location: "123 Main Street, Sector 7",
    status: "In Progress",
    createdAt: "2025-03-10T10:30:00Z",
    updatedAt: "2025-03-11T09:15:00Z",
  },
  {
    id: "DEF67890",
    category: "Electricity",
    description: "Frequent power outages in our neighborhood.",
    location: "456 Park Avenue, Sector 9",
    status: "Submitted",
    createdAt: "2025-03-12T14:20:00Z",
    updatedAt: "2025-03-12T14:20:00Z",
  },
  {
    id: "GHI12345",
    category: "Roads",
    description: "Large pothole causing traffic issues and safety concerns.",
    location: "789 Oak Street, Sector 5",
    status: "Under Review",
    createdAt: "2025-03-11T09:45:00Z",
    updatedAt: "2025-03-11T11:30:00Z",
  },
  {
    id: "JKL67890",
    category: "Sanitation",
    description: "Garbage not collected for over a week.",
    location: "101 Pine Road, Sector 3",
    status: "Resolved",
    createdAt: "2025-03-09T16:15:00Z",
    updatedAt: "2025-03-10T13:45:00Z",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { complaints, getComplaints } = useComplaints();

  console.log(complaints)

  const [activeTab, setActiveTab] = useState("complaints");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getComplaints()
  }, [])
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-500";
      case "Under Review":
        return "bg-yellow-500";
      case "In Progress":
        return "bg-orange-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      case "Under Review":
        return (
          <Badge
            variant="warning"
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Under Review
          </Badge>
        );
      case "In Progress":
        return (
          <Badge
            variant="default"
            className="bg-orange-500 hover:bg-orange-600"
          >
            In Progress
          </Badge>
        );
      case "Resolved":
        return (
          <Badge variant="success" className="bg-green-500 hover:bg-green-600">
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      searchTerm === "" ||
      complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <div className="hidden md:block">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="/placeholder.svg?height=80&width=80"
                      alt="User"
                    />
                    <AvatarFallback>{user?.avatar || "DP"}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>

                <nav className="flex flex-col gap-1">
                  <Button
                    variant={activeTab === "complaints" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("complaints")}
                  >
                    <FileText className="mr-2 h-4 w-4" /> My Complaints
                  </Button>
                  <Button
                    variant={
                      activeTab === "notifications" ? "secondary" : "ghost"
                    }
                    className="justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                    <Badge className="ml-auto">3</Badge>
                  </Button>
                  <Button
                    variant={activeTab === "feedback" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("feedback")}
                  >
                    <Star className="mr-2 h-4 w-4" /> Feedback
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </nav>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Complaints
                      </span>
                      <span className="font-medium">{complaints.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Resolved
                      </span>
                      <span className="font-medium">
                        {
                          complaints.filter((c) => c.status === "Resolved")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        In Progress
                      </span>
                      <span className="font-medium">
                        {
                          complaints.filter((c) => c.status === "In Progress")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Pending
                      </span>
                      <span className="font-medium">
                        {
                          complaints.filter((c) =>
                            ["Submitted", "Under Review"].includes(c.status)
                          ).length
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <TabsList className="h-9">
                    <TabsTrigger value="complaints" className="text-sm">
                      My Complaints
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="text-sm">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="text-sm">
                      Feedback
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-sm">
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href="/submit-complaint">
                        <Plus className="mr-2 h-4 w-4" /> New Complaint
                      </Link>
                    </Button>
                  </div>
                </div>

                <TabsContent value="complaints" className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle>My Complaints</CardTitle>
                          <CardDescription>
                            View and manage all your submitted complaints
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search complaints..."
                              className="pl-8 w-full sm:w-[200px]"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only">Filter</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Filter by Status
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setStatusFilter("all")}
                              >
                                All Statuses
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setStatusFilter("Submitted")}
                              >
                                Submitted
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setStatusFilter("Under Review")}
                              >
                                Under Review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setStatusFilter("In Progress")}
                              >
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setStatusFilter("Resolved")}
                              >
                                Resolved
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredComplaints.length === 0 ? (
                          <div className="text-center py-6">
                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium">No complaints found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Submit a new complaint to get started"}
                            </p>
                            {!searchTerm && statusFilter === "all" && (
                              <Button asChild className="mt-4">
                                <Link href="/submit-complaint">
                                  <Plus className="mr-2 h-4 w-4" /> New
                                  Complaint
                                </Link>
                              </Button>
                            )}
                          </div>
                        ) : (
                          filteredComplaints.map((complaint) => (
                            <Card
                              key={complaint.complaintId}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col sm:flex-row">
                                <div className="flex-1 p-4 sm:p-6">
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium">
                                          {complaint.category}
                                        </h3>
                                        {getStatusBadge(complaint.status)}
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        ID: {complaint.complaintId} •{" "}
                                        {formatDate(complaint.createdAt)}
                                      </p>
                                      <p className="text-sm mb-2">
                                        {complaint.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Location: {complaint.location}
                                      </p>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="w-full"
                                      >
                                        <Link
                                          href={`/track-complaint?id=${complaint.complaintId}`}
                                        >
                                          Track
                                        </Link>
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full"
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              More
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>
                                            View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            Contact Support
                                          </DropdownMenuItem>
                                          {complaint.status === "Resolved" && (
                                            <DropdownMenuItem>
                                              Leave Feedback
                                            </DropdownMenuItem>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Stay updated on your complaint status and important
                        announcements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h3 className="font-medium">
                                Complaint Status Updated
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                2 hours ago
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              Your complaint{" "}
                              <span className="font-medium">ABC12345</span> has
                              been updated to{" "}
                              <Badge
                                variant="default"
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                In Progress
                              </Badge>
                            </p>
                            <div className="mt-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0"
                                asChild
                              >
                                <Link href="/track-complaint?id=ABC12345">
                                  View Details{" "}
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h3 className="font-medium">Reminder</h3>
                              <span className="text-xs text-muted-foreground">
                                1 day ago
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              Your feedback is requested for resolved complaint{" "}
                              <span className="font-medium">JKL67890</span>
                            </p>
                            <div className="mt-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0"
                              >
                                Leave Feedback{" "}
                                <ChevronRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h3 className="font-medium">New Comment</h3>
                              <span className="text-xs text-muted-foreground">
                                3 days ago
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              Water Department has added a comment to your
                              complaint{" "}
                              <span className="font-medium">ABC12345</span>
                            </p>
                            <div className="mt-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0"
                                asChild
                              >
                                <Link href="/track-complaint?id=ABC12345">
                                  View Comment{" "}
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Load More
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Feedback</CardTitle>
                      <CardDescription>
                        Rate your experience and help us improve our services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Pending Feedback</h3>
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <CardTitle className="text-base">
                                    Sanitation Complaint
                                  </CardTitle>
                                  <CardDescription>
                                    ID: JKL67890 • Resolved on Mar 10, 2025
                                  </CardDescription>
                                </div>
                                <Badge
                                  variant="success"
                                  className="bg-green-500 hover:bg-green-600 w-fit"
                                >
                                  Resolved
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor="rating"
                                    className="block mb-2"
                                  >
                                    Rate your experience
                                  </Label>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Button
                                        key={star}
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full"
                                      >
                                        <Star className="h-5 w-5" />
                                        <span className="sr-only">
                                          {star} stars
                                        </span>
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="feedback-comment">
                                    Additional Comments
                                  </Label>
                                  <Textarea
                                    id="feedback-comment"
                                    placeholder="Share your experience with the resolution process..."
                                    rows={3}
                                  />
                                </div>
                                <Button>Submit Feedback</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Previous Feedback</h3>
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <CardTitle className="text-base">
                                    Roads Complaint
                                  </CardTitle>
                                  <CardDescription>
                                    ID: VWX67890 • Resolved on Mar 5, 2025
                                  </CardDescription>
                                </div>
                                <div className="flex">
                                  {[1, 2, 3, 4].map((star) => (
                                    <Star
                                      key={star}
                                      className="h-4 w-4 fill-primary text-primary"
                                    />
                                  ))}
                                  <Star className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">
                                The pothole was fixed promptly and the road is
                                now safe to drive on. The team was professional
                                and kept me updated throughout the process.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences and personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Personal Information</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" defaultValue={user?.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue={user?.email}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue={user?.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              defaultValue={user?.address}
                            />
                          </div>
                        </div>
                        <Button>Update Information</Button>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">
                          Notification Preferences
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="email-notifications"
                              className="flex-1"
                            >
                              Email Notifications
                            </Label>
                            <input
                              type="checkbox"
                              id="email-notifications"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked={user?.notificationPreferences?.email}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="sms-notifications"
                              className="flex-1"
                            >
                              SMS Notifications
                            </Label>
                            <input
                              type="checkbox"
                              id="sms-notifications"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked={user?.notificationPreferences?.sms}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="status-updates" className="flex-1">
                              Status Updates
                            </Label>
                            <input
                              type="checkbox"
                              id="status-updates"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked={user?.notificationPreferences?.statusUpdates}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="feedback-reminders"
                              className="flex-1"
                            >
                              Feedback Reminders
                            </Label>
                            <input
                              type="checkbox"
                              id="feedback-reminders"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked={user?.notificationPreferences?.feedbackReminders}
                            />
                          </div>
                        </div>
                        <Button>Save Preferences</Button>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Security</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">
                              Current Password
                            </Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="confirm-password">
                              Confirm New Password
                            </Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                        </div>
                        <Button>Change Password</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
            <Link
              href="#"
              className="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:underline dark:text-gray-400"
            >
              Accessibility
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
