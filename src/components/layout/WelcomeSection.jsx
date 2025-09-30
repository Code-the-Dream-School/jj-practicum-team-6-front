const AboutUsSection = () => {
  return (
    <section
      id="welcome"
      className="pt-10 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}

        <h2 className="mt-0 font-display text-5xl md:text-6xl font-bold text-ink text-center mb-4">
          Welcome to Retrieve App
        </h2>

        {/* Summary Paragraph */}

        <div className="max-w-3xl mx-auto">
          <p className="font-body text-lg text-gray600 leading-relaxed text-center">
            RetrieveApp was created to solve the everyday frustration of losing
            items in shared spaces like campuses, libraries, and cafés. Built
            through Code the Dream's Practicum, it connects communities through
            a centralized platform for posting, searching, and reuniting lost
            belongings with interactive maps and messaging features. More than a
            project, it reflects our growth as developers and our mission to
            build tools that bring people together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
