import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";
import InternalNavbar from "./InternalNavbar";
// import {
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaImage,
//   FaUserCircle,
//   FaHome,
//   FaPlusCircle,
//   FaUpload,
// } from "react-icons/fa";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("About us");
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });
  const navRefs = useRef([]);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  const navigationItems = [
    { label: "About us", href: "#about" },
    { label: "Our values", href: "#values" },
    { label: "How it works?", href: "#how-it-works" },
    { label: "Our team", href: "#team" },
    { label: "Contacts", href: "#contacts" },
  ];

  const activeIndex = navigationItems.findIndex(
    (item) => item.label === activeNav
  );

  // Update pill position and size when active nav changes (only on landing page)
  useEffect(() => {
    if (isLandingPage) {
      const activeElement = navRefs.current[activeIndex];
      if (activeElement) {
        const { offsetWidth, offsetLeft } = activeElement;
        setPillStyle({
          width: offsetWidth,
          left: offsetLeft,
        });
      }
    }
  }, [activeIndex, isLandingPage]);

  const handleAuthClick = (type) => {
    if (type === "signin") {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 shadow-md backdrop-blur-sm backdrop-filter">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-3 items-center gap-8 lg:grid-cols-3 md:grid-cols-2 md:gap-6">
        {/* Logo Section - Left */}
        <Link
          to="/"
          className="font-display text-3xl md:text-2xl font-bold text-ink cursor-pointer transition-colors hover:text-primary justify-self-start no-underline"
        >
          RetrieveApp
        </Link>

        {/* Navigation Section - Center (Only show on landing page) */}
        {isLandingPage ? (
          <nav className="hidden lg:flex justify-center">
            <div className="relative flex items-center bg-gray-100 rounded-full p-1">
              {/* Sliding background pill with orange border */}
              <div
                className="absolute bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out h-full border-2 border-primary"
                style={{
                  width: `${pillStyle.width}px`,
                  transform: `translateX(${pillStyle.left}px)`,
                }}
              />

              {navigationItems.map((item, index) => (
                <a
                  key={item.href}
                  ref={(el) => (navRefs.current[index] = el)}
                  href={item.href}
                  className={`relative z-10 font-medium transition-colors duration-200 py-3 px-6 rounded-full whitespace-nowrap text-center ${
                    activeNav === item.label
                      ? "text-ink"
                      : "text-gray600 hover:text-ink"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(item.label);
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        ) :(
          <>

          {/* For non-landing pages, show current page title in center */}

 <div className="hidden lg:flex justify-center">
          </div>
          </>
        )}
        {/* Auth Section - Right */}
    <div className="flex justify-end">
      {isLandingPage ? (
            <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => handleAuthClick("signin")}
            >
              Sign in
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAuthClick("signup")}
            >
              Sign up
            </Button>
          </div> 
           ) : localStorage.getItem("token") ? (
            <InternalNavbar />
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="small"
                onClick={() => handleAuthClick("signin")}
              >
                Sign in
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleAuthClick("signup")}
              >
                Sign up
              </Button>
            </div>
       
            )}
          </div>
      </div>
      </header>
  );
};

export default Header;
