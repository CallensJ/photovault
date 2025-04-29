"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <h2 className="font-quicksand bg-gradient-to-r from-[#f9572a] to-[#ffc905] bg-clip-text text-transparent">
              Photovault
            </h2>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div
          className={`hidden md:flex flex-1 justify-center items-center ${
            isSearchVisible ? "" : "hidden"
          }`}
        >
          <input
            type="text"
            className="p-2 w-1/3 rounded-md bg-gray-700 text-white"
            placeholder="Rechercher des photos..."
          />
        </div>

        {/* Mobile Search Toggle Button */}
        <button className="md:hidden text-white" onClick={toggleSearch}>
          🔍
        </button>

        {/* Authentication / Avatar */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-md">
            Login
          </button>
          <button className="hidden md:block bg-green-500 text-white px-4 py-2 rounded-md">
            Signup
          </button>
          {/* Avatar if logged in */}
          {/* Example */}
          <div className="hidden md:block bg-gray-300 w-8 h-8 rounded-full"></div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button className="text-white" onClick={toggleMenu}>
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 p-4">
          <button className="block w-full text-left text-white py-2">
            Login
          </button>
          <button className="block w-full text-left text-white py-2">
            Signup
          </button>
          <button className="block w-full text-left text-white py-2">
            Profile
          </button>
        </div>
      )}
    </nav>
  );
}
