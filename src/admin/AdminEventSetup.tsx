// import { useEffect, useState } from 'react'
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   setDoc,
//   Timestamp,
// } from 'firebase/firestore'
// import { db } from '../config/firebase'
// import { toast } from 'react-hot-toast'
// import {
//   BedDouble,
//   BookOpen,
//   Edit3,
//   Plus,
//   Save,
//   Trash2,
//   Users,
//   X,
// } from 'lucide-react'

// /* =========================================================
//    TYPES
// ========================================================= */

// type AccommodationCategory =
//   | 'male-adult'
//   | 'female-adult'
//   | 'male-youth'
//   | 'female-youth'
//   | 'children'

// type StudyGroupType =
//   | 'adult'
//   | 'youth'
//   | 'children'

// type Accommodation = {
//   id?: string
//   name: string
//   capacity: number
//   category: AccommodationCategory
// }

// type StudyGroup = {
//   id?: string
//   name: string
//   type: StudyGroupType
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export const EventSetup = () => {
//   const [loading, setLoading] = useState(true)

//   const [accommodations, setAccommodations] = useState<
//     Accommodation[]
//   >([])

//   const [studyGroups, setStudyGroups] = useState<
//     StudyGroup[]
//   >([])

//   /* =======================================================
//      ACCOMMODATION FORM
//   ======================================================= */

//   const [showAccommodationForm, setShowAccommodationForm] =
//     useState(false)

//   const [editingAccommodationId, setEditingAccommodationId] =
//     useState<string | null>(null)

//   const [accommodationName, setAccommodationName] =
//     useState('')

//   const [accommodationCapacity, setAccommodationCapacity] =
//     useState(4)

//   const [accommodationCategory, setAccommodationCategory] =
//     useState<AccommodationCategory>('male-adult')

//   /* =======================================================
//      STUDY GROUP FORM
//   ======================================================= */

//   const [showStudyGroupForm, setShowStudyGroupForm] =
//     useState(false)

//   const [editingStudyGroupId, setEditingStudyGroupId] =
//     useState<string | null>(null)

//   const [studyGroupName, setStudyGroupName] =
//     useState('')

//   const [studyGroupType, setStudyGroupType] =
//     useState<StudyGroupType>('adult')

//   /* =======================================================
//      SAVING STATES
//   ======================================================= */

//   const [savingAccommodation, setSavingAccommodation] =
//     useState(false)

//   const [savingStudyGroup, setSavingStudyGroup] =
//     useState(false)

//   /* =========================================================
//      FETCH EXISTING SETTINGS
//   ========================================================= */

//   useEffect(() => {
//     fetchConventionSettings()
//   }, [])

//   const fetchConventionSettings = async () => {
//     try {
//       setLoading(true)

//       /*
//         IMPORTANT:

//         We are using the EXISTING database:

//         ConventionSettings/main
//       */

//       const settingsRef = doc(
//         db,
//         'ConventionSettings',
//         'main'
//       )

//       const snapshot = await getDocs(
//         collection(db, 'ConventionSettings')
//       )

//       /*
//         We first try the existing document directly.
//       */

//       const { getDoc } = await import(
//         'firebase/firestore'
//       )

//       const settingsSnapshot = await getDoc(
//         settingsRef
//       )

//       if (!settingsSnapshot.exists()) {
//         setAccommodations([])
//         setStudyGroups([])
//         return
//       }

//       const data = settingsSnapshot.data()

//       /*
//         OLD DATABASE DATA

//         accommodations:
//         [
//           {
//             name: "Room 1",
//             capacity: 20,
//             category: "male-adult"
//           }
//         ]

//         studyGroups:
//         [
//           {
//             name: "English",
//             type: "adult"
//           }
//         ]
//       */

//       setAccommodations(
//         Array.isArray(data.accommodations)
//           ? data.accommodations
//           : []
//       )

//       setStudyGroups(
//         Array.isArray(data.studyGroups)
//           ? data.studyGroups
//           : []
//       )
//     } catch (error) {
//       console.error(
//         'Failed to fetch convention settings:',
//         error
//       )

//       toast.error(
//         'Failed to load convention configuration'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* =========================================================
//      ACCOMMODATION FORM RESET
//   ========================================================= */

//   const resetAccommodationForm = () => {
//     setAccommodationName('')
//     setAccommodationCapacity(4)
//     setAccommodationCategory('male-adult')

//     setEditingAccommodationId(null)
//     setShowAccommodationForm(false)
//   }

//   /* =========================================================
//      ADD / UPDATE ACCOMMODATION
//   ========================================================= */

//   const saveAccommodation = async () => {
//     const name = accommodationName.trim()

//     if (!name) {
//       toast.error(
//         'Enter an accommodation name'
//       )
//       return
//     }

//     if (
//       !accommodationCapacity ||
//       accommodationCapacity < 1
//     ) {
//       toast.error(
//         'Capacity must be at least 1'
//       )
//       return
//     }

//     /*
//       Check duplicates only when creating.
//     */

//     if (!editingAccommodationId) {
//       const exists = accommodations.some(
//         (item) =>
//           item.name.toLowerCase() ===
//           name.toLowerCase()
//       )

//       if (exists) {
//         toast.error(
//           'This accommodation already exists'
//         )
//         return
//       }
//     }

//     try {
//       setSavingAccommodation(true)

//       const accommodation: Accommodation = {
//         name,
//         capacity: Number(
//           accommodationCapacity
//         ),
//         category:
//           accommodationCategory,
//       }

//       let updatedAccommodations: Accommodation[]

//       /*
//         EDIT
//       */

//       if (editingAccommodationId) {
//         updatedAccommodations =
//           accommodations.map((item) =>
//             item.id ===
//             editingAccommodationId
//               ? {
//                   ...item,
//                   ...accommodation,
//                 }
//               : item
//           )
//       }

//       /*
//         CREATE
//       */

//       else {
//         const newAccommodation = {
//           ...accommodation,
//           id: crypto.randomUUID(),
//         }

//         updatedAccommodations = [
//           ...accommodations,
//           newAccommodation,
//         ]
//       }

//       /*
//         SAVE TO EXISTING DATABASE
//       */

//       await setDoc(
//         doc(
//           db,
//           'ConventionSettings',
//           'main'
//         ),
//         {
//           accommodations:
//             updatedAccommodations,
//           updatedAt:
//             Timestamp.now(),
//         },
//         {
//           merge: true,
//         }
//       )

//       setAccommodations(
//         updatedAccommodations
//       )

//       toast.success(
//         editingAccommodationId
//           ? 'Accommodation updated'
//           : 'Accommodation added'
//       )

//       resetAccommodationForm()
//     } catch (error) {
//       console.error(error)

//       toast.error(
//         'Failed to save accommodation'
//       )
//     } finally {
//       setSavingAccommodation(false)
//     }
//   }

//   /* =========================================================
//      EDIT ACCOMMODATION
//   ========================================================= */

//   const editAccommodation = (
//     accommodation: Accommodation
//   ) => {
//     setAccommodationName(
//       accommodation.name
//     )

//     setAccommodationCapacity(
//       accommodation.capacity
//     )

//     setAccommodationCategory(
//       accommodation.category
//     )

//     setEditingAccommodationId(
//       accommodation.id || null
//     )

//     setShowAccommodationForm(true)

//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     })
//   }

//   /* =========================================================
//      DELETE ACCOMMODATION
//   ========================================================= */

//   const deleteAccommodation = async (
//     id?: string
//   ) => {
//     if (!id) return

//     const confirmed = window.confirm(
//       'Are you sure you want to delete this accommodation?'
//     )

//     if (!confirmed) return

//     try {
//       const updatedAccommodations =
//         accommodations.filter(
//           (item) => item.id !== id
//         )

//       await setDoc(
//         doc(
//           db,
//           'ConventionSettings',
//           'main'
//         ),
//         {
//           accommodations:
//             updatedAccommodations,
//           updatedAt:
//             Timestamp.now(),
//         },
//         {
//           merge: true,
//         }
//       )

//       setAccommodations(
//         updatedAccommodations
//       )

//       toast.success(
//         'Accommodation deleted'
//       )
//     } catch (error) {
//       console.error(error)

//       toast.error(
//         'Failed to delete accommodation'
//       )
//     }
//   }

//   /* =========================================================
//      STUDY GROUP FORM RESET
//   ========================================================= */

//   const resetStudyGroupForm = () => {
//     setStudyGroupName('')
//     setStudyGroupType('adult')

//     setEditingStudyGroupId(null)
//     setShowStudyGroupForm(false)
//   }

//   /* =========================================================
//      ADD / UPDATE STUDY GROUP
//   ========================================================= */

//   const saveStudyGroup = async () => {
//     const name = studyGroupName.trim()

//     if (!name) {
//       toast.error(
//         'Enter a study group name'
//       )
//       return
//     }

//     if (!editingStudyGroupId) {
//       const exists = studyGroups.some(
//         (group) =>
//           group.name.toLowerCase() ===
//           name.toLowerCase()
//       )

//       if (exists) {
//         toast.error(
//           'This study group already exists'
//         )
//         return
//       }
//     }

//     try {
//       setSavingStudyGroup(true)

//       const studyGroup: StudyGroup = {
//         name,
//         type: studyGroupType,
//       }

//       let updatedGroups: StudyGroup[]

//       /*
//         EDIT
//       */

//       if (editingStudyGroupId) {
//         updatedGroups =
//           studyGroups.map((group) =>
//             group.id ===
//             editingStudyGroupId
//               ? {
//                   ...group,
//                   ...studyGroup,
//                 }
//               : group
//           )
//       }

//       /*
//         CREATE
//       */

//       else {
//         const newGroup = {
//           ...studyGroup,
//           id: crypto.randomUUID(),
//         }

//         updatedGroups = [
//           ...studyGroups,
//           newGroup,
//         ]
//       }

//       /*
//         SAVE TO EXISTING DATABASE
//       */

//       await setDoc(
//         doc(
//           db,
//           'ConventionSettings',
//           'main'
//         ),
//         {
//           studyGroups:
//             updatedGroups,
//           updatedAt:
//             Timestamp.now(),
//         },
//         {
//           merge: true,
//         }
//       )

//       setStudyGroups(
//         updatedGroups
//       )

//       toast.success(
//         editingStudyGroupId
//           ? 'Study group updated'
//           : 'Study group added'
//       )

//       resetStudyGroupForm()
//     } catch (error) {
//       console.error(error)

//       toast.error(
//         'Failed to save study group'
//       )
//     } finally {
//       setSavingStudyGroup(false)
//     }
//   }

//   /* =========================================================
//      EDIT STUDY GROUP
//   ========================================================= */

//   const editStudyGroup = (
//     group: StudyGroup
//   ) => {
//     setStudyGroupName(
//       group.name
//     )

//     setStudyGroupType(
//       group.type
//     )

//     setEditingStudyGroupId(
//       group.id || null
//     )

//     setShowStudyGroupForm(true)

//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     })
//   }

//   /* =========================================================
//      DELETE STUDY GROUP
//   ========================================================= */

//   const deleteStudyGroup = async (
//     id?: string
//   ) => {
//     if (!id) return

//     const confirmed = window.confirm(
//       'Are you sure you want to delete this study group?'
//     )

//     if (!confirmed) return

//     try {
//       const updatedGroups =
//         studyGroups.filter(
//           (group) => group.id !== id
//         )

//       await setDoc(
//         doc(
//           db,
//           'ConventionSettings',
//           'main'
//         ),
//         {
//           studyGroups:
//             updatedGroups,
//           updatedAt:
//             Timestamp.now(),
//         },
//         {
//           merge: true,
//         }
//       )

//       setStudyGroups(
//         updatedGroups
//       )

//       toast.success(
//         'Study group deleted'
//       )
//     } catch (error) {
//       console.error(error)

//       toast.error(
//         'Failed to delete study group'
//       )
//     }
//   }

//   /* =========================================================
//      LOADING
//   ========================================================= */

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin mx-auto mb-4" />

//           <p className="text-gray-600">
//             Loading convention configuration...
//           </p>
//         </div>
//       </div>
//     )
//   }

//   /* =========================================================
//      UI
//   ========================================================= */

//   return (
//     <div className="space-y-8">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           Convention Configuration
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Manage accommodation rooms and study
//           groups used during convention registration.
//         </p>
//       </div>


//       {/* =====================================================
//           ACCOMMODATIONS
//       ===================================================== */}

//       <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

//         <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//           <div className="flex items-center gap-3">

//             <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
//               <BedDouble
//                 className="text-[#008080]"
//                 size={24}
//               />
//             </div>

//             <div>
//               <h2 className="text-2xl font-bold">
//                 Accommodations
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Configure rooms and gender categories.
//               </p>
//             </div>

//           </div>

//           <button
//             onClick={() => {
//               if (showAccommodationForm) {
//                 resetAccommodationForm()
//               } else {
//                 setShowAccommodationForm(true)
//               }
//             }}
//             className="flex items-center justify-center gap-2 bg-[#008080] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#006b6b] transition"
//           >
//             {showAccommodationForm ? (
//               <>
//                 <X size={18} />
//                 Cancel
//               </>
//             ) : (
//               <>
//                 <Plus size={18} />
//                 Add Accommodation
//               </>
//             )}
//           </button>

//         </div>


//         {/* ACCOMMODATION FORM */}

//         {showAccommodationForm && (
//           <div className="p-6 bg-gray-50 border-b">

//             <h3 className="font-bold text-lg mb-5">
//               {editingAccommodationId
//                 ? 'Edit Accommodation'
//                 : 'Add Accommodation'}
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Room Name
//                 </label>

//                 <input
//                   type="text"
//                   value={accommodationName}
//                   onChange={(e) =>
//                     setAccommodationName(
//                       e.target.value
//                     )
//                   }
//                   placeholder="e.g. Room 1"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//                 />
//               </div>


//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Capacity
//                 </label>

//                 <input
//                   type="number"
//                   min="1"
//                   value={accommodationCapacity}
//                   onChange={(e) =>
//                     setAccommodationCapacity(
//                       Number(e.target.value)
//                     )
//                   }
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//                 />
//               </div>


//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Category
//                 </label>

//                 <select
//                   value={accommodationCategory}
//                   onChange={(e) =>
//                     setAccommodationCategory(
//                       e.target.value as AccommodationCategory
//                     )
//                   }
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//                 >
//                   <option value="male-adult">
//                     Male Adult
//                   </option>

//                   <option value="female-adult">
//                     Female Adult
//                   </option>

//                   <option value="male-youth">
//                     Male Youth
//                   </option>

//                   <option value="female-youth">
//                     Female Youth
//                   </option>

//                   <option value="children">
//                     Children
//                   </option>
//                 </select>
//               </div>

//             </div>


//             <div className="flex justify-end gap-3 mt-5">

//               <button
//                 onClick={resetAccommodationForm}
//                 className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={saveAccommodation}
//                 disabled={savingAccommodation}
//                 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008080] text-white font-semibold disabled:opacity-50"
//               >
//                 <Save size={18} />

//                 {savingAccommodation
//                   ? 'Saving...'
//                   : editingAccommodationId
//                   ? 'Update Room'
//                   : 'Save Room'}
//               </button>

//             </div>

//           </div>
//         )}


//         {/* ACCOMMODATION LIST */}

//         <div className="p-6">

//           {accommodations.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <BedDouble
//                 size={42}
//                 className="mx-auto mb-3 opacity-30"
//               />

//               <p>
//                 No accommodations configured yet.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

//               {accommodations.map(
//                 (room, index) => (
//                   <div
//                     key={
//                       room.id ||
//                       `${room.name}-${index}`
//                     }
//                     className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
//                   >

//                     <div className="flex items-start justify-between">

//                       <div>

//                         <h3 className="font-bold text-lg">
//                           {room.name}
//                         </h3>

//                         <p className="text-sm text-gray-500 mt-1">
//                           Capacity: {room.capacity}
//                         </p>

//                       </div>

//                       <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#008080]/10 text-[#008080]">
//                         {room.category
//                           ?.replace('-', ' ')
//                           .replace('-', ' ')}
//                       </span>

//                     </div>


//                     <div className="flex gap-2 mt-5">

//                       <button
//                         onClick={() =>
//                           editAccommodation(
//                             room
//                           )
//                         }
//                         className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50"
//                       >
//                         <Edit3 size={16} />
//                         Edit
//                       </button>

//                       <button
//                         onClick={() =>
//                           deleteAccommodation(
//                             room.id
//                           )
//                         }
//                         className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-50"
//                       >
//                         <Trash2 size={16} />
//                         Delete
//                       </button>

//                     </div>

//                   </div>
//                 )
//               )}

//             </div>
//           )}

//         </div>

//       </section>


//       {/* =====================================================
//           STUDY GROUPS
//       ===================================================== */}

//       <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

//         <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//           <div className="flex items-center gap-3">

//             <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
//               <BookOpen
//                 className="text-[#008080]"
//                 size={24}
//               />
//             </div>

//             <div>
//               <h2 className="text-2xl font-bold">
//                 Study Groups
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Manage study groups and their categories.
//               </p>
//             </div>

//           </div>


//           <button
//             onClick={() => {
//               if (showStudyGroupForm) {
//                 resetStudyGroupForm()
//               } else {
//                 setShowStudyGroupForm(true)
//               }
//             }}
//             className="flex items-center justify-center gap-2 bg-[#008080] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#006b6b] transition"
//           >
//             {showStudyGroupForm ? (
//               <>
//                 <X size={18} />
//                 Cancel
//               </>
//             ) : (
//               <>
//                 <Plus size={18} />
//                 Add Study Group
//               </>
//             )}
//           </button>

//         </div>


//         {/* STUDY GROUP FORM */}

//         {showStudyGroupForm && (
//           <div className="p-6 bg-gray-50 border-b">

//             <h3 className="font-bold text-lg mb-5">
//               {editingStudyGroupId
//                 ? 'Edit Study Group'
//                 : 'Add Study Group'}
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Group Name
//                 </label>

//                 <input
//                   type="text"
//                   value={studyGroupName}
//                   onChange={(e) =>
//                     setStudyGroupName(
//                       e.target.value
//                     )
//                   }
//                   placeholder="e.g. English"
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//                 />
//               </div>


//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Group Category
//                 </label>

//                 <select
//                   value={studyGroupType}
//                   onChange={(e) =>
//                     setStudyGroupType(
//                       e.target.value as StudyGroupType
//                     )
//                   }
//                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//                 >
//                   <option value="adult">
//                     Adult
//                   </option>

//                   <option value="youth">
//                     Youth / Teenager
//                   </option>

//                   <option value="children">
//                     Children
//                   </option>
//                 </select>
//               </div>

//             </div>


//             <div className="flex justify-end gap-3 mt-5">

//               <button
//                 onClick={resetStudyGroupForm}
//                 className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={saveStudyGroup}
//                 disabled={savingStudyGroup}
//                 className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008080] text-white font-semibold disabled:opacity-50"
//               >
//                 <Save size={18} />

//                 {savingStudyGroup
//                   ? 'Saving...'
//                   : editingStudyGroupId
//                   ? 'Update Group'
//                   : 'Save Group'}
//               </button>

//             </div>

//           </div>
//         )}


//         {/* STUDY GROUP LIST */}

//         <div className="p-6">

//           {studyGroups.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <BookOpen
//                 size={42}
//                 className="mx-auto mb-3 opacity-30"
//               />

//               <p>
//                 No study groups configured yet.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

//               {studyGroups.map(
//                 (group, index) => (
//                   <div
//                     key={
//                       group.id ||
//                       `${group.name}-${index}`
//                     }
//                     className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
//                   >

//                     <div className="flex items-start justify-between">

//                       <div className="flex items-center gap-3">

//                         <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center">
//                           <Users
//                             size={20}
//                             className="text-[#008080]"
//                           />
//                         </div>

//                         <div>

//                           <h3 className="font-bold">
//                             {group.name}
//                           </h3>

//                           <p className="text-sm text-gray-500 capitalize">
//                             {group.type}
//                           </p>

//                         </div>

//                       </div>

//                     </div>


//                     <div className="flex gap-2 mt-5">

//                       <button
//                         onClick={() =>
//                           editStudyGroup(
//                             group
//                           )
//                         }
//                         className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50"
//                       >
//                         <Edit3 size={16} />
//                         Edit
//                       </button>

//                       <button
//                         onClick={() =>
//                           deleteStudyGroup(
//                             group.id
//                           )
//                         }
//                         className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-50"
//                       >
//                         <Trash2 size={16} />
//                         Delete
//                       </button>

//                     </div>

//                   </div>
//                 )
//               )}

//             </div>
//           )}

//         </div>

//       </section>

//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-hot-toast'
import {
  BedDouble,
  BookOpen,
  Edit3,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from 'lucide-react'

/* =========================================================
   TYPES
========================================================= */

type AccommodationCategory =
  | 'male-adult'
  | 'female-adult'
  | 'male-youth'
  | 'female-youth'
  | 'children'

type StudyGroupType =
  | 'adult'
  | 'youth'
  | 'children'

type StudyGroupAssignmentType =
  | 'preference'
  | 'automatic'

type Accommodation = {
  id: string
  name: string
  capacity: number
  category: AccommodationCategory
}

type StudyGroup = {
  id: string
  name: string
  type: StudyGroupType
  language: string
  capacity: number
  assignmentType: StudyGroupAssignmentType
}

/* =========================================================
   HELPERS
========================================================= */

const createId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`
}

/*
  Converts old accommodation data into the new structure.

  Old data may look like:

  {
    name: "Room 1",
    capacity: 20
  }

  We keep it and simply give it a default category.
*/
const normalizeAccommodation = (
  item: any,
  index: number
): Accommodation => {
  const validCategories: AccommodationCategory[] = [
    'male-adult',
    'female-adult',
    'male-youth',
    'female-youth',
    'children',
  ]

  const category =
    validCategories.includes(item?.category)
      ? item.category
      : 'male-adult'

  return {
    id:
      typeof item?.id === 'string' && item.id
        ? item.id
        : `accommodation-${index}-${createId()}`,

    name:
      typeof item?.name === 'string'
        ? item.name
        : `Room ${index + 1}`,

    capacity:
      Number(item?.capacity) > 0
        ? Number(item.capacity)
        : 1,

    category,
  }
}

/*
  Converts old study-group data into the new structure.

  Old data:

  {
    name: "English",
    type: "adult"
  }

  New data:

  {
    name: "English",
    type: "adult",
    language: "English",
    capacity: 50,
    assignmentType: "preference"
  }
*/
const normalizeStudyGroup = (
  item: any,
  index: number
): StudyGroup => {
  let type: StudyGroupType = 'adult'

  if (
    item?.type === 'children' ||
    item?.type === 'child'
  ) {
    type = 'children'
  } else if (
    item?.type === 'youth' ||
    item?.type === 'teenager' ||
    item?.type === 'teen'
  ) {
    type = 'youth'
  }

  const assignmentType: StudyGroupAssignmentType =
    item?.assignmentType === 'automatic'
      ? 'automatic'
      : 'preference'

  return {
    id:
      typeof item?.id === 'string' && item.id
        ? item.id
        : `study-group-${index}-${createId()}`,

    name:
      typeof item?.name === 'string'
        ? item.name
        : `Study Group ${index + 1}`,

    type,

    language:
      typeof item?.language === 'string' &&
      item.language.trim()
        ? item.language
        : 'English',

    capacity:
      Number(item?.capacity) > 0
        ? Number(item.capacity)
        : 50,

    assignmentType,
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export const EventSetup = () => {
  const [loading, setLoading] = useState(true)

  const [accommodations, setAccommodations] =
    useState<Accommodation[]>([])

  const [studyGroups, setStudyGroups] =
    useState<StudyGroup[]>([])

  /* =======================================================
     ACCOMMODATION FORM
  ======================================================= */

  const [
    showAccommodationForm,
    setShowAccommodationForm,
  ] = useState(false)

  const [
    editingAccommodationId,
    setEditingAccommodationId,
  ] = useState<string | null>(null)

  const [
    accommodationName,
    setAccommodationName,
  ] = useState('')

  const [
    accommodationCapacity,
    setAccommodationCapacity,
  ] = useState(4)

  const [
    accommodationCategory,
    setAccommodationCategory,
  ] = useState<AccommodationCategory>(
    'male-adult'
  )

  /* =======================================================
     STUDY GROUP FORM
  ======================================================= */

  const [
    showStudyGroupForm,
    setShowStudyGroupForm,
  ] = useState(false)

  const [
    editingStudyGroupId,
    setEditingStudyGroupId,
  ] = useState<string | null>(null)

  const [
    studyGroupName,
    setStudyGroupName,
  ] = useState('')

  const [
    studyGroupType,
    setStudyGroupType,
  ] = useState<StudyGroupType>('adult')

  const [
    studyGroupLanguage,
    setStudyGroupLanguage,
  ] = useState('English')

  const [
    studyGroupCapacity,
    setStudyGroupCapacity,
  ] = useState(50)

  const [
    studyGroupAssignmentType,
    setStudyGroupAssignmentType,
  ] =
    useState<StudyGroupAssignmentType>(
      'preference'
    )

  /* =======================================================
     SAVING STATES
  ======================================================= */

  const [
    savingAccommodation,
    setSavingAccommodation,
  ] = useState(false)

  const [
    savingStudyGroup,
    setSavingStudyGroup,
  ] = useState(false)

  /* =========================================================
     FETCH EXISTING SETTINGS
  ========================================================= */

  useEffect(() => {
    fetchConventionSettings()
  }, [])

  const fetchConventionSettings = async () => {
    try {
      setLoading(true)

      const settingsRef = doc(
        db,
        'ConventionSettings',
        'main'
      )

      const snapshot = await getDoc(
        settingsRef
      )

      if (!snapshot.exists()) {
        setAccommodations([])
        setStudyGroups([])
        return
      }

      const data = snapshot.data()

      /*
        Normalize old accommodation records.
      */

      const rawAccommodations =
        Array.isArray(data.accommodations)
          ? data.accommodations
          : []

      const normalizedAccommodations =
        rawAccommodations.map(
          (item: any, index: number) =>
            normalizeAccommodation(
              item,
              index
            )
        )

      /*
        Normalize old study group records.
      */

      const rawStudyGroups =
        Array.isArray(data.studyGroups)
          ? data.studyGroups
          : []

      const normalizedStudyGroups =
        rawStudyGroups.map(
          (item: any, index: number) =>
            normalizeStudyGroup(
              item,
              index
            )
        )

      setAccommodations(
        normalizedAccommodations
      )

      setStudyGroups(
        normalizedStudyGroups
      )
    } catch (error) {
      console.error(
        'Failed to fetch convention settings:',
        error
      )

      toast.error(
        'Failed to load convention configuration'
      )
    } finally {
      setLoading(false)
    }
  }

  /* =========================================================
     SAVE ALL CONFIGURATION
  ========================================================= */

  const saveConfiguration = async (
    updatedAccommodations: Accommodation[],
    updatedStudyGroups: StudyGroup[]
  ) => {
    await setDoc(
      doc(
        db,
        'ConventionSettings',
        'main'
      ),
      {
        accommodations:
          updatedAccommodations,

        studyGroups:
          updatedStudyGroups,

        updatedAt:
          Timestamp.now(),
      },
      {
        merge: true,
      }
    )
  }

  /* =========================================================
     ACCOMMODATION FORM RESET
  ========================================================= */

  const resetAccommodationForm = () => {
    setAccommodationName('')
    setAccommodationCapacity(4)
    setAccommodationCategory(
      'male-adult'
    )

    setEditingAccommodationId(null)
    setShowAccommodationForm(false)
  }

  /* =========================================================
     ADD / UPDATE ACCOMMODATION
  ========================================================= */

  const saveAccommodation = async () => {
    const name =
      accommodationName.trim()

    if (!name) {
      toast.error(
        'Enter an accommodation name'
      )
      return
    }

    if (
      !accommodationCapacity ||
      accommodationCapacity < 1
    ) {
      toast.error(
        'Capacity must be at least 1'
      )
      return
    }

    /*
      Prevent duplicate accommodation names.
    */

    const exists =
      accommodations.some(
        (item) =>
          item.name.toLowerCase() ===
            name.toLowerCase() &&
          item.id !==
            editingAccommodationId
      )

    if (exists) {
      toast.error(
        'This accommodation already exists'
      )
      return
    }

    try {
      setSavingAccommodation(true)

      const accommodation: Accommodation = {
        id:
          editingAccommodationId ||
          createId(),

        name,

        capacity:
          Number(
            accommodationCapacity
          ),

        category:
          accommodationCategory,
      }

      let updatedAccommodations: Accommodation[]

      if (editingAccommodationId) {
        updatedAccommodations =
          accommodations.map(
            (item) =>
              item.id ===
              editingAccommodationId
                ? accommodation
                : item
          )
      } else {
        updatedAccommodations = [
          ...accommodations,
          accommodation,
        ]
      }

      await saveConfiguration(
        updatedAccommodations,
        studyGroups
      )

      setAccommodations(
        updatedAccommodations
      )

      toast.success(
        editingAccommodationId
          ? 'Accommodation updated'
          : 'Accommodation added'
      )

      resetAccommodationForm()
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to save accommodation'
      )
    } finally {
      setSavingAccommodation(false)
    }
  }

  /* =========================================================
     EDIT ACCOMMODATION
  ========================================================= */

  const editAccommodation = (
    accommodation: Accommodation
  ) => {
    setAccommodationName(
      accommodation.name
    )

    setAccommodationCapacity(
      accommodation.capacity
    )

    setAccommodationCategory(
      accommodation.category
    )

    setEditingAccommodationId(
      accommodation.id
    )

    setShowAccommodationForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /* =========================================================
     DELETE ACCOMMODATION
  ========================================================= */

  const deleteAccommodation = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this accommodation?'
      )

    if (!confirmed) return

    try {
      const updatedAccommodations =
        accommodations.filter(
          (item) =>
            item.id !== id
        )

      await saveConfiguration(
        updatedAccommodations,
        studyGroups
      )

      setAccommodations(
        updatedAccommodations
      )

      if (
        editingAccommodationId ===
        id
      ) {
        resetAccommodationForm()
      }

      toast.success(
        'Accommodation deleted'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to delete accommodation'
      )
    }
  }

  /* =========================================================
     STUDY GROUP FORM RESET
  ========================================================= */

  const resetStudyGroupForm = () => {
    setStudyGroupName('')
    setStudyGroupType('adult')
    setStudyGroupLanguage('English')
    setStudyGroupCapacity(50)
    setStudyGroupAssignmentType(
      'preference'
    )

    setEditingStudyGroupId(null)
    setShowStudyGroupForm(false)
  }

  /* =========================================================
     ADD / UPDATE STUDY GROUP
  ========================================================= */

  const saveStudyGroup = async () => {
    const name =
      studyGroupName.trim()

    const language =
      studyGroupLanguage.trim()

    if (!name) {
      toast.error(
        'Enter a study group name'
      )
      return
    }

    if (!language) {
      toast.error(
        'Enter the study group language'
      )
      return
    }

    if (
      !studyGroupCapacity ||
      studyGroupCapacity < 1
    ) {
      toast.error(
        'Study group capacity must be at least 1'
      )
      return
    }

    /*
      Prevent duplicate group names.
    */

    const duplicateName =
      studyGroups.some(
        (group) =>
          group.name.toLowerCase() ===
            name.toLowerCase() &&
          group.id !==
            editingStudyGroupId
      )

    if (duplicateName) {
      toast.error(
        'This study group already exists'
      )
      return
    }

    /*
      Prevent the same language/category
      combination from accidentally being
      created twice.

      Example:

      Adult + English

      cannot have another identical
      Adult + English group with the
      exact same name.
    */

    try {
      setSavingStudyGroup(true)

      const studyGroup: StudyGroup = {
        id:
          editingStudyGroupId ||
          createId(),

        name,

        type:
          studyGroupType,

        language,

        capacity:
          Number(
            studyGroupCapacity
          ),

        assignmentType:
          studyGroupAssignmentType,
      }

      let updatedGroups: StudyGroup[]

      if (editingStudyGroupId) {
        updatedGroups =
          studyGroups.map(
            (group) =>
              group.id ===
              editingStudyGroupId
                ? studyGroup
                : group
          )
      } else {
        updatedGroups = [
          ...studyGroups,
          studyGroup,
        ]
      }

      await saveConfiguration(
        accommodations,
        updatedGroups
      )

      setStudyGroups(
        updatedGroups
      )

      toast.success(
        editingStudyGroupId
          ? 'Study group updated'
          : 'Study group added'
      )

      resetStudyGroupForm()
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to save study group'
      )
    } finally {
      setSavingStudyGroup(false)
    }
  }

  /* =========================================================
     EDIT STUDY GROUP
  ========================================================= */

  const editStudyGroup = (
    group: StudyGroup
  ) => {
    setStudyGroupName(
      group.name
    )

    setStudyGroupType(
      group.type
    )

    setStudyGroupLanguage(
      group.language
    )

    setStudyGroupCapacity(
      group.capacity
    )

    setStudyGroupAssignmentType(
      group.assignmentType
    )

    setEditingStudyGroupId(
      group.id
    )

    setShowStudyGroupForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /* =========================================================
     DELETE STUDY GROUP
  ========================================================= */

  const deleteStudyGroup = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this study group?'
      )

    if (!confirmed) return

    try {
      const updatedGroups =
        studyGroups.filter(
          (group) =>
            group.id !== id
        )

      await saveConfiguration(
        accommodations,
        updatedGroups
      )

      setStudyGroups(
        updatedGroups
      )

      if (
        editingStudyGroupId ===
        id
      ) {
        resetStudyGroupForm()
      }

      toast.success(
        'Study group deleted'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to delete study group'
      )
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Loading convention configuration...
          </p>

        </div>
      </div>
    )
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Convention Configuration
        </h1>

        <p className="text-gray-500 mt-2">
          Manage accommodation rooms and study
          groups used during convention registration.
        </p>
      </div>

      {/* =====================================================
          ACCOMMODATIONS
      ===================================================== */}

      <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
              <BedDouble
                className="text-[#008080]"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Accommodations
              </h2>

              <p className="text-sm text-gray-500">
                Configure rooms, capacity and gender categories.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              if (showAccommodationForm) {
                resetAccommodationForm()
              } else {
                setShowAccommodationForm(true)
              }
            }}
            className="flex items-center justify-center gap-2 bg-[#008080] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#006b6b] transition"
          >
            {showAccommodationForm ? (
              <>
                <X size={18} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Accommodation
              </>
            )}
          </button>

        </div>

        {/* ACCOMMODATION FORM */}

        {showAccommodationForm && (
          <div className="p-6 bg-gray-50 border-b">

            <h3 className="font-bold text-lg mb-5">
              {editingAccommodationId
                ? 'Edit Accommodation'
                : 'Add Accommodation'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* NAME */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Room Name
                </label>

                <input
                  type="text"
                  value={accommodationName}
                  onChange={(e) =>
                    setAccommodationName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Room 1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>

              {/* CAPACITY */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    accommodationCapacity
                  }
                  onChange={(e) =>
                    setAccommodationCapacity(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>

                <select
                  value={
                    accommodationCategory
                  }
                  onChange={(e) =>
                    setAccommodationCategory(
                      e.target.value as AccommodationCategory
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                >

                  <option value="male-adult">
                    Male Adult
                  </option>

                  <option value="female-adult">
                    Female Adult
                  </option>

                  <option value="male-youth">
                    Male Youth
                  </option>

                  <option value="female-youth">
                    Female Youth
                  </option>

                  <option value="children">
                    Children
                  </option>

                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                type="button"
                onClick={
                  resetAccommodationForm
                }
                className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveAccommodation
                }
                disabled={
                  savingAccommodation
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008080] text-white font-semibold disabled:opacity-50"
              >
                <Save size={18} />

                {savingAccommodation
                  ? 'Saving...'
                  : editingAccommodationId
                  ? 'Update Room'
                  : 'Save Room'}
              </button>

            </div>

          </div>
        )}

        {/* ACCOMMODATION LIST */}

        <div className="p-6">

          {accommodations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">

              <BedDouble
                size={42}
                className="mx-auto mb-3 opacity-30"
              />

              <p>
                No accommodations configured yet.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {accommodations.map(
                (room) => (
                  <div
                    key={room.id}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-lg">
                          {room.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Capacity: {room.capacity}
                        </p>

                      </div>

                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#008080]/10 text-[#008080] capitalize">
                        {room.category.replace(
                          /-/g,
                          ' '
                        )}
                      </span>

                    </div>

                    <div className="flex gap-2 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          editAccommodation(
                            room
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteAccommodation(
                            room.id
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          STUDY GROUPS
      ===================================================== */}

      <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
              <BookOpen
                className="text-[#008080]"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Study Groups
              </h2>

              <p className="text-sm text-gray-500">
                Configure language, category and capacity.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              if (showStudyGroupForm) {
                resetStudyGroupForm()
              } else {
                setShowStudyGroupForm(true)
              }
            }}
            className="flex items-center justify-center gap-2 bg-[#008080] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#006b6b] transition"
          >
            {showStudyGroupForm ? (
              <>
                <X size={18} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Study Group
              </>
            )}
          </button>

        </div>

        {/* STUDY GROUP FORM */}

        {showStudyGroupForm && (
          <div className="p-6 bg-gray-50 border-b">

            <h3 className="font-bold text-lg mb-5">
              {editingStudyGroupId
                ? 'Edit Study Group'
                : 'Add Study Group'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* GROUP NAME */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Group Name
                </label>

                <input
                  type="text"
                  value={studyGroupName}
                  onChange={(e) =>
                    setStudyGroupName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. English Study Group"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Group Category
                </label>

                <select
                  value={
                    studyGroupType
                  }
                  onChange={(e) =>
                    setStudyGroupType(
                      e.target.value as StudyGroupType
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                >

                  <option value="adult">
                    Adult
                  </option>

                  <option value="youth">
                    Youth / Teenager
                  </option>

                  <option value="children">
                    Children
                  </option>

                </select>
              </div>

              {/* LANGUAGE */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Study Language
                </label>

                <select
                  value={
                    studyGroupLanguage
                  }
                  onChange={(e) =>
                    setStudyGroupLanguage(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                >

                  <option value="English">
                    English
                  </option>

                  <option value="Yoruba">
                    Yoruba
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>
              </div>

              {/* CAPACITY */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    studyGroupCapacity
                  }
                  onChange={(e) =>
                    setStudyGroupCapacity(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                />
              </div>

              {/* ASSIGNMENT TYPE */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Assignment Type
                </label>

                <select
                  value={
                    studyGroupAssignmentType
                  }
                  onChange={(e) =>
                    setStudyGroupAssignmentType(
                      e.target.value as StudyGroupAssignmentType
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
                >

                  <option value="preference">
                    Preference
                  </option>

                  <option value="automatic">
                    Automatic
                  </option>

                </select>
              </div>

            </div>

            {/* HELP TEXT */}

            <div className="mt-5 bg-white border border-gray-200 rounded-xl p-4">

              <p className="text-sm text-gray-600">

                <strong>
                  Preference:
                </strong>{' '}
                attendees can request this language/group
                during registration and the system will
                assign them if there is available capacity.

              </p>

              <p className="text-sm text-gray-600 mt-2">

                <strong>
                  Automatic:
                </strong>{' '}
                the system can use this group when
                automatically balancing registrations.

              </p>

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                type="button"
                onClick={
                  resetStudyGroupForm
                }
                className="px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  saveStudyGroup
                }
                disabled={
                  savingStudyGroup
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008080] text-white font-semibold disabled:opacity-50"
              >

                <Save size={18} />

                {savingStudyGroup
                  ? 'Saving...'
                  : editingStudyGroupId
                  ? 'Update Group'
                  : 'Save Group'}

              </button>

            </div>

          </div>
        )}

        {/* STUDY GROUP LIST */}

        <div className="p-6">

          {studyGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">

              <BookOpen
                size={42}
                className="mx-auto mb-3 opacity-30"
              />

              <p>
                No study groups configured yet.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {studyGroups.map(
                (group) => (
                  <div
                    key={group.id}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center">
                          <Users
                            size={20}
                            className="text-[#008080]"
                          />
                        </div>

                        <div>

                          <h3 className="font-bold">
                            {group.name}
                          </h3>

                          <p className="text-sm text-gray-500 capitalize">
                            {group.type}
                          </p>

                        </div>

                      </div>

                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                        {group.language}
                      </span>

                    </div>

                    {/* GROUP DETAILS */}

                    <div className="grid grid-cols-2 gap-3 mt-5">

                      <div className="bg-gray-50 rounded-xl p-3">

                        <p className="text-xs text-gray-500">
                          Capacity
                        </p>

                        <p className="font-bold text-gray-900">
                          {group.capacity}
                        </p>

                      </div>

                      <div className="bg-gray-50 rounded-xl p-3">

                        <p className="text-xs text-gray-500">
                          Assignment
                        </p>

                        <p className="font-bold text-gray-900 capitalize">
                          {group.assignmentType}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-2 mt-5">

                      <button
                        type="button"
                        onClick={() =>
                          editStudyGroup(
                            group
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteStudyGroup(
                            group.id
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </section>

    </div>
  )
}