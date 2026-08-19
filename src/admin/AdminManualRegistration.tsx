import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import { toast } from 'react-hot-toast'
import {
  UserPlus,
  Loader2,
  Save,
  MapPin,
  Phone,
  Mail,
  User,
  BedDouble,
  BookOpen,
  Church,
} from 'lucide-react'

/* =========================================================
   TYPES
========================================================= */

type StudyGroup = {
  id?: string
  name: string
  type?: string
  language?: string
}

type Accommodation = {
  id?: string
  name: string
  capacity?: number
  category?: string
}

type AdminManualRegistrationProps = {
  eventId?: string
  onSuccess?: () => void
}

/* =========================================================
   CHURCH BRANCHES
=========================================================

   Replace these 8 names with the actual branches.

========================================================= */

const CHURCH_BRANCHES = [
 'City Of Bethesda (Ajegunle)',
  'Convenant Parish (Kajola)',
  'Top Of Hill Parish (Sango)',
  'Friends Of Ministry',
  'Fountain Of Light(Ijapo)',
  'House of Hope Parish (Lagos)',
]

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminManualRegistration({
  eventId,
  onSuccess,
}: AdminManualRegistrationProps) {

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')

  const [churchBranch, setChurchBranch] =
    useState('')

  const [studyGroup, setStudyGroup] =
    useState('')

  const [accommodation, setAccommodation] =
    useState('')

  /* =======================================================
     CONFIGURATION STATE
  ======================================================= */

  const [studyGroups, setStudyGroups] =
    useState<StudyGroup[]>([])

  const [accommodations, setAccommodations] =
    useState<Accommodation[]>([])

  const [
    loadingConfiguration,
    setLoadingConfiguration,
  ] = useState(true)

  const [
    configurationError,
    setConfigurationError,
  ] = useState(false)

  const [saving, setSaving] =
    useState(false)

  /* =======================================================
     LOAD CONFIGURATION
  ======================================================= */

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      setLoadingConfiguration(true)
      setConfigurationError(false)

      const settingsRef = doc(
        db,
        'ConventionSettings',
        'main'
      )

      const settingsSnapshot =
        await getDoc(settingsRef)

      if (!settingsSnapshot.exists()) {
        setStudyGroups([])
        setAccommodations([])
        setConfigurationError(true)

        toast.error(
          'Convention configuration was not found'
        )

        return
      }

      const data =
        settingsSnapshot.data()

      /* -----------------------------------------------
         STUDY GROUPS
      ----------------------------------------------- */

      const loadedStudyGroups =
        Array.isArray(data.studyGroups)
          ? data.studyGroups.filter(
              (group: any) =>
                group &&
                typeof group.name ===
                  'string' &&
                group.name.trim() !== ''
            )
          : []

      /* -----------------------------------------------
         ACCOMMODATIONS
      ----------------------------------------------- */

      const loadedAccommodations =
        Array.isArray(data.accommodations)
          ? data.accommodations.filter(
              (room: any) =>
                room &&
                typeof room.name ===
                  'string' &&
                room.name.trim() !== ''
            )
          : []

      setStudyGroups(
        loadedStudyGroups
      )

      setAccommodations(
        loadedAccommodations
      )

    } catch (error) {

      console.error(
        'Failed to load convention configuration:',
        error
      )

      setStudyGroups([])
      setAccommodations([])
      setConfigurationError(true)

      toast.error(
        'Failed to load study groups and accommodations'
      )

    } finally {
      setLoadingConfiguration(false)
    }
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setFullName('')
    setPhone('')
    setAddress('')
    setEmail('')
    setGender('')
    setChurchBranch('')
    setStudyGroup('')
    setAccommodation('')
  }

  /* =======================================================
     GET SELECTED STUDY GROUP
  ======================================================= */

  const getSelectedStudyGroup = () => {
    return studyGroups.find(
      (group) =>
        group.id === studyGroup ||
        group.name === studyGroup
    )
  }

  /* =======================================================
     GET SELECTED ACCOMMODATION
  ======================================================= */

  const getSelectedAccommodation = () => {
    return accommodations.find(
      (room) =>
        room.id === accommodation ||
        room.name === accommodation
    )
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!eventId?.trim()) {
      toast.error(
        'Event ID is missing. Please reopen the manual registration from the event page.'
      )
      return
    }

    if (!fullName.trim()) {
      toast.error(
        'Enter the registrant name'
      )
      return
    }

   

    if (!address.trim()) {
      toast.error(
        'Enter the address'
      )
      return
    }

 

    if (!gender) {
      toast.error(
        'Select sex'
      )
      return
    }

    if (!churchBranch) {
      toast.error(
        'Select a church branch'
      )
      return
    }

    if (!studyGroup) {
      toast.error(
        'Select a study group'
      )
      return
    }

    if (!accommodation) {
      toast.error(
        'Select an accommodation'
      )
      return
    }

    const selectedStudyGroup =
      getSelectedStudyGroup()

    const selectedAccommodation =
      getSelectedAccommodation()

    if (!selectedStudyGroup) {
      toast.error(
        'The selected study group could not be found'
      )
      return
    }

    if (!selectedAccommodation) {
      toast.error(
        'The selected accommodation could not be found'
      )
      return
    }

    /* =====================================================
       SAVE
    ===================================================== */

    try {

      setSaving(true)

      await addDoc(
        collection(
          db,
          'eventRegistrations'
        ),
        {
          /* ---------------------------------------------
             EVENT
          --------------------------------------------- */

          eventId:
            eventId.trim(),

          /* ---------------------------------------------
             PERSONAL INFORMATION
          --------------------------------------------- */

          fullName:
            fullName.trim(),

          phone:
            phone.trim(),

          address:
            address.trim(),

          email:
            email.trim(),

          gender,

          /* ---------------------------------------------
             CHURCH INFORMATION
          --------------------------------------------- */

          branch:
            churchBranch,

          /* ---------------------------------------------
             STUDY GROUP
          --------------------------------------------- */

          studyGroup:
            selectedStudyGroup.name,

          studyGroupPreference:
            selectedStudyGroup.language?.trim() ||
            selectedStudyGroup.name,

          /* ---------------------------------------------
             ACCOMMODATION
          --------------------------------------------- */

          accommodation:
            selectedAccommodation.name,

          accommodationRoom:
            selectedAccommodation.name,

          needsAccommodation:
            true,

          /* ---------------------------------------------
             REGISTRATION INFORMATION
          --------------------------------------------- */

          registrationMethod:
            'admin',

          status:
            'registered',

          createdAt:
            Timestamp.now(),

          updatedAt:
            Timestamp.now(),
        }
      )

      toast.success(
        'Registration added successfully'
      )

      resetForm()

      onSuccess?.()

    } catch (error) {

      console.error(
        'Failed to save manual registration:',
        error
      )

      toast.error(
        'Failed to save registration'
      )

    } finally {
      setSaving(false)
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingConfiguration) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">

        <div className="flex flex-col items-center justify-center text-center">

          <Loader2
            size={36}
            className="animate-spin text-[#008080] mb-4"
          />

          <p className="text-gray-600 font-medium">
            Loading registration configuration...
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Loading available study groups
            and accommodations.
          </p>

        </div>

      </div>
    )
  }

  /* =======================================================
     CONFIGURATION ERROR
  ======================================================= */

  if (configurationError) {
    return (
      <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-8">

        <div className="text-center">

          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">

            <BookOpen
              size={24}
              className="text-red-500"
            />

          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Configuration unavailable
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            The study groups and accommodations
            could not be loaded.
          </p>

          <button
            type="button"
            onClick={loadConfiguration}
            className="mt-5 px-5 py-3 rounded-xl bg-[#008080] text-white font-semibold hover:bg-[#006b6b] transition"
          >
            Try Again
          </button>

        </div>

      </div>
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="p-6 md:p-8 border-b border-gray-100">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center">

            <UserPlus
              size={24}
              className="text-[#008080]"
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Manual Registration
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter the details of someone
              registered manually.
            </p>

          </div>

        </div>

      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* =================================================
              NAME
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Enter full name"
                autoComplete="name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
              />

            </div>

          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
                autoComplete="tel"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
              />

            </div>

          </div>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>

            <div className="relative">

              <MapPin
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Enter address"
                rows={3}
                autoComplete="street-address"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
              />

            </div>

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email address"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
              />

            </div>

          </div>

          {/* =================================================
              SEX
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sex *
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
            >

              <option value="">
                Select sex
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

            </select>

          </div>

          {/* =================================================
              CHURCH BRANCH
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Church Branch *
            </label>

            <div className="relative">

              <Church
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <select
                value={churchBranch}
                onChange={(e) =>
                  setChurchBranch(
                    e.target.value
                  )
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080]"
              >

                <option value="">
                  Select church branch
                </option>

                {CHURCH_BRANCHES.map(
                  (branch) => (
                    <option
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* =================================================
              STUDY GROUP
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Study Group *
            </label>

            <div className="relative">

              <BookOpen
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <select
                value={studyGroup}
                onChange={(e) =>
                  setStudyGroup(
                    e.target.value
                  )
                }
                disabled={
                  studyGroups.length === 0
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080] disabled:bg-gray-50 disabled:text-gray-400"
              >

                <option value="">
                  Select study group
                </option>

                {studyGroups.map(
                  (group) => {

                    const value =
                      group.id ||
                      group.name

                    return (
                      <option
                        key={value}
                        value={value}
                      >
                        {group.name}

                        {group.language
                          ? ` — ${group.language}`
                          : ''}
                      </option>
                    )
                  }
                )}

              </select>

            </div>

            {studyGroups.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                No study groups have been
                configured by the admin.
              </p>
            )}

          </div>

          {/* =================================================
              ACCOMMODATION
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Accommodation *
            </label>

            <div className="relative">

              <BedDouble
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <select
                value={accommodation}
                onChange={(e) =>
                  setAccommodation(
                    e.target.value
                  )
                }
                disabled={
                  accommodations.length === 0
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080] disabled:bg-gray-50 disabled:text-gray-400"
              >

                <option value="">
                  Select accommodation
                </option>

                {accommodations.map(
                  (room) => {

                    const value =
                      room.id ||
                      room.name

                    return (
                      <option
                        key={value}
                        value={value}
                      >
                        {room.name}

                        {typeof room.capacity ===
                        'number'
                          ? ` — Capacity: ${room.capacity}`
                          : ''}
                      </option>
                    )
                  }
                )}

              </select>

            </div>

            {accommodations.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                No accommodations have been
                configured by the admin.
              </p>
            )}

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">

          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="px-6 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              studyGroups.length === 0 ||
              accommodations.length === 0
            }
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#008080] text-white font-semibold hover:bg-[#006b6b] disabled:opacity-50 transition"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                Add Registration
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  )
}