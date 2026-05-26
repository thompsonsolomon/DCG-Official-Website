import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const images = [
  "/asset/bg/8.jpg",  
  "/asset/bg/19.jpg",
  "/asset/bg/20.jpg",
  "/asset/bg/11.jpg",
  "/asset/bg/10.jpg",
]

export default function DefaultHero() {
  const [index, setIndex] = useState(0)

  // background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 4500)

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
            alt="Church background"
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.08,
            }}
            transition={{ duration: 1.5 }}
          />
        ))}

        {/* SOFT OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Welcome to Disciples Church
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6"
        >
          A place of worship, growth, and transformation in Christ.
          Join us as we grow in faith together.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-4"
        >
          <Link
            to="/plan-visit"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Plan a Visit
          </Link>

          <Link
            to="/sermons"
            className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Watch Sermons
          </Link>
        </motion.div>

      </div>
    </div>
  )
}