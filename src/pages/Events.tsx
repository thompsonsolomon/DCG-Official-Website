import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import Breadcrumb from '@/UI/Breadcrum'
import { motion } from "framer-motion";

export const Events = () => {
  const { events } = useEvents()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'worship', 'fellowship', 'outreach', 'youth']
  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category === selectedCategory)


    

  return (
    <div className="w-full">
          <Breadcrumb  
           title="Latest Events"
        backgroundImage="/asset/bg/3.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Events" },
        ]}/>


      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-[#008080] text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event, i) => (
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

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No events found in this category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
