import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#008080] text-white ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Disciples Church</h3>
            <p className="text-gray-300">
              Disciples Church of God for All Nations - A place of worship, growth, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-accent transition">Home</Link></li>
              <li><Link to="/events" className="hover:text-accent transition">Events</Link></li>
              <li><Link to="/sermons" className="hover:text-accent transition">Sermons</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="tel:+1234567890" className="hover:text-accent transition">(123) 8036550941</a></li>
              <li><a href="mailto:info@dcg.org" className="hover:text-accent transition">info@dcgfan.org</a></li>
              <li>
                <address className="not-italic">
                  @km 11, Akure/Owo Road,<br />
                  Ajegunle ilu Abo Via Akure, <br />
                  Akure North LG Ondo State
                </address>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/DCGFAN/?checkpoint_src=any" className="hover:text-accent transition">Facebook</a>
              <a href="https://www.facebook.com/DCGFAN/?checkpoint_src=any" className="hover:text-accent transition">Instagram</a>
              <a href="https://www.youtube.com/@discipleschurchofgod" className="hover:text-accent transition">YouTube</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            &copy; {currentYear} Disciples Church of God for All Nations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  )
}
