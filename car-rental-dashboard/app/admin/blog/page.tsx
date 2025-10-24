"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui-admin/data-table"
import { ModalForm } from "@/components/ui-admin/modal-form"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Textarea } from "@/components/ui-admin/textarea"
import { Badge } from "@/components/ui-admin/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-admin/select"
import { Switch } from "@/components/ui-admin/switch"
import { Plus } from "lucide-react"
import { postsApi } from "@/src/services/api"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await postsApi.getAll()
        setPosts(postsData)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "author", label: "Author", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "published" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const handleRowAction = (action: string, post: any) => {
    if (action === "edit") {
      setEditingPost(post)
      setShowPostModal(true)
    } else if (action === "delete") {
      console.log("Delete post:", post)
    }
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPostModal(false)
    setEditingPost(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Blog</h1>
          <p className="text-muted-foreground">Manage blog posts and content for your website.</p>
        </div>
        <Button onClick={() => setShowPostModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <DataTable data={posts} columns={columns} onRowAction={handleRowAction} />

      {/* Post Modal */}
      <ModalForm
        open={showPostModal}
        onOpenChange={setShowPostModal}
        title={editingPost ? "Edit Post" : "Create New Post"}
        description="Write and publish blog content."
      >
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Post title..." defaultValue={editingPost?.title} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue={editingPost?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel-tips">Travel Tips</SelectItem>
                  <SelectItem value="electric-vehicles">Electric Vehicles</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" placeholder="Author name" defaultValue={editingPost?.author || "Admin"} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              rows={8}
              defaultValue={editingPost?.content}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="published" defaultChecked={editingPost?.status === "published"} />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowPostModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingPost ? "Update Post" : "Create Post"}</Button>
          </div>
        </form>
      </ModalForm>
    </div>
  )
}
