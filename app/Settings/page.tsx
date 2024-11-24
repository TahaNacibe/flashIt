"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Bell, User, Shield, Moon, Sun, Smartphone, Plus, Camera } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import DeleteConfirmationDialog from "../dialogs/confirm_delete"
import LoadingSpinner from "@/components/animation/loading"
import { useTheme } from "../theme_provider"
import SignInPage from "../SignIn/page"
import Link from "next/link"

export default function SettingsPage() {
  //* get params
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  //* manage state
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [mobileNotifications, setMobileNotifications] = useState(true)
  const [loadingState, setLoadingState] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  //* get user details 
  const [userName, setUserName] = useState(session?.user.name ?? "...")

  //* handle the image state 
  const [previewItem, setPreviewItem] = useState<File | null>()
  const [previewItemImageView, setPreviewItemImageView] = useState<string | null>()

  // Load saved theme and user preferences
  useEffect(() => {
    setIsDarkMode(theme === 'dark' ? true : false)
    if (session?.user.name) {
      setUserName(session.user.name)
    }
    setLoadingState(false)
  }, [session])



  // Handle theme toggle with persistence
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    setTheme(theme === 'dark' ? 'light' : 'dark')
    
    toast({
      title: `${newDarkMode ? 'Dark' : 'Light'} theme activated`,
      description: `Theme preference saved`,
      duration: 2000,
    })
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion is being processed.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    }
  }



  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsSaving(true)
    try {
      let url
      if (previewItem) {
        url = await handleUpload()
      }

      const response = await fetch("api/connection/user", {
        method: "PUT",
        body: JSON.stringify({ userId: session?.user.id, userName, pfp: url })
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved successfully.",
        })
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }


  //* handle the change in the pfp
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      })
      return
    }

    setPreviewItem(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewItemImageView(reader.result as string)
    }
    reader.readAsDataURL(file)
  }



  //* handle upload the image
  const handleUpload = async () => {
    if (!previewItem) return null
    
    const formData = new FormData()
    formData.append("file", previewItem)

    const response = await fetch("/api/connection/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    return response.ok ? data.url : null
  }


  //* the widget of the profile
  const ProfileWidget = () => {
    return (
      <div className="relative rounded-full w-32 h-32 group overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          disabled={!isEditing}
        />
        <img
          src={previewItemImageView ?? session?.user.image ?? '/user.png'}
          alt="Profile"
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    )
  }


  //* handle cancel editing action
  const cancelEditing = () => {
    setIsEditing(false)
    setPreviewItem(null)
    setPreviewItemImageView(null)
    setUserName(session?.user.name ?? "...")
  }


  //* in case of loading 
  if (loadingState) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const EditButton = () => {
    if (session) {
      return (<Button onClick={() => setIsEditing(true)}>
      Edit Profile
    </Button>)
    } else {
      return (
        <Link href={"/SignIn"}> <Button>
      Log In
    </Button>
        </ Link>
        )
    }
  }



  //* ui tree
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="transition-shadow hover:shadow-md">
          {/* headers */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your profile information
            </CardDescription>
          </CardHeader>
          {/* content */}
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* profile image */}
              <div className="flex justify-center">
                <ProfileWidget />
              </div>
              {/* user name  */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!isEditing}
                    className="max-w-md"
                  />
                </div>
                {/* buttons */}
                <div className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={cancelEditing}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <LoadingSpinner />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </>
                  ) : (
                    <EditButton />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* preferences tab */}
        <Card className="transition-shadow hover:shadow-md">
          {/* header */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your app experience
            </CardDescription>
          </CardHeader>
          {/* content */}
          <CardContent className="space-y-6">
            {/* dark mode toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <Separator className="my-4" />

            {/* other stuff */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div className="space-y-0.5">
                  <Label>Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                <div className="space-y-0.5">
                  <Label>Mobile Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your mobile device
                  </p>
                </div>
              </div>
              <Switch
                checked={mobileNotifications}
                onCheckedChange={setMobileNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* delete account  */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Manage your account security and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <DeleteConfirmationDialog
                title="Delete Account"
                itemName={userName || "account"}
                itemType="account"
                deleteCase={true}
                onConfirm={handleDeleteAccount}
                trigger={
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}