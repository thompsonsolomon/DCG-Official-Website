import React from 'react'

function WelcomMessage() {
  return (
<section className="py-12 sm:py-16 lg:py-24 bg-background overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

      {/* LEFT CONTENT */}
      <div className="space-y-6 sm:space-y-8 text-center lg:text-left">

        {/* Title */}
        <div>
          <p className="text-accent uppercase tracking-widest text-xs sm:text-sm font-semibold mb-2">
            Welcome Message 
          </p>

          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-[#008080] leading-tight mb-4">
            A Message from Our <span className="text-accent">Pastor</span>
          </h2>

          <div className="w-16 sm:w-20 h-1 bg-accent mx-auto lg:mx-0 mb-6"></div>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0">
            Welcome to Disciples Church of God! I am Pastor M.B. Aremu, and it is my privilege
            to serve this wonderful congregation. For over 20 years, I have witnessed God's
            faithfulness in this community.
          </p>
        </div>

        {/* Icon Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">

          <ul className="space-y-3">
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Spiritual Growth
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Strong Community
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Faith Development
            </li>
          </ul>

          <ul className="space-y-3">
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Worship Experience
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Bible Teaching
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-accent">★</span> Life Transformation
            </li>
          </ul>

        </div>

        {/* Quote */}
        <div className="border-l-4 border-accent pl-4 sm:pl-5 py-3 bg-muted/40 rounded-r-lg text-left">
          <p className="text-[#008080] font-medium italic text-sm sm:text-base">
            "Come as you are, grow as you go, and serve as you're called."
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            — Pastor M.B. Aremu & Pastor Mrs. Folashade Aremu
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center lg:justify-start">
          <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-gray-700 rounded-md hover:bg-primary/90 transition text-sm sm:text-base">
            Learn More
          </button>
        </div>

      </div>

      {/* RIGHT IMAGE DESIGN */}
<div className="relative 
  w-[85%] sm:w-[320px] md:w-[380px] lg:w-[440px] 
  max-w-[440px] 
  mx-auto 
  flex justify-center items-center 
  mt-10 lg:mt-0">
        {/* Main Image */}
        <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] 
                        h-[320px] sm:h-[380px] md:h-[440px] lg:h-[520px] 
                        shadow-2xl overflow-hidden">
          <img
            src="/asset/bg/dad.jpg"
            alt="Pastor"
            className="w-full h-full object-cover rounded-bgg"
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
        </div>

        {/* Floating Image */}
        <div className="absolute 
                        bottom-[-30px] sm:bottom-[-40px] 
                        left-[-30px] sm:left-[-50px] lg:left-[-70px] 
                        w-32 h-44 sm:w-44 sm:h-60 md:w-52 md:h-64 
                        overflow-hidden ">
          <img
            src="/asset/bg/mom.jpg"
            alt="Church"
            className="w-full h-full object-cover rounded-smm"
          />
        </div>

        {/* Decorative Glow */}
        <div className="absolute -top-10 sm:-top-12 -right-6 sm:-right-10 
                        w-28 h-28 sm:w-40 sm:h-40 
                        bg-accent/20 rounded-full blur-3xl"></div>

      </div>

    </div>
  </div>
</section>  )
}

export default WelcomMessage