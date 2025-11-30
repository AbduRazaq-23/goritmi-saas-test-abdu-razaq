import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Build Better, Faster with{" "}
            <span className="text-blue-600">GoritmiDev</span>
          </h1>

          <p className="mt-5 text-gray-600 text-lg">
            A modern platform to help you create scalable applications, automate
            processes, and deliver high-quality digital experiences.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-8 flex space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/#features"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT IMAGE / GRAPHIC */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex justify-center"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800"
            alt="Hero Illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
