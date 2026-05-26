import { useParams, useNavigate } from 'react-router-dom'
import { useGallery } from '@/hooks'
import { useState } from 'react'

export const GalleryDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { images } = useGallery()

  const currentIndex = images.findIndex(item => item.id === id)
  const item = images[currentIndex]

  const [loading, setLoading] = useState(false)

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Image not found</p>
        <button
          onClick={() => navigate('/gallery')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  // 👉 Download Image
  const handleDownload = async () => {
    try {
      setLoading(true)
      const response = await fetch(item.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = item.title || 'gallery-image'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Download failed')
    } finally {
      setLoading(false)
    }
  }

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      navigate(`/gallery/${images[currentIndex + 1].id}`)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      navigate(`/gallery/${images[currentIndex - 1].id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate('/gallery')}
          className="mb-6 text-[#008080] font-semibold hover:underline"
        >
          ← Back to Gallery
        </button>

        {/* Image */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full max-h-[500px] object-cover"
          />

          {/* Content */}
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">{item.title}</h1>

            <p className="text-gray-600">{item.description}</p>

            <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm capitalize">
              {item.category}
            </span>

            {/* Actions */}
            <div className="flex gap-4 mt-4 flex-wrap">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {loading ? 'Downloading...' : 'Download Image'}
              </button>

              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                ← Previous
              </button>

              <button
                onClick={goNext}
                disabled={currentIndex === images.length - 1}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}