import { useGallery } from '@/hooks'
import Breadcrumb from '@/UI/Breadcrum'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Gallery = () => {
  const { images } = useGallery()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()
  const categories = ['all', ...new Set(images?.map(item => item.category))]
  const filteredItems = selectedCategory === 'all'
    ? images
    : images.filter(item => item.category === selectedCategory)

  return (
    <div className="w-full">
      <Breadcrumb
        title="Our Gallery"
        backgroundImage="/asset/bg/20.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "gallery" },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories?.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${selectedCategory === cat
                    ? 'bg-[#008080] text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems?.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer group"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                <div className="relative overflow-hidden h-48 group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full cursor-zoom-in object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="absolute cursor-zoom-in inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">


                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
                  <button onClick={() => navigate(`/gallery/${item.id}`)}
                    className="text-[#008080] font-semibold hover:text-accent">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No images in this category</p>
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl">
              ×
            </button>
            <img src={selectedImage} alt="Full view" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
