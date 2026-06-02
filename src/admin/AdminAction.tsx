import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-hot-toast'

type SiteSettings = {
  isLiveStreaming: boolean
  liveStreamUrl: string
  heroType: 'default' | 'christmas' | 'convention'
  allowTestimonies: boolean
  showAnnouncements: boolean
  maintenanceMode: boolean
}

export const AdminAction = () => {
  const [loading, setLoading] = useState(true)

  const [settings, setSettings] = useState<SiteSettings>({
    isLiveStreaming: false,
    liveStreamUrl: '',
    heroType: 'default',
    allowTestimonies: true,
    showAnnouncements: true,
    maintenanceMode: false,
  })

  // -----------------------------------
  // FETCH SETTINGS
  // -----------------------------------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, 'settings', 'main')

        const snap = await getDoc(ref)

        if (snap.exists()) {
          setSettings(snap.data() as SiteSettings)
        } else {
          // create default doc if not existing
          await setDoc(ref, settings)
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // -----------------------------------
  // HANDLE CHANGE
  // -----------------------------------
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  // -----------------------------------
  // UPDATE SINGLE FIELD
  // -----------------------------------
  const updateSetting = async (
    key: keyof SiteSettings,
    value: any,
    successMessage: string
  ) => {
    try {
      await updateDoc(doc(db, 'settings', 'main'), {
        [key]: value,
        updatedAt: new Date(),
      })

      toast.success(successMessage)
    } catch (error) {
      console.log(error)
      toast.error('Failed to update setting')
    }
  }

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <h2 className="text-2xl font-bold text-gray-700">
          Loading Settings...
        </h2>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Admin Actions
        </h1>

        <p className="text-gray-600 mt-2">
          Manage global website settings and church controls.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LIVE STREAM */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Live Streaming
              </h2>

              <p className="text-gray-500 text-sm">
                Control church livestream settings
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                settings.isLiveStreaming
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {settings.isLiveStreaming
                ? 'LIVE'
                : 'OFFLINE'}
            </div>
          </div>

          <div className="space-y-5">

            {/* TOGGLE */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Enable Live Stream
                </h3>

                <p className="text-sm text-gray-500">
                  Show live badge on frontend
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.isLiveStreaming}
                onChange={async (e) => {
                  const checked = e.target.checked

                  setSettings((prev) => ({
                    ...prev,
                    isLiveStreaming: checked,
                  }))

                  await updateSetting(
                    'isLiveStreaming',
                    checked,
                    checked
                      ? 'Live stream enabled'
                      : 'Live stream disabled'
                  )
                }}
                className="w-5 h-5"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block mb-2 font-semibold">
                Live Stream URL
              </label>

              <input
                type="text"
                name="liveStreamUrl"
                value={settings.liveStreamUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/embed/..."
                className="w-full px-4 py-3 border rounded-2xl"
              />
            </div>

            <button
              onClick={() =>
                updateSetting(
                  'liveStreamUrl',
                  settings.liveStreamUrl,
                  'Live stream URL updated'
                )
              }
              className="w-full bg-[#008080] hover:bg-[#006666] text-white py-3 rounded-2xl font-semibold transition"
            >
              Save Live Stream URL
            </button>
          </div>
        </div>

        {/* HERO SETTINGS */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold mb-2">
            Hero Section
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Select which hero UI should display on the homepage
          </p>

          <div className="space-y-5">

            <div>
              <label className="block mb-2 font-semibold">
                Active Hero UI
              </label>

              <select
                name="heroType"
                value={settings.heroType}
                onChange={(e) => {
                  handleChange(e)
                }}
                className="w-full px-4 py-3 border rounded-2xl"
              >
                <option value="default">
                  Default Hero
                </option>

                <option value="christmas">
                  Christmas Hero
                </option>

                <option value="convention">
                  Convention Hero
                </option>

                <option value="mountain">
                   21 mountain prayer
                </option>


              </select>
            </div>

            {/* PREVIEW */}
            <div className="bg-[#008080]/5 border border-[#008080]/10 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Current Active Hero
                  </p>

                  <h3 className="capitalize text-2xl font-bold text-[#008080]">
                    {settings.heroType}
                  </h3>
                </div>

                <div className="bg-[#008080]/10 text-[#008080] px-3 py-1 rounded-full text-sm font-semibold">
                  Active
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                updateSetting(
                  'heroType',
                  settings.heroType,
                  'Hero section updated'
                )
              }
              className="w-full bg-[#008080] hover:bg-[#006666] text-white py-3 rounded-2xl font-semibold transition"
            >
              Save Hero Section
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">
            Website Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* TESTIMONIES */}
            <div className="border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold">
                    Allow Testimonies
                  </h3>

                  <p className="text-sm text-gray-500">
                    Users can submit testimonies
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.allowTestimonies}
                  onChange={async (e) => {
                    const checked = e.target.checked

                    setSettings((prev) => ({
                      ...prev,
                      allowTestimonies: checked,
                    }))

                    await updateSetting(
                      'allowTestimonies',
                      checked,
                      'Testimony settings updated'
                    )
                  }}
                  className="w-5 h-5"
                />
              </div>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className="border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold">
                    Show Announcements
                  </h3>

                  <p className="text-sm text-gray-500">
                    Toggle announcement section
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.showAnnouncements}
                  onChange={async (e) => {
                    const checked = e.target.checked

                    setSettings((prev) => ({
                      ...prev,
                      showAnnouncements: checked,
                    }))

                    await updateSetting(
                      'showAnnouncements',
                      checked,
                      'Announcement settings updated'
                    )
                  }}
                  className="w-5 h-5"
                />
              </div>
            </div>

            {/* MAINTENANCE */}
            <div className="border rounded-2xl p-5 border-red-200 bg-red-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-red-600">
                    Maintenance Mode
                  </h3>

                  <p className="text-sm text-gray-500">
                    Temporarily disable website
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={async (e) => {
                    const checked = e.target.checked

                    setSettings((prev) => ({
                      ...prev,
                      maintenanceMode: checked,
                    }))

                    await updateSetting(
                      'maintenanceMode',
                      checked,
                      checked
                        ? 'Maintenance mode enabled'
                        : 'Maintenance mode disabled'
                    )
                  }}
                  className="w-5 h-5"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}