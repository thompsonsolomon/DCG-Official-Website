import { useEvents } from '../hooks/useEvents'
import { useSermons } from '../hooks/useSermons'
import { useBlogs } from '../hooks/useBlogs'
import { useMessages } from '../hooks/useMessages'

export const AdminDashboard = () => {
  const { events } = useEvents()
  const { sermons } = useSermons()
  const { blogs } = useBlogs()
  const { messages } = useMessages()

  const stats = [
    { label: 'Total Events', value: events.length, color: 'bg-blue-500' },
    { label: 'Total Sermons', value: sermons.length, color: 'bg-green-500' },
    { label: 'Blog Posts', value: blogs.length, color: 'bg-purple-500' },
    { label: 'Unread Messages', value: messages.filter(m => !m.read).length, color: 'bg-orange-500' }
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-xl">📊</span>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Events</h2>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex justify-between items-start pb-3 border-b">
                <div>
                  <p className="font-semibold">{event.EventTitle}</p>
                  {/* <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p> */}
                                    <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-gray-500">No events yet</p>}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Messages</h2>
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="flex justify-between items-start pb-3 border-b">
                <div className="flex-1">
                  <p className="font-semibold">{message.name}</p>
                  <p className="text-sm text-gray-600">{message.subject}</p>
                  <p className="text-xs text-gray-500">{message.date
  ? new Date(message.date).toLocaleDateString()
  : 'No date'}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
