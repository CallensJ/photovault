"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NavSearchBar from "./NavSearchBar";
import LoginForm from "@/app/components/modals/LoginForm";
import RegisterForm from "@/app/components/modals/RegisterForm";
import { useModal } from "@/app/context/ModalContext";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { openLogin, openSignup } = useModal();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Forcer le rafraîchissement de la session
const refreshSession = async () => {
  await fetch('/api/auth/session'); // Force un refresh de la session en appelant l'API
};


  // Déboguer la session pour comprendre l'état de la session
  useEffect(() => {
    console.log("Session status: ", status);
    console.log("Session data: ", session);

    if (status === "authenticated" || status === "unauthenticated") {
      setIsSessionLoaded(true);
      refreshSession();
      console.log("User logged in:", session?.user);
      
    }
  }, [status, session]);

  const isAuthenticated = !!session;
  const username = session?.user?.username?.replace("@", "");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    console.log("Logging out...");
    await signOut({ callbackUrl: '/' }); // Redirection après déconnexion
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isSessionLoaded) {
    return <div>Loading...</div>; // Affiche un écran de chargement si la session n'est pas prête
  }

  return (
    <nav className="bg-[#16171b] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
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

        {/* Auth / Avatar zone */}
        <div className="flex items-center space-x-4 relative">
          {!isAuthenticated ? (
            <>
              <button
                onClick={openLogin}
                className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Login
              </button>
              <button
                onClick={openSignup}
                className="border cursor-pointer border-[#f9572a] hover:bg-gradient-to-r hover:from-[#f9572a] hover:to-[#ffc905] hidden md:block text-white px-4 py-2 rounded-md"
              >
                Signup
              </button>
            </>
          ) : (
            <div ref={dropdownRef} className="relative">
              <div
                className="w-8 h-8 rounded-full cursor-pointer overflow-hidden"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src={session.user?.avatar || "/images/avatars/dummy-avatar.png"}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-[#2c2c2c] border border-gray-600 rounded-md w-32 text-sm z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (username) router.push(`/profile/${username}`);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button className="text-white" onClick={toggleMenu}>
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 p-4 space-y-2">
          {!isAuthenticated ? (
            <>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/images/avatars/dummy-avatar.png"
                  alt="avatar"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={openLogin}
                className="block bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Login
              </button>
              <button
                onClick={openSignup}
                className="border border-[#f9572a] hover:bg-gradient-to-r hover:from-[#f9572a] hover:to-[#ffc905] text-white px-4 py-2 rounded-md"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                className="cursor-pointer block w-full text-left text-white py-2"
                onClick={() => {
                  if (username) router.push(`/profile/${username}`);
                }}
              >
                Profile
              </button>
              <button
                className="cursor-pointer block w-full text-left text-white py-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Modales */}
      <LoginForm />
      <RegisterForm />
    </nav>
  );
}
