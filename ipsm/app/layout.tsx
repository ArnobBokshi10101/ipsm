import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="civicsafe-theme">
          <Providers>
            <div className="relative min-h-screen bg-background transition-colors duration-300">
              <Navbar />
              <main className="pt-16">
                {children}
                <footer className="border-t border-border py-12 bg-background">
                  <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8 text-muted-foreground">
                      <div>
                        <h3 className="text-[hsl(var(--civic-primary))] mb-4 text-lg font-semibold">Emergency 999</h3>
                        <p className="text-sm">24/7 Nationwide Emergency Response Service</p>
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--civic-primary))] mb-4 text-lg font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                          <li><button className="hover:text-[hsl(var(--civic-primary))] transition-colors">Service Status</button></li>
                          <li><button className="hover:text-[hsl(var(--civic-primary))] transition-colors">Safety Guidelines</button></li>
                          <li><button className="hover:text-[hsl(var(--civic-primary))] transition-colors">Privacy Policy</button></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--civic-primary))] mb-4 text-lg font-semibold">Contact</h4>
                        <p className="text-sm">Hotline: 999</p>
                        <p className="text-sm">Email: emergency@gov.bd</p>
                      </div>
                      <div>
                        <h4 className="text-[hsl(var(--civic-primary))] mb-4 text-lg font-semibold">Follow Us</h4>
                        <div className="flex gap-4">
                          <button className="p-2 rounded-lg bg-[hsl(var(--civic-primary))]/10 hover:bg-[hsl(var(--civic-primary))]/20 transition-colors">
                            Twitter
                          </button>
                          <button className="p-2 rounded-lg bg-[hsl(var(--civic-primary))]/10 hover:bg-[hsl(var(--civic-primary))]/20 transition-colors">
                            Facebook
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </footer>
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}