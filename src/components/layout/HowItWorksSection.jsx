const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Register your account",
      description: "Create a free account in seconds — no hassle, just your email.",
      position: "right"
    },
    {
      number: 2,
      title: "Post a lost or found item",
      description: "Drop a pin on the map, add a photo and a short description.",
      position: "left"
    },
    {
      number: 3,
      title: "Browse the map",
      description: "Explore local posts near you using a simple visual map.",
      position: "right"
    },
    {
      number: 4,
      title: "Connect and solve together",
      description: "Send a message or mark 'seen it' to help reunite people with their items.",
      position: "left"
    }
  ];

  return (
    //<section id="how-it-works" className="py-20 bg-gray-50">
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <h2 className="font-display text-5xl md:text-6xl font-bold text-ink text-center mb-4">
          How it works
        </h2>
        
        {/* Subtitle */}
        <p className="font-body text-lg text-gray600 text-center mb-16 max-w-2xl mx-auto">
          Getting started is simple. Follow these easy steps to find your lost items or help others recover theirs.
        </p>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full hidden md:block"></div>
          
          {steps.map((step, index) => (
            <div key={step.number} className="relative mb-20 last:mb-0">
              {/* Step number circle */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                {step.number}
              </div>
              
              {/* Content card */}
              <div className={`relative ${step.position === 'right' ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'} md:w-1/2 mt-16 md:mt-0`}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 ml-8 md:ml-0">
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-gray600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;