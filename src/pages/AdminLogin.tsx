
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    try {
      setLoading(true)

      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      toast.success('Login successful')

      navigate('/admin')
    } catch (error) {
      console.log(error)
      toast.error('Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008080] via-[#006666] to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl">
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white">
              Admin Portal
            </h1>

            <p className="text-white/70 mt-3 leading-relaxed">
              Login to manage sermons, livestreams,
              events, testimonies and church content.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@email.com"
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#008080] hover:bg-gray-100 transition py-4 rounded-2xl font-black text-lg shadow-lg disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              Protected Church Administration System
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
