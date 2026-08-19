import { useEffect, useMemo, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Users,
  BedDouble,
  GraduationCap,
  ChevronDown,
  Settings,
  CalendarDays,
  Download,
  X,
} from 'lucide-react'

import { db } from '@/config/firebase'
import { Event, EventRegistration } from '@/types'
import { Link, useNavigate } from 'react-router-dom'
import AdminManualRegistration from './AdminManualRegistration'

/* =========================================================
   TYPES
========================================================= */

type Accommodation = {
  name: string
  capacity: number
}

type StudyGroupType = 'adult' | 'youth' | 'children'

type StudyGroup = {
  name: string
  type: StudyGroupType
}

type ConventionSettings = {
  accommodations: Accommodation[]
  studyGroups: StudyGroup[]
}

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings: ConventionSettings = {
  accommodations: [],
  studyGroups: [],
}

/* =========================================================
   COMPONENT
========================================================= */

export const AdminRegistrations = () => {
  const navigate = useNavigate()
  /* -------------------------------------------------------
     EVENTS
  ------------------------------------------------------- */

  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const [selectedEventId, setSelectedEventId] =
    useState<string>('')

    const [showManualRegistration, setShowManualRegistration] =
  useState(false)


  /* -------------------------------------------------------
     REGISTRATIONS
  ------------------------------------------------------- */

  const [registrations, setRegistrations] =
    useState<EventRegistration[]>([])

  const [registrationsLoading, setRegistrationsLoading] =
    useState(false)
  console.log(registrations)

  /* -------------------------------------------------------
     SETTINGS
  ------------------------------------------------------- */

  const [settings, setSettings] =
    useState<ConventionSettings>(defaultSettings)

  const [settingsLoading, setSettingsLoading] =
    useState(true)

  const [savingSettings, setSavingSettings] =
    useState(false)

  /* -------------------------------------------------------
     NEW ACCOMMODATION
  ------------------------------------------------------- */

  const [newAccommodationName, setNewAccommodationName] =
    useState('')

  const [newAccommodationCapacity, setNewAccommodationCapacity] =
    useState<number>(4)

  /* -------------------------------------------------------
     NEW STUDY GROUP
  ------------------------------------------------------- */

  const [newStudyGroupName, setNewStudyGroupName] =
    useState('')

  const [newStudyGroupType, setNewStudyGroupType] =
    useState<StudyGroupType>('adult')

  /* -------------------------------------------------------
     ALLOCATION
  ------------------------------------------------------- */

  const [allocating, setAllocating] =
    useState(false)

  /* =========================================================
     FETCH EVENTS
  ========================================================= */

  useEffect(() => {
    const q = query(
      collection(db, 'Events'),
      orderBy('date', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        })) as Event[]

        setEvents(data)
        setEventsLoading(false)
      },
      (error) => {
        console.error(error)
        toast.error('Failed to load events')
        setEventsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  /* =========================================================
     FETCH CONVENTION SETTINGS
  ========================================================= */

  useEffect(() => {
    const settingsRef = doc(
      db,
      'ConventionSettings',
      'main'
    )

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data =
            snapshot.data() as ConventionSettings

          setSettings({
            accommodations:
              data.accommodations || [],

            studyGroups:
              data.studyGroups || [],
          })
        } else {
          setSettings(defaultSettings)
        }

        setSettingsLoading(false)
      },
      (error) => {
        console.error(error)
        toast.error(
          'Failed to load convention settings'
        )

        setSettingsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  /* =========================================================
     FETCH REGISTRATIONS FOR SELECTED EVENT
  ========================================================= */

  useEffect(() => {
    if (!selectedEventId) {
      setRegistrations([])
      setRegistrationsLoading(false)
      return
    }

    setRegistrationsLoading(true)

    const q = query(
      collection(db, 'eventRegistrations'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: EventRegistration[] = snapshot.docs
          .map((item) => ({
            ...(item.data() as Omit<EventRegistration, "id">),
            id: item.id,
          }))
          .filter(
            (registration) =>
              registration.eventId === selectedEventId
          ) as EventRegistration[]

        setRegistrations(data)
        setRegistrationsLoading(false)
      },
      (error) => {
        console.error(error)

        toast.error(
          'Failed to load event registrations'
        )

        setRegistrationsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [selectedEventId])

  /* =========================================================
     SELECTED EVENT
  ========================================================= */

  const selectedEvent = useMemo(() => {
    return events.find(
      (event) => event.id === selectedEventId
    )
  }, [events, selectedEventId])

  /* =========================================================
     ADD ACCOMMODATION
  ========================================================= */

  const addAccommodation = () => {
    const name =
      newAccommodationName.trim()

    const capacity =
      Number(newAccommodationCapacity)

    if (!name) {
      toast.error(
        'Enter an accommodation name'
      )
      return
    }

    if (!capacity || capacity < 1) {
      toast.error(
        'Capacity must be at least 1'
      )
      return
    }

    const exists =
      settings.accommodations.some(
        (item) =>
          item.name.toLowerCase() ===
          name.toLowerCase()
      )

    if (exists) {
      toast.error(
        'This accommodation already exists'
      )
      return
    }

    setSettings((prev) => ({
      ...prev,

      accommodations: [
        ...prev.accommodations,

        {
          name,
          capacity,
        },
      ],
    }))

    setNewAccommodationName('')
    setNewAccommodationCapacity(4)
  }

  /* =========================================================
     UPDATE ACCOMMODATION
  ========================================================= */

  const updateAccommodation = (
    index: number,
    field: keyof Accommodation,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,

      accommodations:
        prev.accommodations.map(
          (item, i) =>
            i === index
              ? {
                ...item,
                [field]:
                  field === 'capacity'
                    ? Number(value)
                    : value,
              }
              : item
        ),
    }))
  }

  /* =========================================================
     DELETE ACCOMMODATION
  ========================================================= */

  const deleteAccommodation = (
    index: number
  ) => {
    setSettings((prev) => ({
      ...prev,

      accommodations:
        prev.accommodations.filter(
          (_, i) => i !== index
        ),
    }))
  }

  /* =========================================================
     ADD STUDY GROUP
  ========================================================= */

  const addStudyGroup = () => {
    const name =
      newStudyGroupName.trim()

    if (!name) {
      toast.error(
        'Enter a study group name'
      )
      return
    }

    const exists =
      settings.studyGroups.some(
        (group) =>
          group.name.toLowerCase() ===
          name.toLowerCase()
      )

    if (exists) {
      toast.error(
        'This study group already exists'
      )
      return
    }

    setSettings((prev) => ({
      ...prev,

      studyGroups: [
        ...prev.studyGroups,

        {
          name,
          type: newStudyGroupType,
        },
      ],
    }))

    setNewStudyGroupName('')
    setNewStudyGroupType('adult')
  }

  /* =========================================================
     UPDATE STUDY GROUP
  ========================================================= */

  const updateStudyGroup = (
    index: number,
    field: keyof StudyGroup,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,

      studyGroups:
        prev.studyGroups.map(
          (group, i) =>
            i === index
              ? {
                ...group,
                [field]: value,
              }
              : group
        ),
    }))
  }

  /* =========================================================
     DELETE STUDY GROUP
  ========================================================= */

  const deleteStudyGroup = (
    index: number
  ) => {
    setSettings((prev) => ({
      ...prev,

      studyGroups:
        prev.studyGroups.filter(
          (_, i) => i !== index
        ),
    }))
  }

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const saveSettings = async () => {
    try {
      setSavingSettings(true)

      await setDoc(
        doc(
          db,
          'ConventionSettings',
          'main'
        ),
        {
          ...settings,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      )

      toast.success(
        'Convention settings saved'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to save convention settings'
      )
    } finally {
      setSavingSettings(false)
    }
  }

  /* =========================================================
     ALLOCATION HELPERS
  ========================================================= */

  const getEligibleStudyGroups = (
    ageGroup?: string
  ) => {
    const normalized =
      ageGroup?.toLowerCase()

    if (
      normalized === 'child' ||
      normalized === 'children'
    ) {
      return settings.studyGroups.filter(
        (group) =>
          group.type === 'children'
      )
    }

    if (
      normalized === 'youth' ||
      normalized === 'teenager' ||
      normalized === 'teen'
    ) {
      return settings.studyGroups.filter(
        (group) =>
          group.type === 'youth'
      )
    }

    return settings.studyGroups.filter(
      (group) =>
        group.type === 'adult'
    )
  }

  /* =========================================================
     FIX ALL ALLOCATIONS
  ========================================================= */

  const fixAllocations = async () => {
    if (!selectedEventId) {
      toast.error(
        'Select an event first'
      )
      return
    }

    if (registrations.length === 0) {
      toast.error(
        'This event has no registrations'
      )
      return
    }

    if (
      settings.studyGroups.length === 0
    ) {
      toast.error(
        'Add study groups first'
      )
      return
    }

    if (
      settings.accommodations.length === 0
    ) {
      toast.error(
        'Add accommodations first'
      )
      return
    }

    try {
      setAllocating(true)

      /*
       * ------------------------------------------
       * STUDY GROUP ALLOCATION
       * ------------------------------------------
       *
       * Participants are distributed across
       * groups of the appropriate age/type.
       */

      const groupCounters: Record<
        string,
        number
      > = {}

      settings.studyGroups.forEach(
        (group) => {
          groupCounters[group.name] = 0
        }
      )

      const updatedRegistrations =
        registrations.map(
          (registration) => {
            const groups =
              getEligibleStudyGroups(
                registration.category
              )

            if (groups.length === 0) {
              return {
                ...registration,
                studyGroup: null,
              }
            }

            /*
             * Pick the group currently having
             * the smallest number of people.
             */

            const selectedGroup =
              [...groups].sort(
                (a, b) =>
                  groupCounters[a.name] -
                  groupCounters[b.name]
              )[0]

            groupCounters[
              selectedGroup.name
            ] += 1

            return {
              ...registration,
              studyGroup:
                selectedGroup.name,
            }
          }
        )

      /*
       * ------------------------------------------
       * ACCOMMODATION ALLOCATION
       * ------------------------------------------
       */

      const roomOccupancy: Record<
        string,
        number
      > = {}

      settings.accommodations.forEach(
        (room) => {
          roomOccupancy[room.name] = 0
        }
      )

      /*
       * Start with people who actually
       * requested accommodation.
       */

      const finalRegistrations =
        updatedRegistrations.map(
          (registration) => {
            const needsAccommodation =
              Boolean(
                registration?.needsAccommodation
              )

            if (!needsAccommodation) {
              return {
                ...registration,
                accommodation: null,
              }
            }

            /*
             * Find the first room with
             * available capacity.
             */

            const availableRoom =
              settings.accommodations.find(
                (room) =>
                  roomOccupancy[
                  room.name
                  ] < room.capacity
              )

            /*
             * No room available.
             */

            if (!availableRoom) {
              return {
                ...registration,
                accommodation: null,
              }
            }

            roomOccupancy[
              availableRoom.name
            ] += 1

            return {
              ...registration,
              accommodation:
                availableRoom.name,
            }
          }
        )

      /*
       * ------------------------------------------
       * SAVE EVERYTHING IN ONE BATCH
       * ------------------------------------------
       */

      const batch =
        writeBatch(db)

      finalRegistrations.forEach(
        (registration) => {
          if (!registration.id) return

          batch.update(
            doc(
              db,
              'eventRegistrations',
              registration.id
            ),
            {
              studyGroup:
                registration.studyGroup ||
                null,

              accommodation:
                registration.accommodation ||
                null,

              allocatedAt:
                new Date(),
            }
          )
        }
      )

      await batch.commit()

      /*
       * Update local UI immediately.
       */

      setRegistrations(
        finalRegistrations
      )

      toast.success(
        'All allocations fixed successfully'
      )
    } catch (error) {
      console.error(error)

      toast.error(
        'Failed to allocate participants'
      )
    } finally {
      setAllocating(false)
    }
  }

  /* =========================================================
     STATISTICS
  ========================================================= */

  const accommodationNeeded =
    registrations.filter(
      (registration) =>
        registration?.needsAccommodation ===
        true
    ).length

  const accommodationAssigned =
    registrations.filter(
      (registration) =>
        Boolean(
          registration.accommodation
        )
    ).length

  const studyGroupsAssigned =
    registrations.filter(
      (registration) =>
        Boolean(
          registration.studyGroup
        )
    ).length

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    eventsLoading ||
    settingsLoading
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#008080] mx-auto mb-3" />

          <p className="text-gray-600">
            Loading convention management...
          </p>
        </div>
      </div>
    )
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-8 pb-12">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Convention Management
        </h1>

        <p className="text-gray-600 mt-2">
          Configure accommodation and study
          groups, then manage registrations for
          each convention event.
        </p>
      </div>

      {/* ===================================================
          CONVENTION SETTINGS
      =================================================== */}

      {/* ===================================================
          EVENTS
      =================================================== */}

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">

        <div className="flex items-center gap-3 mb-5">

          <CalendarDays className="text-[#008080]" />

          <div>
            <h2 className="text-2xl font-bold">
              Convention Events
            </h2>

            <p className="text-sm text-gray-500">
              Select an event to view its
              registrations.
            </p>
          </div>

        </div>

        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No events have been created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() =>
                  setSelectedEventId(
                    event.id || ''
                  )
                }
                className={`text-left border rounded-2xl overflow-hidden transition hover:shadow-lg ${selectedEventId === event.id
                  ? 'border-[#008080] ring-2 ring-[#008080]/20'
                  : 'border-gray-200'
                  }`}
              >

                {event.Imgurl ? (
                  <img
                    src={event.Imgurl}
                    alt={event.EventTitle}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                    <CalendarDays className="text-gray-400" />
                  </div>
                )}

                <div className="p-4">

                  <h3 className="font-bold text-lg">
                    {event.EventTitle}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {event.date
                      ? new Date(
                        event.date
                      ).toLocaleDateString()
                      : 'No date'}
                  </p>

                  <p className="text-sm text-gray-500">
                    {event.location}
                  </p>

                </div>

              </button>
            ))}

          </div>
        )}

      </div>

      {/* ===================================================
          SELECTED EVENT
      =================================================== */}

      {selectedEvent && (
        <div className="space-y-6">

          {/* EVENT HEADER */}

          <div className="bg-[#008080] rounded-3xl p-6 md:p-8 text-white">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-white/70 text-sm font-semibold uppercase tracking-wide">
                  Selected Event
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {selectedEvent.EventTitle}
                </h2>

                <p className="text-white/80 mt-2">
                  {selectedEvent.date
                    ? new Date(
                      selectedEvent.date
                    ).toLocaleDateString()
                    : ''}
                  {selectedEvent.location
                    ? ` • ${selectedEvent.location}`
                    : ''}
                </p>

              </div>

            <div className="gap-4 flex flex-col">

  <button
    type="button"
    onClick={fixAllocations}
    disabled={
      allocating ||
      registrationsLoading
    }
    className="bg-white text-[#008080] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-60 transition"
  >
    {allocating ? (
      <>
        <RefreshCw
          size={18}
          className="animate-spin"
        />
        Allocating...
      </>
    ) : (
      <>
        <RefreshCw size={18} />
        Fix All Allocations
      </>
    )}
  </button>

  <button
    type="button"
    onClick={() => setShowManualRegistration(true)}
    className="bg-white text-[#008080] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
  >
    Manual Reg
  </button>

</div>






            </div>

          </div>

          {/* STATISTICS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">

              <div className="flex justify-between">

                <div>
                  <p className="text-gray-500 text-sm">
                    Registrations
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {registrations.length}
                  </h3>
                </div>

                <Users className="text-[#008080]" />
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">

              <div className="flex justify-between">

                <div>
                  <p className="text-gray-500 text-sm">
                    Study Groups Assigned
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {studyGroupsAssigned}
                  </h3>
                </div>

                <GraduationCap className="text-[#008080]" />
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">

              <div className="flex justify-between">

                <div>
                  <p className="text-gray-500 text-sm">
                    Need Accommodation
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {accommodationNeeded}
                  </h3>
                </div>

                <BedDouble className="text-purple-600" />
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">

              <div className="flex justify-between">

                <div>
                  <p className="text-gray-500 text-sm">
                    Accommodation Assigned
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {accommodationAssigned}
                  </h3>
                </div>

                <BedDouble className="text-green-600" />
              </div>

            </div>

          </div>

          {/* REGISTRATIONS */}

        {/* ===================================================
    REGISTRATIONS
=================================================== */}

<div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

  {/* HEADER */}

  <div className="p-6 border-b flex items-center justify-between">

    <div className="flex items-end justify-between w-full">

      <div>
        <h2 className="text-2xl font-bold">
          Registered Participants
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {registrations.length}{' '}
          participant
          {registrations.length !== 1 ? 's' : ''}{' '}
          registered for this event.
        </p>
      </div>

      <button
        onClick={() =>
          navigate(
            `/admin/events/${selectedEventId}/registrations/print`
          )
        }
        disabled={!selectedEventId}
        className="flex items-center gap-2 bg-[#008080] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#006b6b] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} />

        Download Registrations
      </button>

    </div>

    {registrationsLoading && (
      <RefreshCw
        className="animate-spin text-[#008080] ml-4"
      />
    )}

  </div>


  {/* EMPTY STATE */}

  {registrations.length === 0 &&
  !registrationsLoading ? (

    <div className="p-14 text-center">

      <Users className="mx-auto text-gray-300 w-12 h-12 mb-4" />

      <h3 className="font-semibold text-lg">
        No registrations yet
      </h3>

      <p className="text-gray-500 mt-1">
        Registrations for this event will appear here.
      </p>

    </div>

  ) : (

    /* =================================================
       REGISTRATION TABLE
    ================================================= */

    <div className="overflow-x-auto">

      <table className="w-full min-w-[1000px] border-collapse">

        {/* TABLE HEADER */}

        <thead>

          <tr className="bg-gray-100 border-b border-gray-300">

            <th className="px-4 py-4 text-center text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              S/N
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              NAME
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              PHONE NO
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              ADDRESS
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              E-MAIL
            </th>

            <th className="px-4 py-4 text-center text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              SEX
            </th>

            <th className="px-4 py-4 text-center text-sm font-bold text-gray-800 border-r border-gray-300 whitespace-nowrap">
              S/G
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold text-gray-800 whitespace-nowrap">
              ACCOMD
            </th>

          </tr>

        </thead>


        {/* TABLE BODY */}

        <tbody>

          {registrations.map(
            (registration, index) => (

              <tr
                key={registration.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >

                {/* S/N */}

                <td className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                  {index + 1}.
                </td>


                {/* NAME */}

                <td className="px-5 py-4 border-r border-gray-200">

                  <p className="font-semibold text-gray-900">
                    {registration.fullName || '-'}
                  </p>

                </td>


                {/* PHONE */}

                <td className="px-5 py-4 border-r border-gray-200">

                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    {registration.phone || '-'}
                  </span>

                </td>


                {/* ADDRESS */}

                <td className="px-5 py-4 border-r border-gray-200">

                  <span className="text-sm text-gray-700">
                    {registration.address || '-'}
                  </span>

                </td>


                {/* EMAIL */}

                <td className="px-5 py-4 border-r border-gray-200">

                  <span className="text-sm text-gray-700">
                    {registration.email || '-'}
                  </span>

                </td>


                {/* SEX */}

                <td className="px-4 py-4 text-center border-r border-gray-200">

                  <span className="font-semibold uppercase text-gray-800">
                    {registration.gender
                      ? registration.gender.charAt(0).toUpperCase()
                      : '-'}
                  </span>

                </td>


                {/* STUDY GROUP */}

                <td className="px-4 py-4 text-center border-r border-gray-200">

                  <span className="font-semibold text-gray-800">
                    {registration.studyGroup || '-'}
                  </span>

                </td>


                {/* ACCOMMODATION */}

                <td className="px-5 py-4">

                  <span className="text-sm font-semibold text-gray-800">
                    {registration.accommodation || '-'}
                  </span>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  )}

</div>

        </div>
      )}

      {/* ===================================================
          NO EVENT SELECTED
      =================================================== */}

      {!selectedEvent && (
        <div className="bg-white rounded-3xl shadow border border-gray-100 p-14 text-center">

          <CalendarDays className="mx-auto w-14 h-14 text-gray-300 mb-4" />

          <h2 className="text-xl font-bold text-gray-800">
            Select an event
          </h2>

          <p className="text-gray-500 mt-2">
            Choose a convention event above to
            view and manage its registrations.
          </p>

        </div>
      )}



{showManualRegistration && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() =>
        setShowManualRegistration(false)
      }
    />

  
  </div>
)}

{showManualRegistration && selectedEventId && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowManualRegistration(false)}
    />

    {/* MODAL */}
    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Manual Registration
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Register someone manually from the admin portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowManualRegistration(false)}
          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
        >
          <X size={20} />
        </button>

      </div>

      {/* FORM */}
      <div className="p-6">
        <AdminManualRegistration
          eventId={selectedEventId}
          onSuccess={() => {
            setShowManualRegistration(false)
          }}
        />
      </div>

    </div>
  </div>
)}


    </div>
  )
}