// import { motion } from "framer-motion"
// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"

// const images = [
//   "/asset/bg/1.jpg",
//   "/asset/bg/2.jpg",
//   "/asset/bg/3.jpg",
//   "/asset/bg/4.jpg",
//   "/asset/bg/9.jpg",
// ]

// export function ConventionHero() {
//   const [index, setIndex] = useState(0)

//   // Background slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length)
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="relative h-[90vh] w-full overflow-hidden">

//       {/* BACKGROUND SLIDER */}
//       <div className="absolute inset-0">
//         {images.map((img, i) => (
//           <motion.img
//             key={i}
//             src={img}
//             alt="Convention"
//             className="absolute w-full h-full object-cover"
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{
//               opacity: i === index ? 1 : 0,
//               scale: i === index ? 1 : 1.1,
//             }}
//             transition={{ duration: 1.2 }}
//           />
//         ))}

//         {/* DARK OVERLAY */}
//         <div className="absolute inset-0 bg-black/60" />
//       </div>

//       {/* CONTENT */}
//       <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">

//         {/* TITLE */}
//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl md:text-6xl font-bold text-white mb-4"
//         >
//           Annual Convention 2026
//         </motion.h1>

//         {/* SUBTEXT */}
//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.8 }}
//           className="text-lg md:text-xl text-gray-200 max-w-2xl mb-6"
//         >
//           Experience God like never before. Join thousands in worship,
//           miracles, and transformation.
//         </motion.p>

//         {/* CTA */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.6, duration: 0.5 }}
//         >
//           <Link
//             to="/events"
//             className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
//           >
//             Join the Convention
//           </Link>
//         </motion.div>

//       </div>
//     </div>
//   )
// }



import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const speakers = [
  {
    image: "/asset/bg/convention26.png",
    name: "Pst. & Pst. (Mrs) M.B. Aremu",
    role: "Missionary Overseer",
  },
]

export function ConventionHero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-[#03164d] text-white">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#031b68] via-[#0759a7] to-[#020b2d]" />

        {/* Large glowing blue circle */}
        <motion.div
          className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Gold glow */}
        <motion.div
          className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-yellow-400/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[15%] top-[-20%] h-[150%] w-[120px] rotate-[25deg] bg-white/20 blur-3xl" />
          <div className="absolute left-[45%] top-[-20%] h-[150%] w-[80px] rotate-[25deg] bg-cyan-200/20 blur-3xl" />
          <div className="absolute right-[15%] top-[-20%] h-[150%] w-[100px] rotate-[25deg] bg-yellow-300/10 blur-3xl" />
        </div>

        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020817] to-transparent" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-5 py-6 sm:px-8 lg:px-12">

        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl"
          >

            {/* Church label */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-5 flex items-center gap-3"
            >
              <div className="h-px w-10 bg-yellow-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300 sm:text-sm">
                Disciples Church of God
              </span>

              <div className="h-px w-10 bg-yellow-400" />
            </motion.div>

            {/* Convention number */}
            <div className="mb-3 flex items-end gap-3">

              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="text-5xl font-black leading-none text-yellow-400 drop-shadow-lg sm:text-7xl"
              >
                24
              </motion.span>

              <div className="pb-2">
                <span className="block text-xl font-bold uppercase tracking-widest text-white sm:text-xl">
                  th
                </span>

                <span className="block text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Annual
                </span>
              </div>
            </div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="text-3xl font-black uppercase leading-[0.9] tracking-tight sm:text-4xl md:text-5xl"
            >
              Annual
              <span className="block text-yellow-400">
                Convention
              </span>
            </motion.h1>

            {/* Theme card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative flex gap-2 mt-7 max-w-xl overflow-hidden rounded-2xl border border-cyan-300/30 bg-[#063c72]/80 p-3 shadow-2xl backdrop-blur-md sm:p-4"
            >
              <div>

                {/* Decorative line */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-300 via-cyan-300 to-yellow-400" />

                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Theme
                </p>

                <h2 className="text-3xl font-bold uppercase leading-tight sm:text-4xl">
                  Create in Me a
                  <span className="block text-yellow-300">
                    Pure Heart
                  </span>
                </h2>

                <p className="mt-2 text-sm font-medium text-white/70">
                  Psalm 51:10
                </p>

              </div>

              {/* Event information */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="mt-7 flex flex-wrap gap-3"
              >

                {/* Date */}
                <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest text-cyan-200">
                    Date
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    18th – 22nd
                  </p>

                  <p className="text-sm text-white/70">
                    August 2026
                  </p>
                </div>

                {/* Time */}
                <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2">
                  <p className="text-xs uppercase tracking-widest text-yellow-300">
                    Daily
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    8:00 AM
                  </p>

                  <p className="text-sm text-white/70">
                    Every Day
                  </p>
                </div>
              </motion.div>


            </motion.div>



            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/events"
                className="group relative overflow-hidden rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-[#06194d] shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300"
              >
                <span className="relative z-10">
                  Join the Convention
                </span>

                <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 font-semibold backdrop-blur-sm transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT / SPEAKER ================= */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative flex min-h-[420px] items-end justify-center lg:min-h-[600px]"
          >

            {/* Gold circular decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute right-5 top-5 h-[280px] w-[280px] rounded-full border border-yellow-400/30 sm:h-[380px] sm:w-[380px]"
            >
              <div className="absolute -left-2 top-1/2 h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
            </motion.div>

            {/* Blue circle */}
            <div className="absolute bottom-10 h-[320px] w-[320px] rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-700/20 blur-sm sm:h-[450px] sm:w-[450px]" />

            {/* Speaker image */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex h-[500px] w-full items-end justify-center sm:h-[600px]"
            >
              <img
                src={speakers[0].image}
                alt={speakers[0].name}
                className="h-full max-w-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
              />
            </motion.div>

            {/* Speaker information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="absolute bottom-4 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-[#031b4f]/85 px-5 py-4 text-center shadow-2xl backdrop-blur-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                {speakers[0].role}
              </p>

              <h3 className="mt-1 text-lg font-bold sm:text-xl">
                {speakers[0].name}
              </h3>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ================= BOTTOM LOCATION ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 text-center text-xs text-white/60 md:block"
      >
        1 Disciples Street, Ajegunle, Ilú ABO • Ondo State, Nigeria
      </motion.div>

    </section>
  )
}