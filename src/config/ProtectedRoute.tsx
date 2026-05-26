import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/config/firebase'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({
  children,
}: Props) {
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#008080]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />

          <p className="text-white text-lg font-semibold">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    )
  }

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  // AUTHORIZED
  return <>{children}</>
}