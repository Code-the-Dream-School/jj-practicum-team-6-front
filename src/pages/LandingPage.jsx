import React, { useState, useEffect } from "react";
import { getAllData } from "../util/index";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LandingPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = "http://localhost:8000/api/v1/";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const myData = await getAllData(URL);
        setMessage(myData.data || "Welcome to Retrieve");
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Backend not connected");
        setMessage("API not available - using mock data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  return (
    <>
      {/* Backend Status FOR DEBUGGING ONLY */}
      {/* {message && (
        <div className={`py-2 px-4 text-center border-b border-gray-200 ${
          error ? "bg-red-50" : "bg-green-50"
        }`}>
          <p className={`m-0 text-sm font-body ${
            error ? "text-red-600" : "text-success"
          }`}>
            Backend Status: {message}
          </p>
        </div>
      )} */}

      <HeroSection />

      {/* About Us Section */}
      <section
        id="about"
        className="py-16 bg-white text-center min-h-[50vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-ink mb-6">
            About Us Section
          </h2>
          <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
            This will be the about us content. Click "About us" in the nav to
            test smooth scrolling.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section
        id="values"
        className="py-16 bg-gray-100 text-center min-h-[50vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-ink mb-6">
            Our Values Section
          </h2>
          <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
            Values content will go here. Test navigation scrolling.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 bg-white text-center min-h-[50vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-ink mb-6">
            How It Works Section
          </h2>
          <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
            How it works content will go here.
          </p>
        </div>
      </section>

      {/* Our Team Section */}
      <section
        id="team"
        className="py-16 bg-gray-100 text-center min-h-[50vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-ink mb-6">
            Our Team Section
          </h2>
          <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
            Team content will go here.
          </p>
        </div>
      </section>

      {/* Contacts Section */}
      <section
        id="contacts"
        className="py-16 bg-white text-center min-h-[50vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-ink mb-6">
            Contacts Section
          </h2>
          <p className="font-body text-lg text-gray600 leading-relaxed max-w-2xl mx-auto">
            Contact information will go here.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
