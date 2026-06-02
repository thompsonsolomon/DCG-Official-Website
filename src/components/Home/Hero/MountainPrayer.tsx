
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const images = [
  "/asset/bg/kajola26.jpg",  
  "/asset/bg/20.jpg",
  "/asset/bg/11.jpg",
]

export default function MountainPrayer() {
  const [index, setIndex] = useState(0)
  const now = new Date()

const isLive =
  now.getHours() >= 21 &&
  now.getHours() < 22

  // background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 6000)

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

<div className="absolute top-20 left-20 w-72 h-72 bg-red-600/20 blur-[120px] rounded-full" />

<div className="absolute bottom-20 right-20 w-72 h-72 bg-[#008080]/20 blur-[120px] rounded-full" />

   {/* CONTENT */}
<div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

  {/* LIVE BADGE */}
  {isLive && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [1, 0.6, 1],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
      className="
      bg-red-600
      text-white
      px-5
      py-2
      rounded-full
      font-bold
      mb-6
      flex
      items-center
      gap-3
      shadow-xl
      "
    >
      <span className="w-3 h-3 bg-white rounded-full" />
      LIVE NOW
    </motion.div>
  )}

  {/* TITLE */}
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="
      text-4xl
      md:text-6xl
      lg:text-7xl
      font-black
      text-white
      mb-4
      leading-tight
    "
  >
    21 DAYS OF PRAYER
    <br />
    WITH THE PROPHET
  </motion.h1>

  {/* THEME */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="
    bg-white/10
    backdrop-blur-md
    border
    border-white/20
    px-6
    py-4
    rounded-2xl
    mb-6
    "
  >
    <p className="text-yellow-300 uppercase tracking-widest text-sm">
      Theme
    </p>

    <h2 className="text-white text-2xl md:text-4xl font-bold">
      Greater Is He
    </h2>

    <p className="text-gray-300">
      1 John 4:4
    </p>
  </motion.div>

  {/* DETAILS */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="
    flex
    flex-wrap
    justify-center
    gap-4
    mb-8
    "
  >
    <div className="bg-red-600 text-white px-5 py-3 rounded-xl">
      📅 June 1 - June 21
    </div>

    <div className="bg-[#008080] text-white px-5 py-3 rounded-xl">
      🕘 9PM - 10PM Daily
    </div>

    <div className="bg-white text-black px-5 py-3 rounded-xl">
      📍 Prayer Mountain
    </div>
  </motion.div>

  {/* SCRIPTURE */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="
    text-lg
    md:text-xl
    text-gray-200
    max-w-3xl
    mb-8
    "
  >
    Ye are of God, little children, and have overcome them:
    because greater is He that is in you, than he that is in the world.
  </motion.p>

  {/* CTA */}
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.8 }}
    className="flex flex-wrap justify-center gap-4"
  >
    <Link
      to="/live"
      className="
      bg-red-600
      text-white
      px-8
      py-4
      rounded-xl
      font-bold
      hover:bg-red-700
      transition
      shadow-xl
      "
    >
      Join Live Prayer
    </Link>

    <Link
      to="/events"
      className="
      bg-white
      text-black
      px-8
      py-4
      rounded-xl
      font-bold
      hover:bg-gray-200
      transition
      "
    >
      Event Details
    </Link>
  </motion.div>

</div>

    </div>
  )
}