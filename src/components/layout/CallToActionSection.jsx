import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { MdLocationPin } from "react-icons/md";

const CallToActionSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section
      id="get-started"
      className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-tight">
              Be someone's <em className="italic text-primary">hero</em>.
            </h2>
            <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
              Post your find or search now.
            </h3>

            <p className="font-body text-lg text-gray600 mb-8 max-w-md mx-auto lg:mx-0">
              Community starts with you.
            </p>

            <Button
              variant="primary"
              size="large"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Get started
            </Button>
          </div>

          {/* Right content - Phone mockup */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Replace the entire phone mockup div with the provided image */}
              <img
                src="/images/phone-mockup_get-started.png"
                alt="Phone showing RetrieveApp map interface"
                className="w-auto h-auto max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
