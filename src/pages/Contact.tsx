import { useState } from 'react'
import { useMessages } from '../hooks/useMessages'
import { toast } from 'react-hot-toast'
import Breadcrumb from '@/UI/Breadcrum'

export const Contact = () => {
  const { addMessage } = useMessages()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString(),
      })
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
     <Breadcrumb
        title="Contact Us"
        backgroundImage="/asset/bg/20.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Contact Us" },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="text-gray-700">

   <address className="not-italic">
                  @km 11, Akure/Owo Road,<br />
                  Ajegunle ilu Abo Via Akure, <br />
                  Akure North LG Ondo State
                </address>

            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-gray-700">(123) 8036550941</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-700">info@dcgfan.org</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008080] text-white py-3 rounded-lg font-semibold hover:bg-accent disabled:bg-gray-400 transition"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
