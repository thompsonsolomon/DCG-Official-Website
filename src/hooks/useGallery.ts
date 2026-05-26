import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, deleteDoc, query, orderBy, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { GalleryImage } from '../types'

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      // try {
      //   const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
      //   const snapshot = await getDocs(q)
      //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage))
      //   console.log(data)
      //   setImages(data)
      // } catch (err) {
      //   setError(err as Error)
      // } finally {
      //   setLoading(false)
      // }




              const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
                  const unsubscribe = onSnapshot(
                    q,
                    (snapshot) => {
                      const data = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                      } as GalleryImage))
                      console.log('Fetched events:', data) // Debug log
            
            
                      setImages(data)
                      setLoading(false)
                    },
            
            
                    (err) => {
                      setError(err)
                      setLoading(false)
                    }
                  )
            
                  return () => unsubscribe()

    }

    fetchImages()
  }, [])

  const addImage = async (image: Omit<GalleryImage, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'gallery'), {
        ...image,
        createdAt: new Date(),
      })
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }


    const updateGalleryItem = async (id: string, updates: Partial<GalleryImage>) => {
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    )
  
    await updateDoc(doc(db, 'gallery', id), {
      ...cleanUpdates,
      updatedAt: new Date(),
    })
    
  }

  const deleteImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { images, loading, error, addImage, deleteImage, updateGalleryItem }
}
