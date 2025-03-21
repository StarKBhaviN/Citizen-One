"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  User,
  Bell,
  FileText,
  Search,
  Home,
  HelpCircle,
  MessageSquare,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  {
    name: "Complaints",
    href: "#",
    icon: FileText,
    children: [
      { name: "Submit Complaint", href: "/submit-complaint" },
      { name: "Track Complaint", href: "/track-complaint" },
      { name: "My Complaints", href: "/dashboard" },
    ],
  },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Contact Us", href: "/contact", icon: MessageSquare },
]

export function CitizenHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U"

    const nameParts = user.name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Citizen Complaint System</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C1</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline-block">CitizenOne</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) =>
            item.children ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-1 px-2",
                      item.children.some((child) => isActive(child.href)) ? "text-primary" : "",
                    )}
                  >
                    {item.name} <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.name} asChild>
                      <Link href={child.href} className={cn(isActive(child.href) ? "bg-muted" : "")}>
                        {child.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium leading-6 transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-foreground",
                )}
              >
                {item.name}
              </Link>
            ),
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/track-complaint">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">Complaint Status Updated</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">Feedback Requested</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">New Comment</div>
                  <div className="text-xs text-muted-foreground">3 days ago</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=notifications" className="w-full cursor-pointer">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Language</span>
          </Button>

          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg?height=36&width=36"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", mobileMenuOpen ? "fixed inset-0 z-50" : "hidden")}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Citizen Complaint System</span>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">C1</span>
                </div>
                <span className="font-semibold text-lg">CitizenOne</span>
              </div>
            </Link>
            <Button variant="ghost" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) =>
                  item.children ? (
                    <div key={item.name} className="space-y-1">
                      <div className="px-3 text-sm font-semibold leading-6">{item.name}</div>
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-muted",
                            isActive(child.href) ? "bg-muted text-primary" : "text-foreground",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-muted",
                        isActive(item.href) ? "bg-muted text-primary" : "text-foreground",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </div>
                    </Link>
                  ),
                )}
              </div>
              <div className="py-6">
                <div className="flex items-center gap-4 mb-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/track-complaint" onClick={() => setMobileMenuOpen(false)}>
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </Link>
                  </Button>

                  {isAuthenticated && (
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        3
                      </span>
                      <span className="sr-only">Notifications</span>
                    </Button>
                  )}

                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Language</span>
                  </Button>

                  <ModeToggle />
                </div>

                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-4 mt-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.avatar || "/placeholder.svg?height=36&width=36"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <Button asChild variant="outline" className="justify-start" size="sm">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="justify-start" size="sm">
                        <Link href="/dashboard?tab=settings" onClick={() => setMobileMenuOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </Button>
                      <Button variant="default" className="mt-2" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Button asChild variant="default">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

