import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";
import InternalNavbar from "./InternalNavbar";
import ProfileMenu from "../ProfileMenu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Welcome!");
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });
  const navRefs = useRef([]);

  const isLandingPage = location.pathname === "/";
  const hasToken = !!localStorage.getItem("token");

  const navigationItems = [
    { label: "Welcome!", href: "#hero" },
    { label: "How it works?", href: "#how-it-works" },
    { label: "Our values", href: "#values" },
    { label: "Get Started", href: "#get-started" },
    { label: "Our team", href: "#team" },
  ];

  const activeIndex = navigationItems.findIndex(
    (item) => item.label === activeNav
  );

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

  // Add this useEffect after your existing useEffect
  useEffect(() => {
    if (!isLandingPage) return;

    const handleScroll = () => {
      const sections = navigationItems.map((item) => ({
        label: item.label,
        element: document.querySelector(item.href),
      }));

      const headerHeight = 100; // Same as your scroll offset
      const scrollPosition = window.scrollY + headerHeight + 50; // Add 50px buffer

      // Find which section is currently in view
      let currentSection = navigationItems[0].label; // Default to first section

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const sectionTop = section.element.offsetTop;
          if (scrollPosition >= sectionTop) {
            currentSection = section.label;
            break;
          }
        }
      }

      // Update active navigation only if it's different
      if (currentSection !== activeNav) {
        setActiveNav(currentSection);
      }
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLandingPage, activeNav, navigationItems]);

  const handleAuthClick = (type) => {
    if (type === "signin") {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-[100] shadow-md backdrop-blur-sm backdrop-filter">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-3 items-center gap-8 lg:grid-cols-3 md:grid-cols-2 md:gap-6">
        {/* Logo Section - Left */}
        <Link
          to="/"
          onClick={(e) => {
            if (isLandingPage) {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
          }}
          className="font-display text-3xl md:text-2xl font-bold text-ink cursor-pointer transition-colors hover:text-primary justify-self-start no-underline"
        >
          RetrieveApp
        </Link>

        {isLandingPage ? (
          <nav className="hidden lg:flex justify-center">
            <div className="relative flex items-center bg-gray-100 rounded-full">
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
                    // if (element) {
                    //   element.scrollIntoView({
                    //     behavior: "smooth",
                    //     block: "start",
                    //   });
                    // }

                    if (element) {
                      const headerHeight = 100; // Adjust based on your header height
                      const elementPosition =
                        element.getBoundingClientRect().top +
                        window.pageYOffset;
                      const offsetPosition = elementPosition - headerHeight;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        ) : (
          <>
            <div className="hidden lg:flex justify-center"></div>
          </>
        )}
        {/* Auth Section - Right */}
        <div className="flex justify-end">
          {hasToken ? (
            isLandingPage ? (
              <ProfileMenu />
            ) : (
              <InternalNavbar />
            )
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
