import { useState } from 'react'
import { useBlogs } from '../hooks/useBlogs'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/UI/Breadcrum'

export const Blog = () => {
  const { blogs } = useBlogs()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log('Blogs:', blogs) // Debug log

  return (
    <div className="w-full">
     <Breadcrumb
        title="Blogs"
        backgroundImage="/asset/bg/bak4.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Blogs" },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="space-y-8">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {blog.imageUrl && (
                    <img src={blog.imageUrl} alt={blog.title} className="w-24 h-24 rounded object-cover" />
                  )}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
                <Link to={`/blog/${blog.id}`} className="text-[#008080] font-semibold hover:text-accent">
                  Read More →
                </Link>
              </article>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
