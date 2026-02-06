"use client";

import { Eye, MousePointerClick, Shield, Zap, Settings, Users } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const capabilities = [
  {
    icon: Eye,
    iconColor: "text-green-500",
    iconBg: "border-green-500/50 bg-green-500/10",
    title: "Pixel-Perfect Replay",
    description:
      "Watch high-fidelity replays of every user session. See exactly what they saw, with support for complex SPAs and dynamic content.",
  },
  {
    icon: MousePointerClick,
    iconColor: "text-blue-500",
    iconBg: "border-blue-500/50 bg-blue-500/10",
    title: "Interaction Tracking",
    description:
      "Every click, scroll, and keypress is captured and visualized. Find exactly where users get stuck or confused.",
  },
  {
    icon: Shield,
    iconColor: "text-purple-500",
    iconBg: "border-purple-500/50 bg-purple-500/10",
    title: "Privacy by Design",
    description:
      "Automatically mask sensitive PII data on the client side. Comply with GDPR and HIPAA without sacrificing insights.",
  },
  {
    icon: Zap,
    iconColor: "text-yellow-500",
    iconBg: "border-yellow-500/50 bg-yellow-500/10",
    title: "Lightweight Agent",
    description:
      "Our recording script is optimized for performance. Zero impact on your site's load time or user experience.",
  },
  {
    icon: Settings,
    iconColor: "text-gray-400",
    iconBg: "border-gray-400/50 bg-gray-400/10",
    title: "Network & Console Log",
    description:
      "See what was happening under the hood. Correlate user actions with network requests and console errors.",
  },
  {
    icon: Users,
    iconColor: "text-gray-400",
    iconBg: "border-gray-400/50 bg-gray-400/10",
    title: "User Journeys",
    description:
      "See how users navigate across multiple pages. Understand the full context of their sessions from start to finish.",
  },
];

export function CoreCapabilities() {
  return (
    <section className="py-24 md:py-36 relative">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedGroup variants={transitionVariants} className="text-center mb-16">
          <p className="text-white text-sm uppercase tracking-wider font-medium mb-4">
            CORE CAPABILITIES
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-green-500">understand</span> and{" "}
            <span className="text-green-500">optimize</span> user experiences.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our session recording engine provides the deep context you need to build products that users love.
          </p>
        </AnimatedGroup>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            },
            ...transitionVariants,
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg border flex items-center justify-center mb-4",
                    capability.iconBg
                  )}
                >
                  <Icon className={cn("w-6 h-6", capability.iconColor)} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            );
          })}
        </AnimatedGroup>
      </div>
    </section>
  );
}
