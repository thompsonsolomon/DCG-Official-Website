import { useState } from 'react'
import { useBlogs } from '../hooks/useBlogs'
import { toast } from 'react-hot-toast'
import { uploadToBackend } from '@/UI/UploadBackend'
import { BlogPost } from '@/types'

export const AdminBlog = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogs()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const initialState: BlogPost = {
    id: '',
    title: '',
    content: '',
    date: '',
    imageUrl: '',
  }

  const [formData, setFormData] = useState<BlogPost>(initialState)

  // -------------------------
  // INPUT HANDLER
  // -------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // -------------------------
  // IMAGE UPLOAD
  // -------------------------
  const handleImageUpload = async (file: File) => {
    try {
      const fileUrl = await uploadToBackend(file)

      setFormData((prev) => ({
        ...prev,
        imageUrl: fileUrl,
      }))

      setImagePreview(fileUrl)

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Image upload failed')
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const basePayload = {
      ...formData,
      updatedAt: new Date(),
    }

    // ONLY add createdAt when creating
    const payload = editingId
      ? basePayload
      : {
          ...basePayload,
          createdAt: new Date(),
        }

    if (editingId) {
      await updateBlog(editingId, payload)
      toast.success('Blog updated successfully')
    } else {
      await addBlog(payload)
      toast.success('Blog created successfully')
    }

    setFormData({
      id: '',
      title: '',
      content: '',
      date: '',
      imageUrl: '',
    })

    setEditingId(null)
    setIsFormOpen(false)
    setImagePreview(null)
  } catch (error) {
    console.error(error)
    toast.error('Failed to save blog')
  }
}

  // -------------------------
  // EDIT
  // -------------------------
  const handleEdit = (blog: BlogPost) => {
    setFormData({
      id: blog.id || '',
      title: blog.title || '',
      content: blog.content || '',
      date: blog.date || '',
      imageUrl: blog.imageUrl || '',
    })

    setImagePreview(blog.imageUrl || null)
    setEditingId(blog.id || null)
    setIsFormOpen(true)
  }

  // -------------------------
  // DELETE
  // -------------------------
  const handleDelete = async (id: string) => {
    if (!id) return toast.error('Invalid blog ID')

    const confirmDelete = window.confirm('Delete this blog?')
    if (!confirmDelete) return

    try {
      await deleteBlog(id)
      toast.success('Blog deleted successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete blog')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData(initialState)
            setImagePreview(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {isFormOpen ? 'Cancel' : '+ New Article'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Article Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <textarea
              name="content"
              placeholder="Article Content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            {/* IMAGE UPLOAD */}
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0])
                  }
                }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-4 mx-auto h-40 object-cover rounded-lg"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingId ? 'Update Article' : 'Create Article'}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Content</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b hover:bg-gray-50">

                <td className="px-6 py-4">
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  )}
                </td>

                <td className="px-6 py-4 font-semibold">{blog.title}</td>

                <td className="px-6 py-4">
                  {new Date(blog.date).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                  {blog.content}
                </td>

                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id!)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}