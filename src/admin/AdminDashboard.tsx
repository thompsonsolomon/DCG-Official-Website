import { useEvents } from '../hooks/useEvents'
import { useSermons } from '../hooks/useSermons'
import { useBlogs } from '../hooks/useBlogs'
import { useMessages } from '../hooks/useMessages'

import {
  CalendarDays,
  Mic2,
  Newspaper,
  Mail,
  ArrowUpRight,
} from 'lucide-react'

export const AdminDashboard = () => {
  const { events } = useEvents()
  const { sermons } = useSermons()
  const { blogs } = useBlogs()
  const { messages } = useMessages()

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: <CalendarDays size={28} />,
      gradient: 'from-blue-500 to-cyan-500',
    },

    {
      label: 'Total Sermons',
      value: sermons.length,
      icon: <Mic2 size={28} />,
      gradient: 'from-green-500 to-emerald-500',
    },

    {
      label: 'Blog Posts',
      value: blogs.length,
      icon: <Newspaper size={28} />,
      gradient: 'from-purple-500 to-pink-500',
    },

    {
      label: 'Unread Messages',
      value: messages.filter((m) => !m.read).length,
      icon: <Mail size={28} />,
      gradient: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Welcome back. Manage your church website easily.
          </p>
        </div>

        <div className="bg-[#008080]/10 text-[#008080] px-5 py-3 rounded-2xl font-semibold">
          DCGFAN CMS
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-2xl transition duration-300"
          >

            {/* BACKGROUND */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-3xl`}
            />

            {/* ICON */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} text-white flex items-center justify-center shadow-lg mb-5`}
            >
              {stat.icon}
            </div>

            <p className="text-gray-500 text-sm font-medium mb-1">
              {stat.label}
            </p>

            <h2 className="text-4xl font-black text-gray-900">
              {stat.value}
            </h2>

            <div className="mt-5 flex items-center text-sm text-green-600 font-semibold">
              <ArrowUpRight size={16} className="mr-1" />
              Active
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* EVENTS */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b bg-gradient-to-r from-[#008080] to-[#006666] text-white">
            <h2 className="text-2xl font-bold">
              Recent Events
            </h2>

            <p className="text-white/80 mt-1">
              Latest church activities and programs
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 pb-5 border-b border-gray-100 last:border-none"
              >

                <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 text-[#008080] flex items-center justify-center">
                  <CalendarDays size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {event.EventTitle}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {event.disc?.slice(0, 80)}...
                  </p>

                  <p className="text-xs text-[#008080] font-semibold mt-2">
                    {event.date}
                  </p>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No events available
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">
              Recent Messages
            </h2>

            <p className="text-white/80 mt-1">
              Latest contact form messages
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            {messages.slice(0, 5).map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-4 pb-5 border-b border-gray-100 last:border-none"
              >

                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                  {message.name?.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-gray-900">
                      {message.name}
                    </h3>

                    {!message.read && (
                      <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {message.subject}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {message.date
                      ? new Date(
                          message.date
                        ).toLocaleDateString()
                      : 'No date'}
                  </p>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No messages yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}