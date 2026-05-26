import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008080] via-[#006666] to-black flex items-center justify-center px-4 overflow-hidden relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-10 max-w-2xl w-full text-center shadow-2xl"
      >
        {/* 404 */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-8xl md:text-[10rem] font-black text-white leading-none"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-white mt-4"
        >
          Page Not Found
        </motion.h2>

        <p className="text-white/80 mt-4 text-lg leading-relaxed max-w-xl mx-auto">
          The page you are looking for does not exist, may have been moved,
          or is temporarily unavailable.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            to="/"
            className="bg-white text-[#008080] hover:bg-gray-100 transition px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="border border-white/30 text-white hover:bg-white/10 transition px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* FOOTER TEXT */}
        <p className="text-white/50 text-sm mt-10">
          DCGFAN Church Platform
        </p>
      </motion.div>
    </div>
  )
}