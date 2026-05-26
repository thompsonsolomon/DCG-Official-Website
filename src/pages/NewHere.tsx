import Breadcrumb from '@/UI/Breadcrum'
import { Link } from 'react-router-dom'

export const NewHere = () => {
  return (
    <div className="w-full">
    <Breadcrumb
        title="New Here?"
        backgroundImage="/asset/bg/breadcrumb.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Newhere" },
        ]}
      />

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-[#008080] p-6 mb-12 rounded">
            <h2 className="text-2xl font-bold text-[#008080] mb-2">You&apos;re in the right place!</h2>
            <p className="text-accent">Disciples Church of God for All Nations is a community of believers dedicated to faith, fellowship, and service. Whether you&apos;re exploring Christianity for the first time or looking for a church home, we&apos;d love to welcome you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Warm and welcoming community</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Inspiring worship and Bible-based teaching</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Small groups for fellowship and growth</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Opportunities to serve and grow in faith</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Childcare available during services</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold mb-4">Service Times</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-semibold">Sunday Worship</p>
                  <p className="text-gray-700">10:00 AM - 11:30 AM</p>
                </div>
                <div>
                  <p className="font-semibold">Wednesday Prayer Night</p>
                  <p className="text-gray-700">7:00 PM - 8:30 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Youth Group</p>
                  <p className="text-gray-700">Friday 6:00 PM - 8:00 PM</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">*Childcare provided during all services</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4">Getting Started</h3>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                <span><strong>Visit us:</strong> Come as you are to our Sunday worship service. We meet at 10 AM every Sunday.</span>
              </li>
              <li className="flex gap-4">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                <span><strong>Connect:</strong> Fill out a connection card or speak with a member. We love meeting newcomers!</span>
              </li>
              <li className="flex gap-4">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                <span><strong>Explore:</strong> Join a small group or ministry. Find where you fit in our church family.</span>
              </li>
              <li className="flex gap-4">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</span>
                <span><strong>Grow:</strong> Deepen your faith through worship, prayer, and community with fellow believers.</span>
              </li>
            </ol>
          </div>

          <div className="text-center">
            <Link to="/plan-visit" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#008080] inline-block">
              Plan Your First Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
