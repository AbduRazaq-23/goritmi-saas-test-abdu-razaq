import React from "react";
// Import all landing components
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Pricing from "../components/Landing/Pricing";
import Testimonials from "../components/Landing/Testimonials";
import FAQ from "../components/Landing/FAQ";
import Contact from "../components/Landing/Contact";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
