import { useParams, Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import Breadcrumb from '@/UI/Breadcrum'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export const EventDetails = () => {
  const { id } = useParams()
  const { events, loading } = useEvents()

  const event = events.find((e) => e.id === id)

  if (!event && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Event Not Found
          </h1>

          <Link
            to="/events"
            className="bg-[#008080] text-white px-6 py-3 rounded-xl"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Breadcrumb
        title={event?.EventTitle || ""}
        backgroundImage={event?.Imgurl || '/asset/bg/3.jpg'}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Events', path: '/events' },
          { label: event?.EventTitle || "" },
        ]}
      />

      {
        loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-800 mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>)
          :

          (
            <section className="py-14 px-4 md:px-8">
              <div className="max-w-6xl mx-auto">

                {/* IMAGE */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl shadow-2xl mb-10"
                >
                  <img
                    src={event?.Imgurl || '/asset/bg/1.jpg'}
                    alt={event?.EventTitle}
                    className="w-full h-[500px] object-cover"
                  />
                </motion.div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                  {/* MAIN */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-2"
                  >
                    <div className="bg-white rounded-3xl shadow-lg p-8">

                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-sm font-semibold capitalize">
                          {event?.category}
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                          {new Date(event?.date || "").toLocaleDateString()}
                        </span>
                      </div>

                      <h1 className="text-4xl font-bold mb-6 text-gray-900">
                        {event?.EventTitle}
                      </h1>

                      <div className="prose max-w-none text-gray-700 leading-8">
                        <p className="text-lg  mb-2 leading-relaxed whitespace-pre-line">
                          {event?.disc}
                        </p>

                        <p className="mt-6 text-[#008080] text-lg ">
                          Join us for this amazing and spirit-filled event?.
                          Come and experience worship, fellowship,
                          prayer and transformation together with believers.
                        </p>

                        <p className="mt-4 text-[#008080] text-lg ">
                          Invite your family and friends and be part
                          of this impactful gathering.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* SIDEBAR */}
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="space-y-6"
                  >

                    {/* EVENT INFO */}
                    <div className="bg-white rounded-3xl shadow-lg p-6">
                      <h3 className="text-2xl font-bold mb-5">
                        Event Information
                      </h3>

                      <div className="space-y-5">

                        <div>
                          <p className="text-sm text-gray-500">
                            Date
                          </p>

                          <h4 className="font-semibold text-lg">
                            {new Date(event?.date || "").toLocaleDateString()}
                          </h4>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Time
                          </p>

                          <h4 className="font-semibold text-lg">
                            {event?.time}
                          </h4>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Category
                          </p>

                          <h4 className="font-semibold text-lg capitalize">
                            {event?.category}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-[#008080] rounded-3xl p-6 text-white">
                      <h3 className="text-2xl font-bold mb-4">
                        Don’t Miss This Event
                      </h3>

                      <p className="mb-6 text-white/90">
                        Stay connected and join us physically
                        or online for this powerful gathering.
                      </p>

                      <Link
                        to="/contact"
                        className="block text-center bg-white text-[#008080] py-3 rounded-2xl font-bold"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>


          )
      }




    </div>
  )
}