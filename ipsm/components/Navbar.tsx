"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full border-b border-border bg-background/80 backdrop-blur-xl z-50 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/" 
                className="flex items-center space-x-3 group transition-all"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[hsl(var(--civic-primary))] to-[hsl(var(--civic-secondary))] flex items-center justify-center shadow-[0_0_20px_-5px_hsl(var(--civic-primary))] transition-transform group-hover:scale-105">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-foreground">
                  CivicSafe
                </span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                ['Submit Report', '/submit-report'],
                ['Track Report', '/track-report'],
                ['User Guide', '/how-it-works'],
                ['Join the Community', '/community'],
              ].map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  className="relative text-sm text-muted-foreground hover:text-foreground transition-all group"
                >
                  {name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[hsl(var(--civic-primary))] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <Link
                href="/contact"
                className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[hsl(var(--civic-primary))] transition-all group-hover:w-full"></span>
              </Link>

              {/* Dashboard Link - Show based on user role */}
              {session && (
                <Link
                  href={session.user.role === "ADMIN" || session.user.role === "MODERATOR" ? "/dashboard" : "/user-dashboard"}
                  className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[hsl(var(--civic-primary))] transition-all group-hover:w-full"></span>
                </Link>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              <button className="group relative flex items-center gap-2 rounded-full bg-gradient-to-br from-red-500 to-rose-600 pl-4 pr-5 py-2 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition-all hover:shadow-red-500/30 hover:scale-[1.02]">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Emergency: 999
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <div className="space-y-1.5">
                  <span className="block w-6 h-[2px] bg-current transition-transform origin-center group-hover:translate-y-0.5" />
                  <span className="block w-6 h-[2px] bg-current" />
                  <span className="block w-6 h-[2px] bg-current transition-transform origin-center group-hover:-translate-y-0.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}