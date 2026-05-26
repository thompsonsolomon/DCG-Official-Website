import { useState } from 'react'
import { useSermons } from '../hooks/useSermons'
import { toast } from 'react-hot-toast'
import { uploadToBackend } from '@/UI/UploadBackend'
import { Sermon, SermonForm } from '@/types'


export const AdminSermons = () => {
  const { sermons, addSermon, updateSermon, deleteSermon } = useSermons()

  const [isFormOpen, setIsFormOpen] = useState(false)
const [editingId, setEditingId] = useState<string | null>(null)
const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<SermonForm>({
    SermonTitle: '',
    preacher: '',
    topic: '',
    date: '',
    Imgurl: '',
  })

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // -----------------------------
  // IMAGE UPLOAD (FIXED)
  // -----------------------------
const handleImageUpload = async (file: File) => {
  try {
    const res = await uploadToBackend(file)

    const fileUrl =   res

    if (!fileUrl) {
      console.log('Invalid upload response:', res)
      throw new Error('No image URL returned')
    }

    setImagePreview(fileUrl)

    setFormData((prev) => {
      const updated = { ...prev, Imgurl: fileUrl }
      console.log('UPDATED FORM:', updated) // 🔥 debug
      return updated
    })

    toast.success('Image uploaded successfully')
  } catch (err) {
    console.log('UPLOAD ERROR:', err)
    toast.error('Image upload failed')
  }
}

  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    if (editingId) {
      // ✅ ONLY send safe update fields
      const { SermonTitle, preacher, topic, date, Imgurl } = formData

      const payload = {
        SermonTitle,
        preacher,
        topic,
        date,
        Imgurl,
        updatedAt: new Date(),
      }

      console.log('Updating sermon with ID:', editingId)

      await updateSermon(editingId, payload)

      toast.success('Sermon updated successfully')
    } else {
     

      const payload = {
  ...formData,
  image: formData.image || '',
  Imgurl: formData.Imgurl || '',
  description: formData.description || '',
  videoUrl: formData.videoUrl || '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

      await addSermon(payload)

      toast.success('Sermon created successfully')
    }

    // reset
    setFormData({
      SermonTitle: '',
      preacher: '',
      topic: '',
      date: '',
      Imgurl: '',
    })

    setEditingId(null)
    setIsFormOpen(false)
    setImagePreview(null)
  } catch (error) {
    console.log(error)
    toast.error('Failed to save sermon')
  }
}


  // -----------------------------
  // EDIT FIXED
  // -----------------------------
  const handleEdit = (sermon: Sermon) => {
    setEditingId(sermon.id || null)
    // console.log('Editing sermon:', sermon.id) // Debug log
    setFormData({
      SermonTitle: sermon.SermonTitle || '',
      preacher: sermon.preacher || '',
      topic: sermon.topic || '',
      date: sermon.date || '',
      Imgurl: sermon.Imgurl || '',
    })

    setImagePreview(sermon.Imgurl || null)
    setIsFormOpen(true)

  }

  // -----------------------------
  // DELETE FIXED
  // -----------------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return

    try {
      await deleteSermon(id)
      toast.success('Sermon deleted successfully')
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete sermon')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sermons Management</h1>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setImagePreview(null)

            setFormData({
              SermonTitle: '',
              preacher: '',
              topic: '',
              date: '',
              Imgurl: '',
            })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {isFormOpen ? 'Cancel' : '+ New Sermon'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'Edit Sermon' : 'Create New Sermon'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="SermonTitle"
              placeholder="Sermon Title"
              value={formData.SermonTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />

            <input
              type="text"
              name="preacher"
              placeholder="Preacher"
              value={formData.preacher}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />

            <input
              type="text"
              name="topic"
              placeholder="Topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />

            {/* IMAGE UPLOAD */}
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-4 mx-auto h-40 object-cover rounded-lg shadow"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              {editingId ? 'Update Sermon' : 'Create Sermon'}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Preacher</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Topic</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sermons.map((sermon) => (
              <tr key={sermon.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {sermon.Imgurl && (
                    <img
                      src={sermon.Imgurl}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  )}
                </td>

                <td className="px-6 py-4">{sermon.SermonTitle}</td>
                <td className="px-6 py-4">{sermon.preacher}</td>
                <td className="px-6 py-4">
                  {new Date(sermon.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{sermon.topic}</td>

                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => handleEdit(sermon)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(sermon.id)}
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