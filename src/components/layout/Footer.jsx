import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo part from the UI desgin*/}
        <div className={styles.logo}>RetrieveApp</div>

        <div className={styles.contactInfo}>
          <p className={styles.contactText}>Got questions?</p>
          <p className={styles.contactDetails}>
            We've got answers →
            <a
              href="mailto:emailaddress@gmail.com"
              className={styles.emailLink}
            >
              emailaddress@gmail.com
            </a>
          </p>
        </div>

        <div className={styles.copyright}>
          <p>© 2025 RetrieveApp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
