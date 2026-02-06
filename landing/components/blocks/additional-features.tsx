"use client";

import { Zap, Settings, Users } from "lucide-react";
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

const features = [
  {
    icon: Zap,
    iconColor: "text-white",
    iconBg: "bg-gray-800",
    title: "Lightweight Agent",
    description:
      "Our recording script is optimized for performance. Zero impact on your site's load time or user experience.",
  },
  {
    icon: Settings,
    iconColor: "text-white",
    iconBg: "bg-gray-700 border border-white",
    title: "Network & Console Log",
    description:
      "See what was happening under the hood. Correlate user actions with network requests and console errors.",
    highlighted: true,
  },
  {
    icon: Users,
    iconColor: "text-white",
    iconBg: "bg-gray-800",
    title: "User Journeys",
    description:
      "See how users navigate across multiple pages. Understand the full context of their sessions from start to finish.",
  },
];

export function AdditionalFeatures() {
  return (
    <section className="py-24 md:py-36 relative">
      <div className="mx-auto max-w-7xl px-6">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                  className={cn(
                  "rounded-xl p-6 transition-all duration-300",
                  feature.highlighted
                    ? "bg-gray-800 border border-white"
                    : "bg-gray-900/50 border border-gray-800 hover:border-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    feature.iconBg
                  )}
                >
                  <Icon className={cn("w-6 h-6", feature.iconColor)} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </AnimatedGroup>
      </div>
    </section>
  );
}
