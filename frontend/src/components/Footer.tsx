import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaRegEnvelope } from "react-icons/fa";


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm">
      {/* Newsletter */}
      <div className="border-b border-gray-300 py-6 px-4 text-center md:text-left md:flex md:justify-between md:items-center max-w-6xl mx-auto">
        <div>
          <h3 className="text-lg font-semibold">Join our newsletter for £10 offs</h3>
          <p className="text-xs text-gray-500">
            Register now to get latest updates on promotions & coupons. Don’t worry, we not spam!
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email address"
            className="px-4 py-2 outline-none w-full"
          />
          <button className="bg-purple-600 text-white px-5 py-2">SEND</button>
        </div>
      </div>

      {/* Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 px-4 max-w-6xl mx-auto">
        {/* Support */}
        <div>
          <h4 className="font-semibold mb-2">Do You Need Help ?</h4>
          <p className="text-xs text-gray-500">
            Autoseilgen syr. Nek diarsak fröbomba. Nör antipoI kyonda nymat. Pressa fämoksa.
          </p>
          <p className="mt-2 font-bold text-lg">0 800 300-353</p>
          <p className="text-xs text-gray-500">Monday-Friday: 08am-9pm</p>
          <p className="flex items-center gap-2 mt-2">
            <FaRegEnvelope className="text-gray-500" /> info@example.com
          </p>
        </div>

        {/* Make Money */}
        <div>
          <h4 className="font-semibold mb-2">Make Money with Us</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>Sell on Grogin</li>
            <li>Sell Your Services on Grogin</li>
            <li>Sell on Grogin Business</li>
            <li>Sell Your Apps on Grogin</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
            <li>Sell-Publish with Us</li>
            <li>Become a Blowwe Vendor</li>
          </ul>
        </div>

        {/* Customer Help */}
        <div>
          <h4 className="font-semibold mb-2">Let Us Help You</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>Accessibility Statement</li>
            <li>Your Orders</li>
            <li>Returns & Replacements</li>
            <li>Shipping Rates & Policies</li>
            <li>Refund and Returns Policy</li>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>Cookie Settings</li>
            <li>Help Center</li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h4 className="font-semibold mb-2">Get to Know Us</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>Careers for Grogin</li>
            <li>About Grogin</li>
            <li>Investor Relations</li>
            <li>Grogin Devices</li>
            <li>Customer reviews</li>
            <li>Social Responsibility</li>
            <li>Store Locations</li>
          </ul>
        </div>
      </div>

      {/* Download App & Social Media */}
      <div className="border-t border-gray-300 py-6 px-4 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        
        
        {/* Social Media */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-600 hover:text-blue-600 text-xl">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-600 hover:text-pink-500 text-xl">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-500 text-xl">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 py-4 px-4 text-center text-xs text-gray-500">
        <p>Copyright 2024 © Jinstore WooCommerce WordPress Theme. All rights reserved.</p>
        <p>Powered by <span className="text-blue-600">BlackRise Themes</span>.</p>
        <div className="flex justify-center gap-4 mt-2">
          <span>Terms and Conditions</span>
          <span>Privacy Policy</span>
          <span>Order Tracking</span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
