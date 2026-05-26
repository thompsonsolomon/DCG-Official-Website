import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import Breadcrumb from '@/UI/Breadcrum'

export const BlogDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { blogs } = useBlogs()

  const blog = blogs.find(item => item.id === id)

  // 👉 Related blogs (simple logic)
  const relatedBlogs = blogs
    .filter(item => item.id !== id)
    .slice(0, 3)

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Blog not found</p>
        <button
          onClick={() => navigate('/blog')}
          className="mt-4 px-4 py-2 bg-[#008080] text-white rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate('/blog')}
            className="mb-6 text-[#008080] font-semibold hover:underline"
          >
            ← Back to Blogs
          </button>

          {/* Blog Card */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* Image */}
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-[300px] object-cover"
              />
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              <h1 className="text-3xl font-bold">{blog.title}</h1>

              <p className="text-gray-500 text-sm">
                {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>

              {/* Share */}
              <div className="pt-4 flex gap-4 flex-wrap">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Copy Link
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map(item => (
                <Link
                  key={item.id}
                  to={`/blog/${item.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg line-clamp-2">
                      {item.title}
                    </h3>
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