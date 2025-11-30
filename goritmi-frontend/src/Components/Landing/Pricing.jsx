import React from "react";
import { motion } from "framer-motion";
import plans from "../../utills/pricingPlansData";

const Pricing = () => {
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
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Choose Your Plan
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Simple and transparent pricing designed for everyone.
        </motion.p>

        {/* Pricing Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className={`p-8 rounded-2xl shadow-lg transition-transform ${
                plan.highlighted
                  ? "border-2 border-blue-600 scale-105 bg-blue-50 shadow-xl"
                  : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-2 ${
                  plan.highlighted ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {plan.title}
              </h3>

              <p className="text-4xl font-extrabold text-gray-900 mb-4">
                {plan.price}
              </p>

              <p className="text-gray-600 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-6 text-gray-700">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-blue-600 font-bold">✔</span> {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-semibold ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
