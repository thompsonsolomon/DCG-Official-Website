import { useState } from 'react'
import { useMessages } from '../hooks/useMessages'
import { toast } from 'react-hot-toast'
import Breadcrumb from '@/UI/Breadcrum'

export const PlanVisit = () => {
  const { addMessage } = useMessages()
  type VisitForm = {
  name: string
  email: string
  phone: string
  visitDate: string
  groupSize: string
  interests: string[]
  message: string
}

const [formData, setFormData] = useState<VisitForm>({
  name: '',
  email: '',
  phone: '',
  visitDate: '',
  groupSize: '',
  interests: [],
  message: '',
})
  const [loading, setLoading] = useState(false)

  const interests = ['Worship', 'Prayer', 'Bible Study', 'Youth Group', 'Volunteer', 'Counseling']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInterestChange = (interest: any) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Visit Planning - ${formData.name}`,
        message: `Planned visit date: ${formData.visitDate}\nGroup size: ${formData.groupSize}\nInterests: ${formData.interests.join(', ')}\n\n${formData.message}`,
        date: new Date().toISOString(),
      })
      toast.success('Your visit has been scheduled! We look forward to seeing you.')
      setFormData({ name: '', email: '', phone: '', visitDate: '', groupSize: '1', interests: [], message: '' })
    } catch (error) {
      toast.error('Failed to schedule visit')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
 <Breadcrumb
        title="Plan A Visit "
        backgroundImage="/asset/bg/20.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Plan visit " },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Group Size</label>
                <select
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="1">Just me</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5+">5 or more</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">What interests you? (Check all that apply)</label>
              <div className="space-y-2">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-red-100 rounded"
                    />
                    <span className="text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Comments</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us a bit about yourself or any questions you have..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-[#008080] disabled:bg-gray-400 transition"
            >
              {loading ? 'Scheduling...' : 'Schedule My Visit'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4">Service Times</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>Sunday Worship:</strong> 10:00 AM - 11:30 AM</p>
              <p><strong>Location:</strong> 123 Church Street, City, State 12345</p>
              <p><strong>Parking:</strong> Free parking available in our lot</p>
              <p><strong>Childcare:</strong> Available for children during service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
