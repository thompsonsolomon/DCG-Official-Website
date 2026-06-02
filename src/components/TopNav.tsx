import { Facebook, Twitter, Mail, Phone, Clock } from 'lucide-react'

export default function TopHeader() {
  return (
    <div className="bg-primary text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-wrap">
          
          {/* Opening Hours */}
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Opening Hours - 10 AM to 6 PM</span>
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-3 ml-2">
            <a
              href="https://web.facebook.com/DCGFAN/?_rdc=1&_rdr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
            >
              <Facebook size={16} />
            </a>

            <a
              href="http://twitter.com/dcg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
            >
              <Twitter size={16} />
            </a>

            {/* Replace Google with Mail or Globe */}
            <a
              href="mailto:info@dcg.org"
              className="hover:text-accent transition"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 flex-wrap">
          
          {/* Email */}
          <a
            href="mailto:info@dcg.org"
            className="flex items-center gap-2 hover:text-accent transition"
          >
            <Mail size={16} />
            <span>info@dcg.org</span>
          </a>

          {/* Phone */}
          <a
            href="tel:08036550941"
            className="flex items-center gap-2 hover:text-accent transition"
          >
            <Phone size={16} />
            <span>08036550941</span>
          </a>

        </div>

      </div>
    </div>
  )
}