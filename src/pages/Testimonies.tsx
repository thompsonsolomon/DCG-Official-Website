import Breadcrumb from '@/UI/Breadcrum'
import { useTestimonies } from '../hooks/useTestimonies'
import { useState } from 'react'
import { uploadToBackend } from '@/UI/UploadBackend'
import toast from 'react-hot-toast'

type TestimonyForm = {
  name: string
  title: string
  story: string
  date: string
  imageUrl: string
}

export const Testimonies = () => {
  const { testimonies, addTestimony } = useTestimonies(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
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
      console.log(error)
      toast.error('Image upload failed')
    }
  }

  // -----------------------------------
  // SUBMIT
  // -----------------------------------
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      await addTestimony({
        ...formData,
        approved: false,
        createdAt: new Date(),
      })

      toast.success(
        'Testimony submitted successfully. Awaiting approval.'
      )

      // RESET
      setFormData({
        name: '',
        title: '',
        story: '',
        date: '',
        imageUrl: '',
      })

      setImagePreview(null)
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
      toast.error('Failed to submit testimony')
    }
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Breadcrumb
        title="Testimonies"
        backgroundImage="/asset/bg/bak4.jpg"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Testimonies' },
        ]}
      />

      {/* HERO SECTION */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-14">
            <span className="inline-block bg-[#008080]/10 text-[#008080] px-5 py-2 rounded-full text-sm font-semibold mb-5">
              Faith • Grace • Transformation
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Powerful Testimonies
              <br />
              From Our Church Family
            </h2>

            <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
              Every testimony is proof of God's goodness and faithfulness.
              Be encouraged as you read stories of healing, breakthroughs,
              restoration, provision, and transformed lives.
            </p>

            {/* SHARE BUTTON */}
            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen)

                setFormData({
                  name: '',
                  title: '',
                  story: '',
                  date: '',
                  imageUrl: '',
                })

                setImagePreview(null)
              }}
              className="mt-8 bg-[#008080] hover:bg-[#006666] text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg"
            >
              {isFormOpen
                ? 'Close Form'
                : 'Share Your Testimony'}
            </button>
          </div>

          {/* FORM */}
          {isFormOpen && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-16 border border-gray-100">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Share Your Testimony
                </h3>

                <p className="text-gray-600">
                  Tell others what God has done in your life.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title / Role
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g Church Member"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                {/* STORY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Testimony
                  </label>

                  <textarea
                    name="story"
                    placeholder="Share your testimony..."
                    value={formData.story}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                {/* DATE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload Image
                  </label>

                  <div className="border-2 border-dashed border-[#008080]/30 rounded-3xl p-8 text-center bg-[#008080]/5">
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
                      className="mb-5"
                    />

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-52 w-full max-w-md object-cover rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className="text-gray-500">
                        Upload a testimony image
                      </div>
                    )}
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-[#008080] hover:bg-[#006666] text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg"
                >
                  Submit Testimony
                </button>
              </form>
            </div>
          )}

          {/* TESTIMONIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonies.map((testimony) => (
              <div
                key={testimony.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-300 p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-6">
                  {testimony.imageUrl && (
                    <img
                      src={testimony.imageUrl}
                      alt={testimony.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-[#008080]/10"
                    />
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {testimony.name}
                    </h3>

                    <p className="text-[#008080] text-sm font-semibold">
                      {testimony.title}
                    </p>
                  </div>
                </div>

                {/* QUOTE ICON */}
                <div className="mb-4 text-[#008080]/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.17 6A5.001 5.001 0 002 11v7h7v-7H5.1A3.001 3.001 0 017.17 8H9V6H7.17zm10 0A5.001 5.001 0 0012 11v7h7v-7h-3.9A3.001 3.001 0 0117.17 8H19V6h-1.83z" />
                  </svg>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                  {testimony.story}
                </p>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {new Date(
                      testimony.date
                    ).toLocaleDateString()}
                  </p>

                  <span className="bg-[#008080]/10 text-[#008080] text-xs px-3 py-1 rounded-full font-semibold">
                    Shared Testimony
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {testimonies.length === 0 && (
            <div className="text-center py-20">
              <div className="text-7xl mb-4">🙏</div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No testimonies yet
              </h3>

              <p className="text-gray-600 text-lg">
                Be the first to share your testimony.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}