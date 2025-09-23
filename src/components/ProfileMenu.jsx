import React, { useState, useRef, useEffect, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";
import { logout as authLogout } from "../services/authService";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const userName =
    currentUser?.firstName ||
    currentUser?.name ||
    (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return "User";
        const u = JSON.parse(raw);
        return u?.firstName || u?.name || "User";
      } catch (e) {
        return "User";
      }
    })();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    authLogout();
    window.location.href = "/signin";
  };
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-black focus:outline-none"
      >
        <span className="bg-black rounded-full p-1 flex items-center justify-center">
          <FaUserCircle className="text-sm text-white font-semibold" />
        </span>

        <span className="hidden sm:inline">{userName}</span>
        <svg
          className="w-6 h-6 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1 text-sm text-gray-700">
            <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
              My profile
            </a>
            <a href="/threads" className="block px-4 py-2 hover:bg-gray-100">
              Messages
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
