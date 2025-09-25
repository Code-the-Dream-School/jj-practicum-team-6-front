import React from "react";
import Button from "../ui/Button";

const HeroSection = () => {
  return (
    //<section className="bg-gradient-to-br from-orange-50 to-blue-50 py-16 min-h-[80vh] flex items-center">
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 min-h-[80vh] flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="font-display text-6xl md:text-5xl sm:text-4xl xs:text-3xl font-bold leading-tight text-ink m-0">
            Lost something?
          </h1>

          {/* Subtitle with emphasized word */}
          <p className="font-display text-6xl md:text-5xl sm:text-4xl xs:text-3xl font-bold leading-tight text-ink m-0">
            Let <em className="italic text-primary">community</em> help
          </p>

          {/* Description */}
          <p className="font-body text-lg text-gray600 leading-relaxed m-0 max-w-lg">
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
          <div className="text-2xl text-gray600 mt-6 animate-bounce">↓</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
