import { useState } from 'react'
import { useGallery } from '../hooks/useGallery'
import { toast } from 'react-hot-toast'
import { uploadToBackend } from '@/UI/UploadBackend'
import { GalleryImage } from '@/types'

type GalleryForm = Omit<GalleryImage, 'id'>

export const AdminGallery = () => {
  const { images, addImage, updateGalleryItem, deleteImage } = useGallery()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const initialState: GalleryForm = {
    title: '',
    description: '',
    imageUrl: '',
    category: 'worship',
  }

  const [formData, setFormData] = useState<GalleryForm>(initialState)

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)

      const imageUrl = await uploadToBackend(file)

      setFormData((prev) => ({
        ...prev,
        imageUrl,
      }))

      setImagePreview(imageUrl)

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.log(error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (!formData.imageUrl) {
        toast.error('Please upload an image')
        return
      }

      if (editingId) {
        await updateGalleryItem(editingId, {
          ...formData,
          updatedAt: new Date(),
        })

        toast.success('Gallery updated successfully')
      } else {
        await addImage({
          ...formData,
        })

        toast.success('Image added successfully')
      }

      // RESET
      setFormData(initialState)
      setImagePreview(null)
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
      toast.error('Failed to save image')
    }
  }

  // -----------------------------
  // EDIT
  // -----------------------------
  const handleEdit = (item: GalleryImage) => {
    setEditingId(item.id || null)

    setFormData({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'worship',
    })

    setImagePreview(item.imageUrl || null)

    setIsFormOpen(true)
  }

  // -----------------------------
  // DELETE
  // -----------------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      await deleteImage(id)
      toast.success('Image deleted successfully')
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete image')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setImagePreview(null)
            setFormData(initialState)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {isFormOpen ? 'Cancel' : '+ Add Image'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'Edit Gallery Image' : 'Add New Gallery Image'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}
            <input
              type="text"
              name="title"
              placeholder="Image Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Image Description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* CATEGORY */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="worship">Worship</option>
              <option value="fellowship">Fellowship</option>
              <option value="youth">Youth</option>
              <option value="outreach">Outreach</option>
            </select>

            {/* IMAGE UPLOAD */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="gallery-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0])
                  }
                }}
              />

              <label
                htmlFor="gallery-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <p className="font-semibold text-gray-700">
                  Click to upload image
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, JPEG
                </p>
              </label>

              {/* LOADING */}
              {uploading && (
                <div className="mt-4">
                  <p className="text-blue-600 font-medium">
                    Uploading image...
                  </p>
                </div>
              )}

              {/* PREVIEW */}
              {imagePreview && (
                <div className="mt-6">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-52 w-full max-w-md object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {editingId ? 'Update Gallery' : 'Add Image'}
            </button>
          </form>
        </div>
      )}

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images?.map((item: GalleryImage) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <div className="relative overflow-hidden group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full capitalize">
                {item.category}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-xl mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                {item.description}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id!)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}