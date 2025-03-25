"use client"

import { useState } from "react"
import { AdminHeader } from "../components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, ChevronDown, Filter, Lock, MoreHorizontal, Search, Shield, User, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"

// Mock data for users
// const users = [
//   {
//     id: 1,
//     name: "John Smith",
//     email: "john.smith@example.com",
//     role: "Citizen",
//     status: "Active",
//     lastActive: "2025-03-12T10:30:00Z",
//     complaints: 4,
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "JS",
//   },
//   {
//     id: 2,
//     name: "Jane Doe",
//     email: "jane.doe@example.com",
//     role: "Citizen",
//     status: "Active",
//     lastActive: "2025-03-11T15:45:00Z",
//     complaints: 2,
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "JD",
//   },
//   {
//     id: 3,
//     name: "Robert Johnson",
//     email: "robert.johnson@example.com",
//     role: "Citizen",
//     status: "Inactive",
//     lastActive: "2025-02-28T09:15:00Z",
//     complaints: 1,
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "RJ",
//   },
//   {
//     id: 4,
//     name: "Emily Williams",
//     email: "emily.williams@example.com",
//     role: "Citizen",
//     status: "Active",
//     lastActive: "2025-03-10T14:20:00Z",
//     complaints: 3,
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "EW",
//   },
//   {
//     id: 5,
//     name: "Michael Brown",
//     email: "michael.brown@example.com",
//     role: "Officer",
//     status: "Active",
//     lastActive: "2025-03-12T11:10:00Z",
//     department: "Water Department",
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "MB",
//   },
//   {
//     id: 6,
//     name: "Sarah Miller",
//     email: "sarah.miller@example.com",
//     role: "Officer",
//     status: "Active",
//     lastActive: "2025-03-12T09:30:00Z",
//     department: "Electricity Department",
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "SM",
//   },
//   {
//     id: 7,
//     name: "David Wilson",
//     email: "david.wilson@example.com",
//     role: "Supervisor",
//     status: "Active",
//     lastActive: "2025-03-12T08:45:00Z",
//     department: "Roads Department",
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "DW",
//   },
//   {
//     id: 8,
//     name: "Jennifer Taylor",
//     email: "jennifer.taylor@example.com",
//     role: "Admin",
//     status: "Active",
//     lastActive: "2025-03-12T10:00:00Z",
//     avatar: "/placeholder.svg?height=40&width=40",
//     initials: "JT",
//   },
// ]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)

  const {allUser} = useAuth()

  const users = allUser
  console.log(users)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Admin</Badge>
      case "supervisor":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Supervisor</Badge>
      case "officer":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Officer</Badge>
      case "citizen":
        return <Badge variant="outline">Citizen</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleViewDetails = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsUserDetailOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="User Management" />

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">Manage citizens, officers, and administrators</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account in the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Smith" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.smith@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="citizen">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="officer">Officer</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department (for Officers/Supervisors)</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Applicable</SelectItem>
                        <SelectItem value="water">Water Department</SelectItem>
                        <SelectItem value="electricity">Electricity Department</SelectItem>
                        <SelectItem value="roads">Roads Department</SelectItem>
                        <SelectItem value="sanitation">Sanitation Department</SelectItem>
                        <SelectItem value="public_services">Public Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all-users" className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="all-users">All Users</TabsTrigger>
              <TabsTrigger value="citizens">Citizens</TabsTrigger>
              <TabsTrigger value="officers">Officers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Citizen")}>Citizen</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Officer")}>Officer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Supervisor")}>Supervisor</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Admin")}>Admin</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Suspended")}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all-users" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center gap-1">
                          Name
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </div>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Last Active
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => {
                        console.log(user)
                        return(
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{formatDate(user.lastActive)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                  <User className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" /> Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Lock className="mr-2 h-4 w-4" /> Reset Password
                                </DropdownMenuItem>
                                {user.status === "Active" ? (
                                  <DropdownMenuItem className="text-destructive">Deactivate Account</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>Activate Account</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )})
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="citizens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Citizens</CardTitle>
                <CardDescription>Manage citizen accounts and their complaints</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Complaints</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.role === "Citizen")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.complaints}</TableCell>
                          <TableCell>{formatDate(user.lastActive)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="officers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Officers & Supervisors</CardTitle>
                <CardDescription>Manage department officers and supervisors</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.role === "Officer" || user.role === "Supervisor")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>Manage system administrators</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => user.role === "Admin")
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{formatDate(user.lastActive)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Dialog */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>View and manage user information</DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="grid gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="text-2xl">{selectedUser.initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                        <p>{selectedUser._id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Active</h3>
                        <p>{formatDate(selectedUser.lastActive)}</p>
                      </div>
                      {selectedUser.role === "Officer" || selectedUser.role === "Supervisor" ? (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                          <p>{selectedUser.department}</p>
                        </div>
                      ) : selectedUser.role === "Citizen" ? (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Complaints</h3>
                          <p>{selectedUser.complaints} complaints submitted</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Shield className="mr-2 h-4 w-4" /> Change Role
                        </Button>
                        <Button variant="outline" size="sm">
                          <Lock className="mr-2 h-4 w-4" /> Reset Password
                        </Button>
                        {selectedUser.status === "Active" ? (
                          <Button variant="outline" size="sm" className="text-destructive">
                            Deactivate Account
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            Activate Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser.role === "Citizen" && (
                  <div>
                    <h3 className="font-medium mb-2">Recent Complaints</h3>
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>ABC12345</TableCell>
                            <TableCell>Water Supply</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-500 hover:bg-orange-600">In Progress</Badge>
                            </TableCell>
                            <TableCell>Mar 10, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>DEF67890</TableCell>
                            <TableCell>Electricity</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Submitted</Badge>
                            </TableCell>
                            <TableCell>Mar 12, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                )}

                {(selectedUser.role === "Officer" || selectedUser.role === "Supervisor") && (
                  <div>
                    <h3 className="font-medium mb-2">Assigned Complaints</h3>
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Citizen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>ABC12345</TableCell>
                            <TableCell>John Smith</TableCell>
                            <TableCell>
                              <Badge className="bg-orange-500 hover:bg-orange-600">In Progress</Badge>
                            </TableCell>
                            <TableCell>Mar 11, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>GHI12345</TableCell>
                            <TableCell>Robert Johnson</TableCell>
                            <TableCell>
                              <Badge variant="secondary">Under Review</Badge>
                            </TableCell>
                            <TableCell>Mar 11, 2025</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                    Close
                  </Button>
                  <Button>Edit User</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

