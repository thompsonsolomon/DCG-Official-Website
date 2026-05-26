// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { Toaster } from 'react-hot-toast'

// // Public Pages
// import { Home } from './pages/Home'
// import { Events } from './pages/Events'
// import { Sermons } from './pages/Sermons'
// import { Gallery } from './pages/Gallery'
// import { Blog } from './pages/Blog'
// import { Testimonies } from './pages/Testimonies'
// import { Contact } from './pages/Contact'
// import { NewHere } from './pages/NewHere'
// import { PlanVisit } from './pages/PlanVisit'
// import { Live } from './pages/Live'

// // Admin Pages
// import { AdminLayout } from './admin/AdminLayout'
// import { AdminDashboard } from './admin/AdminDashboard'
// import { AdminEvents } from './admin/AdminEvents'
// import { AdminSermons } from './admin/AdminSermons'
// import { AdminGallery } from './admin/AdminGallery'
// import { AdminBlog } from './admin/AdminBlog'
// import { AdminTestimonies } from './admin/AdminTestimonies'
// import { AdminMessages } from './admin/AdminMessages'
// import Navigation from './components/Navigation'
// import Footer from './components/Footer'

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           element={
//             <div className="flex flex-col min-h-screen">
//               <Navigation />
//               <main className="flex-grow">
//                 <Routes>
//                   <Route path="/" element={<Home />} />
//                   <Route path="/events" element={<Events />} />
//                   <Route path="/sermons" element={<Sermons />} />
//                   <Route path="/gallery" element={<Gallery />} />
//                   <Route path="/blog" element={<Blog />} />
//                   <Route path="/testimonies" element={<Testimonies />} />
//                   <Route path="/contact" element={<Contact />} />
//                   <Route path="/new-here" element={<NewHere />} />
//                   <Route path="/plan-visit" element={<PlanVisit />} />
//                   <Route path="/live" element={<Live />} />
//                 </Routes>
//               </main>
//               <Footer />
//             </div>
//           }
//         />

//         {/* Admin Routes */}
//         <Route element={<AdminLayout />}>
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/admin/events" element={<AdminEvents />} />
//           <Route path="/admin/sermons" element={<AdminSermons />} />
//           <Route path="/admin/gallery" element={<AdminGallery />} />
//           <Route path="/admin/blog" element={<AdminBlog />} />
//           <Route path="/admin/testimonies" element={<AdminTestimonies />} />
//           <Route path="/admin/messages" element={<AdminMessages />} />
//         </Route>
//       </Routes>
//       <Toaster position="top-center" />
//     </Router>
//   )
// }



import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Public Pages
import { Home } from './pages/Home'
import { Events } from './pages/Events'
import { Sermons } from './pages/Sermons'
import { Gallery } from './pages/Gallery'
import { Blog } from './pages/Blog'
import { Testimonies } from './pages/Testimonies'
import { Contact } from './pages/Contact'
import { NewHere } from './pages/NewHere'
import { PlanVisit } from './pages/PlanVisit'
import { Live } from './pages/Live'

// Admin Pages
import { AdminLayout } from './admin/AdminLayout'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminEvents } from './admin/AdminEvents'
import { AdminSermons } from './admin/AdminSermons'
import { AdminGallery } from './admin/AdminGallery'
import { AdminBlog } from './admin/AdminBlog'
import { AdminTestimonies } from './admin/AdminTestimonies'
import { AdminMessages } from './admin/AdminMessages'
import { PublicLayout } from './pages/PublicLayout'
import { GalleryDetails } from './pages/GalleryDetails'
import { BlogDetails } from './pages/BlogDetails'
import { SermonDetails } from './pages/SermonDetails'
import {AdminAction} from './admin/AdminAction'

// Layout

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/sermons/:id" element={<SermonDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/testimonies" element={<Testimonies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/new-here" element={<NewHere />} />
          <Route path="/plan-visit" element={<PlanVisit />} />
          <Route path="/live" element={<Live />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/sermons" element={<AdminSermons />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/testimonies" element={<AdminTestimonies />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/actions" element={<AdminAction />} />
        </Route>

      </Routes>

      <Toaster position="top-center" />
    </Router>
  )
}