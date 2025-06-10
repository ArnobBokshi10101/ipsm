import SafetyChatbot from "@/components/SafetyChatbot";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-50" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--civic-primary))]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--civic-secondary))]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-6 pt-32">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-32">
            <div className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/50 px-5 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-[hsl(var(--civic-primary))]/30 hover:bg-[hsl(var(--civic-primary))]/10 hover:text-[hsl(var(--civic-primary))] animate-fade-in">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" />
              </svg>
              Secure & Anonymous Reporting
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl animate-slide-up">
              Report Incident
              <span className="block mt-4 bg-gradient-to-r from-[hsl(var(--civic-primary))] to-[hsl(var(--civic-secondary))] bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Protect Public Safety
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground animate-fade-in-delayed">
              Your voice matters. Help create safer communities while maintaining 
              complete anonymity through our military-grade encrypted reporting system.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Link href="/submit-report">
                <button className="group relative flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(var(--civic-primary))] to-[hsl(var(--civic-secondary))] px-8 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[hsl(var(--civic-primary))]/30 hover:-translate-y-0.5 hover:scale-[1.02]">
                  <span className="relative z-10">Make Report</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12H19M12 5L19 12L12 19" />
                  </svg>
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-8 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-[hsl(var(--civic-primary))]/30 hover:bg-[hsl(var(--civic-primary))]/10 hover:text-[hsl(var(--civic-primary))] group">
                  <span>Access Dashboard</span>
                  <div className="w-0 h-[2px] bg-[hsl(var(--civic-primary))] transition-all group-hover:w-4"></div>
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-32">
            {[
              {
                title: "Anonymous & Verified Reporting",
                description: "Submit reports anonymously or choose to verify for follow-ups — your identity, your control.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor\" strokeWidth="2">
                    <path strokeLinecap="round\" strokeLinejoin="round\" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.656 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "AI-Powered Report Classification",
                description: "Automatically route incidents to the right authorities using smart categorization.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: "One-Click Location Sharing",
                description: "Share your real-time location instantly with responders in one tap.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "Live Report Tracking",
                description: "Follow your report in real-time from submission to resolution.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                title: "AI-Assisted Reporting",
                description: "Generate titles, descriptions, and classify incidents with the help of AI.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },   
              {
                title: "Hate Speech Detection",
                description: "AI automatically flags hate speech for moderation and safety.",
                icon: (
                  <svg className="h-6 w-6 text-[hsl(var(--civic-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-[hsl(var(--civic-primary))]/30 hover:bg-[hsl(var(--civic-primary))]/10 hover:shadow-[0_0_30px_-10px_hsl(var(--civic-primary))]"
              >
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-card/50 p-3 backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-md leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mb-32 rounded-3xl border border-border bg-card/50 p-12 backdrop-blur-xl">
            <div className="grid gap-y-12 sm:grid-cols-3">
              {[
                { value: "250K+", label: "Secure Reports", metric: "and counting" },
                { value: "100%", label: "Anonymity", metric: "guaranteed" },
                { value: "24/7", label: "Support", metric: "coverage" },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className={`text-center ${i < 2 ? 'sm:border-r border-border' : ''}`}
                >
                  <div className="text-4xl font-bold text-[hsl(var(--civic-primary))] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg text-foreground font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mb-32 flex flex-col items-center gap-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/50 px-6 py-3 text-sm text-muted-foreground backdrop-blur-xl transition-all hover:border-[hsl(var(--civic-primary))]/30 hover:bg-[hsl(var(--civic-primary))]/10 hover:text-[hsl(var(--civic-primary))] group">
              <div className="flex space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--civic-primary))] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--civic-primary))]"></span>
                </span>
              </div>
              Trusted by Law Enforcement Nationwide
            </div>
          </div>
        </div>
      </div>
      <SafetyChatbot/>
    </main>
  );
}