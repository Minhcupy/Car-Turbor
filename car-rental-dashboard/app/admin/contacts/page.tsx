"use client"

import type React from "react"

import { useState } from "react"
import { DataTable } from "@/components/ui-admin/data-table"
import { ModalForm } from "@/components/ui-admin/modal-form"
import { Button } from "@/components/ui-admin/button"
import { Textarea } from "@/components/ui-admin/textarea"
import { Badge } from "@/components/ui-admin/badge"

const mockMessages = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice@email.com",
    subject: "Question about luxury car rentals",
    date: "2024-01-20",
    status: "new",
    message: "Hi, I am interested in renting a luxury car for my wedding. Do you have BMW or Mercedes available?",
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@email.com",
    subject: "Booking cancellation request",
    date: "2024-01-19",
    status: "responded",
    message: "I need to cancel my booking BK002 due to emergency. Please process the refund.",
  },
]

export default function ContactsPage() {
  const [messages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "subject", label: "Subject", sortable: true },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "new" ? "default" : "secondary"}>{value}</Badge>,
    },
  ]

  const handleRowAction = (action: string, message: any) => {
    if (action === "view" || action === "reply") {
      setSelectedMessage(message)
      setShowReplyModal(true)
    }
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowReplyModal(false)
    setSelectedMessage(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Contacts</h1>
        <p className="text-muted-foreground">Manage customer inquiries and support messages.</p>
      </div>

      <DataTable data={messages} columns={columns} onRowAction={handleRowAction} />

      {/* Reply Modal */}
      <ModalForm
        open={showReplyModal}
        onOpenChange={setShowReplyModal}
        title="Customer Message"
        description="View message and compose reply."
      >
        {selectedMessage && (
          <form onSubmit={handleReplySubmit} className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Original Message</h3>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">From:</span> {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-sm">
                  <span className="font-medium">Subject:</span> {selectedMessage.subject}
                </p>
                <p className="text-sm mt-2">{selectedMessage.message}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reply</label>
              <Textarea placeholder="Type your reply here..." rows={6} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowReplyModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Reply</Button>
            </div>
          </form>
        )}
      </ModalForm>
    </div>
  )
}
