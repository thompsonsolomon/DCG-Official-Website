import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, doc, onSnapshot } from 'firebase/firestore'
import { Sermon } from '../types'

export function useSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSermons = async () => {
      const q = query(collection(db, 'Sermons'), orderBy('date', 'desc'))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          } as Sermon))
          console.log('Fetched events:', data) // Debug log


          setSermons(data)
          setLoading(false)
        },


        (err) => {
          setError(err)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    }

    fetchSermons()
  }, [])

  const addSermon = async (sermon: Omit<Sermon, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Sermons'), {
        ...sermon,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  // const updateSermon = async (id: string, updates: Partial<Sermon>) => {
  //   console.log('Updating sermon with ID:', id) // Debug log
  //   try {
  //     await updateDoc(doc(db, 'Sermons', id), {
  //       ...updates,
  //       updatedAt: new Date(),
  //     })
  //   } catch (err) {
  //     setError(err as Error)
  //     throw err
  //   }
  // }


  const updateSermon = async (id: string, updates: Partial<Sermon>) => {
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined)
  )

  await updateDoc(doc(db, 'Sermons', id), {
    ...cleanUpdates,
    updatedAt: new Date(),
  })
  
}

  

  const deleteSermon = async (id: string) => {
    console.log(id)
    try {
      await deleteDoc(doc(db, 'Sermons', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { sermons, loading, error, addSermon, updateSermon, deleteSermon }
}
