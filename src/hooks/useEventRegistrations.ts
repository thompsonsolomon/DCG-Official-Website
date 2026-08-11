// import { useEffect, useState } from 'react'
// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   where,
//   getDocs,
// } from 'firebase/firestore'

// import { db } from '../config/firebase'
// import { EventRegistration } from '../types'

// export function useEventRegistrations(eventId?: string) {
//   const [registrations, setRegistrations] = useState<EventRegistration[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)

//   useEffect(() => {
//     if (!eventId) {
//       setRegistrations([])
//       setLoading(false)
//       return
//     }

//     const q = query(
//       collection(db, 'eventRegistrations'),
//       where('eventId', '==', eventId),
//       orderBy('createdAt', 'desc')
//     )

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const data = snapshot.docs.map((item) => ({
//           ...item.data(),
//           id: item.id,
//          })) as EventRegistration[]
//          console.log(data)

//         setRegistrations(data)
//         setLoading(false)
//       },
//       (err) => {
//         console.error(err)
//         setError(err)
//         setLoading(false)
//       }
//     )

//     return () => unsubscribe()
//   }, [eventId])

//   const addRegistration = async (
//     registration: Omit<EventRegistration, 'id'>
//   ) => {
//     try {
//       const docRef = await addDoc(
//         collection(db, 'EventRegistrations'),
//         {
//           ...registration,
//           createdAt: new Date(),
//         }
//       )

//       return docRef.id
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   const updateRegistration = async (
//     id: string,
//     updates: Partial<EventRegistration>
//   ) => {
//     try {
//       await updateDoc(
//         doc(db, 'EventRegistrations', id),
//         updates
//       )
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   const deleteRegistration = async (id: string) => {
//     try {
//       await deleteDoc(
//         doc(db, 'EventRegistrations', id)
//       )
//     } catch (err) {
//       setError(err as Error)
//       throw err
//     }
//   }

//   return {
//     registrations,
//     loading,
//     error,
//     addRegistration,
//     updateRegistration,
//     deleteRegistration,
//   }
// }



// // import { useEffect, useState } from 'react'
// // import {
// //   collection,
// //   onSnapshot,
// //   orderBy,
// //   query,
// // } from 'firebase/firestore'
// // import { db } from '../config/firebase'
// // import { EventRegistration } from '../types'

// // export const useEventRegistrations = () => {
// //   const [registrations, setRegistrations] = useState<EventRegistration[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState<Error | null>(null)

// //   useEffect(() => {
// //     const registrationsCollection = collection(
// //       db,
// //       'eventRegistrations'
// //     )

// //     const q = query(
// //       registrationsCollection,
// //       orderBy('createdAt', 'desc')
// //     )

// //     const unsubscribe = onSnapshot(
// //       q,
// //       (snapshot) => {
// //         const data: EventRegistration[] = snapshot.docs.map(
// //           (item) => ({
// //             id: item.id,
// //             ...item.data(),
// //           } as EventRegistration)
// //         )

// //         console.log('Event registrations:', data)

// //         setRegistrations(data)
// //         setLoading(false)
// //       },
// //       (error) => {
// //         console.error(
// //           'Error fetching event registrations:',
// //           error
// //         )

// //         setError(error)
// //         setLoading(false)
// //       }
// //     )

// //     return () => unsubscribe()
// //   }, [])

// //   return {
// //     registrations,
// //     loading,
// //     error,
// //   }
// // }




import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '../config/firebase'
import { EventRegistration } from '../types'

const REGISTRATIONS_COLLECTION = 'eventRegistrations'

export function useEventRegistrations(eventId?: string) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------------
  // FETCH REGISTRATIONS
  // -----------------------------------
  useEffect(() => {
    if (!eventId) {
      setRegistrations([])
      setLoading(false)
      return
    }

    setLoading(true)

    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: EventRegistration[] = snapshot.docs.map((item) => ({
          ...(item.data() as Omit<EventRegistration, 'id'>),
          id: item.id,
        }))

        console.log('Fetched registrations:', data)

        setRegistrations(data)
        setLoading(false)
      },
      (err) => {
        console.error('Failed to fetch registrations:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [eventId])

  // -----------------------------------
  // ADD REGISTRATION
  // -----------------------------------
  const addRegistration = async (
    registration: Omit<EventRegistration, 'id'>
  ) => {
    try {
      const docRef = await addDoc(
        collection(db, REGISTRATIONS_COLLECTION),
        {
          ...registration,
          createdAt: new Date(),
        }
      )

      return docRef.id
    } catch (err) {
      console.error('Failed to add registration:', err)
      setError(err as Error)
      throw err
    }
  }

  // -----------------------------------
  // UPDATE REGISTRATION
  // -----------------------------------
  const updateRegistration = async (
    id: string,
    updates: Partial<EventRegistration>
  ) => {
    try {
      await updateDoc(
        doc(db, REGISTRATIONS_COLLECTION, id),
        {
          ...updates,
          updatedAt: new Date(),
        }
      )
    } catch (err) {
      console.error('Failed to update registration:', err)
      setError(err as Error)
      throw err
    }
  }

  // -----------------------------------
  // DELETE REGISTRATION
  // -----------------------------------
  const deleteRegistration = async (id: string) => {
    try {
      await deleteDoc(
        doc(db, REGISTRATIONS_COLLECTION, id)
      )
    } catch (err) {
      console.error('Failed to delete registration:', err)
      setError(err as Error)
      throw err
    }
  }

  return {
    registrations,
    loading,
    error,
    addRegistration,
    updateRegistration,
    deleteRegistration,
  }
}