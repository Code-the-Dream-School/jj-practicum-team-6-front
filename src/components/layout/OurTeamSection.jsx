import { FaLinkedin } from "react-icons/fa";

const OurTeamSection = () => {
  const teamMembers = [
    {
      name: "Frank Stepanski",
      role: "Practicum mentor",
      // LinkedIn profile image URL,
      image:
        "https://media.licdn.com/dms/image/v2/C4E03AQG8mXFiHHxSsw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1612190765596?e=1761782400&v=beta&t=TRlDv_2TH5eIbRYBZ6R2lUceoUG1Zk8u7HBXNVV8zTk",
      linkedin: "https://www.linkedin.com/in/frankstepanski/",
    },
    {
      name: "Mario Martinez",
      role: "Lead mentor",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQEN1IVOaOzd6Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1732139508311?e=1761782400&v=beta&t=coUXq-3TE1cujGyqonU14BaudTwl8-7EjLw3flvMJ9U",
      linkedin: "https://www.linkedin.com/in/mntri4/",
    },
    {
      name: "Chris Lee",
      role: "React/Node mentor",
      image: null,
      linkedin: null, //"https://linkedin.com/in/chris-lee",
      initals: "CL",
    },
    {
      name: "Aida Burlutckaia",
      role: "Full Stack Developer, Designer",
      subtitle: "Assistant mentor",
      image:
        "https://media.licdn.com/dms/image/v2/D4E35AQFelFjMTwC-dA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1734444267715?e=1759644000&v=beta&t=6nwTxBUD2bF5osh7MDFiKEWsI8kDbZfRr0SAABXWzs8",
      linkedin: "https://www.linkedin.com/in/aida-burlutckaia-08832363/",
    },
    {
      name: "Vera Fesianava",
      role: "Backend Developer",
      image:
        "https://media.licdn.com/dms/image/v2/C5603AQGqzNx0zTqzIw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516586883056?e=1761782400&v=beta&t=kzKRluIQcp7TR9tJtv8ow8SN7i260NwqYnGeiJNGz-4",
      linkedin: "https://www.linkedin.com/in/vera-fesianava/",
    },
    {
      name: "Alina Dalantaeva",
      role: "Frontend Developer",
      subtitle: "Assistant mentor",
      image:
        "https://media.licdn.com/dms/image/v2/D4D03AQEVJ-pLmHqClQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1719335178445?e=1761782400&v=beta&t=N5YodskOGeBN_b6RTtXmnOp1ZRmyiigNipyAWtF6vl8",
      linkedin: "https://www.linkedin.com/in/alina-dalantaeva/",
    },
    {
      name: "Hemang Limbachiya",
      role: "Frontend Developer",
      subtitle: "Assistant mentor",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQHA4E_bkYnZlw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1667775483173?e=1761782400&v=beta&t=XvLWlaOIJd5-B10i0KXrX5WsD9jU_rAUrI5_modudDY",
      linkedin: "https://www.linkedin.com/in/hemang-limbachiya/",
    },
    {
      name: "Masouma Ahmadi Jay",
      role: "Frontend Developer",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQED0GDJbVex1g/profile-displayphoto-scale_200_200/B4EZmRvWbuKUAY-/0/1759086733538?e=1761782400&v=beta&t=TatrV50x3mrjCgEDfDJIqgzP0V6taTf6Hy4J3wiTQRo",
      linkedin: "https://www.linkedin.com/in/masouma-ahmadi-780ab6241/",
    },
  ];

  const handleLinkedInClick = (linkedinUrl) => {
    if (linkedinUrl) {
      window.open(linkedinUrl, "_blank", "noopener,noreferrer");
    }
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

        {/*  */}
        {/* Team Grid - Centered with proper spacing */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col w-60"
                style={{ minHeight: "280px" }}
              >
                {/* Image placeholder */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : member.initials ? (
                    <div className="text-gray-600 text-2xl font-semibold">
                      {member.initials}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xl">👤</div>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-display text-lg font-semibold text-ink mb-2 leading-tight">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="font-body text-sm text-gray600 mb-1 text-center leading-tight">
                  {member.role}
                </p>

                {/* Subtitle if exists */}
                <div className="mb-4 flex-1">
                  {member.subtitle && (
                    <p className="font-body text-xs text-gray-500 text-center">
                      {member.subtitle}
                    </p>
                  )}
                </div>

                {/* LinkedIn - at bottom */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => handleLinkedInClick(member.linkedin)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 transform hover:scale-110 ${
                      member.linkedin
                        ? "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                        : "bg-sky-300 text-sky-100 cursor-default"
                    }`}
                    aria-label={
                      member.linkedin
                        ? `Visit ${member.name}'s LinkedIn profile`
                        : `${member.name}'s LinkedIn not available`
                    }
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeamSection;
