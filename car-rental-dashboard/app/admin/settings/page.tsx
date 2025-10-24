"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
import { Badge } from "@/components/ui-admin/badge"
import { Switch } from "@/components/ui-admin/switch"
import { DataTable } from "@/components/ui-admin/data-table"
import { ModalForm } from "@/components/ui-admin/modal-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { Plus, Upload } from "lucide-react"

const mockStaff = [
  {
    id: 1,
    name: "John Admin",
    email: "john@carrental.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-20",
  },
  {
    id: 2,
    name: "Sarah Staff",
    email: "sarah@carrental.com",
    role: "Staff",
    status: "active",
    lastLogin: "2024-01-19",
  },
]

export default function SettingsPage() {
  const [staff] = useState(mockStaff)
  const [showStaffModal, setShowStaffModal] = useState(false)

  const staffColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      render: (value: string) => <Badge variant={value === "Admin" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "destructive"}>{value}</Badge>,
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const handleStaffAction = (action: string, staffMember: any) => {
    if (action === "edit") {
      setShowStaffModal(true)
    }
  }

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowStaffModal(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground">Configure system settings and manage user accounts.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration for your car rental system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="CarRental Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" defaultValue="admin@carrental.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="darkMode" />
                <Label htmlFor="darkMode">Enable dark mode by default</Label>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Staff Accounts</h2>
            <Button onClick={() => setShowStaffModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </div>

          <DataTable data={staff} columns={staffColumns} onRowAction={handleStaffAction} />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Advanced system settings and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server (Email)</Label>
                <Input id="smtpServer" placeholder="smtp.gmail.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="your-email@gmail.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="themeColor">Primary Theme Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary rounded border"></div>
                  <Input id="themeColor" defaultValue="#3B82F6" className="flex-1" />
                </div>
              </div>

              <Button>Update System Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Staff Modal */}
      <ModalForm
        open={showStaffModal}
        onOpenChange={setShowStaffModal}
        title="Add Staff Member"
        description="Create a new staff account with appropriate permissions."
      >
        <form onSubmit={handleStaffSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Full Name</Label>
              <Input id="staffName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffEmail">Email</Label>
              <Input id="staffEmail" type="email" placeholder="john@carrental.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffRole">Role</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffPassword">Temporary Password</Label>
            <Input id="staffPassword" type="password" placeholder="Enter temporary password" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowStaffModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </ModalForm>
    </div>
  )
}
