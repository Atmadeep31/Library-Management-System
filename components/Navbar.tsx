"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignOutButton, Show, SignUpButton } from "@clerk/nextjs";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Books", href: "/books" },
    { name: "Students", href: "/students" },
    { name: "Issue/Return", href: "/action" },
  ];

  return (
    <nav className="bg-[#1e3a8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Branding & Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              <span className="bg-orange-500 text-white p-1.5 rounded text-sm">📚</span>
              <span>LibManage</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2 font-medium text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-md transition-all ${
                      isActive
                        ? "bg-orange-500 font-bold text-white shadow-sm"
                        : "text-blue-100 hover:bg-blue-800 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <SearchBar/>
          </div>

          {/* Right Side: Authentication Control via your <Show> wrappers */}
          <div className="flex items-center">
            {/* When user is Signed Out -> Show Sign In */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition shadow-sm cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition shadow-sm cursor-pointer ml-1.5">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            {/* When user is Signed In -> Show Log Out */}
            <Show when="signed-in">
              <SignOutButton redirectUrl="/">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition shadow-sm cursor-pointer">
                  Log Out
                </button>
              </SignOutButton>
            </Show>
          </div>

        </div>
      </div>
    </nav>
  );
}