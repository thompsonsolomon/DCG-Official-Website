import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const images = [
   "/asset/bg/crs1.jpg",
  "/asset/bg/crs2.jpg",
]

export default function ChristmasHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt="Christmas background"
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.4 }}
          />
        ))}

        {/* FESTIVE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/60 via-green-900/40 to-black/70" />
      </div>

      {/* SIMPLE FLOATING LIGHT EFFECT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-white rounded-full top-10 left-10 animate-pulse opacity-60"></div>
        <div className="absolute w-3 h-3 bg-white rounded-full top-1/3 left-1/2 animate-ping opacity-40"></div>
        <div className="absolute w-2 h-2 bg-white rounded-full bottom-20 right-20 animate-pulse opacity-60"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-4"
        >
          Merry Christmas 🎄
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-100 max-w-2xl mb-6"
        >
          Celebrating the birth of our Lord Jesus Christ with joy, love, and unity.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            to="/events"
            className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Join Christmas Service
          </Link>
        </motion.div>

      </div>
    </div>
  )
}