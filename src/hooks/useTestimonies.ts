// import { useEffect, useState } from 'react'
// import { db } from '../config/firebase'
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, doc, onSnapshot } from 'firebase/firestore'
// import { Testimony } from '../types'

// export function useTestimonies(onlyApproved = true) {
//   const [testimonies, setTestimonies] = useState<Testimony[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)

//   useEffect(() => {
//     const fetchAllTestimonies = async () => {
//       // try {
//       //   let q = collection(db, 'testimonies')
//       //   if (onlyApproved) {
//       //     q = query(collection(db, 'testimonies'), where('approved', '==', true), orderBy('date', 'desc'))
//       //   } else {
//       //     q = query(collection(db, 'testimonies'), orderBy('date', 'desc'))
//       //   }
//       //   const snapshot = await getDocs(q as any)
//       //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimony))
//       //   setTestimonies(data)
//       // } catch (err) {
//       //   setError(err as Error)
//       // } finally {
//       //   setLoading(false)
//       // }

//        const q = query(collection(db, 'testimonies'), orderBy('date', 'desc'))
//             const unsubscribe = onSnapshot(
//               q,
//               (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({
//                   ...doc.data(),
//                   id: doc.id,
//                 } as Testimony))
//                 console.log('Fetched events:', data) // Debug log
      
      
//                 setTestimonies(data)
//                 setLoading(false)
//               },
      
      
//               (err) => {
//                 setError(err)
//                 setLoading(false)
//               }
//             )
//             return () => unsubscribe()
//     }

//     fetchAllTestimonies()
//   }, [onlyApproved])



//     useEffect(() => {
//     const fetchTestimonies = async () => {

//        const q = query(collection(db, 'testimonies'), where('approved', '==', true),  orderBy('date', 'desc'))
//             const unsubscribe = onSnapshot(
//               q,
//               (snapshot) => {
//                 const data = snapshot.docs.map(doc => ({
//                   ...doc.data(),
//                   id: doc.id,
//                 } as Testimony))
//                 console.log('Fetched events:', data) // Debug log
      
      
//                 setTestimonies(data)
//                 setLoading(false)
//               },
      
      
//               (err) => {
//                 setError(err)
//                 setLoading(false)
//               }
//             )
//             return () => unsubscribe()
//     }

//     fetchTestimonies()
//   }, [onlyApproved])

//   const addTestimony = async (testimony: Omit<Testimony, 'id' | 'createdAt'>) => {
//     try {
//       const docRef = await addDoc(collection(db, 'testimonies'), {
//         ...testimony,
//         createdAt: new Date(),
//       })
//       return docRef.id
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   const approveTestimony = async (id: string) => {
//     try {
//       await updateDoc(doc(db, 'testimonies', id), { approved: true })
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   const deleteTestimony = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, 'testimonies', id))
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   return { testimonies, loading, error, addTestimony, approveTestimony, deleteTestimony }
// }



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
    console.log("testi",id)
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