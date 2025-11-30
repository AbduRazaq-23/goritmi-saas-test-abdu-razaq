import React from "react";
import { motion } from "framer-motion";
import testimonials from "../../utills/testimonialsData";

const Testimonials = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          What Our Users Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Real feedback from real customers who use GoritmiDev every day.
        </motion.p>

        {/* Testimonials Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((item, index) => (
            <motion.div
              variants={cardVariant}
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 rounded-full mx-auto border-4 border-blue-600 mb-5"
              />

              <p className="text-gray-600 italic mb-4">“{item.message}”</p>

              <h3 className="text-xl font-semibold text-gray-900">
                {item.name}
              </h3>
              <span className="text-gray-500 text-sm">{item.role}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
