import React from "react";
// Import all landing components
import Navbar from "../Components/Landing/Navbar";
import Hero from "../Components/Landing/Hero";
import Features from "../Components/Landing/Features";
import Pricing from "../Components/Landing/Pricing";
import Testimonials from "../Components/Landing/Testimonials";
import FAQ from "../Components/Landing/FAQ";
import Contact from "../Components/Landing/Contact";
import Footer from "../Components/Landing/Footer";

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
