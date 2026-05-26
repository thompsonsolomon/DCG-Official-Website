import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TopHeader from './TopNav'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTopHeader, setShowTopHeader] = useState(true)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Testimonies', path: '/testimonies' },
    { name: 'New Here', path: '/new-here' },
    { name: 'Contact', path: '/contact' },
  ]

  // 👇 SCROLL LOGIC
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowTopHeader(false)
      } else {
        setShowTopHeader(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* 🔥 TOP HEADER (HIDES ON SCROLL) */}
      <div
        className={`transition-all duration-300 max-md:hidden ${
          showTopHeader ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <TopHeader />
      </div>

      {/* 🔥 MAIN NAV (STICKY ALWAYS) */}
      <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
  <img
    src="./asset/bg/logo.jpg"
    alt="logo"
    className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
  />

  <Link
    to="/"
    className="font-bold text-lg md:text-2xl hidden sm:block"
  >
    Disciples Church
  </Link>
</div>
            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-accent transition"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/live"
                className="bg-red-300 px-4 py-2 rounded hover:bg-red-600 text-white"
              >
                Watch Live
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden text-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* MOBILE MENU */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/live"
                className="block px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setIsOpen(false)}
              >
                Watch Live
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}