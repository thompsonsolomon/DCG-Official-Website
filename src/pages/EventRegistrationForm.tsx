import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../config/firebase'

type EventRegistrationFormProps = {
  eventId: string
  eventTitle: string
}

type Accommodation = {
  name: string
  capacity: number
}

type StudyGroup = {
  name: string
  type: 'adult' | 'youth' | 'children'
  capacity?: number
  language?: string
}

type Registration = {
  fullName: string
  email: string
  phone: string
  gender: 'male' | 'female' | ''
  age: string
  category:
    | 'adult'
    | 'youth'
    | 'teenager'
    | 'child'
    | ''

  isDCGMember: 'yes' | 'no' | ''
  branch: string
  otherBranch: string
  churchName: string

  needsAccommodation: boolean

  /*
   * USER'S STUDY GROUP PREFERENCE
   *
   * Example:
   * English
   * Yoruba
   * Igbo
   */
  studyGroupPreference: string

  eventId: string
  eventTitle: string

  accommodationRoom: string | null
  studyGroup: string | null

  createdAt: Timestamp | null
}

const initialRegistration: Registration = {
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

  studyGroupPreference: '',

  eventId: '',
  eventTitle: '',

  accommodationRoom: null,
  studyGroup: null,

  createdAt: null,
}

export default function EventRegistrationForm({
  eventId,
  eventTitle,
}: EventRegistrationFormProps) {
  const [registration, setRegistration] =
    useState<Registration>(initialRegistration)

  const [accommodations, setAccommodations] =
    useState<Accommodation[]>([])

  const [studyGroups, setStudyGroups] =
    useState<StudyGroup[]>([])

  const [loadingConfiguration, setLoadingConfiguration] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [registrationComplete, setRegistrationComplete] =
    useState(false)

  /*
  ============================================================
  FETCH CONVENTION SETTINGS
  ============================================================
  */

  useEffect(() => {
    const fetchConfiguration = async () => {
      if (!eventId) {
        setLoadingConfiguration(false)
        return
      }

      try {
        setLoadingConfiguration(true)

        /*
         * USING YOUR EXISTING DATABASE
         *
         * ConventionSettings
         *     └── main
         *
         * We are NOT creating a new settings structure.
         */

        const settingsRef = doc(
          db,
          'ConventionSettings',
          'main'
        )

        const settingsSnap =
          await getDoc(settingsRef)

        if (settingsSnap.exists()) {
          const data = settingsSnap.data()

          /*
           * ACCOMMODATIONS
           */

          if (
            Array.isArray(
              data.accommodations
            )
          ) {
            setAccommodations(
              data.accommodations.map(
                (room: any) => ({
                  name: room.name,
                  capacity: Number(
                    room.capacity || 0
                  ),
                })
              )
            )
          }

          /*
           * STUDY GROUPS
           */

          if (
            Array.isArray(
              data.studyGroups
            )
          ) {
            setStudyGroups(
              data.studyGroups.map(
                (group: any) => ({
                  name: group.name,

                  type:
                    group.type ||
                    'adult',

                  capacity: Number(
                    group.capacity || 0
                  ),

                  language:
                    group.language ||
                    '',
                })
              )
            )
          }
        }
      } catch (error) {
        console.error(error)

        toast.error(
          'Failed to load convention configuration'
        )
      } finally {
        setLoadingConfiguration(false)
      }
    }

    fetchConfiguration()
  }, [eventId])

  /*
  ============================================================
  HANDLE INPUT
  ============================================================
  */

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      name,
      value,
      type,
    } = e.target

    const checked =
      type === 'checkbox'
        ? (
            e.target as HTMLInputElement
          ).checked
        : undefined

    setRegistration((prev) => ({
      ...prev,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  /*
  ============================================================
  GET STUDY GROUP TYPE
  ============================================================
  */

  const getStudyGroupType = (
    category: Registration['category']
  ): 'adult' | 'youth' | 'children' => {
    if (category === 'child') {
      return 'children'
    }

    if (
      category === 'youth' ||
      category === 'teenager'
    ) {
      return 'youth'
    }

    return 'adult'
  }

  /*
  ============================================================
  GET AVAILABLE STUDY GROUP LANGUAGES
  ============================================================
  */

  const getAvailableLanguages = () => {
    if (!registration.category) {
      return []
    }

    const groupType =
      getStudyGroupType(
        registration.category
      )
      console.log(studyGroups)

    const groups =
      studyGroups.filter(
        (group) =>
          group.type === groupType
      )

    /*
     * Remove empty languages and duplicates.
     */

    const languages = groups
      .map(
        (group) =>
          group.language?.trim() || ''
      )
      .filter(Boolean)

    return Array.from(
      new Set(languages)
    )
  }
console.log(getAvailableLanguages())
  /*
  ============================================================
  GET ELIGIBLE STUDY GROUPS
  ============================================================
  */

  const getEligibleStudyGroups = (
    category: Registration['category']
  ) => {
    const groupType =
      getStudyGroupType(category)

    return studyGroups.filter(
      (group) =>
        group.type === groupType
    )
  }

  /*
  ============================================================
  AUTOMATIC STUDY GROUP ALLOCATION
  ============================================================
  */

  const allocateStudyGroup = (
    category: Registration['category'],
    preference: string
  ) => {
    const eligibleGroups =
      getEligibleStudyGroups(
        category
      )

    if (
      eligibleGroups.length === 0
    ) {
      return null
    }

    /*
     * CHILDREN
     *
     * Children already have their
     * standard children study group.
     */

    if (category === 'child') {
      return (
        eligibleGroups[0]?.name ||
        null
      )
    }

    /*
     * YOUTH / TEENAGERS
     *
     * They use the configured youth
     * groups.
     *
     * If a preference was provided,
     * try to match it.
     */

    if (
      category === 'youth' ||
      category === 'teenager'
    ) {
      if (preference) {
        const preferred =
          eligibleGroups.find(
            (group) =>
              group.language
                ?.toLowerCase() ===
              preference.toLowerCase()
          )

        if (preferred) {
          return preferred.name
        }
      }

      return (
        eligibleGroups[0]?.name ||
        null
      )
    }

    /*
     * ADULT
     *
     * Try to match the user's
     * preferred language.
     */

    if (preference) {
      const preferred =
        eligibleGroups.find(
          (group) =>
            group.language
              ?.toLowerCase() ===
            preference.toLowerCase()
        )

      if (preferred) {
        return preferred.name
      }
    }

    /*
     * If the requested language
     * doesn't exist, use the first
     * configured adult group.
     */

    return (
      eligibleGroups[0]?.name ||
      null
    )
  }

  /*
  ============================================================
  AUTOMATIC ACCOMMODATION ALLOCATION
  ============================================================
  */

  const allocateAccommodation = (
    gender: Registration['gender']
  ) => {
    if (
      !registration.needsAccommodation
    ) {
      return null
    }

    if (!gender) {
      return null
    }

    /*
     * Your OLD accommodation structure
     * contains:
     *
     * name
     * capacity
     *
     * So we use the room name to
     * identify gender for now.
     *
     * Example:
     *
     * Male Room 1
     * Female Room 1
     */

    const normalizedGender =
      gender.toLowerCase()

    const genderRooms =
      accommodations.filter(
        (room) => {
          const roomName =
            room.name.toLowerCase()

          if (
            normalizedGender ===
            'male'
          ) {
            return (
              roomName.includes('male') ||
              roomName.includes('men') ||
              roomName.includes('boy')
            )
          }

          if (
            normalizedGender ===
            'female'
          ) {
            return (
              roomName.includes(
                'female'
              ) ||
              roomName.includes(
                'women'
              ) ||
              roomName.includes(
                'girl'
              )
            )
          }

          return false
        }
      )

    if (
      genderRooms.length > 0
    ) {
      return genderRooms[0].name
    }

    /*
     * Fallback for old generic
     * accommodation names.
     */

    return (
      accommodations[0]?.name ||
      null
    )
  }

  /*
  ============================================================
  SUBMIT REGISTRATION
  ============================================================
  */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!eventId) {
      toast.error(
        'Unable to identify this event'
      )
      return
    }

    /*
     * BASIC VALIDATION
     */

    if (
      !registration.fullName.trim() ||
      !registration.email.trim() ||
      !registration.phone.trim()
    ) {
      toast.error(
        'Please complete all required fields'
      )
      return
    }

    if (!registration.gender) {
      toast.error(
        'Please select your gender'
      )
      return
    }

    if (!registration.category) {
      toast.error(
        'Please select your category'
      )
      return
    }

    if (!registration.isDCGMember) {
      toast.error(
        'Please indicate whether you are an DCG member'
      )
      return
    }

    /*
     * DCG MEMBER VALIDATION
     */

    if (
      registration.isDCGMember ===
        'yes' &&
      !registration.branch
    ) {
      toast.error(
        'Please select your DCG branch'
      )
      return
    }

    /*
     * OTHER BRANCH VALIDATION
     */

    if (
      registration.isDCGMember ===
        'yes' &&
      registration.branch ===
        'Other' &&
      !registration.otherBranch.trim()
    ) {
      toast.error(
        'Please enter your DCG branch'
      )
      return
    }

    /*
     * NON MEMBER VALIDATION
     */

    if (
      registration.isDCGMember ===
        'no' &&
      !registration.churchName.trim()
    ) {
      toast.error(
        'Please enter your church name'
      )
      return
    }

    /*
     * STUDY GROUP PREFERENCE
     *
     * Adults should select their
     * preferred language if there
     * are multiple options.
     */

    const availableLanguages =
      getAvailableLanguages()

    if (
      availableLanguages.length >
        0 &&
      registration.category ===
        'adult' &&
      !registration.studyGroupPreference
    ) {
      toast.error(
        'Please select your preferred study group'
      )
      return
    }

    try {
      setSubmitting(true)

      /*
       * AUTOMATIC STUDY GROUP
       */

      const assignedStudyGroup =
        allocateStudyGroup(
          registration.category,
          registration.studyGroupPreference
        )

      /*
       * AUTOMATIC ACCOMMODATION
       */

      const assignedAccommodation =
        registration.needsAccommodation
          ? allocateAccommodation(
              registration.gender
            )
          : null

      /*
       * FIRESTORE DOCUMENT
       */

      const registrationRef =
        doc(
          collection(
            db,
            'eventRegistrations'
          )
        )

      const registrationData = {
        ...registration,

        eventId,
        eventTitle,

        /*
         * ACTUAL ALLOCATION
         */

        accommodationRoom:
          assignedAccommodation,

        studyGroup:
          assignedStudyGroup,

        /*
         * ALLOCATION STATUS
         */

        allocationStatus:
          assignedStudyGroup
            ? 'allocated'
            : 'pending',

        accommodationStatus:
          registration.needsAccommodation
            ? assignedAccommodation
              ? 'allocated'
              : 'pending'
            : 'not-required',

        /*
         * TIMESTAMPS
         */

        createdAt:
          Timestamp.now(),

        updatedAt:
          Timestamp.now(),
      }

      await setDoc(
        registrationRef,
        registrationData
      )

      setRegistrationComplete(
        true
      )

      toast.success(
        'Registration submitted successfully!'
      )
    } catch (error) {
      console.error(
        'Registration error:',
        error
      )

      toast.error(
        'Failed to submit registration'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /*
  ============================================================
  SUCCESS SCREEN
  ============================================================
  */

  if (registrationComplete) {
    return (
      <section
        id="registration"
        className="py-16 px-4 md:px-8 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
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
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Successful
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              Thank you for registering for{' '}
              <strong>
                {eventTitle}
              </strong>
              .
            </p>

            <p className="text-gray-500">
              Your study group and
              accommodation, where
              applicable, have been
              assigned automatically.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  /*
  ============================================================
  FORM
  ============================================================
  */

  return (
    <section
      id="registration"
      className="py-16 px-4 md:px-8 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <span className="inline-block bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Convention Registration
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Register for {eventTitle}
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete the registration
            form below. Your study group
            and accommodation, where
            applicable, will be arranged
            automatically.
          </p>
        </div>

        {/* CONFIGURATION WARNING */}

        {!loadingConfiguration &&
          studyGroups.length === 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4">
              Study group configuration has
              not been completed yet. Your
              registration can still be
              submitted, but the admin will
              need to allocate your study
              group.
            </div>
          )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-10"
        >

          {/* ==================================================
              PERSONAL INFORMATION
          ================================================== */}

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Personal Information
            </h3>

            <p className="text-gray-500 mb-6">
              Please provide your basic
              information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NAME */}

              <div>
                <label className="form-label">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    registration.fullName
                  }
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="form-label">
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    registration.email
                  }
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="form-input"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="form-label">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    registration.phone
                  }
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  className="form-input"
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="form-label">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={
                    registration.gender
                  }
                  onChange={handleChange}
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
                <label className="form-label">
                  Age *
                </label>

                <input
                  type="number"
                  name="age"
                  value={
                    registration.age
                  }
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter your age"
                  className="form-input"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="form-label">
                  Category *
                </label>

                <select
                  name="category"
                  value={
                    registration.category
                  }
                  onChange={handleChange}
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

          {/* ==================================================
              CHURCH INFORMATION
          ================================================== */}

          <div className="border-t pt-8">

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Church Information
            </h3>

            <p className="text-gray-500 mb-6">
              DCG members can select their
              branch. Non-members can provide
              the name of their church.
            </p>

            <div className="space-y-5">

              {/* MEMBER */}

              <div>
                <label className="form-label">
                  Are you an DCG member? *
                </label>

                <select
                  name="isDCGMember"
                  value={
                    registration.isDCGMember
                  }
                  onChange={handleChange}
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

              {/* BRANCH */}

              {registration.isDCGMember ===
                'yes' && (
                <div>
                  <label className="form-label">
                    DCG Branch *
                  </label>

                  <select
                    name="branch"
                    value={
                      registration.branch
                    }
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">
                      Select your branch
                    </option>

                    <option value=" City Of Bethesda(ILU ABO)">
                       City Of Bethesda(ILU ABO)
                    </option>

                    <option value="Fountain of Light">
                      Fountain of Light
                    </option>

                    <option value="House of Hope">
                      House of Hope
                    </option>

                    <option value="Convenant">
                      Convenant
                    </option>

                    <option value="Student Fellowship">
                      Student Fellowship
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>
              )}

              {/* OTHER BRANCH */}

              {registration.isDCGMember ===
                'yes' &&
                registration.branch ===
                  'Other' && (
                  <div>
                    <label className="form-label">
                      Enter Your DCG Branch *
                    </label>

                    <input
                      type="text"
                      name="otherBranch"
                      value={
                        registration.otherBranch
                      }
                      onChange={handleChange}
                      required
                      placeholder="Enter branch name"
                      className="form-input"
                    />
                  </div>
                )}

              {/* NON MEMBER */}

              {registration.isDCGMember ===
                'no' && (
                <div>
                  <label className="form-label">
                    Church Name *
                  </label>

                  <input
                    type="text"
                    name="churchName"
                    value={
                      registration.churchName
                    }
                    onChange={handleChange}
                    required
                    placeholder="Enter your church name"
                    className="form-input"
                  />
                </div>
              )}

            </div>
          </div>

          {/* ==================================================
              STUDY GROUP
          ================================================== */}
       
          <div className="border-t pt-8">

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Study Group
            </h3>

            <p className="text-gray-500 mb-6">
              Select your preferred study
              group. Your final group will be
              assigned automatically based on
              your category and available
              groups.
            </p>

            {/* CHILDREN */}

            {registration.category ===
              'child' ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Children&apos;s Study Group
                </h4>

                <p className="text-sm text-gray-600">
                  Children will automatically
                  be assigned to the standard
                  Children&apos;s Study Group.
                </p>
              </div>
            )
            :
             registration.category=== "youth"?
(
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Youth&apos;s Study Group
                </h4>

                <p className="text-sm text-gray-600">
                  Youth will automatically
                  be assigned to the standard
                  YOuth&apos;s Study Group.
                </p>
              </div>
            )
            :
                         registration.category=== "teenager"?

            
            (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Teenager&apos;s Study Group
                </h4>

                <p className="text-sm text-gray-600">
                  Teenager will automatically
                  be assigned to the standard
                  teenager&apos;s Study Group.
                </p>
              </div>
            )
            
            : (
              <>
                {/* NO GROUP */}

                {!loadingConfiguration &&
                  getAvailableLanguages()
                    .length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                      <p className="text-yellow-800 text-sm">
                       Make Sure to select a category first 
                        Your study group will be
                        assigned by the admin.
                      </p>
                    </div>
                  )}

                {/* LANGUAGE SELECT */}

                {getAvailableLanguages()
                  .length > 0 && (
                  <div>
                    <label className="form-label">
                      Preferred Study Group *
                    </label>

                    <select
                      name="studyGroupPreference"
                      value={
                        registration.studyGroupPreference
                      }
                      onChange={
                        handleChange
                      }
                      required={
                        registration.category ===
                        'adult'
                      }
                      className="form-input"
                    >
                      <option value="">
                        Select preferred group
                      </option>

                      {getAvailableLanguages().map(
                        (language) => (
                          <option
                            key={language}
                            value={language}
                          >
                            {language} Study Group
                          </option>
                        )
                      )}
                    </select>

                    <p className="text-xs text-gray-500 mt-2">
                      We will try to place you
                      in your selected group,
                      subject to availability.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>

          {/* ==================================================
              ACCOMMODATION
          ================================================== */}

          <div className="border-t pt-8">

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Accommodation
            </h3>

            <p className="text-gray-500 mb-6">
              Let us know if you require
              accommodation during the
              convention.
            </p>

            <label className="flex items-center justify-between gap-4 bg-gray-50 p-5 rounded-2xl cursor-pointer">

              <div>
                <h4 className="font-semibold text-gray-900">
                  I need accommodation
                </h4>
                  <input
                type="checkbox"
                name="needsAccommodation"
                checked={
                  registration.needsAccommodation
                }
                onChange={handleChange}
                className="w-5 h-5 accent-[#008080]"
              />

                <p className="text-sm text-gray-500">
                  Accommodation will be assigned
                  automatically based on
                  availability and gender.
                </p>
              </div>

            

            </label>

            {registration.needsAccommodation &&
              accommodations.length ===
                0 && (
                <p className="mt-4 text-sm text-red-600">
                  No accommodation has currently
                  been configured. The admin will
                  allocate accommodation later.
                </p>
              )}

          </div>

          {/* ==================================================
              SUBMIT
          ================================================== */}

          <div className="border-t pt-8">

            <button
              type="submit"
              disabled={
                submitting ||
                loadingConfiguration
              }
              className="w-full bg-[#008080] hover:bg-[#006666] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By submitting this form, you
              confirm that the information
              provided is accurate.
            </p>

          </div>

        </form>
      </div>

      {/* ====================================================
          FORM STYLES
      ==================================================== */}

      <style>{`
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          outline: none;
          background: white;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #008080;
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
        }
      `}</style>
    </section>
  )
}