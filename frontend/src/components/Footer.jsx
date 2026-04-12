import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full mt-8">
      <hr className="border border-gray-300 dark:border-gray-700" />

      <div className="container mx-auto px-4 py-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Left */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-xl font-bold">QuickCart</h1>
            <p className="text-sm">
              Your one-stop for everything you need.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <a href="#" className="text-sm hover:underline">
              About Us
            </a>

            <a href="#" className="text-sm hover:underline">
              Contact
            </a>

            <a href="#" className="text-sm hover:underline">
              Privacy Policy
            </a>

            <a href="#" className="text-sm hover:underline">
              Terms & Conditions
            </a>
          </div>
        </div>

        {/* Social */}
        <div className="mt-6 text-center">
          <p className="text-sm">Follow us:</p>

          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:opacity-75">
              <FaFacebook />
            </a>

            <a href="#" className="hover:opacity-75">
              <FaTwitter />
            </a>

            <a href="#" className="hover:opacity-75">
              <FaInstagram />
            </a>

            <a href="#" className="hover:opacity-75">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;