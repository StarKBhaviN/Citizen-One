"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { AdminHeader } from "../components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useComplaints } from "@/context/ComplaintsContext";

// Mock data for complaints
const complaints = [
  {
    id: "VWX67890",
    citizen: "Jennifer Taylor",
    category: "Roads",
    location: "Sector 4, Main Street",
    status: "Resolved",
    priority: "High",
    assignedTo: "Roads Department",
    createdAt: "2025-03-08T10:15:00Z",
    updatedAt: "2025-03-10T16:20:00Z",
  },
];

export default function ComplaintsPage() {
  const [allComplaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<
    (typeof allComplaints)[0] | null
  >(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { complaints, getComplaints } = useComplaints();

  useEffect(() => {
    const retrieveComplaints = async () => {
      await getComplaints();
      setComplaints(complaints);
    };

    retrieveComplaints();
  }, []);

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="default">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesSearch =
      searchTerm === "" ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || complaint.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "all" || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleViewDetails = (complaint: (typeof allComplaints)[0]) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Complaints Management" />

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Complaints</h2>
            <Badge className="ml-2">{allComplaints.length} Total</Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search complaints..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Complaint
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under_review">Under Review</SelectItem>
                <SelectItem value="In_progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Reopened">Reopened</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Roads & Infrastructure">
                  Roads & Infrastructure
                </SelectItem>
                <SelectItem value="Sanitation & Waste">
                  Sanitation & Waste
                </SelectItem>
                <SelectItem value="Public Services">Public Services</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Citizen</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No complaints found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((complaint) => (
                  <TableRow key={complaint?.complaintId}>
                    <TableCell className="font-medium">
                      {complaint?.complaintId}
                    </TableCell>
                    <TableCell>{complaint?.citizen?.name}</TableCell>
                    <TableCell>{complaint?.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {complaint?.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            complaint?.status
                          )}`}
                        />
                        <span>{complaint?.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(complaint?.priority)}
                    </TableCell>
                    <TableCell>{complaint?.assignedTo || "Unknown"}</TableCell>
                    <TableCell>{formatDate(complaint?.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(complaint)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Add Comment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Complaint ID: {selectedComplaint?.complaintId}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Citizen
                  </h3>
                  <p className="mt-1">{selectedComplaint.citizen.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </h3>
                  <p className="mt-1">{selectedComplaint.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </h3>
                  <p className="mt-1">{selectedComplaint.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        selectedComplaint.status
                      )}`}
                    />
                    <span>{selectedComplaint.status}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Priority
                  </h3>
                  <p className="mt-1">
                    {getPriorityBadge(selectedComplaint.priority)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Assigned To
                  </h3>
                  <p className="mt-1">{selectedComplaint.assignedTo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedComplaint.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedComplaint.updatedAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </h3>
                <p className="mt-1">
                  Water supply has been disrupted in my area for the past 3
                  days. The entire block is affected and we are facing severe
                  water shortage.
                </p>
              </div>

              <div className="grid gap-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Timeline
                </h3>
                <ol className="relative border-l border-gray-200 dark:border-gray-700">
                  <li className="mb-6 ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white dark:ring-gray-900">
                      <span className="text-white text-xs">1</span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Submitted
                      </h3>
                      <time className="mb-1 text-sm font-normal text-gray-400 sm:mb-0">
                        {formatDate(selectedComplaint.createdAt)}
                      </time>
                    </div>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Complaint submitted successfully
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Department: Citizen Portal
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 ring-8 ring-white dark:ring-gray-900">
                      <span className="text-white text-xs">2</span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Under Review
                      </h3>
                      <time className="mb-1 text-sm font-normal text-gray-400 sm:mb-0">
                        {formatDate("2025-03-10T14:45:00Z")}
                      </time>
                    </div>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Complaint assigned to Water Department
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Department: Complaint Cell
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 ring-8 ring-white dark:ring-gray-900">
                      <span className="text-white text-xs">3</span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        In Progress
                      </h3>
                      <time className="mb-1 text-sm font-normal text-gray-400 sm:mb-0">
                        {formatDate(selectedComplaint.updatedAt)}
                      </time>
                    </div>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Water Department team dispatched to the location
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Department: Water Department
                    </p>
                  </li>
                </ol>
              </div>

              <div className="grid gap-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Comments
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-medium text-primary">
                          JD
                        </span>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            John Doe (Water Department)
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate("2025-03-11T09:15:00Z")}
                          </span>
                        </div>
                        <p className="text-sm">
                          Team has been dispatched to investigate the issue.
                          Initial assessment suggests a main pipeline issue
                          affecting the entire block.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-medium text-primary">
                          SM
                        </span>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Sarah Miller (Supervisor)
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate("2025-03-11T10:30:00Z")}
                          </span>
                        </div>
                        <p className="text-sm">
                          Please prioritize this issue as it's affecting a large
                          residential area. Arrange for water tankers as a
                          temporary solution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Add Comment</Button>
                <Button variant="outline">Update Status</Button>
                <Button>Resolve Complaint</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
