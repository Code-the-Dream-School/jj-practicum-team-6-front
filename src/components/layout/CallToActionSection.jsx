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
              {/* Phone frame */}
              <div className="w-64 h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] p-4 relative overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>

                  {/* Map background */}
                  <div className="mt-8 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl relative overflow-hidden">
                    {/* Map lines/roads */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20"
                      viewBox="0 0 300 400"
                    >
                      <path
                        d="M50 50 Q150 100 250 50"
                        stroke="#ccc"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M20 150 L280 150"
                        stroke="#ccc"
                        strokeWidth="2"
                      />
                      <path d="M100 0 L100 400" stroke="#ccc" strokeWidth="2" />
                      <path d="M200 0 L200 400" stroke="#ccc" strokeWidth="2" />
                      <path d="M0 250 L300 250" stroke="#ccc" strokeWidth="2" />
                    </svg>

                    {/* Location pin markers using MdLocationPin */}
                    {/* Lost item marker (red) */}
                    <div className="absolute top-16 left-12 transform -translate-x-1/2 -translate-y-full">
                      <MdLocationPin
                        style={{
                          color: "#D30000",
                          fontSize: "40px",
                        }}
                      />
                    </div>

                    {/* Found item marker (green) */}
                    <div className="absolute top-32 right-16 transform -translate-x-1/2 -translate-y-full">
                      <MdLocationPin
                        style={{
                          color: "#228B22",
                          fontSize: "40px",
                        }}
                      />
                    </div>

                    {/* Another found item marker (green) */}
                    <div className="absolute bottom-32 left-16 transform -translate-x-1/2 -translate-y-full">
                      <MdLocationPin
                        style={{
                          color: "#228B22",
                          fontSize: "40px",
                        }}
                      />
                    </div>

                    {/* Lost item marker (red) */}
                    <div className="absolute bottom-16 right-12 transform -translate-x-1/2 -translate-y-full">
                      <MdLocationPin
                        style={{
                          color: "#D30000",
                          fontSize: "40px",
                        }}
                      />
                    </div>

                    {/* Additional marker in center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <MdLocationPin
                        style={{
                          color: "#228B22",
                          fontSize: "36px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second phone (slightly behind) */}
              <div className="absolute top-8 -right-8 w-48 h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2.5rem] p-2 shadow-xl opacity-60 -z-10">
                <div className="w-full h-full bg-gray-100 rounded-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
