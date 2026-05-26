import React from "react";
import { Link } from "react-router-dom";

function BecomeMember() {
  return (
    <section className="relative w-full bg-fixed bg-center bg-cover py-20 px-4 flex items-center justify-center"
      style={{ backgroundImage: "url('/asset/bg/bak (19).jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center text-white space-y-6">
        <h6 className="uppercase tracking-[4px] text-sm sm:text-base font-semibold">
          A Place For You
        </h6>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          Find a place to connect and grow through a small group, class, or
          regular gathering.
        </h2>

        <Link
          to="/contact"
          className="inline-block bg-white text-blue-600 font-bold uppercase text-sm px-8 py-3 rounded hover:bg-blue-600 hover:text-white transition-all duration-500"
        >
          Become A Member
        </Link>
      </div>
    </section>
  );
}

export default BecomeMember;