import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Goritmi<span className="text-blue-500">Dev</span>
          </h2>
          <p className="text-gray-400">
            Building powerful and modern solutions to help you scale your
            business.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#features" className="hover:text-blue-400">
                Features
              </Link>
            </li>
            <li>
              <Link to="/#pricing" className="hover:text-blue-400">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/privacy-policy" className="hover:text-blue-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-400">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-blue-400">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-5 text-xl">
            <a href="#" className="hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} GoritmiDev. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
