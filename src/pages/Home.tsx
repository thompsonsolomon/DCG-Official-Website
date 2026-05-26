import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useSermons } from '../hooks/useSermons'
import HeroSwitcher from '@/components/Home/Hero/HeroSwitcher'
import WelcomMessage from '@/components/Home/WelcomMessage'
import { motion } from "framer-motion";
import { fadeUp } from '@/config/animation'
import BecomeMember from '@/components/Home/Member'
import { CardSkeleton } from '@/UI/FlipCard'
import { Helmet } from 'react-helmet-async'

export const Home = () => {
  const { events } = useEvents()
  const { sermons } = useSermons()
  const [upcomingEvents, setUpcomingEvents] = useState(events.slice(0, 3))
  const [recentSermons, setRecentSermons] = useState(sermons.slice(0, 3))

  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingSermons, setLoadingSermons] = useState(true)

  useEffect(() => {
    setUpcomingEvents(events.slice(0, 3))
  }, [events])

  useEffect(() => {
    setRecentSermons(sermons.slice(0, 3))
  }, [sermons])


  const highlights = [
    {
      title: "Sundays at 10 AM",
      desc: "Join us for powerful worship service filled with Word and Spirit.",
    },
    {
      title: "Community Driven",
      desc: "We serve with love, compassion, and unity across all families.",
    },
    {
      title: "Growing Together",
      desc: "Discipleship programs that help you grow spiritually and emotionally.",
    },
  ]

  useEffect(() => {
    if (events.length > 0) {
      setUpcomingEvents(events.slice(0, 3))
      setLoadingEvents(false)
    }
  }, [events])

  useEffect(() => {
    if (sermons.length > 0) {
      setRecentSermons(sermons.slice(0, 3))
      setLoadingSermons(false)
    }
  }, [sermons])

  return (
    <>
      <Helmet>
        <title>
          Disciples Church of God - Home
        </title>

        <meta
          name="description"
          content="Welcome to Disciples Church of God. Join our worship services, sermons and church community."
        />

        <meta
          property="og:title"
          content="Disciples Church of God"
        />

        <meta
          property="og:description"
          content="Join us for worship and fellowship."
        />
      </Helmet>

      <div className="w-full">
        {/* Hero Section */}
        <HeroSwitcher />

        <WelcomMessage />


        {/* 
  <FlipCard
        frontImage="/asset/bg/1.jpg"
        name="Pastor M.B Aremu"
        title="Senior Pastor"
        description="A passionate leader dedicated to spiritual growth, community development, and impacting lives through God's word."
      /> */}


        {/* Quick Info */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-10">
          <div className="max-w-6xl mx-auto">

            {/* HEADER */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why We Exist
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                A place of worship, growth, and transformation rooted in Christ.
              </p>
            </div>

            {/* GRID */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-1 bg-accent rounded-full mb-6 group-hover:w-20 transition-all duration-300" />

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-blue-50 -z-10" />
                </motion.div>
              ))}
            </div>

          </div>
        </section>


        {/* Upcoming Events */}
        <div>

          <h2 className="text-4xl font-bold mb-12 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loadingEvents
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : upcomingEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={event.Imgurl || "/asset/bg/1.jpg"}
                    alt={event.EventTitle}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.EventTitle}</h3>
                    <p className="text-gray-600 mb-4">{event.disc}</p>
                    <p className="text-sm text-accent font-semibold">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>



        {/* Recent Sermons */}

        <div className='mb-40'>
          <h2 className="text-4xl font-bold mb-12 text-center">Latest Sermon</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loadingSermons
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : recentSermons.map((sermon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={sermon.Imgurl || "/asset/bg/1.jpg"}
                    alt={sermon.SermonTitle}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{sermon.SermonTitle}</h3>
                    <p className="text-gray-600 mb-2">{sermon.preacher}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(sermon.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>



        <BecomeMember />

      </div>

    </>


  )
}
