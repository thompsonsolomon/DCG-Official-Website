import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSermons } from '../hooks/useSermons'
import Breadcrumb from '@/UI/Breadcrum'

export const SermonDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sermons } = useSermons()

  const sermon = sermons.find(item => item.id === id)

  const relatedSermons = sermons
    .filter(item => item.id !== id)
    .slice(0, 3)

  if (!sermon) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Sermon not found</p>
        <button
          onClick={() => navigate('/sermons')}
          className="mt-4 px-4 py-2 bg-[#008080] text-white rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <Breadcrumb
        title={sermon.SermonTitle}
        backgroundImage="/asset/bg/1.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Sermons", path: "/sermons" },
          { label: sermon.SermonTitle },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate('/sermons')}
            className="mb-6 text-[#008080] font-semibold hover:underline"
          >
            ← Back to Sermons
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* Video OR Image */}
            {sermon.videoUrl ? (
              <div className="w-full h-[300px]">
                <iframe
                  src={sermon.videoUrl}
                  title={sermon.SermonTitle}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={sermon.Imgurl || "/asset/bg/1.jpg"}
                alt={sermon.SermonTitle}
                className="w-full h-[300px] object-cover"
              />
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              <h1 className="text-3xl font-bold">{sermon.SermonTitle}</h1>

              <p className="text-gray-600">
                <strong>Speaker:</strong> {sermon.preacher}
              </p>

              <p className="text-gray-600">
                <strong>Topic:</strong> {sermon.topic}
              </p>

              <p className="text-gray-500 text-sm">
                {new Date(sermon.date || Date.now()).toLocaleDateString()}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 pt-4">

                {/* Download */}
                {sermon.videoUrl && (
                  <a
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#008080] text-white rounded-lg"
                  >
                    Watch / Download
                  </a>
                )}

                {/* Copy Link */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Copy Link
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Share
                </a>
              </div>
            </div>
          </div>

          {/* RELATED SERMONS */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Sermons</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedSermons.map(item => (
                <Link
                  key={item.id}
                  to={`/sermons/${item.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={item.Imgurl || "/asset/bg/1.jpg"}
                    alt={item.SermonTitle}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-bold line-clamp-2">
                      {item.SermonTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.preacher}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}