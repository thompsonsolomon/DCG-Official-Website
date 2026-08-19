import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Zap,
  CalendarDays,
  Mic2,
  Newspaper,
  Images,
  MessageSquareHeart,
  Mail,
  ClipboardList,
  Settings,
} from 'lucide-react'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard size={20} />,
  },

  {
    label: 'Actions',
    path: '/admin/actions',
    icon: <Zap size={20} />,
  },

  {
    label: 'Events',
    path: '/admin/events',
    icon: <CalendarDays size={20} />,
  },

 {
  label: 'Event Setup',
  path: '/admin/event-setup',
  icon: <Settings size={20} />,
},


 {
  label: 'Event Registrations',
  path: '/admin/event-registrations',
  icon: <ClipboardList size={20} />,
},



  {
    label: 'Sermons',
    path: '/admin/sermons',
    icon: <Mic2 size={20} />,
  },

  {
    label: 'Blog',
    path: '/admin/blog',
    icon: <Newspaper size={20} />,
  },

  {
    label: 'Gallery',
    path: '/admin/gallery',
    icon: <Images size={20} />,
  },

  {
    label: 'Testimonies',
    path: '/admin/testimonies',
    icon: <MessageSquareHeart size={20} />,
  },

  {
    label: 'Messages',
    path: '/admin/messages',
    icon: <Mail size={20} />,
  },

  {
    label: 'Assets',
    path: '/admin/assets',
    icon: <Images size={20} />,
  }
]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#006666] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-accent p-2 rounded"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition `}
            >
              <span className="text-xl">{item.icon}</span>

              { sidebarOpen && item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition text-sm"
          >
            <span>🏠</span>
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
