import { useState } from 'react'
import { useSermons } from '../hooks/useSermons'
import Breadcrumb from '@/UI/Breadcrum'
import { Link } from 'react-router-dom'
import { CardSkeleton } from '@/UI/FlipCard'

export const Sermons = () => {
  const { sermons, loading } = useSermons()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSermons = sermons.filter(sermon =>
    sermon.SermonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.SermonTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full">
      <Breadcrumb
        title="Sermons"
        backgroundImage="/asset/bg/1.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Sermons" },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by title, speaker, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {
            
                loading
                                      ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
                                      : 

            filteredSermons.map((sermon) => (
              <Link to={`/sermons/${sermon.id}`} key={sermon.id}>
              <div key={sermon.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {sermon.videoUrl ? (
                  <div className="bg-black h-40 flex items-center justify-center">
                    <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </a>
                  </div>
                ) 
              : (
                   <img
            src={sermon.Imgurl || "/asset/bg/1.jpg"}
            alt={sermon.SermonTitle}
            className="w-full h-48 object-cover"
          />

              )
              }
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{sermon.SermonTitle}</h3>
                  <p className="text-[#008080] mb-2"><strong>Speaker:</strong> {sermon.preacher}</p>
                  <p className="text-gray-600 mb-4"><strong>Topic:</strong> {sermon.SermonTitle}</p>
                                      <p className="text-gray-600 mb-2 max-w-xs truncate"> <strong>Description: </strong>{sermon.description}</p>

                  <p className="text-sm text-gray-500">{new Date(sermon.date).toLocaleDateString()}</p>
                </div>
              </div>
              </Link>
            ))
            
            }
          </div>

          {filteredSermons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No sermons found matching your search</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
