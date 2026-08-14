// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import {
//   collection,
//   getDocs,
//   query,
//   where,
// } from 'firebase/firestore'
// import {
//   ArrowLeft,
//   Download,
//   Loader2,
//   Printer,
//   Users,
// } from 'lucide-react'
// import toast from 'react-hot-toast'

// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'
// import { db } from '@/config/firebase'

// /* =========================================================
//    TYPES
// ========================================================= */

// type AgeFilter =
//   | 'all'
//   | 'adult'
//   | 'children'
//   | 'youth'
//   | 'teen'
//   | 'youth-teen'

// type Registration = {
//   id: string

//   fullName?: string
//   email?: string
//   phone?: string

//   gender?: string
//   age?: number | string
//   category?: string

//   isRCCGMember?: boolean
//   isDCGMember?: boolean

//   branch?: string
//   otherBranch?: string
//   churchName?: string

//   needsAccommodation?: boolean

//   accommodationRoom?: string | null
//   studyGroup?: string | null
//   studyGroupPreference?: string

//   status?: string

//   createdAt?: any
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// const normalize = (value: unknown) => {
//   return String(value ?? '')
//     .trim()
//     .toLowerCase()
// }

// const formatCategory = (category?: string) => {
//   if (!category) return '-'

//   switch (normalize(category)) {
//     case 'adult':
//       return 'Adult'

//     case 'youth':
//       return 'Youth'

//     case 'teenager':
//     case 'teen':
//       return 'Teenager'

//     case 'child':
//     case 'children':
//       return 'Children'

//     default:
//       return category
//   }
// }

// const formatMemberStatus = (
//   registration: Registration
// ) => {
//   if (
//     typeof registration.isRCCGMember === 'boolean'
//   ) {
//     return registration.isRCCGMember
//       ? 'Yes'
//       : 'No'
//   }

//   if (
//     typeof registration.isDCGMember === 'boolean'
//   ) {
//     return registration.isDCGMember
//       ? 'Yes'
//       : 'No'
//   }

//   return '-'
// }

// const getBranch = (
//   registration: Registration
// ) => {
//   /*
//     For RCCG/DCG members, branch is used.

//     If "Other" was selected, use otherBranch.

//     For non-members, churchName is still useful
//     in the printout.
//   */

//   const branch =
//     registration.branch?.trim()

//   const otherBranch =
//     registration.otherBranch?.trim()

//   const churchName =
//     registration.churchName?.trim()

//   if (
//     branch &&
//     normalize(branch) !== 'other'
//   ) {
//     return branch
//   }

//   if (otherBranch) {
//     return otherBranch
//   }

//   if (churchName) {
//     return churchName
//   }

//   return '-'
// }

// const getCreatedDate = (
//   createdAt: any
// ) => {
//   if (!createdAt) return '-'

//   try {
//     if (
//       typeof createdAt.toDate ===
//       'function'
//     ) {
//       return createdAt
//         .toDate()
//         .toLocaleString()
//     }

//     if (
//       createdAt instanceof Date
//     ) {
//       return createdAt.toLocaleString()
//     }

//     return new Date(
//       createdAt
//     ).toLocaleString()
//   } catch {
//     return '-'
//   }
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function EventRegistrationPrintout() {
//   const { eventId } = useParams<{
//     eventId: string
//   }>()

//   const navigate = useNavigate()

//   /* =======================================================
//      STATE
//   ======================================================= */

//   const [registrations, setRegistrations] =
//     useState<Registration[]>([])

//   const [loading, setLoading] =
//     useState(true)

//   const [selectedBranch, setSelectedBranch] =
//     useState('all')

//   const [selectedAgeRange, setSelectedAgeRange] =
//     useState<AgeFilter>('all')

//   const [eventTitle, setEventTitle] =
//     useState('Event Registration')

//   /* =======================================================
//      FETCH REGISTRATIONS
//   ======================================================= */

//   useEffect(() => {
//     if (!eventId) {
//       setLoading(false)
//       return
//     }

//     fetchRegistrations()
//   }, [eventId])

//   const fetchRegistrations = async () => {
//     if (!eventId) return

//     try {
//       setLoading(true)

//       /*
//         IMPORTANT:

//         We are NOT fetching branches from another
//         collection.

//         We fetch registrations belonging to THIS event:

//         eventRegistrations
//               ↓
//           eventId
//       */

//       const registrationsQuery =
//         query(
//           collection(
//             db,
//             'eventRegistrations'
//           ),
//           where(
//             'eventId',
//             '==',
//             eventId
//           )
//         )

//       const snapshot =
//         await getDocs(
//           registrationsQuery
//         )

//       const data =
//         snapshot.docs.map(
//           (item) => ({
//             id: item.id,
//             ...item.data(),
//           })
//         ) as Registration[]

//       setRegistrations(data)

//       /*
//         Get event title from the registration
//         data itself.

//         This avoids needing another event
//         collection query.
//       */

//       const firstRegistration =
//         data[0]

//       if (
//         firstRegistration &&
//         (firstRegistration as any).eventTitle
//       ) {
//         setEventTitle(
//           (firstRegistration as any)
//             .eventTitle
//         )
//       }
//     } catch (error) {
//       console.error(
//         'Failed to fetch registrations:',
//         error
//       )

//       toast.error(
//         'Failed to load event registrations'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* =======================================================
//      GET BRANCHES FROM THIS EVENT'S REGISTRATIONS
//   ======================================================= */

//   const availableBranches =
//     useMemo(() => {
//       const branches = registrations
//         .map((registration) =>
//           getBranch(registration)
//         )
//         .filter(
//           (branch) =>
//             branch !== '-'
//         )

//       return Array.from(
//         new Set(branches)
//       ).sort((a, b) =>
//         a.localeCompare(b)
//       )
//     }, [registrations])

//   /* =======================================================
//      FILTER BY AGE CATEGORY
//   ======================================================= */

//   const matchesAgeRange = (
//     registration: Registration
//   ) => {
//     if (
//       selectedAgeRange === 'all'
//     ) {
//       return true
//     }

//     const category =
//       normalize(
//         registration.category
//       )

//     switch (
//       selectedAgeRange
//     ) {
//       case 'adult':
//         return category === 'adult'

//       case 'children':
//         return (
//           category === 'child' ||
//           category === 'children'
//         )

//       case 'youth':
//         return category === 'youth'

//       case 'teen':
//         return (
//           category === 'teenager' ||
//           category === 'teen'
//         )

//       case 'youth-teen':
//         return (
//           category === 'youth' ||
//           category === 'teenager' ||
//           category === 'teen'
//         )

//       default:
//         return true
//     }
//   }

//   /* =======================================================
//      FILTERED REGISTRATIONS
//   ======================================================= */

//   const filteredRegistrations =
//     useMemo(() => {
//       return registrations.filter(
//         (registration) => {
//           const branch =
//             getBranch(
//               registration
//             )

//           const branchMatches =
//             selectedBranch ===
//               'all' ||
//             branch ===
//               selectedBranch

//           const ageMatches =
//             matchesAgeRange(
//               registration
//             )

//           return (
//             branchMatches &&
//             ageMatches
//           )
//         }
//       )
//     }, [
//       registrations,
//       selectedBranch,
//       selectedAgeRange,
//     ])

//   /* =======================================================
//      DOWNLOAD PDF
//   ======================================================= */

//   const downloadPDF = () => {
//     if (
//       filteredRegistrations.length ===
//       0
//     ) {
//       toast.error(
//         'There are no registrations to download'
//       )

//       return
//     }

//     try {
//       /*
//         LANDSCAPE A4
//       */

//       const pdf =
//         new jsPDF({
//           orientation: 'landscape',
//           unit: 'mm',
//           format: 'a4',
//         })

//       const pageWidth =
//         pdf.internal.pageSize
//           .getWidth()

//       /* ===================================================
//          TITLE
//       =================================================== */

//       pdf.setFontSize(18)

//       pdf.text(
//         eventTitle,
//         pageWidth / 2,
//         15,
//         {
//           align: 'center',
//         }
//       )

//       pdf.setFontSize(11)

//       pdf.text(
//         'Event Registration List',
//         pageWidth / 2,
//         22,
//         {
//           align: 'center',
//         }
//       )

//       /* ===================================================
//          FILTER INFORMATION
//       =================================================== */

//       const branchLabel =
//         selectedBranch ===
//         'all'
//           ? 'All Branches'
//           : selectedBranch

//       let ageLabel =
//         'All Categories'

//       switch (
//         selectedAgeRange
//       ) {
//         case 'adult':
//           ageLabel = 'Adult'
//           break

//         case 'children':
//           ageLabel =
//             'Children'
//           break

//         case 'youth':
//           ageLabel = 'Youth'
//           break

//         case 'teen':
//           ageLabel =
//             'Teenager'
//           break

//         case 'youth-teen':
//           ageLabel =
//             'Youth / Teenager'
//           break
//       }

//       pdf.setFontSize(9)

//       pdf.text(
//         `Branch: ${branchLabel}`,
//         10,
//         30
//       )

//       pdf.text(
//         `Category: ${ageLabel}`,
//         10,
//         35
//       )

//       pdf.text(
//         `Total Registrations: ${filteredRegistrations.length}`,
//         pageWidth - 10,
//         30,
//         {
//           align: 'right',
//         }
//       )

//       /* ===================================================
//          TABLE
//       =================================================== */

//       const rows =
//         filteredRegistrations.map(
//           (
//             registration,
//             index
//           ) => [
//             index + 1,

//             registration.fullName ||
//               '-',

//             registration.email ||
//               '-',

//             registration.phone ||
//               '-',

//             registration.gender ||
//               '-',

//             registration.age ??
//               '-',

//             formatCategory(
//               registration.category
//             ),

//             formatMemberStatus(
//               registration
//             ),

//             getBranch(
//               registration
//             ),

//             registration.churchName ||
//               '-',

//             registration.needsAccommodation
//               ? 'Yes'
//               : 'No',

//             registration.accommodationRoom ||
//               '-',

//             registration.studyGroupPreference ||
//               '-',

//             registration.studyGroup ||
//               '-',

//             registration.status ||
//               'registered',

//             getCreatedDate(
//               registration.createdAt
//             ),
//           ]
//         )

//       autoTable(
//         pdf,
//         {
//           startY: 40,

//           head: [
//             [
//               'No.',
//               'Full Name',
//               'Email',
//               'Phone',
//               'Gender',
//               'Age',
//               'Category',
//               'Member',
//               'Branch',
//               'Church',
//               'Accommodation?',
//               'Room',
//               'Preferred Group',
//               'Study Group',
//               'Status',
//               'Registered At',
//             ],
//           ],

//           body: rows,

//           theme: 'grid',

//           styles: {
//             fontSize: 6.5,
//             cellPadding: 2,
//             overflow: 'linebreak',
//             valign: 'middle',
//           },

//           headStyles: {
//             fontSize: 6.5,
//             fontStyle: 'bold',
//           },

//           columnStyles: {
//             0: {
//               cellWidth: 8,
//             },

//             1: {
//               cellWidth: 30,
//             },

//             2: {
//               cellWidth: 32,
//             },

//             3: {
//               cellWidth: 23,
//             },

//             4: {
//               cellWidth: 15,
//             },

//             5: {
//               cellWidth: 10,
//             },

//             6: {
//               cellWidth: 18,
//             },

//             7: {
//               cellWidth: 13,
//             },

//             8: {
//               cellWidth: 25,
//             },

//             9: {
//               cellWidth: 25,
//             },

//             10: {
//               cellWidth: 16,
//             },

//             11: {
//               cellWidth: 20,
//             },

//             12: {
//               cellWidth: 22,
//             },

//             13: {
//               cellWidth: 22,
//             },

//             14: {
//               cellWidth: 18,
//             },

//             15: {
//               cellWidth: 27,
//             },
//           },

//           margin: {
//             left: 8,
//             right: 8,
//           },

//           didDrawPage: (
//             data
//           ) => {
//             const pageHeight =
//               pdf.internal.pageSize
//                 .getHeight()

//             pdf.setFontSize(7)

//             pdf.text(
//               `Page ${data.pageNumber}`,
//               pageWidth - 10,
//               pageHeight - 5,
//               {
//                 align: 'right',
//               }
//             )
//           },
//         }
//       )

//       /* ===================================================
//          FILE NAME
//       =================================================== */

//       const safeEventTitle =
//         eventTitle
//           .replace(
//             /[^a-z0-9]/gi,
//             '-'
//           )
//           .replace(
//             /-+/g,
//             '-'
//           )
//           .replace(
//             /^-|-$/g,
//             ''
//           )

//       const safeBranch =
//         selectedBranch ===
//         'all'
//           ? 'all-branches'
//           : selectedBranch
//               .replace(
//                 /[^a-z0-9]/gi,
//                 '-'
//               )
//               .replace(
//                 /-+/g,
//                 '-'
//               )

//       const safeCategory =
//         selectedAgeRange

//       pdf.save(
//         `${safeEventTitle}-${safeBranch}-${safeCategory}-registrations.pdf`
//       )

//       toast.success(
//         'Registration PDF downloaded'
//       )
//     } catch (error) {
//       console.error(
//         'PDF generation error:',
//         error
//       )

//       toast.error(
//         'Failed to generate PDF'
//       )
//     }
//   }

//   /* =======================================================
//      PRINT
//   ======================================================= */

//   const printPage = () => {
//     if (
//       filteredRegistrations.length ===
//       0
//     ) {
//       toast.error(
//         'There are no registrations to print'
//       )

//       return
//     }

//     window.print()
//   }

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2
//             className="w-10 h-10 animate-spin text-[#008080] mx-auto mb-4"
//           />

//           <p className="text-gray-600">
//             Loading event registrations...
//           </p>
//         </div>
//       </div>
//     )
//   }

//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ===================================================
//           TOP BAR
//       =================================================== */}

//       <div className="bg-white border-b sticky top-0 z-30 print:hidden">

//         <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">

//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

//             {/* LEFT */}

//             <div className="flex items-center gap-3">

//               <button
//                 onClick={() =>
//                   navigate(-1)
//                 }
//                 className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
//               >
//                 <ArrowLeft
//                   size={19}
//                 />
//               </button>

//               <div>

//                 <h1 className="text-xl md:text-2xl font-bold text-gray-900">
//                   Registration Printout
//                 </h1>

//                 <p className="text-sm text-gray-500">
//                   {eventTitle}
//                 </p>

//               </div>

//             </div>


//             {/* ACTIONS */}

//             <div className="flex gap-3">

//               <button
//                 onClick={
//                   printPage
//                 }
//                 disabled={
//                   filteredRegistrations.length ===
//                   0
//                 }
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold hover:bg-gray-50 disabled:opacity-50"
//               >
//                 <Printer
//                   size={18}
//                 />

//                 Print
//               </button>

//               <button
//                 onClick={
//                   downloadPDF
//                 }
//                 disabled={
//                   filteredRegistrations.length ===
//                   0
//                 }
//                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#008080] text-white font-semibold hover:bg-[#006b6b] disabled:opacity-50"
//               >
//                 <Download
//                   size={18}
//                 />

//                 Download PDF
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ===================================================
//           MAIN
//       =================================================== */}

//       <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">

//         {/* =================================================
//             FILTER CARD
//         ================================================= */}

//         <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 print:hidden">

//           <div className="flex items-center gap-3 mb-5">

//             <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center">
//               <Users
//                 size={20}
//                 className="text-[#008080]"
//               />
//             </div>

//             <div>

//               <h2 className="font-bold text-lg">
//                 Registration Filters
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Select a branch and category
//                 before downloading.
//               </p>

//             </div>

//           </div>


//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//             {/* BRANCH */}

//             <div>

//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Church Branch
//               </label>

//               <select
//                 value={
//                   selectedBranch
//                 }
//                 onChange={(e) =>
//                   setSelectedBranch(
//                     e.target.value
//                   )
//                 }
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//               >
//                 <option value="all">
//                   All Branches
//                 </option>

//                 {availableBranches.map(
//                   (branch) => (
//                     <option
//                       key={branch}
//                       value={branch}
//                     >
//                       {branch}
//                     </option>
//                   )
//                 )}
//               </select>

//               <p className="text-xs text-gray-500 mt-2">
//                 These branches come directly
//                 from registrations for this
//                 event.
//               </p>

//             </div>


//             {/* AGE RANGE */}

//             <div>

//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Age / Category
//               </label>

//               <select
//                 value={
//                   selectedAgeRange
//                 }
//                 onChange={(e) =>
//                   setSelectedAgeRange(
//                     e.target.value as AgeFilter
//                   )
//                 }
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
//               >
//                 <option value="all">
//                   All Categories
//                 </option>

//                 <option value="adult">
//                   Adult
//                 </option>

//                 <option value="children">
//                   Children
//                 </option>

//                 <option value="youth">
//                   Youth
//                 </option>

//                 <option value="teen">
//                   Teenager
//                 </option>

//                 <option value="youth-teen">
//                   Youth / Teenager
//                 </option>
//               </select>

//               <p className="text-xs text-gray-500 mt-2">
//                 Youth / Teenager combines both
//                 categories into one list.
//               </p>

//             </div>

//           </div>

//         </section>


//         {/* =================================================
//             SUMMARY
//         ================================================= */}

//         <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Total Event Registrations
//               </p>

//               <p className="text-2xl font-bold mt-1">
//                 {registrations.length}
//               </p>
//             </div>


//             <div>
//               <p className="text-sm text-gray-500">
//                 Available Branches
//               </p>

//               <p className="text-2xl font-bold mt-1">
//                 {availableBranches.length}
//               </p>
//             </div>


//             <div>
//               <p className="text-sm text-gray-500">
//                 Current Selection
//               </p>

//               <p className="text-2xl font-bold mt-1">
//                 {filteredRegistrations.length}
//               </p>
//             </div>


//             <div>
//               <p className="text-sm text-gray-500">
//                 Selected Branch
//               </p>

//               <p className="font-bold mt-2 truncate">
//                 {selectedBranch ===
//                 'all'
//                   ? 'All Branches'
//                   : selectedBranch}
//               </p>
//             </div>

//           </div>

//         </section>


//         {/* =================================================
//             PRINTABLE HEADER
//         ================================================= */}

//         <div className="hidden print:block mb-6">

//           <div className="text-center">

//             <h1 className="text-2xl font-bold">
//               {eventTitle}
//             </h1>

//             <h2 className="text-lg font-semibold mt-1">
//               Event Registration List
//             </h2>

//             <p className="text-sm mt-2">
//               Branch:{' '}
//               {selectedBranch ===
//               'all'
//                 ? 'All Branches'
//                 : selectedBranch}
//             </p>

//             <p className="text-sm">
//               Category:{' '}
//               {selectedAgeRange ===
//               'all'
//                 ? 'All Categories'
//                 : selectedAgeRange ===
//                   'youth-teen'
//                 ? 'Youth / Teenager'
//                 : selectedAgeRange}
//             </p>

//           </div>

//         </div>


//         {/* =================================================
//             TABLE
//         ================================================= */}

//         <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//           <div className="overflow-x-auto">

//             <table className="w-full border-collapse text-sm">

//               <thead>

//                 <tr className="bg-gray-100 text-left">

//                   <th className="px-4 py-3 border">
//                     No.
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Full Name
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Email
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Phone
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Gender
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Age
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Category
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Branch
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Church
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Accommodation
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Room
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Preferred Group
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Study Group
//                   </th>

//                   <th className="px-4 py-3 border">
//                     Status
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {filteredRegistrations.length ===
//                 0 ? (
//                   <tr>

//                     <td
//                       colSpan={14}
//                       className="text-center py-16 text-gray-500"
//                     >
//                       No registrations match
//                       the selected filters.
//                     </td>

//                   </tr>
//                 ) : (
//                   filteredRegistrations.map(
//                     (
//                       registration,
//                       index
//                     ) => (
//                       <tr
//                         key={
//                           registration.id
//                         }
//                         className="hover:bg-gray-50"
//                       >

//                         <td className="px-4 py-3 border">
//                           {index + 1}
//                         </td>

//                         <td className="px-4 py-3 border font-semibold whitespace-nowrap">
//                           {
//                             registration.fullName ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.email ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border whitespace-nowrap">
//                           {
//                             registration.phone ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border capitalize">
//                           {
//                             registration.gender ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.age ??
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {formatCategory(
//                             registration.category
//                           )}
//                         </td>

//                         <td className="px-4 py-3 border whitespace-nowrap">
//                           {getBranch(
//                             registration
//                           )}
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.churchName ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {registration.needsAccommodation
//                             ? 'Yes'
//                             : 'No'}
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.accommodationRoom ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.studyGroupPreference ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border">
//                           {
//                             registration.studyGroup ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-4 py-3 border capitalize">
//                           {
//                             registration.status ||
//                             'registered'
//                           }
//                         </td>

//                       </tr>
//                     )
//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         </section>

//       </main>


//       {/* ===================================================
//           PRINT STYLES
//       =================================================== */}

//       <style>
//         {`
//           @media print {

//             @page {
//               size: A4 landscape;
//               margin: 8mm;
//             }

//             body {
//               background: white !important;
//             }

//             .print\\:hidden {
//               display: none !important;
//             }

//             .print\\:block {
//               display: block !important;
//             }

//             table {
//               width: 100% !important;
//               font-size: 8px !important;
//             }

//             th,
//             td {
//               padding: 4px !important;
//             }

//             section {
//               box-shadow: none !important;
//               border: none !important;
//             }
//           }
//         `}
//       </style>

//     </div>
//   )
// }


import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import {
  ArrowLeft,
  Download,
  Loader2,
  Printer,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { db } from '@/config/firebase'

/* =========================================================
   TYPES
========================================================= */

type AgeFilter =
  | 'all'
  | 'adult'
  | 'children'
  | 'youth'
  | 'teen'
  | 'youth-teen'

type Registration = {
  id: string

  fullName?: string
  email?: string
  phone?: string

  gender?: string
  age?: number | string
  category?: string

  isRCCGMember?: boolean
  isDCGMember?: boolean

  branch?: string
  otherBranch?: string
  churchName?: string

  address?: string

  needsAccommodation?: boolean

  accommodationRoom?: string | null
  studyGroup?: string | null
  studyGroupPreference?: string

  status?: string

  eventTitle?: string

  createdAt?: any
}

/* =========================================================
   CONSTANTS
========================================================= */

const OTHER_BRANCH = '__others__'

/* =========================================================
   HELPERS
========================================================= */

const normalize = (value: unknown) => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

/*
 * Convert a category into a nice display name.
 */
const formatCategory = (category?: string) => {
  if (!category) return '-'

  switch (normalize(category)) {
    case 'adult':
      return 'Adult'

    case 'youth':
      return 'Youth'

    case 'teen':
    case 'teenager':
      return 'Teenager'

    case 'child':
    case 'children':
      return 'Children'

    default:
      return category
  }
}

/*
 * Convert the selected age filter into a nice
 * display name for the PDF.
 */
const formatAgeFilter = (
  filter: AgeFilter
) => {
  switch (filter) {
    case 'adult':
      return 'Adult'

    case 'children':
      return 'Children'

    case 'youth':
      return 'Youth'

    case 'teen':
      return 'Teenager'

    case 'youth-teen':
      return 'Youth / Teenager'

    default:
      return 'All Categories'
  }
}

/*
 * Member status.
 */
const formatMemberStatus = (
  registration: Registration
) => {
  if (
    typeof registration.isRCCGMember ===
    'boolean'
  ) {
    return registration.isRCCGMember
      ? 'Yes'
      : 'No'
  }

  if (
    typeof registration.isDCGMember ===
    'boolean'
  ) {
    return registration.isDCGMember
      ? 'Yes'
      : 'No'
  }

  return '-'
}

/*
 * Get the RAW branch value from a registration.
 *
 * We intentionally do NOT immediately use otherBranch
 * or churchName here.
 *
 * This allows us to distinguish:
 *
 *   Actual event branch
 *   vs
 *   Other branch
 */
const getRawBranch = (
  registration: Registration
) => {
  const branch =
    registration.branch?.trim()

  if (
    branch &&
    normalize(branch) !== 'other' &&
    normalize(branch) !== 'others'
  ) {
    return branch
  }

  return ''
}

/*
 * Get the branch that should be displayed.
 *
 * If it is not a recognised branch belonging to this
 * event, it becomes "Others".
 */
const getDisplayBranch = (
  registration: Registration,
  availableRealBranches: string[]
) => {
  const rawBranch =
    getRawBranch(registration)

  if (!rawBranch) {
    return 'Others'
  }

  const matchedBranch =
    availableRealBranches.find(
      (branch) =>
        normalize(branch) ===
        normalize(rawBranch)
    )

  if (matchedBranch) {
    return matchedBranch
  }

  return 'Others'
}

/*
 * Date formatter.
 */
const getCreatedDate = (
  createdAt: any
) => {
  if (!createdAt) return '-'

  try {
    if (
      typeof createdAt.toDate ===
      'function'
    ) {
      return createdAt
        .toDate()
        .toLocaleString()
    }

    if (
      createdAt instanceof Date
    ) {
      return createdAt.toLocaleString()
    }

    return new Date(
      createdAt
    ).toLocaleString()
  } catch {
    return '-'
  }
}

/*
 * Safely create a filename.
 */
const makeSafeFileName = (
  value: string
) => {
  return value
    .replace(
      /[^a-z0-9]/gi,
      '-'
    )
    .replace(
      /-+/g,
      '-'
    )
    .replace(
      /^-|-$/g,
      '')
    .toLowerCase()
}

/* =========================================================
   COMPONENT
========================================================= */

export default function EventRegistrationPrintout() {
  const { eventId } =
    useParams<{
      eventId: string
    }>()

  const navigate =
    useNavigate()

  /* =======================================================
     STATE
  ======================================================= */

  const [
    registrations,
    setRegistrations,
  ] = useState<Registration[]>([])

  const [loading, setLoading] =
    useState(true)

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState('all')

  const [
    selectedAgeRange,
    setSelectedAgeRange,
  ] = useState<AgeFilter>('all')

  const [
    eventTitle,
    setEventTitle,
  ] = useState(
    'Event Registration'
  )

  /* =======================================================
     FETCH REGISTRATIONS
  ======================================================= */

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      return
    }

    fetchRegistrations()
  }, [eventId])

  const fetchRegistrations =
    async () => {
      if (!eventId) return

      try {
        setLoading(true)

        /*
         * ONLY registrations for this event.
         */
        const registrationsQuery =
          query(
            collection(
              db,
              'eventRegistrations'
            ),
            where(
              'eventId',
              '==',
              eventId
            )
          )

        const snapshot =
          await getDocs(
            registrationsQuery
          )

        const data =
          snapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          ) as Registration[]

        setRegistrations(data)

        /*
         * Get event title from the registration data.
         */
        const firstRegistration =
          data[0]

        if (
          firstRegistration?.eventTitle
        ) {
          setEventTitle(
            firstRegistration.eventTitle
          )
        }
      } catch (error) {
        console.error(
          'Failed to fetch registrations:',
          error
        )

        toast.error(
          'Failed to load event registrations'
        )
      } finally {
        setLoading(false)
      }
    }

  /* =======================================================
     REAL BRANCHES FOR THIS EVENT
  ======================================================= */

  const availableRealBranches =
    useMemo(() => {
      const branches =
        registrations
          .map(
            (registration) =>
              getRawBranch(
                registration
              )
          )
          .filter(Boolean)

      /*
       * Remove duplicate branches case-insensitively.
       */
      const uniqueBranches =
        new Map<
          string,
          string
        >()

      branches.forEach(
        (branch) => {
          const key =
            normalize(branch)

          if (!uniqueBranches.has(key)) {
            uniqueBranches.set(
              key,
              branch
            )
          }
        }
      )

      return Array.from(
        uniqueBranches.values()
      ).sort((a, b) =>
        a.localeCompare(b)
      )
    }, [registrations])

  /* =======================================================
     BRANCH OPTIONS
  ======================================================= */

  const branchOptions =
    useMemo(() => {
      const options = [
        ...availableRealBranches,
      ]

      /*
       * Check if there are registrations that
       * belong under Others.
       */
      const hasOthers =
        registrations.some(
          (registration) => {
            const rawBranch =
              getRawBranch(
                registration
              )

            if (!rawBranch) {
              return true
            }

            const exists =
              availableRealBranches.some(
                (branch) =>
                  normalize(branch) ===
                  normalize(
                    rawBranch
                  )
              )

            return !exists
          }
        )

      if (hasOthers) {
        options.push(
          OTHER_BRANCH
        )
      }

      return options
    }, [
      registrations,
      availableRealBranches,
    ])

  /* =======================================================
     AGE FILTER
  ======================================================= */

  const matchesAgeRange = (
    registration: Registration
  ) => {
    if (
      selectedAgeRange === 'all'
    ) {
      return true
    }

    const category =
      normalize(
        registration.category
      )

    switch (
      selectedAgeRange
    ) {
      case 'adult':
        return (
          category ===
          'adult'
        )

      case 'children':
        return (
          category === 'child' ||
          category === 'children'
        )

      case 'youth':
        return (
          category ===
          'youth'
        )

      case 'teen':
        return (
          category ===
            'teenager' ||
          category === 'teen'
        )

      /*
       * IMPORTANT:
       *
       * Youth / Teenager means BOTH
       * youth and teenagers.
       */
      case 'youth-teen':
        return (
          category ===
            'youth' ||
          category ===
            'teenager' ||
          category === 'teen'
        )

      default:
        return true
    }
  }

  /* =======================================================
     FILTERED REGISTRATIONS
  ======================================================= */

  const filteredRegistrations =
    useMemo(() => {
      return registrations.filter(
        (registration) => {
          const displayBranch =
            getDisplayBranch(
              registration,
              availableRealBranches
            )

          let branchMatches =
            true

          if (
            selectedBranch !==
            'all'
          ) {
            if (
              selectedBranch ===
              OTHER_BRANCH
            ) {
              branchMatches =
                displayBranch ===
                'Others'
            } else {
              branchMatches =
                normalize(
                  displayBranch
                ) ===
                normalize(
                  selectedBranch
                )
            }
          }

          const ageMatches =
            matchesAgeRange(
              registration
            )

          return (
            branchMatches &&
            ageMatches
          )
        }
      )
    }, [
      registrations,
      availableRealBranches,
      selectedBranch,
      selectedAgeRange,
    ])

  /* =======================================================
     DISPLAYED BRANCH LABEL
  ======================================================= */

  const selectedBranchLabel =
    selectedBranch === 'all'
      ? 'All Branches'
      : selectedBranch ===
        OTHER_BRANCH
      ? 'Others'
      : selectedBranch

  /* =======================================================
     DOWNLOAD PDF
  ======================================================= */

  const downloadPDF = () => {
    if (
      filteredRegistrations.length ===
      0
    ) {
      toast.error(
        'There are no registrations to download'
      )

      return
    }

    try {
      /*
       * LANDSCAPE A4
       */
      const pdf =
        new jsPDF({
          orientation:
            'landscape',
          unit: 'mm',
          format: 'a4',
        })

      const pageWidth =
        pdf.internal.pageSize.getWidth()

      const pageHeight =
        pdf.internal.pageSize.getHeight()

      /* ===================================================
         MAIN HEADER
      =================================================== */

      pdf.setFont(
        'helvetica',
        'bold'
      )

      pdf.setFontSize(16)

      pdf.text(
        'DISCIPLES CHURCH OF GOD FOR ALL NATION',
        pageWidth / 2,
        12,
        {
          align: 'center',
        }
      )

      /*
       * Branch + Event title
       */
      pdf.setFontSize(12)

      pdf.text(
        `${selectedBranchLabel} Registration for ${eventTitle}`,
        pageWidth / 2,
        19,
        {
          align: 'center',
        }
      )

      /*
       * Small subtitle
       */
      pdf.setFont(
        'helvetica',
        'normal'
      )

      pdf.setFontSize(8)

      pdf.text(
        'Event Registration Report',
        pageWidth / 2,
        25,
        {
          align: 'center',
        }
      )

      /* ===================================================
         FILTER INFORMATION
      =================================================== */

      pdf.setFontSize(8)

      pdf.text(
        `Branch: ${selectedBranchLabel}`,
        8,
        32
      )

      pdf.text(
        `Category: ${formatAgeFilter(
          selectedAgeRange
        )}`,
        8,
        37
      )

      pdf.text(
        `Total Registrations: ${filteredRegistrations.length}`,
        pageWidth - 8,
        32,
        {
          align: 'right',
        }
      )

      /* ===================================================
         TABLE DATA
      =================================================== */

      const rows =
        filteredRegistrations.map(
          (
            registration,
            index
          ) => [
            index + 1,

            registration.fullName ||
              '-',

            registration.email ||
              '-',

            registration.phone ||
              '-',

            registration.gender ||
              '-',

            registration.age ??
              '-',

            formatCategory(
              registration.category
            ),

            formatMemberStatus(
              registration
            ),

            getDisplayBranch(
              registration,
              availableRealBranches
            ),

            registration.churchName ||
              '-',

            registration.address ||
              registration.otherBranch ||
              '-',

            registration.needsAccommodation
              ? 'Yes'
              : 'No',

            registration.accommodationRoom ||
              '-',

            registration.studyGroupPreference ||
              '-',

            registration.studyGroup ||
              '-',

            registration.status ||
              'registered',
          ]
        )

      /* ===================================================
         TABLE
      =================================================== */

      autoTable(
        pdf,
        {
          startY: 42,

          head: [
            [
              'No.',
              'Full Name',
              'Email',
              'Phone',
              'Gender',
              'Age',
              'Category',
              'Member',
              'Branch',
              'Church',
              'Address',
              'Accommodation',
              'Room',
              'Preferred Group',
              'Study Group',
              'Status',
            ],
          ],

          body: rows,

          theme: 'grid',

          styles: {
            fontSize: 6.2,
            cellPadding: 1.8,
            overflow:
              'linebreak',
            valign: 'middle',
            lineWidth: 0.1,
          },

          headStyles: {
            fontSize: 6.2,
            fontStyle:
              'bold',
            halign: 'center',
          },

          bodyStyles: {
            fontSize: 6.2,
          },

          columnStyles: {
            0: {
              cellWidth: 7,
            },

            1: {
              cellWidth: 28,
            },

            2: {
              cellWidth: 30,
            },

            3: {
              cellWidth: 22,
            },

            4: {
              cellWidth: 13,
            },

            5: {
              cellWidth: 9,
            },

            6: {
              cellWidth: 17,
            },

            7: {
              cellWidth: 11,
            },

            8: {
              cellWidth: 24,
            },

            9: {
              cellWidth: 24,
            },

            10: {
              cellWidth: 32,
            },

            11: {
              cellWidth: 16,
            },

            12: {
              cellWidth: 18,
            },

            13: {
              cellWidth: 21,
            },

            14: {
              cellWidth: 20,
            },

            15: {
              cellWidth: 17,
            },
          },

          margin: {
            left: 7,
            right: 7,
          },

          didDrawPage: (
            data
          ) => {
            /*
             * Footer
             */
            pdf.setFont(
              'helvetica',
              'normal'
            )

            pdf.setFontSize(7)

            pdf.text(
              `Disciples Church of God for All Nation • ${eventTitle}`,
              8,
              pageHeight - 5
            )

            pdf.text(
              `Page ${data.pageNumber}`,
              pageWidth - 8,
              pageHeight - 5,
              {
                align:
                  'right',
              }
            )
          },
        }
      )

      /* ===================================================
         FILE NAME
      =================================================== */

      const safeEventTitle =
        makeSafeFileName(
          eventTitle
        )

      const safeBranch =
        makeSafeFileName(
          selectedBranchLabel
        )

      const safeCategory =
        makeSafeFileName(
          formatAgeFilter(
            selectedAgeRange
          )
        )

      const filename =
        `${safeEventTitle}-${safeBranch}-${safeCategory}-registrations.pdf`

      pdf.save(filename)

      toast.success(
        'Registration PDF downloaded'
      )
    } catch (error) {
      console.error(
        'PDF generation error:',
        error
      )

      toast.error(
        'Failed to generate PDF'
      )
    }
  }

  /* =======================================================
     PRINT
  ======================================================= */

  const printPage = () => {
    if (
      filteredRegistrations.length ===
      0
    ) {
      toast.error(
        'There are no registrations to print'
      )

      return
    }

    window.print()
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            className="w-10 h-10 animate-spin text-[#008080] mx-auto mb-4"
          />

          <p className="text-gray-600">
            Loading event registrations...
          </p>
        </div>
      </div>
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===================================================
          TOP BAR
      =================================================== */}

      <div className="bg-white border-b sticky top-0 z-30 print:hidden">

        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LEFT */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  navigate(-1)
                }
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <ArrowLeft
                  size={19}
                />
              </button>

              <div>

                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Registration Printout
                </h1>

                <p className="text-sm text-gray-500">
                  {eventTitle}
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="flex gap-3">

              <button
                onClick={
                  printPage
                }
                disabled={
                  filteredRegistrations.length ===
                  0
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                <Printer
                  size={18}
                />

                Print
              </button>

              <button
                onClick={
                  downloadPDF
                }
                disabled={
                  filteredRegistrations.length ===
                  0
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#008080] text-white font-semibold hover:bg-[#006b6b] disabled:opacity-50"
              >
                <Download
                  size={18}
                />

                Download PDF
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">

        {/* =================================================
            FILTER CARD
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 print:hidden">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center">
              <Users
                size={20}
                className="text-[#008080]"
              />
            </div>

            <div>

              <h2 className="font-bold text-lg">
                Registration Filters
              </h2>

              <p className="text-sm text-gray-500">
                Select a branch and category
                before downloading.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* BRANCH */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Church Branch
              </label>

              <select
                value={
                  selectedBranch
                }
                onChange={(e) =>
                  setSelectedBranch(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
              >

                <option value="all">
                  All Branches
                </option>

                {availableRealBranches.map(
                  (branch) => (
                    <option
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </option>
                  )
                )}

                {branchOptions.includes(
                  OTHER_BRANCH
                ) && (
                  <option
                    value={
                      OTHER_BRANCH
                    }
                  >
                    Others
                  </option>
                )}

              </select>

              <p className="text-xs text-gray-500 mt-2">
                Branches come directly from
                registrations for this event.
                Other/unrecognised branches are
                grouped under Others.
              </p>

            </div>


            {/* AGE RANGE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age / Category
              </label>

              <select
                value={
                  selectedAgeRange
                }
                onChange={(e) =>
                  setSelectedAgeRange(
                    e.target.value as AgeFilter
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
              >

                <option value="all">
                  All Categories
                </option>

                <option value="adult">
                  Adult
                </option>

                <option value="children">
                  Children
                </option>

                <option value="youth">
                  Youth
                </option>

                <option value="teen">
                  Teenager
                </option>

                <option value="youth-teen">
                  Youth / Teenager
                </option>

              </select>

              <p className="text-xs text-gray-500 mt-2">
                Youth / Teenager combines both
                Youth and Teenager registrations.
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 print:hidden">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Total Event Registrations
              </p>

              <p className="text-2xl font-bold mt-1">
                {registrations.length}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Available Branches
              </p>

              <p className="text-2xl font-bold mt-1">
                {availableRealBranches.length}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Current Selection
              </p>

              <p className="text-2xl font-bold mt-1">
                {
                  filteredRegistrations.length
                }
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Selected Branch
              </p>

              <p className="font-bold mt-2 truncate">
                {
                  selectedBranchLabel
                }
              </p>
            </div>

          </div>

        </section>


        {/* =================================================
            PRINTABLE HEADER
        ================================================= */}

        <div className="hidden print:block mb-6">

          <div className="text-center">

            <h1 className="text-2xl font-bold uppercase">
              Disciples Church Of God For All Nation
            </h1>

            <h2 className="text-lg font-semibold mt-1">
              {selectedBranchLabel} Registration for{' '}
              {eventTitle}
            </h2>

            <p className="text-sm mt-2">
              Category:{' '}
              {formatAgeFilter(
                selectedAgeRange
              )}
            </p>

            <p className="text-sm">
              Total Registrations:{' '}
              {
                filteredRegistrations.length
              }
            </p>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-sm">

              <thead>

                <tr className="bg-gray-100 text-left">

                  <th className="px-4 py-3 border">
                    No.
                  </th>

                  <th className="px-4 py-3 border">
                    Full Name
                  </th>

                  <th className="px-4 py-3 border">
                    Email
                  </th>

                  <th className="px-4 py-3 border">
                    Phone
                  </th>

                  <th className="px-4 py-3 border">
                    Gender
                  </th>

                  <th className="px-4 py-3 border">
                    Age
                  </th>

                  <th className="px-4 py-3 border">
                    Category
                  </th>

                  <th className="px-4 py-3 border">
                    Branch
                  </th>

                  <th className="px-4 py-3 border">
                    Church
                  </th>

                  <th className="px-4 py-3 border">
                    Address
                  </th>

                  <th className="px-4 py-3 border">
                    Accommodation
                  </th>

                  <th className="px-4 py-3 border">
                    Room
                  </th>

                  <th className="px-4 py-3 border">
                    Preferred Group
                  </th>

                  <th className="px-4 py-3 border">
                    Study Group
                  </th>

                  <th className="px-4 py-3 border">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRegistrations.length ===
                0 ? (
                  <tr>

                    <td
                      colSpan={15}
                      className="text-center py-16 text-gray-500"
                    >
                      No registrations match
                      the selected filters.
                    </td>

                  </tr>
                ) : (
                  filteredRegistrations.map(
                    (
                      registration,
                      index
                    ) => (
                      <tr
                        key={
                          registration.id
                        }
                        className="hover:bg-gray-50"
                      >

                        <td className="px-4 py-3 border">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 border font-semibold whitespace-nowrap">
                          {
                            registration.fullName ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.email ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border whitespace-nowrap">
                          {
                            registration.phone ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border capitalize">
                          {
                            registration.gender ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.age ??
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {formatCategory(
                            registration.category
                          )}
                        </td>

                        <td className="px-4 py-3 border whitespace-nowrap">
                          {getDisplayBranch(
                            registration,
                            availableRealBranches
                          )}
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.churchName ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.address ||
                            registration.otherBranch ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {registration.needsAccommodation
                            ? 'Yes'
                            : 'No'}
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.accommodationRoom ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.studyGroupPreference ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border">
                          {
                            registration.studyGroup ||
                            '-'
                          }
                        </td>

                        <td className="px-4 py-3 border capitalize">
                          {
                            registration.status ||
                            'registered'
                          }
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* ===================================================
          PRINT STYLES
      =================================================== */}

      <style>
        {`
          @media print {

            @page {
              size: A4 landscape;
              margin: 8mm;
            }

            body {
              background: white !important;
            }

            .print\\\\:hidden {
              display: none !important;
            }

            .print\\\\:block {
              display: block !important;
            }

            table {
              width: 100% !important;
              font-size: 8px !important;
            }

            th,
            td {
              padding: 4px !important;
            }

            section {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>

    </div>
  )
}