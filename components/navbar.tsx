"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Leaf, Menu, User, LogOut, BarChart3, Home, Info, Mail, Settings, Zap, BookOpen, Search, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProfileManagement } from "@/components/profile-management"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Features", href: "/features", icon: Zap },
  { name: "How It Works", href: "/how-it-works", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
]

const searchableContent = [
  { title: "Dashboard", url: "/dashboard", description: "View your carbon footprint tracking dashboard" },
  { title: "Log Activity", url: "/dashboard", description: "Record your eco-friendly activities" },
  { title: "Carbon Chart", url: "/dashboard", description: "Visualize your carbon emissions over time" },
  { title: "Weekly Report", url: "/dashboard", description: "See your weekly environmental impact" },
  { title: "Streak Tracker", url: "/dashboard", description: "Track your daily eco-activity streak" },
  { title: "Badges", url: "/dashboard", description: "View your environmental achievement badges" },
  { title: "Profile Settings", url: "/dashboard", description: "Manage your account and preferences" },
  { title: "About Us", url: "/about", description: "Learn about CarbonWise mission and values" },
  { title: "Features", url: "/features", description: "Discover all CarbonWise features and capabilities" },
  { title: "How It Works", url: "/how-it-works", description: "Understand how carbon tracking works" },
  { title: "Contact", url: "/contact", description: "Get in touch with our support team" },
  { title: "Sign Up", url: "/auth/signup", description: "Create your CarbonWise account" },
  { title: "Sign In", url: "/auth/signin", description: "Access your existing account" },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(searchableContent)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleAuthClick = (type: "signin" | "signup") => {
    router.push(`/auth/${type}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults(searchableContent)
      return
    }

    const filtered = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  const handleSearchSelect = (url: string) => {
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults(searchableContent)
    router.push(url)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">CarbonWise</span>
          </Link>

          {/* Desktop Navigation - Hidden on smaller screens */}
          <div className="hidden xl:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-green-600 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Right Side - Search + Auth */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
            {/* Search Button - Only Icon */}
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Search CarbonWise</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search features, pages, or help topics..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSearch("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSelect(result.url)}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{result.title}</div>
                            <div className="text-sm text-gray-600 mt-1">{result.description}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No results found for "{searchQuery}"</p>
                        <p className="text-sm mt-1">Try searching for features, pages, or help topics</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="hidden lg:flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="lg:hidden h-8 w-8 p-0"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="sr-only">Dashboard</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="lg:hidden">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Profile Settings</DialogTitle>
                        </DialogHeader>
                        <ProfileManagement />
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleAuthClick("signin")} className="text-sm">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => handleAuthClick("signup")} className="text-sm">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center space-x-2 mb-8">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-bold">CarbonWise</span>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Search className="mr-2 h-4 w-4" />
                        Search CarbonWise
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Search CarbonWise</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search features, pages, or help topics..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.length > 0 ? (
                            <div className="space-y-2">
                              {searchResults.map((result, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    handleSearchSelect(result.url)
                                    setMobileMenuOpen(false)
                                  }}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                                >
                                  <div className="font-medium text-gray-900">{result.title}</div>
                                  <div className="text-sm text-gray-600 mt-1">{result.description}</div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No results found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive
                            ? "text-green-600 bg-green-50"
                            : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile Auth */}
                <div className="mt-8 pt-8 border-t">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {user.email?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/dashboard")
                          setMobileMenuOpen(false)
                        }}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Profile Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Profile Settings</DialogTitle>
                          </DialogHeader>
                          <ProfileManagement />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleAuthClick("signin")
                          setMobileMenuOpen(false)
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          handleAuthClick("signup")
                          setMobileMenuOpen(false)
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
