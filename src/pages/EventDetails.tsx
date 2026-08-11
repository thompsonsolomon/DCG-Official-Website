// import { useParams, Link } from 'react-router-dom'
// import { useEvents } from '../hooks/useEvents'
// import Breadcrumb from '@/UI/Breadcrum'
// import { motion } from 'framer-motion'
// import { Loader2 } from 'lucide-react'

// export const EventDetails = () => {
//   const { id } = useParams()
//   const { events, loading } = useEvents()

//   const event = events.find((e) => e.id === id)

//   if (!event && !loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold mb-4">
//             Event Not Found
//           </h1>

//           <Link
//             to="/events"
//             className="bg-[#008080] text-white px-6 py-3 rounded-xl"
//           >
//             Back to Events
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full">
//       <Breadcrumb
//         title={event?.EventTitle || ""}
//         backgroundImage={event?.Imgurl || '/asset/bg/3.jpg'}
//         breadcrumbs={[
//           { label: 'Home', path: '/' },
//           { label: 'Events', path: '/events' },
//           { label: event?.EventTitle || "" },
//         ]}
//       />

//       {
//         loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <Loader2 className="h-8 w-8 animate-spin text-emerald-800 mx-auto mb-4" />
//               <p className="text-gray-600">Loading...</p>
//             </div>
//           </div>)
//           :

//           (
//             <section className="py-14 px-4 md:px-8">
//               <div className="max-w-6xl mx-auto">

//                 {/* IMAGE */}
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="overflow-hidden rounded-3xl shadow-2xl mb-10"
//                 >
//                   <img
//                     src={event?.Imgurl || '/asset/bg/1.jpg'}
//                     alt={event?.EventTitle}
//                     className="w-full h-[500px] object-cover"
//                   />
//                 </motion.div>

//                 {/* CONTENT */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

//                   {/* MAIN */}
//                   <motion.div
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="lg:col-span-2"
//                   >
//                     <div className="bg-white rounded-3xl shadow-lg p-8">

//                       <div className="flex flex-wrap gap-3 mb-6">
//                         <span className="bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold capitalize">
//                           {event?.category}
//                         </span>

//                         <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
//                           {new Date(event?.date || "").toLocaleDateString()}
//                         </span>
//                       </div>

//                       <h1 className="text-4xl font-bold mb-6 text-gray-900">
//                         {event?.EventTitle}
//                       </h1>

//                       <div className="prose max-w-none text-gray-700 leading-8">
//                         <p className="text-lg  mb-2 leading-relaxed whitespace-pre-line">
//                           {event?.disc}
//                         </p>

//                         <p className="mt-6 text-[#008080] text-lg ">
//                           Join us for this amazing and spirit-filled event?.
//                           Come and experience worship, fellowship,
//                           prayer and transformation together with believers.
//                         </p>

//                         <p className="mt-4 text-[#008080] text-lg ">
//                           Invite your family and friends and be part
//                           of this impactful gathering.
//                         </p>
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* SIDEBAR */}
//                   <motion.div
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.7 }}
//                     className="space-y-6"
//                   >

//                     {/* EVENT INFO */}
//                     <div className="bg-white rounded-3xl shadow-lg p-6">
//                       <h3 className="text-2xl font-bold mb-5">
//                         Event Information
//                       </h3>

//                       <div className="space-y-5">

//                         <div>
//                           <p className="text-sm text-gray-500">
//                             Date
//                           </p>

//                           <h4 className="font-semibold text-lg">
//                             {new Date(event?.date || "").toLocaleDateString()}
//                           </h4>
//                         </div>

//                         <div>
//                           <p className="text-sm text-gray-500">
//                             Time
//                           </p>

//                           <h4 className="font-semibold text-lg">
//                             {event?.time}
//                           </h4>
//                         </div>

//                         <div>
//                           <p className="text-sm text-gray-500">
//                             Category
//                           </p>

//                           <h4 className="font-semibold text-lg capitalize">
//                             {event?.category}
//                           </h4>
//                         </div>
//                       </div>
//                     </div>

//                     {/* CTA */}
//                     <div className="bg-[#008080] rounded-3xl p-6 text-white">
//                       <h3 className="text-2xl font-bold mb-4">
//                         Don’t Miss This Event
//                       </h3>

//                       <p className="mb-6 text-white/90">
//                         Stay connected and join us physically
//                         or online for this powerful gathering.
//                       </p>

//                       <Link
//                         to="/contact"
//                         className="block text-center bg-white text-[#008080] py-3 rounded-2xl font-bold"
//                       >
//                         Contact Us
//                       </Link>
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </section>


//           )
//       }




//     </div>
//   )
// }


import { useParams, Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import Breadcrumb from '@/UI/Breadcrum'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'

type RegistrationForm = {
  fullName: string
  email: string
  phone: string
  gender: string
  age: string
  category: string
  isDCGMember: string
  branch: string
  otherBranch: string
  churchName: string
  needsAccommodation: boolean
}

const initialForm: RegistrationForm = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  age: '',
  category: '',
  isDCGMember: '',
  branch: '',
  otherBranch: '',
  churchName: '',
  needsAccommodation: false,
}

export const EventDetails = () => {
  const { id } = useParams()
  const { events, loading } = useEvents()

  const event = events.find((e) => e.id === id)

  const [registration, setRegistration] =
    useState<RegistrationForm>(initialForm)

  const [submitting, setSubmitting] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  // ----------------------------------------
  // HANDLE FORM CHANGES
  // ----------------------------------------

  const handleRegistrationChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target

    setRegistration((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  // ----------------------------------------
  // SUBMIT REGISTRATION
  // ----------------------------------------

  const handleRegistrationSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!event?.id) {
      toast.error('Event information is unavailable')
      return
    }

    try {
      setSubmitting(true) 

   const data =   await addDoc(
        collection(db, 'eventRegistrations'),
        {
          eventId: event.id,
          eventTitle: event.EventTitle,

          // Personal information
          fullName: registration.fullName.trim(),
          email: registration.email.trim(),
          phone: registration.phone.trim(),
          gender: registration.gender,
          age: Number(registration.age),
          category: registration.category,

          // Church information
          isDCGMember:
            registration.isDCGMember === 'yes',

          branch:
            registration.isDCGMember === 'yes'
              ? registration.branch
              : '',

          otherBranch:
            registration.branch === 'other'
              ? registration.otherBranch.trim()
              : '',

          churchName:
            registration.isDCGMember === 'no'
              ? registration.churchName.trim()
              : '',

          // Accommodation
          needsAccommodation:
            registration.needsAccommodation,

          // Will be assigned from Admin later
          accommodationRoom: null,
          studyGroup: null,

          // Registration status
          status: 'registered',

          createdAt: serverTimestamp(),
        }
      )

      setRegistrationComplete(true)

      console.log(data)
      setRegistration(initialForm)

      toast.success(
        'Registration completed successfully!'
      )
    } catch (error) {
      console.error(
        'Registration submission error:',
        error
      )

      toast.error(
        'Registration failed. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ----------------------------------------
  // EVENT NOT FOUND
  // ----------------------------------------

  if (!event && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">

          <h1 className="text-4xl font-bold mb-4">
            Event Not Found
          </h1>

          <Link
            to="/events"
            className="bg-[#008080] text-white px-6 py-3 rounded-xl"
          >
            Back to Events
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="w-full">

      {/* =====================================
          BREADCRUMB
      ===================================== */}

      <Breadcrumb
        title={event?.EventTitle || ''}
        backgroundImage={
          event?.Imgurl || '/asset/bg/3.jpg'
        }
        breadcrumbs={[
          {
            label: 'Home',
            path: '/',
          },
          {
            label: 'Events',
            path: '/events',
          },
          {
            label: event?.EventTitle || '',
          },
        ]}
      />

      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (
        <div className="flex items-center justify-center py-20">

          <div className="text-center">

            <Loader2
              className="h-8 w-8 animate-spin text-emerald-800 mx-auto mb-4"
            />

            <p className="text-gray-600">
              Loading event...
            </p>

          </div>

        </div>
      ) : (

        <>
          {/* =====================================
              EVENT DETAILS
          ===================================== */}

          <section className="py-14 px-4 md:px-8">

            <div className="max-w-6xl mx-auto">

              {/* EVENT IMAGE */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="overflow-hidden rounded-3xl shadow-2xl mb-10"
              >

                <img
                  src={
                    event?.Imgurl ||
                    '/asset/bg/1.jpg'
                  }
                  alt={event?.EventTitle}
                  className="w-full h-[300px] md:h-[500px] object-cover"
                />

              </motion.div>

              {/* CONTENT */}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* MAIN CONTENT */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="lg:col-span-2"
                >

                  <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">

                    {/* TAGS */}

                    <div className="flex flex-wrap gap-3 mb-6">

                      <span className="bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold capitalize">
                        {event?.category}
                      </span>

                      <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {new Date(
                          event?.date || ''
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    {/* TITLE */}

                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      {event?.EventTitle}
                    </h1>

                    {/* DESCRIPTION */}

                    <div className="text-gray-700 leading-8">

                      <p className="text-lg leading-relaxed whitespace-pre-line">
                        {event?.disc}
                      </p>

                      <p className="mt-6 text-[#008080] text-lg">
                        Join us for this amazing and
                        spirit-filled event. Come and
                        experience worship, fellowship,
                        prayer and transformation
                        together with believers.
                      </p>

                      <p className="mt-4 text-[#008080] text-lg">
                        Invite your family and friends
                        and be part of this impactful
                        gathering.
                      </p>

                    </div>

                  </div>

                </motion.div>

                {/* SIDEBAR */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: 40,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="space-y-6"
                >

                  {/* EVENT INFORMATION */}

                  <div className="bg-white rounded-3xl shadow-lg p-6">

                    <h3 className="text-2xl font-bold mb-5">
                      Event Information
                    </h3>

                    <div className="space-y-5">

                      <div>
                        <p className="text-sm text-gray-500">
                          Date
                        </p>

                        <h4 className="font-semibold text-lg">
                          {new Date(
                            event?.date || ''
                          ).toLocaleDateString()}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Time
                        </p>

                        <h4 className="font-semibold text-lg">
                          {event?.time}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Category
                        </p>

                        <h4 className="font-semibold text-lg capitalize">
                          {event?.category}
                        </h4>
                      </div>

                    </div>

                  </div>

                  {/* CTA */}

                  <div className="bg-[#008080] rounded-3xl p-6 text-white">

                    <h3 className="text-2xl font-bold mb-4">
                      Don’t Miss This Event
                    </h3>

                    <p className="mb-6 text-white/90">
                      Stay connected and join us
                      physically or online for this
                      powerful gathering.
                    </p>

                    <a
                      href="#registration"
                      className="block text-center bg-white text-[#008080] py-3 rounded-2xl font-bold hover:bg-gray-100 transition"
                    >
                      Register Now
                    </a>

                  </div>

                </motion.div>

              </div>

            </div>

          </section>


          {/* =====================================
              REGISTRATION SECTION
          ===================================== */}

          <section
            id="registration"
            className="py-16 px-4 md:px-8 bg-gray-50"
          >

            <div className="max-w-5xl mx-auto">

              {/* REGISTRATION HEADER */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="text-center mb-10"
              >

                <span className="inline-block bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Convention Registration
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Register for {event?.EventTitle}
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto">
                  Complete the registration form below
                  to reserve your place. Your study group
                  and accommodation will be arranged by
                  the convention team.
                </p>

              </motion.div>

              {/* SUCCESS */}

              {registrationComplete ? (

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
                >

                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">

                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Registration Successful!
                  </h3>

                  <p className="text-gray-600 max-w-xl mx-auto mb-8">
                    Your registration for this event has
                    been successfully submitted. Your
                    accommodation and study group will
                    be assigned by the convention
                    administration.
                  </p>

                  <button
                    onClick={() =>
                      setRegistrationComplete(false)
                    }
                    className="bg-[#008080] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#006666] transition"
                  >
                    Register Another Person
                  </button>

                </motion.div>

              ) : (

                /* FORM */

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="bg-white rounded-3xl shadow-xl p-6 md:p-10"
                >

                  <form
                    onSubmit={
                      handleRegistrationSubmit
                    }
                    className="space-y-8"
                  >

                    {/* PERSONAL INFORMATION */}

                    <div>

                      <h3 className="text-xl font-bold text-gray-900 mb-5">
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* FULL NAME */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>

                          <input
                            type="text"
                            name="fullName"
                            value={
                              registration.fullName
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            placeholder="Enter your full name"
                            className="form-input"
                          />
                        </div>

                        {/* EMAIL */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>

                          <input
                            type="email"
                            name="email"
                            value={
                              registration.email
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            placeholder="example@email.com"
                            className="form-input"
                          />
                        </div>

                        {/* PHONE */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number *
                          </label>

                          <input
                            type="tel"
                            name="phone"
                            value={
                              registration.phone
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            placeholder="08012345678"
                            className="form-input"
                          />
                        </div>

                        {/* GENDER */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender *
                          </label>

                          <select
                            name="gender"
                            value={
                              registration.gender
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            className="form-input"
                          >
                            <option value="">
                              Select gender
                            </option>

                            <option value="male">
                              Male
                            </option>

                            <option value="female">
                              Female
                            </option>
                          </select>
                        </div>

                        {/* AGE */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Age *
                          </label>

                          <input
                            type="number"
                            name="age"
                            value={
                              registration.age
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            min="1"
                            placeholder="Enter your age"
                            className="form-input"
                          />
                        </div>

                        {/* CATEGORY */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category *
                          </label>

                          <select
                            name="category"
                            value={
                              registration.category
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            className="form-input"
                          >
                            <option value="">
                              Select category
                            </option>

                            <option value="adult">
                              Adult
                            </option>

                            <option value="youth">
                              Youth
                            </option>

                            <option value="teenager">
                              Teenager
                            </option>

                            <option value="child">
                              Child
                            </option>
                          </select>
                        </div>

                      </div>

                    </div>


                    {/* CHURCH INFORMATION */}

                    <div className="border-t pt-8">

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Church Information
                      </h3>

                      <p className="text-sm text-gray-500 mb-5">
                        DCG members can select their
                        DCG branch. Non-members can
                        provide the name of their church.
                      </p>

                      <div className="space-y-5">

                        {/* DCG MEMBER */}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Are you an DCG member? *
                          </label>

                          <select
                            name="isDCGMember"
                            value={
                              registration.isDCGMember
                            }
                            onChange={
                              handleRegistrationChange
                            }
                            required
                            className="form-input"
                          >
                            <option value="">
                              Select option
                            </option>

                            <option value="yes">
                              Yes
                            </option>

                            <option value="no">
                              No
                            </option>
                          </select>
                        </div>


                        {/* DCG BRANCH */}

                        {registration.isDCGMember ===
                          'yes' && (

                          <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              DCG Branch *
                            </label>

                            <select
                              name="branch"
                              value={
                                registration.branch
                              }
                              onChange={
                                handleRegistrationChange
                              }
                              required
                              className="form-input"
                            >

                              <option value="">
                                Select your DCG branch
                              </option>

                              <option value="ILU ABO">
                                ILU ABO
                              </option>

                              <option value="Fountain of Light">
                                Fountain of Light
                              </option>

                              <option value="House of Hope">
                                House of Hope
                              </option>

                              <option value="Covenant">
                                Covenant
                              </option>

                              <option value="Student Fellowship">
                                Student Fellowship
                              </option>

                              <option value="other">
                                Other DCG Branch
                              </option>

                            </select>

                          </div>
                        )}


                        {/* OTHER DCG BRANCH */}

                        {registration.isDCGMember ===
                          'yes' &&
                          registration.branch ===
                            'other' && (

                          <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Other DCG Branch *
                            </label>

                            <input
                              type="text"
                              name="otherBranch"
                              value={
                                registration.otherBranch
                              }
                              onChange={
                                handleRegistrationChange
                              }
                              required
                              placeholder="Enter your DCG branch"
                              className="form-input"
                            />

                          </div>
                        )}


                        {/* NON DCG CHURCH */}

                        {registration.isDCGMember ===
                          'no' && (

                          <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Church Name *
                            </label>

                            <input
                              type="text"
                              name="churchName"
                              value={
                                registration.churchName
                              }
                              onChange={
                                handleRegistrationChange
                              }
                              required
                              placeholder="Enter your church name"
                              className="form-input"
                            />

                          </div>
                        )}

                      </div>

                    </div>


                    {/* ACCOMMODATION */}

                    <div className="border-t pt-8">

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Accommodation
                      </h3>

                      <p className="text-sm text-gray-500 mb-5">
                        If you require accommodation,
                        the convention administration
                        will assign an available room
                        after registrations are organized.
                      </p>

                      <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-xl">

                        <input
                          type="checkbox"
                          name="needsAccommodation"
                          checked={
                            registration.needsAccommodation
                          }
                          onChange={
                            handleRegistrationChange
                          }
                          className="w-5 h-5 accent-[#008080]"
                        />

                        <span className="font-medium text-gray-700">
                          I require accommodation
                          during the convention
                        </span>

                      </label>

                    </div>


                    {/* NOTICE */}

                    <div className="bg-[#008080]/5 border border-[#008080]/10 rounded-2xl p-5">

                      <p className="text-sm text-gray-600 leading-relaxed">

                        <strong className="text-[#008080]">
                          Please note:
                        </strong>{' '}

                        Your registration will be reviewed
                        and organized by the convention
                        administration. Study groups and
                        accommodation will be assigned
                        based on your registration details
                        and available capacity.

                      </p>

                    </div>


                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#008080] hover:bg-[#006666] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg"
                    >

                      {submitting
                        ? 'Submitting Registration...'
                        : 'Complete Registration'}

                    </button>

                  </form>

                </motion.div>

              )}

            </div>

          </section>

        </>

      )}

      {/* =====================================
          FORM STYLES
      ===================================== */}

      <style>
        {`
          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            outline: none;
            transition: all 0.2s;
            background: white;
          }

          .form-input:focus {
            border-color: #008080;
            box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
          }
        `}
      </style>

    </div>
  )
}