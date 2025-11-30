import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Goritmi<span className="text-gray-900">Dev</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <Link to="#home" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="#features" className="hover:text-blue-600">
              Features
            </Link>
          </li>
          <li>
            <Link to="#pricing" className="hover:text-blue-600">
              Pricing
            </Link>
          </li>
          <li>
            <Link to="#contact" className="hover:text-blue-600">
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-gray-700 hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col space-y-4 p-6 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/#features"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </Link>
            </li>

            <li>
              <Link
                to="/#pricing"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>

            <li>
              <Link
                to="/#contact"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </li>

            {/* CTA */}
            <hr />

            <Link
              to="/login"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="block bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
