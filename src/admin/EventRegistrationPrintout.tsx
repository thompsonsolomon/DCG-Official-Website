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

type AdultClassFilter =
  | 'all'
  | 'yoruba'
  | 'english'

type Registration = {
  id: string

  fullName?: string
  email?: string
  phone?: string
  address?: string

  gender?: string
  age?: number | string

  category?: string
  ageGroup?: string
  type?: string

  branch?: string
  otherBranch?: string
  churchName?: string

  studyGroup?: string | null
  studyGroupPreference?: string | null

  accommodation?: string | null
  accommodationRoom?: string | null
  needsAccommodation?: boolean

  eventTitle?: string

  status?: string
  registrationMethod?: string

  createdAt?: any
  updatedAt?: any
}

/* =========================================================
   CONSTANTS
========================================================= */

const OTHER_BRANCH = '__others__'

const CONVENTION_NAME =
  '24TH ANNUAL CONVENTION 2026'

const CONVENTION_THEME =
  'CREATE IN ME A PURE HEART (PSM 51:10)'

const REGISTRATION_DATE =
  'AUGUST 18TH – 22ND'

/* =========================================================
   TEXT NORMALIZATION
========================================================= */

const normalize = (
  value: unknown
): string => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/* =========================================================
   CATEGORY DETECTION
========================================================= */

const getCategorySources = (
  registration: Registration
): string[] => {
  return [
    registration.studyGroup,
    registration.studyGroupPreference,
    registration.category,
    registration.ageGroup,
    registration.type,
  ]
    .map(normalize)
    .filter(Boolean)
}

const getStudyGroupCategory = (
  registration: Registration
): AgeFilter | '' => {
  const sources =
    getCategorySources(registration)

  /* CHILDREN */
  const isChildren =
    sources.some((value) => {
      return (
        value.includes('children') ||
        value.includes('child')
      )
    })

  if (isChildren) {
    return 'children'
  }

  /* YOUTH */
  const isYouth =
    sources.some((value) => {
      return (
        value.includes('youth') ||
        value.includes('young adult') ||
        value.includes('youngadult')
      )
    })

  if (isYouth) {
    return 'youth'
  }

  /* ADULT */
  const isAdult =
    sources.some((value) => {
      return (
        value.includes('adult') ||
        value.includes('yoruba') ||
        value.includes('english')
      )
    })

  if (isAdult) {
    return 'adult'
  }

  return ''
}

/* =========================================================
   ADULT CLASS
========================================================= */

const getAdultClass = (
  registration: Registration
): AdultClassFilter => {
  const category =
    getStudyGroupCategory(registration)

  if (category !== 'adult') {
    return ''
  }

  const sources =
    getCategorySources(registration)

  if (
    sources.some((value) =>
      value.includes('yoruba')
    )
  ) {
    return 'yoruba'
  }

  if (
    sources.some((value) =>
      value.includes('english')
    )
  ) {
    return 'english'
  }

  return ''
}

/* =========================================================
   CATEGORY DISPLAY
========================================================= */

const formatStudyGroupCategory = (
  registration: Registration
) => {
  const category =
    getStudyGroupCategory(registration)

  switch (category) {
    case 'adult':
      return 'Adult'

    case 'youth':
      return 'Youth'

    case 'children':
      return 'Children'

    default:
      return '-'
  }
}

/* =========================================================
   ADULT CLASS DISPLAY
========================================================= */

const formatAdultClass = (
  registration: Registration
) => {
  const adultClass =
    getAdultClass(registration)

  switch (adultClass) {
    case 'yoruba':
      return 'Yoruba'

    case 'english':
      return 'English'

    default:
      return '-'
  }
}

/* =========================================================
   STUDY GROUP DISPLAY
========================================================= */

const formatStudyGroup = (
  registration: Registration
) => {
  const raw =
    String(
      registration.studyGroup ?? ''
    ).trim()

  if (!raw) {
    const category =
      getStudyGroupCategory(registration)

    if (category === 'children') {
      return 'Children'
    }

    if (category === 'youth') {
      return 'Youth'
    }

    if (category === 'adult') {
      const adultClass =
        getAdultClass(registration)

      if (adultClass === 'yoruba') {
        return 'Yoruba'
      }

      if (adultClass === 'english') {
        return 'English'
      }
    }

    return '-'
  }

  return raw.replace(
    /([a-zA-Z]+)(\d+)/,
    '$1 $2'
  )
}

/* =========================================================
   CATEGORY LABELS
========================================================= */

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

    default:
      return 'All Categories'
  }
}

const formatAdultClassFilter = (
  filter: AdultClassFilter
) => {
  switch (filter) {
    case 'yoruba':
      return 'Yoruba'

    case 'english':
      return 'English'

    default:
      return 'All Adult Classes'
  }
}

/* =========================================================
   BRANCH HELPERS
========================================================= */

const getRawBranch = (
  registration: Registration
) => {
  const branch =
    String(
      registration.branch ?? ''
    ).trim()

  if (
    branch &&
    normalize(branch) !== 'other' &&
    normalize(branch) !== 'others'
  ) {
    return branch
  }

  return ''
}

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

/* =========================================================
   SEX
========================================================= */

const formatSex = (
  gender?: string
) => {
  const value =
    normalize(gender)

  if (
    value === 'male' ||
    value === 'm'
  ) {
    return 'M'
  }

  if (
    value === 'female' ||
    value === 'f'
  ) {
    return 'F'
  }

  return gender || '-'
}

/* =========================================================
   ACCOMMODATION
========================================================= */

const formatAccommodation = (
  registration: Registration
) => {
  if (
    registration.accommodationRoom &&
    normalize(
      registration.accommodationRoom
    ) !== 'none'
  ) {
    return registration.accommodationRoom
  }

  if (
    registration.accommodation &&
    normalize(
      registration.accommodation
    ) !== 'none'
  ) {
    return registration.accommodation
  }

  if (
    registration.needsAccommodation ===
    false
  ) {
    return 'NIL'
  }

  if (
    registration.needsAccommodation ===
    true
  ) {
    return 'Requested'
  }

  return '-'
}

/* =========================================================
   FILE NAME
========================================================= */

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
      ''
    )
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
    selectedAdultClass,
    setSelectedAdultClass,
  ] =
    useState<AdultClassFilter>(
      'all'
    )

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

        console.table(
          data.map((item) => ({
            name:
              item.fullName ?? '',

            studyGroup:
              item.studyGroup ?? '',

            preference:
              item.studyGroupPreference ??
              '',

            categoryField:
              item.category ?? '',

            ageGroup:
              item.ageGroup ?? '',

            type:
              item.type ?? '',

            DETECTED_CATEGORY:
              getStudyGroupCategory(
                item
              ),

            DETECTED_ADULT_CLASS:
              getAdultClass(item),
          }))
        )

        const unclassified =
          data.filter(
            (item) =>
              !getStudyGroupCategory(
                item
              )
          )

        if (
          unclassified.length > 0
        ) {
          console.warn(
            'UNCLASSIFIED REGISTRATIONS:',
            unclassified
          )
        }

        setRegistrations(data)

        const firstRegistration =
          data.find(
            (registration) =>
              registration.eventTitle
          )

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
     AVAILABLE BRANCHES
  ======================================================= */

  const availableRealBranches =
    useMemo(() => {
      const branches =
        registrations
          .map(
            (registration) =>
              getRawBranch(registration)
          )
          .filter(Boolean)

      const uniqueBranches =
        new Map<string, string>()

      branches.forEach(
        (branch) => {
          const key =
            normalize(branch)

          if (
            !uniqueBranches.has(key)
          ) {
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
                  normalize(rawBranch)
              )

            return !exists
          }
        )

      if (hasOthers) {
        options.push(OTHER_BRANCH)
      }

      return options
    }, [
      registrations,
      availableRealBranches,
    ])

  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const matchesAgeRange = (
    registration: Registration
  ) => {
    if (
      selectedAgeRange ===
      'all'
    ) {
      return true
    }

    const category =
      getStudyGroupCategory(
        registration
      )

    return (
      category ===
      selectedAgeRange
    )
  }

  /* =======================================================
     ADULT CLASS FILTER
  ======================================================= */

  const matchesAdultClass = (
    registration: Registration
  ) => {
    if (
      selectedAgeRange !==
      'adult'
    ) {
      return true
    }

    if (
      selectedAdultClass ===
      'all'
    ) {
      return true
    }

    return (
      getAdultClass(
        registration
      ) ===
      selectedAdultClass
    )
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
                normalize(
                  displayBranch
                ) === 'others'
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

          const categoryMatches =
            matchesAgeRange(
              registration
            )

          const adultClassMatches =
            matchesAdultClass(
              registration
            )

          return (
            branchMatches &&
            categoryMatches &&
            adultClassMatches
          )
        }
      )
    }, [
      registrations,
      availableRealBranches,
      selectedBranch,
      selectedAgeRange,
      selectedAdultClass,
    ])

  /* =======================================================
     TOTAL SELECTED PARTICIPANTS
  ======================================================= */

  /*
   * THIS IS THE IMPORTANT VALUE.
   *
   * It represents the exact number of registrations
   * that will appear in the generated/printed document.
   *
   * Every filter affects this number.
   */
  const selectedDocumentTotal =
    filteredRegistrations.length

  /* =======================================================
     SUMMARY COUNTS
  ======================================================= */

  const categoryCounts =
    useMemo(() => {
      let adult = 0
      let youth = 0
      let children = 0

      let adultYoruba = 0
      let adultEnglish = 0

      registrations.forEach(
        (registration) => {
          const category =
            getStudyGroupCategory(
              registration
            )

          if (
            category ===
            'adult'
          ) {
            adult++

            const adultClass =
              getAdultClass(
                registration
              )

            if (
              adultClass ===
              'yoruba'
            ) {
              adultYoruba++
            }

            if (
              adultClass ===
              'english'
            ) {
              adultEnglish++
            }
          }

          if (
            category ===
            'youth'
          ) {
            youth++
          }

          if (
            category ===
            'children'
          ) {
            children++
          }
        }
      )

      return {
        adult,
        youth,
        children,
        adultYoruba,
        adultEnglish,
      }
    }, [registrations])

  /* =======================================================
     LABELS
  ======================================================= */

  const selectedBranchLabel =
    selectedBranch === 'all'
      ? 'ALL ASSEMBLIES'
      : selectedBranch ===
        OTHER_BRANCH
      ? 'OTHERS'
      : selectedBranch

  const selectedCategoryLabel =
    formatAgeFilter(
      selectedAgeRange
    )

  const selectedAdultClassLabel =
    selectedAgeRange ===
    'adult'
      ? formatAdultClassFilter(
          selectedAdultClass
        )
      : ''

  /* =======================================================
     FILE STATUS LABEL
  ======================================================= */

  const statusLabelForFile = () => {
    if (
      selectedAgeRange ===
        'adult' &&
      selectedAdultClass !==
        'all'
    ) {
      return `Adult-${selectedAdultClassLabel}`
    }

    return selectedCategoryLabel
  }

  /* =======================================================
     DOWNLOAD PDF
  ======================================================= */

  const downloadPDF = () => {
    if (
      selectedDocumentTotal ===
      0
    ) {
      toast.error(
        'There are no registrations to download'
      )

      return
    }

    try {
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
         HEADER
      =================================================== */

      pdf.setTextColor(
        30,
        30,
        30
      )

      pdf.setFont(
        'helvetica',
        'bold'
      )

      pdf.setFontSize(15)

      pdf.text(
        'DISCIPLES CHURCH OF GOD FOR ALL NATIONS',
        pageWidth / 2,
        11,
        {
          align: 'center',
        }
      )

      pdf.setFontSize(12)

      pdf.text(
        CONVENTION_NAME,
        pageWidth / 2,
        18,
        {
          align: 'center',
        }
      )

      pdf.setFontSize(10)

      pdf.text(
        `THEME: ${CONVENTION_THEME}`,
        pageWidth / 2,
        24,
        {
          align: 'center',
        }
      )

      pdf.setFontSize(9)

      pdf.text(
        `REGISTRATION 2026 — ${REGISTRATION_DATE}`,
        8,
        32
      )

      let statusLabel =
        selectedCategoryLabel

      if (
        selectedAgeRange ===
          'adult' &&
        selectedAdultClass !==
          'all'
      ) {
        statusLabel =
          `Adult — ${selectedAdultClassLabel}`
      }

      pdf.text(
        `STATUS: ${statusLabel.toUpperCase()}`,
        pageWidth - 8,
        32,
        {
          align: 'right',
        }
      )

      pdf.setFontSize(10)

      pdf.text(
        `NAME OF ASSEMBLY: ${selectedBranchLabel}`,
        8,
        39
      )

      /* ===================================================
         TOTAL SELECTED PARTICIPANTS
      =================================================== */

      /*
       * The total is now printed directly inside
       * the document header.
       */

      pdf.setFont(
        'helvetica',
        'bold'
      )

      pdf.setFontSize(10)

      pdf.text(
        `TOTAL SELECTED PARTICIPANTS: ${selectedDocumentTotal}`,
        pageWidth - 8,
        39,
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

            registration.phone ||
              '-',

            registration.address ||
              '-',

            registration.email ||
              '-',

            formatSex(
              registration.gender
            ),

            formatStudyGroup(
              registration
            ),

            formatAccommodation(
              registration
            ),
          ]
        )

      /* ===================================================
         TABLE
      =================================================== */

      autoTable(
        pdf,
        {
          startY: 44,

          head: [
            [
              'S/N',
              'NAME',
              'PHONE NO',
              'ADDRESS',
              'E-MAIL',
              'SEX',
              'S/G',
              'ACCOMOD',
            ],
          ],

          body: rows,

          theme: 'grid',

          styles: {
            font:
              'helvetica',
            fontSize: 8,
            cellPadding: 2,
            overflow:
              'linebreak',
            valign:
              'middle',
            lineWidth: 0.2,
            textColor: [
              30,
              30,
              30,
            ],
          },

          headStyles: {
            fontSize: 8,
            fontStyle:
              'bold',
            halign:
              'center',
            valign:
              'middle',
          },

          bodyStyles: {
            fontSize: 8,
          },

          columnStyles: {
            0: {
              cellWidth: 10,
              halign:
                'center',
            },

            1: {
              cellWidth: 42,
            },

            2: {
              cellWidth: 32,
            },

            3: {
              cellWidth: 48,
            },

            4: {
              cellWidth: 52,
            },

            5: {
              cellWidth: 15,
              halign:
                'center',
            },

            6: {
              cellWidth: 25,
              halign:
                'center',
            },

            7: {
              cellWidth: 27,
            },
          },

          margin: {
            left: 8,
            right: 8,
          },

          didDrawPage: (
            data
          ) => {
            pdf.setFont(
              'helvetica',
              'normal'
            )

            pdf.setFontSize(7)

            /*
             * Keep the total in the footer too.
             * This makes the total visible even when
             * the table spans multiple pages.
             */

            pdf.text(
              `Total Selected: ${selectedDocumentTotal} participant${
                selectedDocumentTotal !==
                1
                  ? 's'
                  : ''
              }`,
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
          eventTitle ||
            CONVENTION_NAME
        )

      const safeBranch =
        makeSafeFileName(
          selectedBranchLabel
        )

      const safeCategory =
        makeSafeFileName(
          statusLabelForFile()
        )

      const filename =
        `${safeEventTitle}-${safeBranch}-${safeCategory}-${selectedDocumentTotal}-participants-onsite-registration.pdf`

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
      selectedDocumentTotal ===
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

            <div className="flex items-center gap-3">

              <button
                type="button"
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

            <div className="flex gap-3">

              <button
                type="button"
                onClick={
                  printPage
                }
                disabled={
                  selectedDocumentTotal ===
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
                type="button"
                onClick={
                  downloadPDF
                }
                disabled={
                  selectedDocumentTotal ===
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
            FILTERS
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
                Select an assembly and
                study group before
                printing.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* ASSEMBLY */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name of Assembly
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
                  All Assemblies
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

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={
                  selectedAgeRange
                }
                onChange={(e) => {
                  const value =
                    e.target
                      .value as AgeFilter

                  setSelectedAgeRange(
                    value
                  )

                  if (
                    value !==
                    'adult'
                  ) {
                    setSelectedAdultClass(
                      'all'
                    )
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30"
              >

                <option value="all">
                  All Categories
                </option>

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

            </div>

            {/* ADULT CLASS */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adult Class
              </label>

              <select
                value={
                  selectedAdultClass
                }
                onChange={(e) =>
                  setSelectedAdultClass(
                    e.target
                      .value as AdultClassFilter
                  )
                }
                disabled={
                  selectedAgeRange !==
                  'adult'
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#008080]/30 disabled:bg-gray-100 disabled:text-gray-400"
              >

                <option value="all">
                  All Adult Classes
                </option>

                <option value="yoruba">
                  Yoruba
                </option>

                <option value="english">
                  English
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* =================================================
            CATEGORY SUMMARY
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 print:hidden">

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Total Registrations
              </p>

              <p className="text-2xl font-bold mt-1">
                {registrations.length}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Adults
              </p>

              <p className="text-2xl font-bold mt-1">
                {categoryCounts.adult}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Yoruba:{' '}
                {
                  categoryCounts.adultYoruba
                }{' '}
                • English:{' '}
                {
                  categoryCounts.adultEnglish
                }
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Youth
              </p>

              <p className="text-2xl font-bold mt-1">
                {categoryCounts.youth}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Children
              </p>

              <p className="text-2xl font-bold mt-1">
                {categoryCounts.children}
              </p>

            </div>

            {/* CURRENT SELECTION */}

            <div className="rounded-xl bg-[#008080]/10 px-4 py-3">

              <p className="text-sm text-[#006b6b] font-semibold">
                Total Selected
              </p>

              <p className="text-3xl font-bold text-[#008080] mt-1">
                {selectedDocumentTotal}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Participants in document
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            PRINT PREVIEW
        ================================================= */}

        <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8">

          {/* HEADER */}

          <div className="text-center mb-6">

            <h1 className="text-xl md:text-2xl font-bold uppercase">
              DISCIPLES CHURCH OF GOD FOR ALL NATIONS
            </h1>

            <h2 className="text-lg md:text-xl font-bold mt-2 uppercase">
              {CONVENTION_NAME}
            </h2>

            <p className="font-semibold mt-1 uppercase">
              THEME: {CONVENTION_THEME}
            </p>

            <div className="flex justify-between items-center mt-4 text-sm font-semibold">

              <span>
                REGISTRATION 2026 —{' '}
                {REGISTRATION_DATE}
              </span>

              <span>
                STATUS:{' '}

                {selectedCategoryLabel.toUpperCase()}

                {selectedAgeRange ===
                  'adult' &&
                  selectedAdultClass !==
                    'all' &&
                  ` — ${selectedAdultClassLabel.toUpperCase()}`}
              </span>

            </div>

            <div className="flex justify-between items-center mt-2">

              <div className="text-left font-bold uppercase">
                NAME OF ASSEMBLY:{' '}
                {selectedBranchLabel}
              </div>

              {/* =================================================
                  TOTAL ON PRINTED DOCUMENT
              ================================================= */}

              <div className="text-right font-bold uppercase">
                TOTAL SELECTED PARTICIPANTS:{' '}
                <span className="text-[#008080]">
                  {selectedDocumentTotal}
                </span>
              </div>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-sm">

              <thead>

                <tr>

                  <th className="px-3 py-3 border border-black text-center">
                    S/N
                  </th>

                  <th className="px-3 py-3 border border-black text-left">
                    NAME
                  </th>

                  <th className="px-3 py-3 border border-black text-left">
                    PHONE NO
                  </th>

                  <th className="px-3 py-3 border border-black text-left">
                    ADDRESS
                  </th>

                  <th className="px-3 py-3 border border-black text-left">
                    E-MAIL
                  </th>

                  <th className="px-3 py-3 border border-black text-center">
                    SEX
                  </th>

                  <th className="px-3 py-3 border border-black text-center">
                    S/G
                  </th>

                  <th className="px-3 py-3 border border-black text-center">
                    ACCOMOD
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRegistrations.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="text-center py-16 border border-black text-gray-500"
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
                      >

                        <td className="px-3 py-3 border border-black text-center">
                          {index + 1}
                        </td>

                        <td className="px-3 py-3 border border-black font-medium">
                          {
                            registration.fullName ||
                            '-'
                          }
                        </td>

                        <td className="px-3 py-3 border border-black">
                          {
                            registration.phone ||
                            '-'
                          }
                        </td>

                        <td className="px-3 py-3 border border-black">
                          {
                            registration.address ||
                            '-'
                          }
                        </td>

                        <td className="px-3 py-3 border border-black">
                          {
                            registration.email ||
                            '-'
                          }
                        </td>

                        <td className="px-3 py-3 border border-black text-center">
                          {formatSex(
                            registration.gender
                          )}
                        </td>

                        <td className="px-3 py-3 border border-black text-center">

                          <div className="font-semibold">
                            {formatStudyGroup(
                              registration
                            )}
                          </div>

                          <div className="text-xs text-gray-600 mt-1">

                            {formatStudyGroupCategory(
                              registration
                            )}

                            {getStudyGroupCategory(
                              registration
                            ) ===
                              'adult' &&
                              ` — ${formatAdultClass(
                                registration
                              )}`}

                          </div>

                        </td>

                        <td className="px-3 py-3 border border-black text-center">
                          {formatAccommodation(
                            registration
                          )}
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              DOCUMENT TOTAL
          ================================================= */}

          <div className="flex justify-end mt-4">

            <div className="border-2 border-black px-5 py-3 font-bold uppercase text-sm">

              TOTAL SELECTED PARTICIPANTS:{' '}

              <span className="text-lg">
                {selectedDocumentTotal}
              </span>

            </div>

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
              margin: 0 !important;
              padding: 0 !important;
            }

            .print\\\\:hidden {
              display: none !important;
            }

            main {
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            section {
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-size: 8px !important;
            }

            th,
            td {
              border: 1px solid #000 !important;
              padding: 5px !important;
            }

            thead {
              display: table-header-group;
            }

            tr {
              page-break-inside: avoid;
            }

            h1 {
              font-size: 18px !important;
            }

            h2 {
              font-size: 14px !important;
            }

            .overflow-x-auto {
              overflow: visible !important;
            }

          }
        `}
      </style>

    </div>
  )
}