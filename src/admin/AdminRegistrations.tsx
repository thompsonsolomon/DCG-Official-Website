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
} from 'lucide-react'

import { db } from '@/config/firebase'
import { Event, EventRegistration } from '@/types'

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
  /* -------------------------------------------------------
     EVENTS
  ------------------------------------------------------- */

  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const [selectedEventId, setSelectedEventId] =
    useState<string>('')

  /* -------------------------------------------------------
     REGISTRATIONS
  ------------------------------------------------------- */

  const [registrations, setRegistrations] =
    useState<EventRegistration[]>([])

  const [registrationsLoading, setRegistrationsLoading] =
    useState(false)

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
        const data: EventRegistration[]= snapshot.docs
          .map((item) => ({
            ...(item.data()as Omit <EventRegistration, "id">),
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

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        <div className="p-6 border-b bg-gray-50">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
              <Settings className="text-[#008080]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Convention Settings
              </h2>

              <p className="text-gray-500 text-sm">
                Configure the groups and
                accommodations used for automatic
                allocation.
              </p>
            </div>

          </div>

        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ================================================
              ACCOMMODATIONS
          ================================================ */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">

                <BedDouble className="text-[#008080]" />

                <h3 className="text-xl font-bold">
                  Accommodations
                </h3>

              </div>

              <span className="text-sm text-gray-500">
                {settings.accommodations.length}{' '}
                rooms
              </span>

            </div>

            <div className="space-y-3">

              {settings.accommodations.map(
                (room, index) => (
                  <div
                    key={`${room.name}-${index}`}
                    className="flex gap-3 items-center bg-gray-50 border rounded-2xl p-3"
                  >

                    <input
                      value={room.name}
                      onChange={(e) =>
                        updateAccommodation(
                          index,
                          'name',
                          e.target.value
                        )
                      }
                      className="flex-1 min-w-0 px-3 py-2 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#008080]/20"
                    />

                    <input
                      type="number"
                      min="1"
                      value={room.capacity}
                      onChange={(e) =>
                        updateAccommodation(
                          index,
                          'capacity',
                          e.target.value
                        )
                      }
                      className="w-24 px-3 py-2 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#008080]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        deleteAccommodation(
                          index
                        )
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                )
              )}

              {settings.accommodations.length ===
                0 && (
                <div className="border-2 border-dashed rounded-2xl p-8 text-center text-gray-500">
                  No accommodations added yet.
                </div>
              )}

            </div>

            {/* ADD ACCOMMODATION */}

            <div className="mt-5 p-4 bg-[#008080]/5 rounded-2xl border border-[#008080]/10">

              <p className="font-semibold mb-3">
                Add Accommodation
              </p>

              <div className="flex flex-col sm:flex-row gap-3">

                <input
                  value={
                    newAccommodationName
                  }
                  onChange={(e) =>
                    setNewAccommodationName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Hostel 1 House"
                  className="flex-1 px-4 py-3 border rounded-xl bg-white"
                />

                <input
                  type="number"
                  min="1"
                  value={
                    newAccommodationCapacity
                  }
                  onChange={(e) =>
                    setNewAccommodationCapacity(
                      Number(e.target.value)
                    )
                  }
                  className="sm:w-24 px-4 py-3 border rounded-xl bg-white"
                />

                <button
                  type="button"
                  onClick={addAccommodation}
                  className="px-5 py-3 bg-[#008080] text-white rounded-xl font-semibold hover:bg-[#006666] transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>

              </div>

            </div>

          </div>

          {/* ================================================
              STUDY GROUPS
          ================================================ */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">

                <GraduationCap className="text-[#008080]" />

                <h3 className="text-xl font-bold">
                  Study Groups
                </h3>

              </div>

              <span className="text-sm text-gray-500">
                {settings.studyGroups.length}{' '}
                groups
              </span>

            </div>

            <div className="space-y-3">

              {settings.studyGroups.map(
                (group, index) => (
                  <div
                    key={`${group.name}-${index}`}
                    className="flex gap-3 items-center bg-gray-50 border rounded-2xl p-3"
                  >

                    <input
                      value={group.name}
                      onChange={(e) =>
                        updateStudyGroup(
                          index,
                          'name',
                          e.target.value
                        )
                      }
                      className="flex-1 min-w-0 px-3 py-2 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-[#008080]/20"
                    />

                    <select
                      value={group.type}
                      onChange={(e) =>
                        updateStudyGroup(
                          index,
                          'type',
                          e.target.value
                        )
                      }
                      className="w-32 px-3 py-2 bg-white border rounded-xl outline-none"
                    >
                      <option value="adult">
                        Adult
                      </option>

                      <option value="youth">
                        Youth
                      </option>

                      <option value="children">
                        Children
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        deleteStudyGroup(
                          index
                        )
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                )
              )}

              {settings.studyGroups.length ===
                0 && (
                <div className="border-2 border-dashed rounded-2xl p-8 text-center text-gray-500">
                  No study groups added yet.
                </div>
              )}

            </div>

            {/* ADD STUDY GROUP */}

            <div className="mt-5 p-4 bg-[#008080]/5 rounded-2xl border border-[#008080]/10">

              <p className="font-semibold mb-3">
                Add Study Group
              </p>

              <div className="flex flex-col sm:flex-row gap-3">

                <input
                  value={newStudyGroupName}
                  onChange={(e) =>
                    setNewStudyGroupName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Grace Group"
                  className="flex-1 px-4 py-3 border rounded-xl bg-white"
                />

                <select
                  value={newStudyGroupType}
                  onChange={(e) =>
                    setNewStudyGroupType(
                      e.target
                        .value as StudyGroupType
                    )
                  }
                  className="sm:w-32 px-4 py-3 border rounded-xl bg-white"
                >
                  <option value="adult">
                    Adult
                  </option>

                  <option value="youth">
                    Youth
                  </option>

                  <option value="children">
                    Children
                  </option>
                </select>

                <button
                  type="button"
                  onClick={addStudyGroup}
                  className="px-5 py-3 bg-[#008080] text-white rounded-xl font-semibold hover:bg-[#006666] transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* SAVE SETTINGS */}

        <div className="p-6 border-t bg-gray-50 flex justify-end">

          <button
            type="button"
            onClick={saveSettings}
            disabled={savingSettings}
            className="bg-[#008080] hover:bg-[#006666] disabled:opacity-60 text-white px-7 py-3 rounded-xl font-bold flex items-center gap-2 transition"
          >
            {savingSettings ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Convention Settings
              </>
            )}
          </button>

        </div>

      </div>

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
                className={`text-left border rounded-2xl overflow-hidden transition hover:shadow-lg ${
                  selectedEventId === event.id
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

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            <div className="p-6 border-b flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Registered Participants
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {registrations.length}{' '}
                  participant
                  {registrations.length !== 1
                    ? 's'
                    : ''}{' '}
                  registered for this event.
                </p>
              </div>

              {registrationsLoading && (
                <RefreshCw
                  className="animate-spin text-[#008080]"
                />
              )}

            </div>

            {registrations.length === 0 &&
            !registrationsLoading ? (
              <div className="p-14 text-center">

                <Users className="mx-auto text-gray-300 w-12 h-12 mb-4" />

                <h3 className="font-semibold text-lg">
                  No registrations yet
                </h3>

                <p className="text-gray-500 mt-1">
                  Registrations for this event
                  will appear here.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b">

                    <tr>

                      <th className="px-5 py-4 text-left text-sm">
                        Participant
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Type
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Age Group
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Branch
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Study Group
                      </th>

                      <th className="px-5 py-4 text-left text-sm">
                        Accommodation
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {registrations.map(
                      (registration) => (
                        <tr
                          key={
                            registration.id
                          }
                          className="border-b hover:bg-gray-50 transition"
                        >

                          <td className="px-5 py-4">

                            <p className="font-semibold">
                              {
                                registration.name
                              }
                            </p>

                            <p className="text-sm text-gray-500 capitalize">
                              {
                                registration.gender
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <p className="text-sm">
                              {
                                registration.email
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              {
                                registration.phone
                              }
                            </p>

                          </td>

                          <td className="px-5 py-4 capitalize">
                            {
                              registration.gender
                            }
                          </td>

                          <td className="px-5 py-4 capitalize">
                            {
                              registration.category
                            }
                          </td>

                          <td className="px-5 py-4">

                            <p>
                              {
                                registration.branch ||
                                '—'
                              }
                            </p>

                            {registration.churchName && (
                              <p className="text-xs text-gray-500 mt-1">
                                {
                                  registration.churchName
                                }
                              </p>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            {registration.studyGroup ? (
                              <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                {
                                  registration.studyGroup
                                }
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                Not assigned
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            {registration.accommodation ? (
                              <span className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                                {
                                  registration.accommodation
                                }
                              </span>
                            ) : registration.needsAccommodation ? (
                              <span className="text-orange-500 text-sm font-medium">
                                Not assigned
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Not required
                              </span>
                            )}

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

    </div>
  )
}