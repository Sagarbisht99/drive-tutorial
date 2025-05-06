"use client";
import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

interface mobileSliders {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSlider: React.FC<mobileSliders> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 md:hidden h-full w-64 bg-black text-white transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-800">
        <span className="text-lg font-semibold">Menu</span>
        <button onClick={onClose} className="text-white text-2xl">
          &times;
        </button>
      </div>

      <div className="px-6 my-4 flex flex-col gap-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
      <ul className="flex flex-col gap-4 px-6 py-6 text-sm font-medium">
        <Link href="/" onClick={onClose}>
          <li className="hover:text-blue-500 cursor-pointer transition">
            Home
          </li>
        </Link>
        <Link href="/docs" onClick={onClose}>
          <li className="hover:text-blue-500 cursor-pointer transition">
            Docs
          </li>
        </Link>
        <Link onClick={onClose} target="_blank" href="https://saas-ai-msxz.vercel.app">
          <li className="hover:text-blue-500 cursor-pointer transition">
            Ask AI
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default MobileSlider;
