const AboutUsSection = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <h2 className="font-display text-5xl md:text-6xl font-bold text-ink text-center mb-4">
          About Us
        </h2>

        {/* Summary Paragraph */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-3xl mx-auto">
          <p className="font-body text-lg text-gray600 leading-relaxed text-justify">
            RetrieveApp was born from recognizing the daily frustration of lost
            items in shared spaces like campuses, libraries, and cafés. Our
            dedicated team collaborated through Code the Dream's Practicum
            program to create a centralized platform where communities can post,
            search, and reunite people with their belongings through interactive
            maps and direct messaging. This project represents not only our
            technical growth in full-stack development but also our commitment
            to building meaningful solutions that bring communities together,
            made possible through the invaluable mentorship and learning
            opportunities provided by Code the Dream.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
