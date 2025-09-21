import React, { useState, useEffect } from "react";
import { getAllData } from "../util/index";
import HeroSection from "../components/layout/HeroSection";
import LandingMapSection from "../components/layout/LandingMapSection";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Section from "../components/layout/Section";

const LandingPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_API_URL;

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
      <div className="flex justify-center items-center">
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

      {/* NEW: Recently Added Map Section */}
      <LandingMapSection />

      <Section id="about" title="About Us Section">
        This will be the about us content. Click "About us" in the nav to test
        smooth scrolling.
      </Section>

      <Section id="values" title="Our Values Section" bg="bg-gray-100">
        Values content will go here. Test navigation scrolling.
      </Section>

      <Section id="how-it-works" title="How It Works Section">
        How it works content will go here.
      </Section>

      <Section id="team" title="Our Team Section" bg="bg-gray-100">
        Team content will go here.
      </Section>

      <Section id="contacts" title="Contacts Section">
        Contact information will go here.
      </Section>
    </>
  );
};

export default LandingPage;
