import React from "react";
import logoImage from "../assets/logo.png";
import phoneImage from "../assets/phone.png";

const Header = () => {
  return (
    <header className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-green-400 py-6 md:py-3">
          {/* Logo and tagline container */}
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Fitrition Kitchen"
              className="h-12 md:h-19 w-auto"
            />
            <p className="text-sm md:text-lg ml-2 md:mt-0 font-extrabold text-gray-400 tracking-widest uppercase">
              HEALTHY CHOICE FOR ASIAN FOOD
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start mt-4 md:mt-0">
            <a
              href="/"
              className="text-lg md:text-xl tracking-wide font-extrabold text-black hover:text-green-200 mr-4"
            >
              HOME
            </a>
            <a
              href="/menu"
              className="text-lg md:text-xl tracking-wide font-extrabold text-black hover:text-green-200"
            >
              MENU
            </a>
          </nav>

          {/* Contact Number */}
          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="tel:+16263008068"
              className="flex items-center text-lg md:text-xl font-bold text-green-600 hover:text-green-400 mr-4"
            >
              <img
                src={phoneImage}
                alt="phone: "
                className="h-5 w-auto mr-2"
              />
              626-300-8068
            </a>
            <a
              href="tel:+16267894388"
              className="flex items-center text-lg md:text-xl font-bold text-green-600 hover:text-green-400 mr-4"
            >
              626-789-4388
            </a>
            <a
              href="tel:+16267081018"
              className="flex items-center text-lg md:text-xl font-bold text-green-600 hover:text-green-400"
            >
              626-708-1018
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
