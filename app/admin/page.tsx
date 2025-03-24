"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "./components/admin-header";

import { useDashboard } from "@/context/DashboardContext";
import Skeleton from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { adminStats, loading, error, getAdminStats } = useDashboard();

  useEffect(() => {
    getAdminStats();
  }, []);

  // Calculate percentage changes (frontend mock data - would normally come from backend)
  const percentChanges = {
    totalComplaints: "+12%",
    pendingComplaints: "-4%",
    resolvedComplaints: "+19%",
    activeUsers: "+8%",
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Dashboard" />
        <main className="flex-1 p-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
            <h3 className="text-red-800 dark:text-red-300 font-medium">
              Error loading dashboard data
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
              onClick={() => getAdminStats()}
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Dashboard" />

      <main className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Complaints
              </CardTitle>
              <FileWarning className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {adminStats?.counts.totalComplaints.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {percentChanges.totalComplaints} from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Complaints
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {(adminStats
                      ? adminStats.statusCounts.submitted +
                        adminStats.statusCounts.underReview +
                        adminStats.statusCounts.inProgress
                      : 0
                    ).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {percentChanges.pendingComplaints} from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolved Complaints
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {adminStats?.statusCounts.resolved.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {percentChanges.resolvedComplaints} from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {adminStats?.counts.totalUsers.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {percentChanges.activeUsers} from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="urgent">Urgent Complaints</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Complaints by Category</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                      {adminStats?.complaintsByCategory.length ? (
                        <div className="w-full h-full p-4">
                          {/* This would normally be a chart component */}
                          <div className="space-y-4">
                            {adminStats.complaintsByCategory
                              .slice(0, 5)
                              .map((category) => (
                                <div
                                  key={category._id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="font-medium">
                                    {category._id}
                                  </div>
                                  <div className="text-sm">
                                    {category.count} complaints
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        "No category data available"
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Resolution Time</CardTitle>
                  <CardDescription>
                    Average time to resolve complaints by department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                      {adminStats?.resolutionTimeStats?.length ? (
                        <div className="w-full h-full p-4">
                          {/* This would normally be a chart component */}
                          <div className="space-y-4">
                            {adminStats.resolutionTimeStats.map((stat) => (
                              <div
                                key={stat._id}
                                className="flex items-center justify-between"
                              >
                                <div className="font-medium">
                                  {stat._id || "All Categories"}
                                </div>
                                <div className="text-sm">
                                  {stat.averageResolutionTime.toFixed(1)} days
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        "No resolution time data available"
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>
                    Latest complaints submitted to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-2 w-2 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adminStats?.recentComplaints.length ? (
                        adminStats.recentComplaints.map((complaint) => (
                          <div
                            key={complaint._id}
                            className="flex items-center gap-4"
                          >
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <div className="flex-1 grid gap-1">
                              <div className="font-medium">
                                {complaint.category}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {complaint.complaintId} | Filed by:{" "}
                                {complaint.citizen?.name || "Unknown"}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                complaint.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No recent complaints found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>
                    Resolution rate by department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adminStats?.complaintsByDepartment.length ? (
                        adminStats.complaintsByDepartment
                          .slice(0, 4)
                          .map((dept) => {
                            // Calculate a mock performance percentage (in real app would come from backend)
                            const totalDeptComplaints = dept.count;
                            const mockResolved = Math.floor(
                              totalDeptComplaints * 0.7 +
                                Math.random() * 0.3 * totalDeptComplaints
                            );
                            const performancePercentage = Math.round(
                              (mockResolved / totalDeptComplaints) * 100
                            );

                            return (
                              <div key={dept._id}>
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{dept.name}</div>
                                  <div className="text-sm">
                                    {performancePercentage}%
                                  </div>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted mt-1">
                                  <div
                                    className="h-2 rounded-full bg-primary"
                                    style={{
                                      width: `${performancePercentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No department data available
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="urgent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Urgent Complaints</CardTitle>
                <CardDescription>
                  Complaints that require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filter high priority complaints - typically would be filtered by backend */}
                    {adminStats?.recentComplaints.length ? (
                      adminStats.recentComplaints
                        .filter((_, index) => index % 3 === 0) // Artificially create "urgent" complaints
                        .slice(0, 5)
                        .map((complaint, index) => (
                          <div
                            key={`${complaint._id}-${index}`}
                            className="flex items-center gap-4"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="flex-1 grid gap-1">
                              <div className="flex items-center gap-2">
                                <div className="font-medium">
                                  {complaint.category}
                                </div>
                                <Badge variant="destructive">
                                  High Priority
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {complaint.complaintId}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                complaint.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <Button>View Details</Button>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No urgent complaints found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions taken by officers and supervisors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mock activity data based on recent complaints */}
                    {adminStats?.recentComplaints.length ? (
                      adminStats.recentComplaints.map((complaint, index) => {
                        // Create mock activity data based on complaint
                        const actions = [
                          "updated status",
                          "assigned to department",
                          "added comment",
                          "flagged as priority",
                          "completed review",
                        ];
                        const statuses = [
                          "In Progress",
                          "Under Review",
                          "Assigned",
                          "Escalated",
                          "Pending Review",
                        ];
                        const timeAgo = [
                          "10 minutes",
                          "45 minutes",
                          "1 hour",
                          "2 hours",
                          "3 hours",
                        ];

                        // Generate mock initials based on complaint ID
                        const initials = complaint.complaintId
                          .substring(0, 2)
                          .toUpperCase();

                        return (
                          <div
                            key={`${complaint._id}-activity-${index}`}
                            className="flex gap-4"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-xs font-medium text-primary">
                                {initials}
                              </span>
                            </div>
                            <div className="flex-1 grid gap-1">
                              <div className="font-medium">
                                Officer {complaint.complaintId.substring(0, 6)}{" "}
                                (
                                {complaint.assignedTo?.department?.name ||
                                  "Unassigned"}
                                )
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {actions[index % actions.length]} of complaint #
                                {complaint.complaintId} to "
                                {statuses[index % statuses.length]}"
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {timeAgo[index % timeAgo.length]} ago
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No recent activity found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
