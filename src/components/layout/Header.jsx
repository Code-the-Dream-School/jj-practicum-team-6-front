import React, { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import styles from "./Header.module.css";

const Header = () => {
  const [activeNav, setActiveNav] = useState("About us");
  const [activeAuth, setActiveAuth] = useState("signup");

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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo part */}
        <div className={styles.logo}>RetrieveApp</div>

        {/* Navigation slider part */}
        <nav className={styles.navigationSection}>
          <div className={styles.navigation}>
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  activeNav === item.label ? styles.active : ""
                }`}
                //onClick={() => setActiveNav(item.label)}
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

            <div
              className={styles.navSlider}
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className={styles.authSection}>
          <div className={styles.authContainer}>
            <PrimaryButton
              variant={activeAuth === "signin" ? "secondary" : "outline"}
              size="small"
              onClick={() => setActiveAuth("signin")}
            >
              Sign in
            </PrimaryButton>
            <PrimaryButton
              variant={activeAuth === "signup" ? "secondary" : "outline"}
              size="small"
              onClick={() => setActiveAuth("signup")}
            >
              Sign up
            </PrimaryButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
