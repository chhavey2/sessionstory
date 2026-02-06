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
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { PlayCircle, BarChart3, AlertTriangle, Zap, Users } from "lucide-react";

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
        className="flex flex-col items-center justify-center gap-6 w-[90%] md:w-[70%] mx-auto py-24 relative"
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
            Core Capabilities
          </span>
        </div>

        <h2 className="font-bold text-4xl md:text-6xl text-center tracking-tighter leading-[1.1] max-w-4xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Everything you need to understand and optimize user experiences.
        </h2>

        <p className="text-base md:text-lg text-white/50 text-center max-w-2xl leading-relaxed">
          Our session recording engine provides the deep context you need to
          build products that users love.
        </p>
      </AnimatedGroup>
      <BentoGrid items={itemsSample} />
      {/* <div>
        <LinesPatternCard>
          <LinesPatternCardBody>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              Diagonal Lines Pattern
            </h3>
            <p className="text-wrap text-sm text-foreground/60">
              A modern pattern featuring diagonal lines in a repeating grid.
              Creates a sense of movement and depth while maintaining a clean,
              minimalist aesthetic.
            </p>
          </LinesPatternCardBody>
        </LinesPatternCard>
      </div> */}
      <div className="relative">
        <div className="">
          <Footer
            brandName="SessionStory"
            brandDescription="Watch real user sessions as they happen. See every click, scroll, and interaction so you can reproduce bugs and understand exactly what went wrong."
            socialLinks={socialLinks}
            navLinks={navLinks}
            creatorName=""
            creatorUrl=""
            // brandIcon={
            //   <NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
            // }
          />
        </div>
        {/* <div className="absolute bottom-0 h-[90vh] w-full">
          <CrowdCanvas src="https://skiper-ui.com/images/peeps/all-peeps.png" />
        </div> */}
      </div>
    </>
  );
}
