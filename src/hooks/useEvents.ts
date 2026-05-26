import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { Event } from '../types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // ✅ REAL-TIME LISTENER
  useEffect(() => {
    const q = query(collection(db, 'Events'), orderBy('date', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        } as Event))
console.log('Fetched events:', data) // Debug log


        setEvents(data)
        setLoading(false)
      },

      
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // ✅ ADD EVENT
  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Events'), {
        ...event,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  // ✅ UPDATE EVENT
  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await updateDoc(doc(db, 'Events', id), {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  // ✅ DELETE EVENT
  const deleteEvent = async (id: string) => {
    console.log('Deleting event with ID:', id) // Debug log
    try {
      await deleteDoc(doc(db, 'Events', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { events, loading, error, addEvent, updateEvent, deleteEvent }
}