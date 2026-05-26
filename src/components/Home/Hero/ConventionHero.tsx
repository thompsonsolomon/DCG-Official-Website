import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const images = [
  "/asset/bg/1.jpg",
  "/asset/bg/2.jpg",
  "/asset/bg/3.jpg",
  "/asset/bg/4.jpg",
  "/asset/bg/9.jpg",
]

export function ConventionHero() {
  const [index, setIndex] = useState(0)

  // Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[90vh] w-full overflow-hidden">

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt="Convention"
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.2 }}
          />
        ))}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Annual Convention 2026
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6"
        >
          Experience God like never before. Join thousands in worship,
          miracles, and transformation.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/events"
            className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Join the Convention
          </Link>
        </motion.div>

      </div>
    </div>
  )
}