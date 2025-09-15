const Section = ({ id, title, children, bg = "bg-white" }) => {
  return (
    <section
      id={id}
      className={`py-16 ${bg} text-center min-h-[50vh] flex items-center`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display text-4xl font-bold text-ink mb-6">
          {title}
        </h2>
        <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
          {children}
        </p>
      </div>
    </section>
  );
};

export default Section;
