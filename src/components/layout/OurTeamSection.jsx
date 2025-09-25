import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaLinkedin } from "react-icons/fa";

const OurTeamSection = () => {
  const teamMembers = [
    {
      name: "Mario Martinez",
      role: "Lead mentor",
      image: null, // Placeholder for now
      linkedin: "", // Add LinkedIn URL when available
    },
    {
      name: "Chris Lee",
      role: "React/Node mentor",
      image: null,
      linkedin: "",
    },
    {
      name: "Aida Burlutckaia",
      role: "Full Stack Developer, Designer",
      subtitle: "Assistant mentor",
      image: null,
      linkedin: "",
    },
    {
      name: "Vera Fesianava",
      role: "Backend Developer",
      image: null,
      linkedin: "",
    },
    {
      name: "Alina Dalantaeva",
      role: "Frontend Developer",
      subtitle: "Assistant mentor",
      image: null,
      linkedin: "",
    },
    {
      name: "Hemang Limbachiya",
      role: "Frontend Developer",
      subtitle: "Assistant mentor",
      image: null,
      linkedin: "",
    },
    {
      name: "Masouma Ahmadi Jay",
      role: "Frontend Developer",
      image: null,
      linkedin: "",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // Show 4 cards at a time on desktop
  const maxIndex = Math.max(0, teamMembers.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="font-display text-5xl md:text-6xl font-bold text-ink text-center mb-4">
          Our Team
        </h2>

        {/* Subtitle */}
        <p className="font-body text-lg text-gray600 text-center mb-16 max-w-2xl mx-auto">
          Meet the talented individuals who make RetrieveApp possible. Our
          diverse team brings together expertise in development, design, and
          mentorship.
        </p>

        {/* Slideshow Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Previous team members"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Next team members"
          >
            <FaChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 25}%)`, // Show 4 cards at a time (100/4 = 25%)
              }}
            >
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-1/4 px-3" // Fixed width for each card
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    {/* Image placeholder */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">👤</div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-lg font-semibold text-ink mb-1 min-h-[3rem] flex items-center justify-center">
                      {member.name}
                    </h3>

                    {/* Role */}
                    <p className="font-body text-sm text-gray600 mb-2 min-h-[2.5rem] flex items-center justify-center">
                      {member.role}
                    </p>

                    {/* Subtitle if exists */}
                    <div className="min-h-[2rem] flex items-center justify-center mb-3">
                      {member.subtitle && (
                        <p className="font-body text-xs text-gray-500 text-center">
                          {member.subtitle}
                        </p>
                      )}
                    </div>

                    {/* LinkedIn - pushed to bottom */}
                    <div className="mt-auto pt-4">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          aria-label={`${member.name}'s LinkedIn profile`}
                        >
                          <FaLinkedin className="w-4 h-4" />
                        </a>
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                          <FaLinkedin className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeamSection;
