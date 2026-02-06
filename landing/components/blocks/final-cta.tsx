"use client";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

export function FinalCTA() {
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
          className="bg-white rounded-3xl p-12 md:p-16 text-center border border-gray-800"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            Ready to understand your users like never before?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join 10,000+ developers using SessionRecorder to build better experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-gray-900 rounded-xl px-8"
            >
              <Link href="#">
                Start for Free
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white border-black text-black hover:bg-gray-100 rounded-xl px-8"
            >
              <Link href="#">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
