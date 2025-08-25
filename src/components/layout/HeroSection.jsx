import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Lost something?</h1>
          <p className={styles.heroSubtitle}>
            Let <em>community</em> help
          </p>
          <p className={styles.heroDescription}>
            Drop a pin, add a photo. Get it back faster.
          </p>
          <PrimaryButton variant="primary" size="large">
            See what you can do
          </PrimaryButton>
          <div className={styles.scrollIndicator}>↓</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
