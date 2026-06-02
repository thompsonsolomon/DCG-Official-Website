import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { Testimony } from '../types'

export function useTestimonies(isAdmin = false) {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let q

    if (isAdmin) {
      // ✅ Admin → get ALL testimonies
      q = query(collection(db, 'testimonies'), orderBy('date', 'desc'))
    } else {
      // ✅ Users → ONLY approved
      q = query(
        collection(db, 'testimonies'),
        where('approved', '==', true),
        orderBy('date', 'desc')
      )
    }


        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
            } as Testimony))
    
    
            setTestimonies(data)
            setLoading(false)
          },
    
          
          (err) => {
            setError(err)
            setLoading(false)
          }
        )

    return () => unsubscribe()
  }, [isAdmin])

  // ✅ ADD
  const addTestimony = async (testimony: Omit<Testimony, 'id'>) => {
    try {
      const cleanPayload = {
        ...testimony,
        approved: false, // 👈 important
        createdAt: new Date(),
      }

      const docRef = await addDoc(collection(db, 'testimonies'), cleanPayload)
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  // ✅ APPROVE
  const approveTestimony = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonies', id), {
        approved: true,
        updatedAt: new Date(),
      })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  // ✅ DELETE
  const deleteTestimony = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonies', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    testimonies,
    loading,
    error,
    addTestimony,
    approveTestimony,
    deleteTestimony,
  }
}