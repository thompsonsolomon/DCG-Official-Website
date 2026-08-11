import { useEffect, useState } from 'react'
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import { db } from '../config/firebase'
import { ConventionSettings } from '../types'

const defaultSettings: ConventionSettings = {
  studyGroupCount: 5,
  accommodationCount: 10,
}

export function useConventionSettings() {
  const [settings, setSettings] =
    useState<ConventionSettings>(defaultSettings)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(
          db,
          'settings',
          'convention'
        )

        const snapshot = await getDoc(ref)

        if (snapshot.exists()) {
          setSettings({
            ...defaultSettings,
            ...snapshot.data(),
          } as ConventionSettings)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSettings = async (
    updates: Partial<ConventionSettings>
  ) => {
    const newSettings = {
      ...settings,
      ...updates,
      updatedAt: new Date(),
    }

    await setDoc(
      doc(db, 'settings', 'convention'),
      newSettings,
      { merge: true }
    )

    setSettings(newSettings)
  }

  return {
    settings,
    loading,
    updateSettings,
  }
}