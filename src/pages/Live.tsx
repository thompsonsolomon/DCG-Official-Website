import { useEffect, useState } from 'react'
import Breadcrumb from '@/UI/Breadcrum'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'

type LiveSettings = {
  isLive: boolean
  liveStreamUrl: string
  liveTitle?: string
  liveDescription?: string
  isLiveStreaming: any
}

export const Live = () => {
  const [settings, setSettings] = useState<LiveSettings>({
    isLive: false,
    liveStreamUrl: '',
    liveTitle: 'Live Worship Experience',
    liveDescription: 'Join us online and worship with us from anywhere in the world.',
    isLiveStreaming: false,
  })

  // ✅ FETCH LIVE SETTINGS FROM FIREBASE
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'main'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as LiveSettings)

        }
      }
    )

    console.log(settings)
    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* MAIN CONTENT */}
      <section className="py-14 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-12">
            <span className="inline-block bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Worship With Us Online
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {settings.liveTitle || 'Live Worship Experience'}
            </h1>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings.liveDescription ||
                'Join our live worship services, prayer meetings, and special programs from anywhere in the world.'}
            </p>
          </div>

          {/* LIVE BADGE */}
          {settings.isLive && (
            <div className="flex items-center justify-center mb-8">
              <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-full flex items-center gap-3 shadow-sm">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>

                <span className="font-bold tracking-wide">
                  WE ARE LIVE NOW
                </span>
              </div>
            </div>
          )}

          {/* VIDEO PLAYER */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl mb-14 aspect-video border border-gray-200">
            {settings.liveStreamUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={settings.liveStreamUrl}
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-gray-900 to-black">
                <div className="text-7xl mb-4">📡</div>

                <h2 className="text-3xl font-bold mb-3">
                  No Live Stream Yet
                </h2>

                <p className="text-gray-300 text-center max-w-md">
                  The live stream link has not been added yet.
                  Please check back later.
                </p>
              </div>
            )}
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">

            {/* CARD */}
            <div className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center mb-5">
                <span className="text-2xl">⛪</span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Sunday Worship
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                Experience powerful worship, life-changing teachings,
                and fellowship every Sunday.
              </p>

              <p className="text-sm font-semibold text-[#008080]">
                Sundays • 10:00 AM
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center mb-5">
                <span className="text-2xl">🎥</span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Watch Anytime
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                Catch up on previous broadcasts and sermons anytime
                from our growing media archive.
              </p>

              <p className="text-sm font-semibold text-[#008080]">
                Available 24/7
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center mb-5">
                <span className="text-2xl">🙏</span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Prayer Meetings
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                Join our live prayer sessions and connect with believers
                around the world in faith.
              </p>

              <p className="text-sm font-semibold text-[#008080]">
                Wednesdays • 7:00 PM
              </p>
            </div>
          </div>

          {/* HOW TO JOIN */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  How To Join
                </h2>

                <p className="text-gray-500">
                  Follow these quick steps to participate in the live stream.
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Open The Live Stream
                  </h4>

                  <p className="text-gray-600">
                    The stream becomes active a few minutes before service begins.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold">
                  2
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Worship Along
                  </h4>

                  <p className="text-gray-600">
                    Participate actively in worship, prayer, and the Word.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold">
                  3
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    Share The Stream
                  </h4>

                  <p className="text-gray-600">
                    Invite family and friends to join the worship experience.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER CTA */}
          <div className="bg-gradient-to-r from-[#008080] to-[#006666] rounded-3xl p-10 text-center text-white shadow-xl">
            <h2 className="text-4xl font-bold mb-4">
              Stay Connected
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-white/90 mb-8">
              Never miss a service, worship experience, or special church event.
              Join us online and grow in faith together.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-[#008080] px-8 py-3 rounded-2xl font-bold hover:scale-105 transition">
                Watch Live
              </button>

              <button className="border border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white hover:text-[#008080] transition">
                Share Stream
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}