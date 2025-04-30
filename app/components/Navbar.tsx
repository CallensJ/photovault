"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavSearchBar from "./NavSearchBar";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = false; // ou true si tu veux tester
  const router = useRouter();

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="bg-[#16171b] text-white p-4">
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

      <NavSearchBar />



        {/* Authentication / Avatar */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-md">
            Login
          </button>
          <button className="border cursor-pointer border-[#f9572a] hover:bg-gradient-to-r hover:from-[#f9572a] hover:to-[#ffc905]hidden md:block text-white px-4 py-2 rounded-md">
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
    <button className="cursor-pointer block w-full text-left text-white py-2">
      Login
    </button>
    <button className="cursor-pointer block w-full text-left text-white py-2">
      Signup
    </button>

    {/* Profile : visible mais redirige selon auth */}
    <button
      className="cursor-pointer block w-full text-left text-white py-2"
      onClick={() =>
        isAuthenticated
          ? router.push("/profile/ton-username") // à adapter plus tard dynamiquement
          : router.push("/login")
      }
    >
      
      Profile
    </button>
  </div>
)}
    </nav>
  );
}
