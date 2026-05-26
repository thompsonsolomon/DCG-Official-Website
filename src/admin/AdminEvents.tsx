import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { toast } from 'react-hot-toast'
import { Event } from '../types'
import { uploadToBackend } from '@/UI/UploadBackend'

export const AdminEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const initialState: Event = {
    id: '',
    EventTitle: '',
    disc: '',
    date: '',
    time: '',
    location: '',
    category: 'worship',
    image: '',
    Imgurl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const [formData, setFormData] = useState<Event>(initialState)

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const fileUrl = await uploadToBackend(file)

      setFormData((prev) => ({
        ...prev,
        Imgurl: fileUrl,
      }))

      setImagePreview(fileUrl)

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Image upload failed')
    }
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        updatedAt: new Date(),
        createdAt: editingId ? formData.createdAt : new Date(),
      }

      if (editingId) {
        await updateEvent(editingId, payload)
        toast.success('Event updated successfully')
      } else {
        await addEvent(payload)
        toast.success('Event created successfully')
      }

      // RESET
      setFormData(initialState)
      setEditingId(null)
      setIsFormOpen(false)
      setImagePreview(null)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save event')
    }
  }

  // -----------------------------
  // EDIT
  // -----------------------------
  const handleEdit = (event: Event) => {
    setFormData({
      ...event,
      date: event.date?.slice(0, 10),
    })

    setImagePreview(event.Imgurl || null)
    setEditingId(event.id || null)
    setIsFormOpen(true)
  }

  // -----------------------------
  // DELETE
  // -----------------------------
  const handleDelete = async (id: string) => {
    if (!id) return toast.error('Invalid event ID')

    const confirmDelete = window.confirm('Delete this event?')
    if (!confirmDelete) return

    try {
      await deleteEvent(id)
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete event')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events Management</h1>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData(initialState)
            setImagePreview(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          {isFormOpen ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="EventTitle"
              placeholder="Event Title"
              value={formData.EventTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <textarea
              name="disc"
              placeholder="Event Description"
              value={formData.disc}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg"
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg"
              />
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
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

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="worship">Worship</option>
              <option value="fellowship">Fellowship</option>
              <option value="outreach">Outreach</option>
              <option value="youth">Youth</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingId ? 'Update Event' : 'Create Event'}
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
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Category</th>
                            <th className="px-6 py-3 text-left">Feature</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {event.Imgurl && (
                    <img
                      src={event.Imgurl}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  )}
                </td>

                <td className="px-6 py-4">{event.EventTitle}</td>
                <td className="px-6 py-4">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{event.location}</td>

                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {event.featured ? (
                    <button className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Featured
                    </button>
                  ) : (
                    <button className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      Normal
                    </button>
                  )}
                </td>

                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event.id!)}
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