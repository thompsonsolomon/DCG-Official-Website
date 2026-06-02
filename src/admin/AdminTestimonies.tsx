import { useState } from 'react'
import { useTestimonies } from '../hooks/useTestimonies'
import { toast } from 'react-hot-toast'
import { Testimony } from '../types'
import { uploadToBackend } from '@/UI/UploadBackend'

type TestimonyForm = {
  name: string
  title: string
  story: string
  date: string
  imageUrl: string
}

export const AdminTestimonies = () => {
  // ✅ ADMIN SHOULD SEE ALL TESTIMONIES
  const {
    testimonies,
    addTestimony,
    deleteTestimony,
    approveTestimony,
  } = useTestimonies(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<TestimonyForm>({
    name: '',
    title: '',
    story: '',
    date: '',
    imageUrl: '',
  })

  // -----------------------------------
  // INPUT CHANGE
  // -----------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // -----------------------------------
  // IMAGE UPLOAD
  // -----------------------------------
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

  // -----------------------------------
  // SUBMIT (CREATE / UPDATE FIXED)
  // -----------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        updatedAt: new Date(),
      }

      // ✅ UPDATE
      // if (editingId) {
      //   await updateTestimony(editingId, payload)

      //   toast.success('Testimony updated successfully')
      // }

      // ✅ CREATE
      // else {
        await addTestimony({
          ...payload,
          approved: false,
          createdAt: new Date(),
        })

        toast.success('Testimony created successfully')
      // }

      // RESET
      setFormData({
        name: '',
        title: '',
        story: '',
        date: '',
        imageUrl: '',
      })

      setImagePreview(null)
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save testimony')
    }
  }

  // -----------------------------------
  // EDIT FIXED
  // -----------------------------------
  const handleEdit = (testimony: Testimony) => {

    setFormData({
      name: testimony.name || '',
      title: testimony.title || '',
      story: testimony.story || '',
      date: testimony.date || '',
      imageUrl: testimony.imageUrl || '',
    })

    setImagePreview(testimony.imageUrl || null)

    // ✅ VERY IMPORTANT
    // setEditingId(testimony.id)

    setIsFormOpen(true)
  }

  // -----------------------------------
  // DELETE
  // -----------------------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return

    try {
      await deleteTestimony(id)

      toast.success('Testimony deleted successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete testimony')
    }
  }

  // -----------------------------------
  // APPROVE
  // -----------------------------------
  const handleApprove = async (id: string) => {
    try {
      await approveTestimony(id)

      toast.success('Testimony approved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to approve testimony')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Testimonies Management
        </h1>

        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen)

            setEditingId(null)

            setImagePreview(null)

            setFormData({
              name: '',
              title: '',
              story: '',
              date: '',
              imageUrl: '',
            })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {isFormOpen ? 'Cancel' : '+ New Testimony'}
        </button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId
              ? 'Edit Testimony'
              : 'Create New Testimony'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Person's Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="text"
              name="title"
              placeholder="Title / Role"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <textarea
              name="story"
              placeholder="Testimony Story"
              value={formData.story}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* IMAGE UPLOAD */}
            <div className="border-2 border-dashed rounded-2xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (
                    e.target.files &&
                    e.target.files[0]
                  ) {
                    handleImageUpload(
                      e.target.files[0]
                    )
                  }
                }}
                className="mb-4"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-44 w-full max-w-sm object-cover rounded-xl shadow"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {editingId
                ? 'Update Testimony'
                : 'Create Testimony'}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">
                Image
              </th>

              <th className="px-6 py-3 text-left">
                Name
              </th>

              <th className="px-6 py-3 text-left">
                Title
              </th>

              <th className="px-6 py-3 text-left">
                Date
              </th>

              <th className="px-6 py-3 text-left">
                Status
              </th>

              <th className="px-6 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {testimonies.map((testimony) => (
              <tr
                key={testimony.id}
                className="border-b hover:bg-gray-50"
              >
                {/* IMAGE */}
                <td className="px-6 py-4">
                  {testimony.imageUrl && (
                    <img
                      src={testimony.imageUrl}
                      alt={testimony.name}
                      className="h-14 w-14 object-cover rounded-lg"
                    />
                  )}
                </td>

                {/* NAME */}
                <td className="px-6 py-4 font-semibold">
                  {testimony.name}
                </td>

                {/* TITLE */}
                <td className="px-6 py-4">
                  {testimony.title}
                </td>

                {/* DATE */}
                <td className="px-6 py-4">
                  {new Date(
                    testimony.date
                  ).toLocaleDateString()}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  {testimony.approved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Pending
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 space-x-3">
                  {!testimony.approved && (
                    <button
                      onClick={() =>
                        handleApprove(testimony.id!)
                      }
                      className="text-green-600 hover:text-green-800 font-semibold"
                    >
                      Approve
                    </button>
                  )}

                  {/* <button
                    onClick={() =>
                      handleEdit(testimony)
                    }
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Edit
                  </button> */}

                  <button
                    onClick={() =>
                      handleDelete(testimony.id!)
                    }
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY */}
        {testimonies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No testimonies found
          </div>
        )}
      </div>
    </div>
  )
}