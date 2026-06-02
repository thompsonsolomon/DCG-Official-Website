import { useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, doc, onSnapshot } from 'firebase/firestore'
import { Message } from '../types'

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      


        const q = query(collection(db, 'messages'), orderBy('date', 'desc'))
            const unsubscribe = onSnapshot(
              q,
              (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                  ...doc.data(),
                  id: doc.id,
                } as Message))
      
      
                setMessages(data)
                setLoading(false)
              },
      
      
              (err) => {
                setError(err)
                setLoading(false)
              }
            )
      
            return () => unsubscribe()

    }

    fetchMessages()
  }, [])

  const addMessage = async (message: Omit<Message, 'id' | 'read' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...message,
        read: false,
        createdAt: new Date(),
      })
      return docRef.id
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return { messages, loading, error, addMessage, markAsRead, deleteMessage }
}
