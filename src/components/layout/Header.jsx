import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";
import ProfileMenu from '../ProfileMenu';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImage,
  FaUserCircle,
  FaHome,
  FaPlusCircle,
  FaUpload,
} from "react-icons/fa";


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
        {isLandingPage && (
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
        )}

        {/* For non-landing pages, show current page title in center */}
        {!isLandingPage && (
          <div className="hidden lg:flex justify-center">
            <span className="font-medium text-gray600">
              {location.pathname === "/signin" && "Sign In"}
              {location.pathname === "/signup" && "Sign Up"}
              {location.pathname === "/profile" && "Profile"}
              {location.pathname === "/items/list" && "Items"}
              {location.pathname.includes("/items/edit") && "Edit Item"}
              {location.pathname.includes("/profile/edit") && "Edit Profile"}
            </span>
          </div>
        )}

        {/* Auth Section - Right */}
        {/* <div className="flex justify-end"> */}
          {/* <div className="flex items-center gap-4">
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
          </div> */}

         {/* Right Section */}
<div className="flex justify-end">
  {localStorage.getItem("token") ? (
    <div className="flex items-center gap-6">
      
      {/* Logged-in navbar links */}
            <nav className="flex gap-8 items-center">
              <Link
                 to="/"
                 className="flex items-center gap-2 font-semibold"
                  title="Home"
              >
                <FaHome className="text-2xl" />
             </Link>
              <a
                href="/items/list"
                className="flex items-center gap-2 font-semibold"
              >
                <span>All items</span>
              </a>
              <a
                href="/items/new"
                className="flex items-center gap-2 font-semibold"
              >
                <FaPlusCircle className="text-[#E66240] text-xl" />
                <span className="text-[#E66240]">Add lost item</span>
              </a>
              <a
                href="/items/new"
                className="flex items-center gap-2 font-semibold"
              >
                <FaPlusCircle className="text-[#7FD96C] text-xl" />
                <span className="text-[#7FD96C]">Add found item</span>
              </a>
          </nav>
         
        
    {/* <Link to="/" title="Home" className="hover:text-primary">
  //   <HomeIcon className="h-6 w-6 text-gray-700" />
  // </Link>

  //  <Link to="/items/list" className="text-gray-700 hover:text-primary font-small">My Items</Link>   

  //    <Link
  //   to="/items/new/lost"
  //   className="flex items-center gap-1 text-red-600 hover:text-red-700 font-small"
  // >
  //   <PlusCircleIcon className="h-10 w-10" />
  //   Add Lost Item
  // </Link>

  //     <Link
  //   to="/items/new/found"
  //   className="flex items-center gap-1 text-green-600 hover:text-green-700 font-small"
  // >
  //   <PlusCircleIcon className="h-10 w-10" />
  //   Add Found Item
  // </Link>

      {/* Profile dropdown */}
      <ProfileMenu />
    </div> 
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
