// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import TopHeader from './TopNav'

// export default function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [showTopHeader, setShowTopHeader] = useState(true)

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Events', path: '/events' },
//     { name: 'Sermons', path: '/sermons' },
//     { name: 'Gallery', path: '/gallery' },
//     { name: 'Blog', path: '/blog' },
//     { name: 'Testimonies', path: '/testimonies' },
//     { name: 'New Here', path: '/new-here' },
//     { name: 'Contact', path: '/contact' },
//   ]

//   // 👇 SCROLL LOGIC
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setShowTopHeader(false)
//       } else {
//         setShowTopHeader(true)
//       }
//     }

//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   return (
//     <>
//       {/* 🔥 TOP HEADER (HIDES ON SCROLL) */}
//       <div
//         className={`transition-all duration-300 max-md:hidden ${
//           showTopHeader ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
//         }`}
//       >
//         <TopHeader />
//       </div>

//       {/* 🔥 MAIN NAV (STICKY ALWAYS) */}
//       <nav className="bg-white text-black shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4">
          
//           <div className="flex justify-between items-center h-16">
//           <div className="flex items-center space-x-2">
//   <img
//     src="./asset/bg/logo.jpg"
//     alt="logo"
//     className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
//   />

//   <Link
//     to="/"
//     className="font-bold text-lg md:text-2xl hidden sm:block"
//   >
//     Disciples Church
//   </Link>
// </div>
//             {/* DESKTOP MENU */}
//             <div className="hidden md:flex items-center space-x-6">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="hover:text-accent transition"
//                 >
//                   {link.name}
//                 </Link>
//               ))}

//               <Link
//                 to="/live"
//                 className="bg-red-300 px-4 py-2 rounded hover:bg-red-600 text-white"
//               >
//                 Watch Live
//               </Link>
//             </div>

//             {/* MOBILE BUTTON */}
//             <button
//               className="md:hidden text-xl"
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               ☰
//             </button>
//           </div>

//           {/* MOBILE MENU */}
//           {isOpen && (
//             <div className="md:hidden pb-4 space-y-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="block px-4 py-2"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {link.name}
//                 </Link>
//               ))}

//               <Link
//                 to="/live"
//                 className="block px-4 py-2 bg-red-500 text-white rounded"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Watch Live
//               </Link>
//             </div>
//           )}
//         </div>
//       </nav>
//     </>
//   )
// }



import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TopHeader from './TopNav'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTopHeader, setShowTopHeader] = useState(true)
  const [settings, setSettings] = useState<any>(null)
  // ✅ FETCH LIVE SETTINGS FROM FIREBASE
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'main'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as any)
        }
      }
    )

    return () => unsubscribe()
  }, [])
  // 🔴 LIVE STATUS (replace later with Firestore hook)
  const isLive = settings?.isLiveStreaming || false
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

  useEffect(() => {
    const handleScroll = () => {
      setShowTopHeader(window.scrollY <= 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* TOP HEADER */}
      <div
        className={`transition-all duration-300 max-md:hidden ${
          showTopHeader ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <TopHeader />
      </div>

      {/* NAV */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <img
                src="./asset/bg/logo.jpg"
                alt="logo"
                className="h-9 w-9 rounded-full object-cover"
              />

              <Link to="/" className="font-bold text-lg md:text-2xl hidden sm:block" >
                Disciples Church
              </Link>

              {/* LIVE BADGE */}
              {isLive && (
                <span className="ml-2 bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">
                  LIVE
                </span>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-6">

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-[#008080] transition"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/live"
                className="relative flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition"
              >
                {isLive && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative h-2.5 w-2.5 bg-white rounded-full"></span>
                  </span>
                )}
                Watch Live
              </Link>

            </div>

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>

          {/* MOBILE MENU */}
          {isOpen && (
            <div className="md:hidden bg-white border-t pb-4">

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/live"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 mx-4 mt-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold"
              >
                {isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative h-2 w-2 bg-white rounded-full"></span>
                  </span>
                )}
                Watch Live
              </Link>

            </div>
          )}

        </div>
      </nav>
    </>
  )
}