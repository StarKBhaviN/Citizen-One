"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  ChevronDown,
  FileText,
  Home,
  HelpCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/theme-toggle";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";

export function AdminSidebar() {
  const { adminStats } = useDashboard();
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Complaints",
      href: "/admin/complaints",
      icon: ListTodo,
      badge: `${adminStats?.counts?.totalComplaints}`,
      children: [
        { name: "All Complaints", href: "/admin/complaints" },
        { name: "Pending", href: "/admin/complaints/pending" },
        { name: "In Progress", href: "/admin/complaints/in-progress" },
        { name: "Resolved", href: "/admin/complaints/resolved" },
      ],
    },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    // {
    //   name: "Messages",
    //   href: "/admin/messages",
    //   icon: MessageSquare,
    //   badge: "12",
    // },
    {
      name: "Departments",
      href: "/admin/departments",
      icon: Building2,
      children: [
        { name: "Water Department", href: "/admin/departments/water" },
        {
          name: "Electricity Department",
          href: "/admin/departments/electricity",
        },
        { name: "Roads Department", href: "/admin/departments/roads" },
        {
          name: "Sanitation Department",
          href: "/admin/departments/sanitation",
        },
        { name: "Public Services", href: "/admin/departments/public-services" },
      ],
    },
    // { name: "Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    // { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">C1</span>
          </div>
          <span className="font-semibold text-lg">CitizenOne</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navigation.map((item) => {
            const active = isActive(item.href);

            if (item.children) {
              return (
                <Collapsible key={item.name} defaultOpen={active}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="h-5 px-1.5 text-xs font-normal"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                              childActive
                                ? "bg-primary/5 text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-xs font-normal"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Go to citizen view</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/placeholder.svg?height=36&width=36"
                    alt="Avatar"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="grid gap-0.5 text-xs">
            <div className="font-medium">{user?.name}</div>
            <div className="text-muted-foreground">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
