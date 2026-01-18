"use client"

import React, {useMemo} from "react"

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
  const [page, setPage] = useState(0)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))

  const pagePosts = useMemo(() => {
    const start = page * pageSize
    return posts.slice(start, start + pageSize)
  }, [posts, page])

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

  const pgBtn =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-gray-300 text-gray-700 hover:bg-gray-100 " +
      "disabled:opacity-40 disabled:cursor-not-allowed"

  const pgBtnActive =
      "h-8 min-w-[32px] px-2 border rounded text-sm " +
      "border-blue-500 bg-blue-500 text-white"

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

      <DataTable data={pagePosts} columns={columns} onRowAction={handleRowAction} />

      {/* Pagination (FE) */}
      {totalPages > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              Trang <b>{page + 1}</b>/<b>{totalPages}</b>
            </span>

              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => setPage(0)}
              >
                «
              </Button>

              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ‹
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                      key={i}
                      className={i === page ? pgBtnActive : pgBtn}
                      variant="ghost"
                      onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
              ))}

              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                ›
              </Button>

              <Button
                  className={pgBtn}
                  variant="ghost"
                  size="icon"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
              >
                »
              </Button>

              <span className="text-sm text-muted-foreground ml-2">
               Tổng: <b>{posts.length}</b> bài viết
              </span>
            </div>
          </div>
      )}

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
