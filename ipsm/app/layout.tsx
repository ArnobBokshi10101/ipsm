import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicSafe - Integrated public safety and service management system",
  description: "Securely report crimes to law enforcement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-black selection:bg-sky-500/20">
          {/* Gradient Background */}
          <div className="fixed inset-0 -z-10 min-h-screen">
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
          </div>
          <Navbar />
          <main className="pt-16">
            <Providers>{children}</Providers>
            <footer className="border-t border-[#07D348]/20 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-zinc-300">
            <div>
              <h3 className="text-[#07D348] mb-4 text-lg font-semibold">Emergency 999</h3>
              <p className="text-sm">24/7 Nationwide Emergency Response Service</p>
            </div>
            <div>
              <h4 className="text-[#07D348] mb-4 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-[#07D348] transition-colors">Service Status</button></li>
                <li><button className="hover:text-[#07D348] transition-colors">Safety Guidelines</button></li>
                <li><button className="hover:text-[#07D348] transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#07D348] mb-4 text-lg font-semibold">Contact</h4>
              <p className="text-sm">Hotline: 999</p>
              <p className="text-sm">Email: emergency@gov.bd</p>
            </div>
            <div>
              <h4 className="text-[#07D348] mb-4 text-lg font-semibold">Follow Us</h4>
              <div className="flex gap-4">
                <button className="p-2 rounded-lg bg-[#07D348]/10 hover:bg-[#07D348]/20 transition-colors">
                  Twitter
                </button>
                <button className="p-2 rounded-lg bg-[#07D348]/10 hover:bg-[#07D348]/20 transition-colors">
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
