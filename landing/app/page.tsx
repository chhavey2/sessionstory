"use client";

import { Skiper39, CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import { HeroSection } from "@/components/blocks/hero-section-1";
import { CoreCapabilities } from "@/components/blocks/core-capabilities";
import { PatternText } from "@/components/ui/pattern-text";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/modem-animated-footer";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  NotepadTextDashed,
  Sparkles,
} from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  LinesPatternCard,
  LinesPatternCardBody,
} from "@/components/ui/card-with-lines-patter";
import {
  GridPatternCard,
  GridPatternCardBody,
} from "@/components/ui/card-with-grid-pattern";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import {
  PlayCircle,
  BarChart3,
  AlertTriangle,
  Zap,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:contact@resumegpt.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Pricing", href: "/" },
    { label: "Templates", href: "/" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];

  const itemsSample: BentoItem[] = [
    {
      title: "Session Replay",
      meta: "10K+ sessions",
      description:
        "Watch pixel-perfect replays of user sessions with full interaction tracking and console logs",
      icon: <PlayCircle className="w-4 h-4 text-blue-500" />,
      status: "Live",
      tags: ["Replay", "Recording", "Analytics"],
    },
    {
      title: "User Analytics",
      meta: "Real-time",
      description:
        "Track user behavior patterns, conversion funnels, and engagement metrics",
      icon: <BarChart3 className="w-4 h-4 text-emerald-500" />,
      status: "Active",
      tags: ["Analytics", "Metrics"],
    },
    {
      title: "Performance Monitoring",
      meta: "99.9% uptime",
      description:
        "Monitor page load times, API response times, and Core Web Vitals metrics",
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      status: "Optimized",
      tags: ["Performance", "Speed"],
    },
    {
      title: "Error Tracking",
      meta: "Auto-detected",
      description:
        "Automatically capture and analyze JavaScript errors, network failures, and console warnings",
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      status: "Active",
      tags: ["Errors", "Debugging"],
      cta: "Explore →",
    },
    {
      title: "Heatmaps & Click Tracking",
      meta: "Visual insights",
      description:
        "See where users click, scroll, and interact most on your pages",
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      status: "Active",
      tags: ["Heatmaps", "UX"],
    },
    {
      title: "User Journeys",
      meta: "Multi-page",
      description:
        "Track complete user journeys across multiple pages and sessions",
      icon: <Users className="w-4 h-4 text-sky-500" />,
      status: "Beta",
      tags: ["Journeys", "Funnels"],
    },
  ];

  return (
    <>
      <div>
        <HeroSection />
      </div>
      <AnimatedGroup
        preset="blur-slide"
        className="flex flex-col items-center justify-center gap-6 w-[95%] md:w-[70%] mx-auto py-24 md:py-32 relative"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 text-nowrap">
            Core Capabilities
          </span>
        </div>

        <h2 className="font-bold text-3xl md:text-6xl text-center tracking-tighter leading-[1.1] max-w-4xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent px-4">
          Everything you need to understand and optimize user experiences.
        </h2>

        <p className="text-sm md:text-lg text-white/50 text-center max-w-2xl leading-relaxed px-4">
          Our session recording engine provides the deep context you need to
          build products that users love.
        </p>
      </AnimatedGroup>
      <div className="px-4 md:px-0">
        <BentoGrid items={itemsSample} />
      </div>

      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-zinc-500 font-bold tracking-widest text-xs uppercase mb-4 block">
                  The Next Generation
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                  Why leading teams are switching to SessionStory
                </h2>
                <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                  Legacy tools only tell you *what* happened. We tell you *why*.
                  Our engine automatically surfaces user friction, so you don't
                  have to watch thousands of sessions.
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  "Automatic friction discovery with AI",
                  "Sub-second replay latency",
                  "Zero performance impact on your app",
                  "Advanced PII masking & data privacy",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                    <span className="text-white/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500/10 to-white/5 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <GridPatternCard className="rounded-3xl overflow-hidden group">
                <GridPatternCardBody className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Friction Detected
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 uppercase font-medium">
                      Just now
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Checkout Friction Spike
                      </h3>
                      <p className="text-sm text-white/60 italic leading-relaxed">
                        "AI detected a 45% increase in 'Dead Clicks' on the
                        checkout button for mobile users."
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-white/60">
                          Urgency Score
                        </span>
                        <span className="text-lg font-bold text-white">
                          8.5/10
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    <Button className="w-full bg-white hover:bg-zinc-200 text-black font-bold h-12 rounded-xl mt-4 transition-all duration-300">
                      View Affected Sessions
                    </Button>
                  </div>
                </GridPatternCardBody>
              </GridPatternCard>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <LinesPatternCard className="rounded-[2.5rem] overflow-hidden group">
            <LinesPatternCardBody className="relative z-10 flex flex-col items-center text-center space-y-8 p-12 md:p-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.1]">
                Ready to understand your users like never before?
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl">
                Join 10,000+ developers using SessionStory to build better
                experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button className="bg-white text-black hover:bg-zinc-100 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-black/10 transition-transform active:scale-95">
                  Start for Free
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 px-10 rounded-2xl text-lg font-bold backdrop-blur-sm transition-transform active:scale-95"
                >
                  Schedule Demo
                </Button>
              </div>
            </LinesPatternCardBody>
          </LinesPatternCard>
        </div>
      </section>

      <div className="relative">
        <div className="">
          <Footer
            brandName="SessionStory"
            brandDescription="Watch real user sessions as they happen. See every click, scroll, and interaction so you can reproduce bugs and understand exactly what went wrong."
            socialLinks={socialLinks}
            navLinks={navLinks}
            creatorName=""
            creatorUrl=""
          />
        </div>
      </div>
    </>
  );
}
