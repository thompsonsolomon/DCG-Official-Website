import {
  EventRegistration,
  ConventionSettings,
} from '../types'

export function calculateAllocation(
  registrations: EventRegistration[],
  settings: ConventionSettings
) 

{
 console.log(settings)
  const groups = Math.max(
    1,
    settings.studyGroupCount
  )

  const rooms = Math.max(
    1,
    settings.accommodationCount
  )

  const groupCounters: Record<string, number> = {}
  const roomCounters: Record<string, number> = {}

  for (let i = 1; i <= groups; i++) {
    groupCounters[`Group ${i}`] = 0
  }

  for (let i = 1; i <= rooms; i++) {
    roomCounters[`Room ${i}`] = 0
  }

  // Separate accommodation by gender/age
  const eligibleForAccommodation =
    registrations.filter(
      (person) =>
        person.ageGroup !== 'child' &&
        person.ageGroup !== 'teenager'
    )

  const sorted = [...registrations].sort(
    (a, b) =>
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime()
  )

  const allocations = sorted.map(
    (registration, index) => {
      // --------------------------------
      // STUDY GROUP
      // --------------------------------

      let studyGroup: string

      if (
        registration.ageGroup === 'child'
      ) {
        studyGroup = 'Children Study Group'
      } else if (
        registration.ageGroup === 'youth' ||
        registration.ageGroup === 'teenager'
      ) {
        studyGroup = 'Youth Study Group'
      } else {
        const groupNumber =
          (index % groups) + 1

        studyGroup =
          `Group ${groupNumber}`
      }

      // --------------------------------
      // ACCOMMODATION
      // --------------------------------

      let accommodation =
        'Not Required'

      if (
        registration.ageGroup !== 'child' &&
        registration.ageGroup !== 'teenager'
      ) {
        const sameGender =
          eligibleForAccommodation.filter(
            (person) =>
              person.gender ===
              registration.gender
          )

        const position =
          sameGender.findIndex(
            (person) =>
              person.id === registration.id
          )

        const roomNumber =
          (position >= 0 ? position : index) %
            rooms +
          1

        accommodation =
          `${registration.gender === 'male' ? 'Male' : 'Female'} Room ${roomNumber}`
      }

      return {
        id: registration.id,
        studyGroup,
        accommodation,
      }
    }
  )

  return allocations
}