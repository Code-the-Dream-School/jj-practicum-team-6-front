import React, { useState, useEffect } from "react";
import { getAllData } from "./util/index";
import Header from "./components/layout/Header";
import HeroSection from "./components/layout/HeroSection";
import "./App.css";
import Footer from "./components/layout/Footer";

const URL = "http://localhost:8000/api/v1/";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const myData = await getAllData(URL);
        setMessage(myData.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Backend not connected");
        setMessage("API not available - using mock data");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      console.log("unmounting");
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p className="text-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />

      {/* Backend Status Debug */}
      {message && (
        <div
          style={{
            backgroundColor: error ? "#fef2f2" : "#e8f5e8",
            padding: "var(--space-sm)",
            textAlign: "center",
            borderBottom: "1px solid var(--color-background)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: error ? "#dc2626" : "var(--color-success)",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Backend Status: {message}
          </p>
        </div>
      )}

      {/* Need feedback on which code to go with. option 1. or option 2? */}

      {/* option 1: */}
      {/* <main>
        <HeroSection /> */}

      {/* /* Temporary welcome section */}
      {/* <section
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-white)",
            textAlign: "center",
          }}
        >
          <h2 className="text-h2">Welcome to RetrieveApp</h2>
          <p
            className="text-body"
            style={{
              marginTop: "var(--space-md)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Next we'll add: Action buttons, Recent items grid, Stats section,
            and more components.
          </p>
        </section> */}

      {/* /* Test sticky header content */}
      {/* <section
          style={{
            height: "100vh",
            padding: "var(--space-xl)",
            backgroundColor: "var(--color-background)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3 className="text-h3">Scroll test section</h3>
            <p className="text-body">
              Scroll back up to see the hero section and test the sticky header.
            </p>
          </div>
        </section>
      </main> */}

      {/* option 2: */}
      <main>
        <HeroSection />

        <section
          id="about"
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-white)",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <h2 className="text-h2">About Us Section</h2>
          <p className="text-body">
            This will be the about us content. Click "About us" in the nav to
            test smooth scrolling.
          </p>
        </section>

        <section
          id="values"
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-background)",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <h2 className="text-h2">Our Values Section</h2>
          <p className="text-body">
            Values content will go here. Test navigation scrolling.
          </p>
        </section>

        <section
          id="how-it-works"
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-white)",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <h2 className="text-h2">How It Works Section</h2>
          <p className="text-body">How it works content will go here.</p>
        </section>

        <section
          id="team"
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-background)",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <h2 className="text-h2">Our Team Section</h2>
          <p className="text-body">Team content will go here.</p>
        </section>

        <section
          id="contacts"
          style={{
            padding: "var(--space-2xl)",
            backgroundColor: "var(--color-white)",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <h2 className="text-h2">Contacts Section</h2>
          <p className="text-body">Contact information will go here.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
