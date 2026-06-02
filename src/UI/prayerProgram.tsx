// utils/prayerProgram.ts

export const isPrayerProgramLive = () => {
  const now = new Date()

  const year = 2026

  const startDate = new Date(year, 5, 1) // June 1
  const endDate = new Date(year, 5, 21, 23, 59, 59)

  if (now < startDate || now > endDate) {
    return false
  }

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  const currentTime = currentHour * 60 + currentMinute

  const liveStart = 21 * 60 // 9 PM
  const liveEnd = 22 * 60 // 10 PM

  return currentTime >= liveStart && currentTime < liveEnd
}