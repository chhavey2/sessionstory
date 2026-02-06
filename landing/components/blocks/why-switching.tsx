"use client";

import { Check } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  "Automatic friction discovery with AI",
  "Sub-second replay latency",
  "Zero performance impact on your app",
  "Advanced PII masking & data privacy",
];

export function WhySwitching() {
  return (
    <section className="py-24 md:py-36 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedGroup variants={transitionVariants}>
            <p className="text-white text-sm uppercase tracking-wider font-medium mb-4">
              THE NEXT GENERATION
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Why leading teams are switching to{" "}
              <span className="text-white">SessionRecorder</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Legacy tools only tell you <em>what</em> happened. We tell you <em>why</em>. Our engine automatically surfaces user friction, so you don't have to watch thousands of sessions.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </AnimatedGroup>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="bg-gray-900/80 border border-white/30 rounded-xl p-6 shadow-lg shadow-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium border border-white">
                  FRICTION DETECTED
                </span>
                <span className="text-gray-400 text-sm">Just now</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Checkout Friction Spike
              </h3>
              <p className="text-gray-400 mb-6">
                AI detected a 45% increase in 'Dead Clicks' on the checkout button for mobile users.
              </p>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Urgency Score</span>
                  <span className="text-white font-semibold">8.5/10</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
              <Button
                asChild
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Link href="#">
                  View Affected Sessions
                </Link>
              </Button>
            </div>
          </AnimatedGroup>
        </div>
      </div>
    </section>
  );
}
