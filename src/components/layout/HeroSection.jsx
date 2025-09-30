import React from "react";
import Button from "../ui/Button";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 min-h-[80vh] flex items-center"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Left Image - Woman */}
          <div className="hidden lg:block lg:w-[30%]">
            <img
              src="/images/left_hero-section.png"
              alt="Woman using phone to find lost items"
              //className="w-auto h-auto max-w-full" //
              className="w-full h-auto"
            />
          </div>

          {/* Center Content - Text */}
          <div className="w-full lg:w-1/2 text-center px-4">
            {/* Main Title */}
            <h1 className="font-display text-6xl md:text-5xl sm:text-4xl xs:text-3xl font-bold leading-tight text-ink m-0">
              Lost something?
            </h1>

            {/* Subtitle with emphasized word */}
            <p className="font-display text-6xl md:text-5xl sm:text-4xl xs:text-3xl font-bold leading-tight text-ink m-0 mb-6">
              Let <em className="italic text-primary">community</em> help
            </p>

            {/* Description */}
            <p className="font-body text-lg text-gray600 leading-relaxed m-0 max-w-lg mx-auto mb-8">
              Drop a pin, add a photo. Get it back faster.
            </p>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                const mapSection = document.querySelector("#recently-added");
                if (mapSection) {
                  mapSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              See what you can do
            </Button>

            {/* Scroll Indicator */}
            <div className="text-4xl text-black mt-8 animate-bounce">↓</div>
          </div>

          {/* Right Image - Boy */}
          <div className="hidden lg:block lg:w-[30%]">
            <img
              src="/images/right_hero-section.png"
              alt="Boy who found a backpack"
              //className="w-auto h-auto max-w-full"  //
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
