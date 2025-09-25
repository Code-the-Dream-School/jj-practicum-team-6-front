import { FaRegClock, FaMap, FaUsers, FaComments } from "react-icons/fa";

const OurValuesSection = () => {
  const values = [
    {
      icon: <FaRegClock className="w-12 h-12 text-gray-500" />,
      title: "Easy to Use",
      description: "Drop a pin, add a photo — done in seconds.",
    },
    {
      icon: <FaMap className="w-12 h-12 text-gray-500" />,
      title: "Map-Based Search",
      description: "See lost and found items right where they were seen.",
    },
    {
      icon: <FaUsers className="w-12 h-12 text-gray-500" />,
      title: "Community Powered",
      description: "Anyone can mark 'Seen it' or leave a comment.",
    },
    {
      icon: <FaComments className="w-12 h-12 text-gray-500" />,
      title: "Fast Contact",
      description: "Reach out directly to the person who posted.",
    },
  ];

  return (
    <section id="values" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="font-display text-5xl md:text-6xl font-bold text-ink text-center mb-4">
          Our Values
        </h2>

        {/* Subtitle */}
        <p className="font-body text-lg text-gray600 text-center mb-16 max-w-2xl mx-auto">
          Our platform is built on core principles that make finding lost items
          simple, community-driven, and effective.
        </p>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon placeholder box */}
              <div className="w-20 h-16 bg-gray-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-semibold text-ink mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-gray600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValuesSection;
