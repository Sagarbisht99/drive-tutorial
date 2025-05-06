"use client";
import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import MobileSlider from "./Mobileslider";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 bg-transparent backdrop-blur-md border-b border-white/10 text-white ${
          showNavbar ? "top-0" : "-top-24"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-4">
          {/* Logo */}
          <Link href="/">
            <div className="text-lg flex items-center gap-3 md:text-2xl font-bold tracking-wide">
              <Image src="/logo.svg" alt="" height={30} width={40} />{" "}
              <p className="text-[23px]">Drive Vault</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <header className="hidden md:flex items-center gap-3">
            <ul className="hidden md:flex space-x-8 font-medium text-sm mr-4">
              <Link href="/">
                <li className="hover:text-blue-500 cursor-pointer transition">
                  Home
                </li>
              </Link>
              <Link href="/docs">
                <li className="hover:text-blue-500 cursor-pointer transition">
                  Docs
                </li>
              </Link>
              <Link target="_blank" href="https://saas-ai-msxz.vercel.app">
                <li className="hover:text-blue-500 cursor-pointer transition">
                  Ask AI
                </li>
              </Link>
            </ul>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsSliderOpen(true)}
            className="md:hidden cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Slider */}
      <MobileSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
      />
    </>
  );
};

export default Navbar;