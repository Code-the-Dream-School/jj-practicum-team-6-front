import React, { useState, useEffect } from "react";
import { getAllData } from "../util/index";
import HeroSection from "../components/layout/HeroSection";
import LandingMapSection from "../components/layout/LandingMapSection";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Section from "../components/layout/Section";
import HowItWorksSection from "../components/layout/HowItWorksSection";
import OurValuesSection from "../components/layout/OurValuesSection";
import CallToActionSection from "../components/layout/CallToActionSection";
import OurTeamSection from "../components/layout/OurTeamSection";
import WelcomeSection from "../components/layout/WelcomeSection";
import ScrollToTopButton from "../components/ScrollToTopButton";

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
      <HeroSection />

      <WelcomeSection />

      <LandingMapSection />

      <HowItWorksSection />

      <OurValuesSection />

      <CallToActionSection />

      <OurTeamSection />

      <ScrollToTopButton />
    </>
  );
};

export default LandingPage;
