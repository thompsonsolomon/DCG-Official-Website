import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, doc, onSnapshot } from 'firebase/firestore'
import { BlogPost } from '../types'

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
    //   try {
    //     const q = query(collection(db, 'blogs'), orderBy('date', 'desc'))
    //     const snapshot = await getDocs(q)
    //     const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
    //     setBlogs(data)
    //   } catch (err) {
    //     setError(err as Error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

   const q = query(collection(db, 'blogs'), orderBy('date', 'desc'))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          } as BlogPost))
          console.log('Fetched events:', data) // Debug log


          setBlogs(data)
          setLoading(false)
        },


        (err) => {
          setError(err)
          setLoading(false)
        }
      )
      return () => unsubscribe()
      }

      fetchBlogs()

  }, [])

  const addBlog = async (blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        ...blog,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateBlog = async (id: string, updates: Partial<BlogPost>) => {
    const cleanUpdates = Object.fromEntries(
  Object.entries(updates).filter(([_, v]) => v !== undefined)
)

    try {
      await updateDoc(doc(db, 'blogs', id), {
        ...cleanUpdates,
        updatedAt: new Date(),
      })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blogs', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { blogs, loading, error, addBlog, updateBlog, deleteBlog }
}
